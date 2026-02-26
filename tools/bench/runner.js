import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import os from 'node:os';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../../');

const nodeVersion = process.version.slice(1);
const pkg = require(join(rootDir, 'package.json'));
// Attempt to resolve express package.json, might fall back if not found easily but usually in node_modules
let expressVersion = 'unknown';
try {
    const expressPkg = require('express/package.json');
    expressVersion = expressPkg.version;
} catch {
    // try relative resolution if top level require fails
    try {
        const expressPkg = require(join(rootDir, 'node_modules/express/package.json'));
        expressVersion = expressPkg.version;
    } catch { }
}


const servers = [
    {
        name: `node-fetch-server@${pkg.version}`,
        command: 'node',
        args: ['./servers/node-fetch-server.mjs'],
    },
    {
        name: `node:http@${nodeVersion}`,
        command: 'node',
        args: ['./servers/node-http.mjs'],
    },
    {
        name: `express@${expressVersion}`,
        command: 'node',
        args: ['./servers/express.mjs'],
    },
];

async function runBenchmark(server) {
    console.log(`\nStarting benchmark for ${server.name} ...\n`);

    const serverProcess = spawn(server.command, server.args, {
        cwd: __dirname,
        stdio: ['ignore', 'pipe', 'inherit'],
        env: { ...process.env, PORT: '0' },
    });

    serverProcess.stdout.pipe(process.stdout);

    // Wait for server to start and get port
    const port = await new Promise((resolve, reject) => {
        let buffer = '';

        const TIMEOUT_MS = 5000;
        const timeoutId = setTimeout(() => {
            serverProcess.stdout.off('data', onData);
            serverProcess.stdout.off('close', onClose);
            reject(new Error(`Timeout waiting for server to start (waited ${TIMEOUT_MS}ms)`));
        }, TIMEOUT_MS);

        const onData = (data) => {
            buffer += data.toString();
            const match = buffer.match(/Server listening on port (\d+)/);
            if (match) {
                clearTimeout(timeoutId);
                serverProcess.stdout.off('data', onData);
                serverProcess.stdout.off('close', onClose);
                resolve(match[1]);
            }
        };

        const onClose = (code) => {
            clearTimeout(timeoutId);
            serverProcess.stdout.off('data', onData);
            if (code !== 0) reject(new Error(`Server exited with code ${code}`));
        };

        serverProcess.stdout.on('data', onData);
        serverProcess.on('close', onClose);
        serverProcess.on('error', (err) => {
            clearTimeout(timeoutId);
            reject(err);
        });
    });

    console.log(`Server started on port ${port}`);

    try {
        await new Promise((resolve, reject) => {
            const args = ['exec', 'artillery', 'run', '--target', `http://127.0.0.1:${port}`, join(__dirname, 'bench-config.yaml')];
            // Use pnpm to run artillery
            const artillery = spawn('pnpm', args, {
                cwd: rootDir, // Run from root where pnpm is configured
                stdio: 'inherit',
                shell: true
            });

            artillery.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Artillery exited with code ${code}`));
                }
            });

            artillery.on('error', (err) => {
                reject(err);
            });
        });
    } catch (error) {
        console.error(`Benchmark failed for ${server.name}:`, error);
    } finally {
        // Kill the server
        if (serverProcess.pid) {
            if (process.platform === 'win32') {
                spawn('taskkill', ['/pid', serverProcess.pid.toString(), '/f', '/t']);
            } else {
                serverProcess.kill('SIGINT');
            }
        }

        // Give it a moment to cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(`Benchmark completed for ${server.name}`);
    }
}

async function main() {
    console.log(`Platform: ${os.type()} (${os.release()})`);
    console.log(`CPU: ${os.cpus()[0].model}`);
    console.log(`Date: ${new Date().toLocaleString()}`);

    for (const server of servers) {
        await runBenchmark(server);
    }
}

main().catch(console.error);
