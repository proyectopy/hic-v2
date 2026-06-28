class EventStore {
    constructor(limit = 200) {
        this.events = [];
        this.limit = limit;
    }

    add(event) {
        const enriched = {
            ...event,
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
}

module.exports = new EventStore();