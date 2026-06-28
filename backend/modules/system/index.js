const os = require("os");
const osu = require("os-utils");
const eventBus = require("../../core/events");
const logger = require("../../core/logger");

module.exports = {
    name: "system",

    register(app) {

        logger.info("SYSTEM LIVE MONITOR STARTED");

        // =========================
        // FUNCIÓN CENTRAL DE MÉTRICAS
        // =========================
        async function collectMetrics() {

            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;

            const ramPercent = Number(((usedMem / totalMem) * 100).toFixed(2));

            const cpuLoad = await new Promise((resolve) => {
                osu.cpuUsage((v) => resolve(v));
            });

            const load = os.loadavg();

            return {
                cpu: Number((cpuLoad * 100).toFixed(2)),
                ram: ramPercent,
                load,
                totalMem,
                freeMem,
                usedMem
            };
        }

        // =========================
        // STREAM AUTOMÁTICO (EVENTBUS)
        // =========================
        setInterval(async () => {

            const metrics = await collectMetrics();

            eventBus.emit("system.metrics", {
                cpu: metrics.cpu,
                ram: metrics.ram
            });

        }, 3000);

        // =========================
        // API MANUAL
        // =========================
        app.get("/api/system", async (req, res) => {

            logger.info("SYSTEM ROUTE HIT");

            const metrics = await collectMetrics();

            res.json({
                cpu: {
                    usage: metrics.cpu,
                    load1m: metrics.load[0],
                    load5m: metrics.load[1],
                    load15m: metrics.load[2]
                },

                memory: {
                    total: metrics.totalMem,
                    free: metrics.freeMem,
                    used: metrics.usedMem,
                    usagePercent: metrics.ram
                },

                uptime: os.uptime(),
                status: "system module active"
            });
        });
    }
};