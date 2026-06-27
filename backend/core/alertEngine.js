const logger = require("./logger");
const history = require("./history");

class AlertEngine {
    constructor() {
        this.state = {
            cpu: "ok",
            ram: "ok"
        };

        this.cooldowns = {};
        this.COOLDOWN_MS = 10000; // anti-spam
    }

    evaluate(cpu, ram) {
        return {
            cpu: this.getLevel(cpu),
            ram: this.getLevel(ram)
        };
    }

    getLevel(value) {
        if (value > 90) return "critical";
        if (value > 75) return "warning";
        return "ok";
    }

    shouldTrigger(key, level) {
        const now = Date.now();
        const id = `${key}-${level}`;

        if (!this.cooldowns[id]) return true;

        return (now - this.cooldowns[id]) > this.COOLDOWN_MS;
    }

    update(cpu, ram) {
        const newState = this.evaluate(cpu, ram);

        for (const key in newState) {
            const old = this.state[key];
            const now = newState[key];

            if (old !== now) {

                // =========================
                // HISTORY (persistente)
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
                // ALERTA (anti-spam)
                // =========================
                if (this.shouldTrigger(key, now)) {
                    this.cooldowns[`${key}-${now}`] = Date.now();

                    logger.warn(
                        `ALERT ${key.toUpperCase()}: ${old} → ${now} (cpu:${cpu}, ram:${ram})`
                    );
                }

                // =========================
                // LOG DE CAMBIO
                // =========================
                logger.info(
                    `STATE CHANGE ${key.toUpperCase()}: ${old} → ${now}`
                );
            }
        }

        // actualizar estado global
        this.state = newState;

        // =========================
        // WEBSOCKET BROADCAST
        // =========================
        if (global.wsServer) {
            global.wsServer.broadcast({
                type: "metrics",
                state: this.state,
                history: history.get(10)
            });
        }

        return {
            state: this.state,
            history: history.get(20)
        };
    }
}

module.exports = new AlertEngine();