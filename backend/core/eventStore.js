class EventStore {
    constructor() {
        this.events = [];
        this.limit = 200;
    }

    add(event) {
        const enriched = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            type: event.type || "info",
            service: event.service || "system",
            metric: event.metric || null,

            from: event.from ?? null,
            to: event.to ?? null,

            cpu: typeof event.cpu === "number" ? event.cpu : null,
            ram: typeof event.ram === "number" ? event.ram : null,

            message: event.message || null,
            timestamp: new Date().toISOString()
        };

        this.events.push(enriched);

        if (this.events.length > this.limit) {
            this.events.shift();
        }

        return enriched;
    }

    get(limit = 50) {
        return this.events.slice(-limit);
    }

    getByType(type, limit = 50) {
        return this.events.filter(e => e.type === type).slice(-limit);
    }

    clear() {
        this.events = [];
    }
}

module.exports = new EventStore();