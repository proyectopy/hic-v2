const eventBus = require("../../core/events");

// estado global interno
let lastState = {
    cpu: "ok",
    ram: "ok"
};

function evaluateSystem(cpuUsage, ramUsage) {

    let state = {
        cpu: "ok",
        ram: "ok"
    };

    if (cpuUsage > 90) state.cpu = "critical";
    else if (cpuUsage > 75) state.cpu = "warning";

    if (ramUsage > 90) state.ram = "critical";
    else if (ramUsage > 75) state.ram = "warning";

    return state;
}

function detectChanges(newState) {

    const changes = [];

    for (const key in newState) {
        if (newState[key] !== lastState[key]) {
            changes.push({
                type: key,
                from: lastState[key],
                to: newState[key]
            });
        }
    }

    lastState = newState;

    return changes;
}

// 🔥 PROTECCIÓN ANTI-DUPLICADOS (IMPORTANTE)
if (!global.__alerts_registered__) {

    global.__alerts_registered__ = true;

    console.log("ALERT MODULE ACTIVE");

    eventBus.on("system.metrics", (data) => {

        console.log("EVENT RECEIVED IN ALERTS");

        const state = evaluateSystem(data.cpu, data.ram);
        const changes = detectChanges(state);

        if (changes.length > 0) {
            console.log("🔔 Alert changes:", changes);
        }
    });
}

module.exports = {
    name: "alerts",

    register(app) {

        app.get("/api/alerts/test", (req, res) => {

            const cpu = Number(req.query.cpu || 0);
            const ram = Number(req.query.ram || 0);

            const state = evaluateSystem(cpu, ram);
            const changes = detectChanges(state);

            res.json({
                input: { cpu, ram },
                state,
                changes
            });
        });
    }
};