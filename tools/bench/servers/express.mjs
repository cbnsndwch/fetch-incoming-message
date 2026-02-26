import * as stream from "node:stream";
import express from "express";

const PORT = process.env.PORT || 3000;

let app = express();

app.get("/", (_req, res) => {
    res.type("text/html");

    let HELLO_WORLD = "<html><body><h1>Hello, world!</h1></body></html>";

    let body = new stream.Readable({
        read() {
            this.push(HELLO_WORLD);
            this.push(null);
        },
    });

    body.pipe(res);
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${server.address().port}`);
});
