const os = require("os");
const osu = require("os-utils");
const eventBus = require("../../core/events");

module.exports = {
    name: "system",

    register(app) {

        app.get("/api/system", async (req, res) => {

            console.log("SYSTEM ROUTE HIT");

            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;

            const ramPercent = Number(((usedMem / totalMem) * 100).toFixed(2));

            const cpuLoad = await new Promise((resolve) => {
                osu.cpuUsage((v) => resolve(v));
            });

            const load = os.loadavg();

            console.log("EMITTING METRICS");

            eventBus.emit("system.metrics", {
                cpu: cpuLoad * 100,
                ram: ramPercent
            });

            res.json({
                cpu: {
                    usage: Number((cpuLoad * 100).toFixed(2)),
                    load1m: load[0],
                    load5m: load[1],
                    load15m: load[2]
                },

                memory: {
                    total: totalMem,
                    free: freeMem,
                    used: usedMem,
                    usagePercent: ramPercent
                },

                uptime: os.uptime(),

                status: "system module active"
            });
        });
    }
};