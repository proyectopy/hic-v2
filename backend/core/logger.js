const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "../storage/hic.log");

function format(level, msg) {
    const time = new Date().toISOString();
    return `[${time}] [${level.toUpperCase()}] ${msg}`;
}

function writeToFile(line) {
    try {
        fs.appendFileSync(LOG_FILE, line + "\n");
    } catch (err) {
        console.error("Error del archivo de registro:", err.message);
    }
}

function info(msg) {
    const line = format("info", msg);
    console.log(line);
    writeToFile(line);
}

function warn(msg) {
    const line = format("warn", msg);
    console.log(line);
    writeToFile(line);
}

function error(msg) {
    const line = format("error", msg);
    console.error(line);
    writeToFile(line);
}

module.exports = {
    info,
    warn,
    error
};