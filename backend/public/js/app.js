//function init() {
//    Layout.init();
//    // aquí irá el resto de inicializaciones
//}
//
//init();

//const ws = new WebSocket(`ws://${location.host}`);

// =========================
// WEBSOCKET
// =========================

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";

const ws = new WebSocket(
    `${wsProtocol}//${window.location.host}`
);

// =========================
// CHART (CPU + RAM)
// =========================
const ctx = document.getElementById("chart").getContext("2d");




// =========================
// EVENT STREAM
// =========================
function addEvent(e) {
    const box = document.getElementById("events");

    const div = document.createElement("div");
    div.innerText = `[${e.timestamp}] ${e.metric}: ${e.from} → ${e.to}`;

    box.prepend(div);
}

// =========================
// WEBSOCKET
// =========================
ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    console.log("WS:", data);

    // -------------------------
    // CPU / RAM
    // -------------------------
    if (typeof data.cpu === "number") {
        document.getElementById("cpu").innerText = data.cpu + "%";
    }

    if (typeof data.ram === "number") {
        document.getElementById("ram").innerText = data.ram + "%";
    }

    // -------------------------
    // STATE (OK / WARN / CRIT)
    // -------------------------
    if (data.state) {
        document.getElementById("cpuState").innerText = data.state.cpu;
        document.getElementById("ramState").innerText = data.state.ram;

        document.getElementById("cpuState").className = "state " + data.state.cpu;
        document.getElementById("ramState").className = "state " + data.state.ram;
    }

    /// -------------------------
    // GRAPH
    // -------------------------
    if (data.series) {
        drawChart(ctx, data.series);
    }

    // -------------------------
    // EVENTS
    // -------------------------
    //if (data.events) {
    //    data.events.forEach(addEvent);
    //}
    console.log("EVENTOS:", data.events);

    if (data.events) {
        data.events.forEach(addEvent);
    }
};