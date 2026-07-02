
// =========================
// WEBSOCKET
// =========================

const wsProtocol = window.location.protocol === "https:"
    ? "wss:"
    : "ws:";

const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

const ctx = document.getElementById("chart").getContext("2d");

// =========================
// WEBSOCKET HANDLER
// =========================

ws.onmessage = (msg) => {

    const data = JSON.parse(msg.data);

    console.log("WS OK");

    // =========================
    // STATUS
    // =========================
    try {
        if (typeof updateStatus === "function") {
            updateStatus(data);
        }
    } catch (e) {
        console.error("STATUS FAIL", e);
    }

    // =========================
    // CHART
    // =========================
    try {
        if (data.series && typeof drawChart === "function") {
            drawChart(ctx, data.series);
        }
    } catch (e) {
        console.error("CHART FAIL", e);
    }

    // =========================
    // EVENTS
    // =========================
    try {
        if (Array.isArray(data.events) && typeof renderEvents === "function") {
            renderEvents(data.events);
        }
    } catch (e) {
        console.error("EVENTS FAIL", e);
    }

};