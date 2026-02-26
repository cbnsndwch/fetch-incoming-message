# @cbnsndwch/fetch-incoming-message

> **⚠️ EXPERIMENTAL**: This project is highly experimental and not intended for production use. APIs may change without notice.

A drop-in replacement for Node.js `http.IncomingMessage` that implements the standard Fetch API `Request` interface.

## Purpose

The goal of this library is to bridge the gap between Node.js's native `http` module and the modern Fetch API standard. By extending `http.IncomingMessage` and implementing the `Request` interface, `fetch-incoming-message` allows you to treat incoming Node.js requests as standard Fetch Requests.

This eliminates the need for complex adapter layers or converting `IncomingMessage` to `Request` manually when working with web-standard libraries in a Node.js environment.

## Installation

```bash
npm install @cbnsndwch/fetch-incoming-message
# or
pnpm add @cbnsndwch/fetch-incoming-message
# or
yarn add @cbnsndwch/fetch-incoming-message
```

## Usage

You can use `FetchIncomingMessage` by passing it to the `IncomingMessage` option in `http.createServer`:

```typescript
import { createServer } from 'node:http';
import FetchIncomingMessage from '@cbnsndwch/fetch-incoming-message';

const server = createServer(
  {
    IncomingMessage: FetchIncomingMessage,
  },
  (req, res) => {
    // req is now both an IncomingMessage AND a Fetch Request
    
    // You can access standard Fetch properties
    console.log(req.method); 
    console.log(req.url);
    console.log(req.headers.get('content-type')); // Use standard Headers API

    // You can access specific methods like .json(), .text(), .arrayBuffer()
    // req.json().then(data => console.log(data));

    res.end('Hello World');
  }
);

server.listen(3000);
```

## How it works

This library extends the native `Readable` stream (just like `http.IncomingMessage`) but implements the `Request` interface from `undici-types`. It intercepts the socket and parses headers and body content to expose them via standard Fetch API methods and properties.

## Shortcuts & Deviations from Spec

As an experimental library, several shortcuts have been taken:

- **`clone()` is not implemented**: Request cloning is complex with streams and is currently not supported.
- **Direct Socket Consumption**: Body methods (`.json()`, `.text()`, etc.) currently attempt to read directly from the underlying socket in some cases, which may conflict with standard Node.js stream consumption or body parsers.
- **`formData()` is missing**: Multipart form data parsing is not yet implemented.
- **Unimplemented Properties**: Several properties like `cache`, `redirect`, `integrity`, and `referrerPolicy` are present but currently return uninitialized or default values.
- **`body` property**: The `body` property returns `null` or an uninitialized stream in some cases, rather than a strictly compliant Web ReadableStream, though the object itself functions as a Node.js Readable stream.

## Limitations

- **Experimental**: This is a proof-of-concept.
- **Compatibility**: May not support all edge cases of `http.IncomingMessage` or all features of the Fetch `Request` specification perfectly.
- **Performance**: The overhead of aligning these two interfaces has not been fully benchmarked.

## License

MIT
