"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var config_1 = require("../src/config");
var index_1 = require("../src/server/index");
index_1["default"](new ws_1["default"].Server({ port: config_1.PORT }));
