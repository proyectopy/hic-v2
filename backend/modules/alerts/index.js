const eventBus = require("../../core/events");
const alertEngine = require("../../core/alertEngine");
const logger = require("../../core/logger");

module.exports = {
    name: "alerts",

    register(app) {

        logger.info("ALERT ENGINE v2 ACTIVE");

        eventBus.on("system.metrics", (data) => {

            const result = alertEngine.update(
                data.cpu,
                data.ram
            );

            if (result.state) {
                logger.info(
                    `STATE -> CPU:${result.state.cpu} RAM:${result.state.ram}`
                );
            }
        });

        //app.get("/api/alerts", (req, res) => {
        //    res.json(alertEngine.update(0, 0));
        //});

        app.get("/api/alerts", (req, res) => {

            const cpu = Number(req.query.cpu || 0);
            const ram = Number(req.query.ram || 0);

            const result = alertEngine.update(cpu, ram);

            res.json({
                input: { cpu, ram },
                ...result
            });
        });

        
    }
};