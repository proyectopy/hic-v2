const logger = require("./logger");
const history = require("./history");
const eventStore = require("./eventStore");
const rulesEngine = require("./rulesEngine");
const timeseries = require("./timeseries");

class AlertEngine {
    constructor() {
        this.state = {
            cpu: "ok",
            ram: "ok"
        };

        this.cooldowns = {};
        this.COOLDOWN_MS = 10000;
    }

    evaluate(cpu, ram) {
        return {
            cpu: rulesEngine.evaluate("cpu", cpu),
            ram: rulesEngine.evaluate("ram", ram)
        };
    }

    shouldTrigger(key, level) {
        const now = Date.now();
        const id = `${key}-${level}`;

        if (!this.cooldowns[id]) return true;

        return (now - this.cooldowns[id]) > this.COOLDOWN_MS;
    }

    update(cpu, ram) {

        const newState = this.evaluate(cpu, ram);

        // =========================
        // TIME SERIES
        // =========================
        timeseries.push(cpu, ram);

        for (const key in newState) {

            const old = this.state[key];
            const now = newState[key];

            if (old !== now) {

                // =========================
                // HISTORY
                // =========================
                history.add({
                    type: "state_change",
                    key,
                    from: old,
                    to: now,
                    cpu,
                    ram
                });

                // =========================
                // EVENT STORE (DATADOG)
                // =========================
                eventStore.add({
                    type:
                        now === "critical"
                            ? "critical"
                            : now === "warning"
                                ? "warning"
                                : "recovery",
                    service: "system",
                    metric: key,
                    from: old,
                    to: now,
                    cpu,
                    ram
                });

                // =========================
                // LOG
                // =========================
                logger.info(
                    `STATE CHANGE ${key.toUpperCase()}: ${old} → ${now}`
                );

                // =========================
                // ALERT (ANTI-SPAM)
                // =========================
                if (this.shouldTrigger(key, now)) {
                    this.cooldowns[`${key}-${now}`] = Date.now();

                    logger.warn(
                        `ALERT ${key.toUpperCase()}: ${old} → ${now}`
                    );
                }
            }
        }

        this.state = newState;

        // =========================
        // BROADCAST UNIFICADO
        // =========================
        if (global.wsServer) {
            global.wsServer.broadcast({
                type: "observability",
                cpu,
                ram,
                state: this.state,
                series: timeseries.get(200),
                events: eventStore.get(50),
                history: history.get(20)
            });
        }

        return {
            state: this.state,
            series: timeseries.get(200),
            events: eventStore.get(50)
        };
    }
}

module.exports = new AlertEngine();