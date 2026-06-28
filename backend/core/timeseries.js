class TimeSeries {
    constructor(limit = 200) {
        this.limit = limit;

        this.data = {
            cpu: [],
            ram: []
        };
    }

    push(cpu, ram) {
        const t = Date.now();

        this.data.cpu.push({ t, v: cpu });
        this.data.ram.push({ t, v: ram });

        if (this.data.cpu.length > this.limit) this.data.cpu.shift();
        if (this.data.ram.length > this.limit) this.data.ram.shift();
    }

    get(range = 200) {
        return {
            cpu: this.data.cpu.slice(-range),
            ram: this.data.ram.slice(-range)
        };
    }
}

module.exports = new TimeSeries();