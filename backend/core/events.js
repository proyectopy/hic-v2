const EventEmitter = require("events");
const logger = require("./logger");

class HICEventBus extends EventEmitter {
    emit(event, data) {
        logger.info(`EVENT: ${event} -> ${JSON.stringify(data || {})}`);
        return super.emit(event, data);
    }

    on(event, listener) {
        logger.info(`Listener registered: ${event}`);
        return super.on(event, listener);
    }
}

const eventBus = new HICEventBus();

module.exports = eventBus;