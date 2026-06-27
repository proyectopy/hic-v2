const fs = require("fs");
const path = require("path");

function load(app) {
    const modulesPath = path.join(__dirname, "..", "modules");

    console.log("📦 Cargando modulos desde:", modulesPath);

    if (!fs.existsSync(modulesPath)) {
        console.warn("⚠ Carpeta de modulos no encontrada");
        return;
    }

    fs.readdirSync(modulesPath).forEach((folder) => {
        const modulePath = path.join(modulesPath, folder);

        try {
            const mod = require(modulePath);

            if (mod && mod.register) {
                mod.register(app);
                console.log(`✔ Modulo cargado: ${mod.name || folder}`);
            } else {
                console.log(`⚠ Módulo no válido omitido: ${folder}`);
            }

        } catch (err) {
            console.error(`❌ Error cargando modulo ${folder}:`, err.message);
        }
    });
}

module.exports = {
    load
};