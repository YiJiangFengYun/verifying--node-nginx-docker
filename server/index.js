const http = require('http');
const args = require("args");

args.option("host", "Host to listen. Default value is 0.0.0.0", "0.0.0.0")
    .option("port", "Poart to listen. Default value is 1080", 1080)
    .option("name", "Name for this app.", "default");

const options = args.parse(process.argv);

const host = options.host;
const port = options.port;
const name = options.name;
const id = Math.round(Math.random() * 100000);

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello, I am ${id}!`);
});

server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});

function onTerminated() {
    process.exit(0);
}

process.on("SIGINT", onTerminated);
process.on("SIGTERM", onTerminated);