import { createServer, IncomingMessage } from "node:http";

import FetchIncomingMessage from "../lib/index.js";

// @ts-expect-error
const server = createServer({ IncomingMessage: FetchIncomingMessage }, (req, res) => {
    console.log("Request received: ", req.method, req.url);

    res.end("Hello, world!");
});

await new Promise((resolve) => {
    server.listen(3000, () => {
        resolve();
    });
});

console.log("Server listening on port 3000");

const res = await fetch("http://localhost:3000/foo?bar=baz", {
    method: "POST",
    headers: {
        Host: "localhost:3000",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ foo: "bar" }),
});

console.log("Response received: ", res.status, res.statusText, await res.text());

process.exit(0);
