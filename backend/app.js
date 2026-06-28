const express = require("express");
const http = require("http");
const os = require("os");
const osu = require("os-utils");

const config = require("./core/config");
const logger = require("./core/logger");
const moduleLoader = require("./core/moduleLoader");
const WSServer = require("./core/ws");


const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
logger.info("STATIC PATH:", path.join(__dirname, "public"));

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
// HEALTH ROUTE
// =======================
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: config.app.name,
        version: config.app.version
    });
});

// =======================
// BOOT LOG
// =======================
logger.info("Inicializando módulos...");

// =======================
// MODULE LOADER
// =======================
moduleLoader.load(app);

// =======================
// READY LOG
// =======================
logger.info("Servidor iniciando...");

// =======================
// START SERVER
// =======================
server.listen(config.server.port, config.server.host, () => {
    logger.info(
        `${config.app.name} running on http://${config.server.host}:${config.server.port}`
    );
});