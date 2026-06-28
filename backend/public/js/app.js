
const ws = new WebSocket(`ws://${location.host}`);

// =========================
// CHART (CPU + RAM)
// =========================
const ctx = document.getElementById("chart").getContext("2d");

function draw(series) {
    if (!series) return;

    ctx.clearRect(0, 0, 900, 250);

    function line(data, color) {
        ctx.beginPath();

        data.forEach((p, i) => {
            const x = i * 4;
            const y = 250 - p.v * 2;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.strokeStyle = color;
        ctx.stroke();
    }

    // CPU verde
    line(series.cpu, "#22c55e");

    // RAM azul
    line(series.ram, "#60a5fa");
}

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

    // -------------------------
    // GRAPH
    // -------------------------
    if (data.series) {
        draw(data.series);
    }

    // -------------------------
    // EVENTS
    // -------------------------
    if (data.events) {
        data.events.forEach(addEvent);
    }
};