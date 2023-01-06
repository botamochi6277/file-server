'use strict';
const express = require('express');
const os = require("os");
// import { networkInterfaces } from "os";


function getIpAddress() {
  const nets = os.networkInterfaces();
  const net = nets["en0"]?.find((v) => v.family == "IPv4");
  return !!net ? net.address : null;
}

const host = getIpAddress();

const app = express();
const args = process.argv.slice(2);
const rootPath = args[0];
app.use(express.static(rootPath, { index: false }));

//index.htmlを勝手に見に行かない指定

const serveIndex = require('serve-index');

app.use(serveIndex(rootPath, {
  icons: true,
  view: 'details',//'tiles',
  template: './template.html',
}));

const hostname = os.hostname();
const port = 8002
app.listen(port, () => {
  console.log(`File Server for ${rootPath}`);
  console.log(`Please access http://${hostname}:${port}`);
});
