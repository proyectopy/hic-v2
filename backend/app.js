const express = require("express");
const http = require("http");

const config = require("./core/config");
const logger = require("./core/logger");
const moduleLoader = require("./core/moduleLoader");
const WSServer = require("./core/ws");

const app = express();

// =======================
// CORE HTTP SERVER
// =======================
const server = http.createServer(app);

// =======================
// WEBSOCKET SERVER
// =======================
const wsServer = new WSServer(server);
global.wsServer = wsServer;

// =======================
// HEALTH CORE ROUTE
// =======================
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: config.app.name,
        version: config.app.version
    });
});

// =======================
// MODULE LOADER
// =======================
moduleLoader.load(app);

// =======================
// START SERVER
// =======================
server.listen(config.server.port, config.server.host, () => {
    logger.info(
        `${config.app.name} running on http://${config.server.host}:${config.server.port}`
    );
});