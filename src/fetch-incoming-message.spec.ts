import { Socket } from "node:net";
import { Server as HttpServer, IncomingMessage, createServer } from "node:http";

import { describe, it, expect, beforeEach, vi } from "vitest";
import SuperHeaders from "@mjackson/headers";

import FetchIncomingMessage from "./fetch-incoming-message.js";

describe("FetchIncomingMessage", () => {
    // let socket: Socket;
    // let fetchIncomingMessage: FetchIncomingMessage;

    let server: HttpServer;

    beforeEach(() => {
        // socket = new Socket();
        // fetchIncomingMessage = new FetchIncomingMessage(socket);

        server = createServer(
            // @ts-expect-error
            (_req: any, _res: any) => {
                console.log("Request received");
                _res.end();
            },
            {
                IncomingMessage: FetchIncomingMessage,
            },
        );
    });

    it("should get headers set by the node:http parser", async () => {
        await new Promise<void>((resolve) => {
            server.listen(3000, () => {
                resolve();
            });
        });

        console.log("Server listening on port 3000");

        await fetch("http://localhost:3000", {
            headers: {
                "Content-Type": "application/json",
            },
        });
    });

    // it('should initialize with the given socket', () => {
    //     expect(fetchIncomingMessage.socket).toBe(socket);
    // });

    // it('should have default duplex value as "half"', () => {
    //     expect(fetchIncomingMessage.duplex).toBe('half');
    // });

    // it('should set and get cache', () => {
    //     fetchIncomingMessage['_cache'] = 'default';
    //     expect(fetchIncomingMessage.cache).toBe('default');
    // });

    // it('should set and get headers', () => {
    //     const headers = new SuperHeaders({
    //         'Content-Type': 'application/json'
    //     });
    //     fetchIncomingMessage['_headers'] = headers;
    //     expect(fetchIncomingMessage.headers).toBe(headers);
    // });

    // it('should set and get method', () => {
    //     fetchIncomingMessage['_method'] = 'GET';
    //     expect(fetchIncomingMessage.method).toBe('GET');
    // });

    // it('should set and get url', () => {
    //     fetchIncomingMessage['_url'] = 'http://example.com';
    //     expect(fetchIncomingMessage.url).toBe('http://example.com');
    // });

    // it('should set and get integrity', () => {
    //     fetchIncomingMessage['_integrity'] = 'sha256-abc123';
    //     expect(fetchIncomingMessage.integrity).toBe('sha256-abc123');
    // });

    // it('should set and get referrer', () => {
    //     fetchIncomingMessage['_referrer'] = 'http://referrer.com';
    //     expect(fetchIncomingMessage.referrer).toBe('http://referrer.com');
    // });

    // it('should set and get keepalive', () => {
    //     fetchIncomingMessage['_keepalive'] = true;
    //     expect(fetchIncomingMessage.keepalive).toBe(true);
    // });

    // it('should set and get signal', () => {
    //     const signal = new AbortSignal();
    //     fetchIncomingMessage['_signal'] = signal;
    //     expect(fetchIncomingMessage.signal).toBe(signal);
    // });

    // it('should set and get body', () => {
    //     const body = new ReadableStream();
    //     fetchIncomingMessage['_body'] = body;
    //     expect(fetchIncomingMessage.body).toBe(body);
    // });

    // it('should set and get bodyUsed', () => {
    //     fetchIncomingMessage['_bodyUsed'] = true;
    //     expect(fetchIncomingMessage.bodyUsed).toBe(true);
    // });

    // it('should throw error on clone method', () => {
    //     expect(() => fetchIncomingMessage.clone()).toThrow(
    //         'Method not implemented.'
    //     );
    // });

    // it('should read arrayBuffer from socket', async () => {
    //     const data = Buffer.from('test');
    //     vi.spyOn(socket, 'read').mockImplementation(() => data);
    //     const buffer = await fetchIncomingMessage.arrayBuffer();
    //     expect(buffer).toEqual(data.buffer);
    // });

    // it('should read text from socket', async () => {
    //     const data = 'test';
    //     vi.spyOn(socket, 'read').mockImplementation(() => Buffer.from(data));
    //     const text = await fetchIncomingMessage.text();
    //     expect(text).toBe(data);
    // });

    // it('should read json from socket', async () => {
    //     const data = { key: 'value' };
    //     vi.spyOn(socket, 'read').mockImplementation(() =>
    //         Buffer.from(JSON.stringify(data))
    //     );
    //     const json = await fetchIncomingMessage.json();
    //     expect(json).toEqual(data);
    // });

    // it('should read blob from socket', async () => {
    //     const data = Buffer.from('test');
    //     vi.spyOn(socket, 'read').mockImplementation(() => data);
    //     const blob = await fetchIncomingMessage.blob();
    //     expect(blob).toBeInstanceOf(Blob);
    // });

    // it('should add header lines', () => {
    //     const headers = { 'Content-Type': 'application/json' };
    //     fetchIncomingMessage._addHeaderLines(headers, 1);
    //     expect(fetchIncomingMessage.headers).toEqual(new SuperHeaders(headers));
    // });
});
