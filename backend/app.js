const express = require("express");
const fs = require("fs");
const path = require("path");
const eventBus = require("./core/events");

const app = express();

// =======================
// CONFIG
// =======================
const PORT = 3005;

// =======================
// HEALTH CORE ROUTE
// =======================
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        service: "HIC v2",
        version: "0.1.0"
    });
});

// =======================
// MODULE LOADER
// =======================
const modulesPath = path.join(__dirname, "modules");

console.log("📦 Loading modules from:", modulesPath);

if (fs.existsSync(modulesPath)) {
    fs.readdirSync(modulesPath).forEach((folder) => {
        const modulePath = path.join(modulesPath, folder);

        try {
            const mod = require(modulePath);

            if (mod && mod.register) {
                mod.register(app);
                console.log(`✔ Module loaded: ${mod.name || folder}`);
            } else {
                console.log(`⚠ Skipped invalid module: ${folder}`);
            }

        } catch (err) {
            console.error(`❌ Error loading module ${folder}:`, err.message);
        }
    });
} else {
    console.warn("⚠ Modules folder not found");
}

// =======================
// START SERVER
// =======================
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 HIC v2 running on http://0.0.0.0:${PORT}`);
});