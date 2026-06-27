const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "../storage/history.json");

function load() {
    try {
        if (!fs.existsSync(FILE)) return [];
        return JSON.parse(fs.readFileSync(FILE, "utf8"));
    } catch (err) {
        return [];
    }
}

function save(data) {
    try {
        fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("History save error:", err.message);
    }
}

class History {
    constructor() {
        this.events = load();
    }

    add(event) {
        this.events.push({
            ...event,
            timestamp: new Date().toISOString()
        });

        // limitar tamaño
        if (this.events.length > 500) {
            this.events = this.events.slice(-500);
        }

        save(this.events);
    }

    get(limit = 50) {
        return this.events.slice(-limit);
    }
}

module.exports = new History();