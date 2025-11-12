import { EventEmitter } from "events";

const EVENTS = {
  SHOW: "SHOW_ALERT",
};

class AlertService extends EventEmitter {
  show(options) {
    // options: { title, message, type, duration, onPress, buttonText }
    this.emit(EVENTS.SHOW, { ...options });
  }
}

const alertService = new AlertService();
export { alertService, EVENTS };
export default alertService;
