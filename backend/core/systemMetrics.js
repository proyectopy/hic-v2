const os = require("os");

class SystemMetrics {

    getCPUUsage() {
        const cpus = os.cpus();

        let totalIdle = 0;
        let totalTick = 0;

        cpus.forEach(cpu => {
            for (type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });

        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;

        return Math.round(100 - (idle / total) * 100);
    }

    getRAMUsage() {
        const total = os.totalmem();
        const free = os.freemem();

        return Math.round(((total - free) / total) * 100);
    }

    getMetrics() {
        return {
            cpu: this.getCPUUsage(),
            ram: this.getRAMUsage(),
            uptime: os.uptime()
        };
    }
}

module.exports = new SystemMetrics();
