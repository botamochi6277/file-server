'use strict';
const express = require('express');
const os = require("os");
const yargs = require("yargs");
// import { networkInterfaces } from "os";

const args = yargs
  .command('path', 'target directory path')
  .demandCommand(1)
  .option('port', {
    alias: 'p',
    description: 'port number',
    demandOption: true,
    default: 8002
  })
  .option('mode', {
    alias: 'm',
    description: 'mode, page/api',
    demandOption: true,
    default: "page"
  })
  .help()
  .argv

function getIpAddress() {
  const nets = os.networkInterfaces();
  const net = nets["en0"]?.find((v) => v.family == "IPv4");
  return !!net ? net.address : null;
}

const host = getIpAddress();

const app = express();
const rootPath = args._[0];
app.use(express.static(rootPath, { index: false }));

const serveIndex = require('serve-index');

if (args.mode === "page") {
  app.use(serveIndex(rootPath, {
    icons: true,
    view: 'details',//'tiles',
    template: './template.html',
  }));
} else if (args.mode === "api") {
  app.use(serveIndex(rootPath, {
    template: (locals, callback) => {
      callback(null, JSON.stringify({
        directory: locals.directory,
        files: locals.fileList
      }));
    },
  }));
} else {
  // 
  throw new Error(`mode must be page or api. this is ${args.mode}`);
}

const hostname = os.hostname();
const port = args.port
app.listen(port, () => {
  console.log(`File Server is running for ${rootPath} in ${args.mode} mode`);
  console.log(`Please access http://${hostname}:${port}`);
});
