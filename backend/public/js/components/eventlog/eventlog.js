function renderEvents(events) {

    const box = document.getElementById("events");
    if (!box) return;

    box.innerHTML = "";   // 🔴 IMPORTANTE: evita duplicados

    for (const event of events) {

        const div = document.createElement("div");
        div.className = "event";

        div.innerHTML = `
            <span class="event-time">${event.timestamp}</span>
            <span class="event-type">${event.metric}</span>
            <span class="event-message">${event.from} → ${event.to}</span>
        `;

        box.appendChild(div);
    }
}

window.renderEvents = renderEvents;