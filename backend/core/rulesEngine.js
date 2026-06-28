class RulesEngine {
    constructor() {
        this.rules = {
            cpu: { warn: 70, critical: 90 },
            ram: { warn: 75, critical: 90 }
        };
    }

    evaluate(metric, value) {
        const rule = this.rules[metric];
        if (!rule) return "ok";

        if (value >= rule.critical) return "critical";
        if (value >= rule.warn) return "warning";
        return "ok";
    }

    getAll() {
        return this.rules;
    }
}

module.exports = new RulesEngine();