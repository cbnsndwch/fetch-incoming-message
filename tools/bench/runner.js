import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import process from 'node:process';
import os from 'node:os';
import { createRequire } from 'node:module';

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
        port: 13000
    },
    {
        name: `node:http@${nodeVersion}`,
        command: 'node',
        args: ['./servers/node-http.mjs'],
        port: 13001
    },
    {
        name: `express@${expressVersion}`,
        command: 'node',
        args: ['./servers/express.mjs'],
        port: 13002
    },
];

async function runBenchmark(server) {
    console.log(`\nRunning benchmark for ${server.name} on port ${server.port} ...\n`);

    const serverProcess = spawn(server.command, server.args, {
        cwd: __dirname,
        stdio: 'inherit',
        env: { ...process.env, PORT: server.port.toString() },
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
        await new Promise((resolve, reject) => {
            const args = ['exec', 'artillery', 'run', '--target', `http://127.0.0.1:${server.port}`, join(__dirname, 'bench-config.yaml')];
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
