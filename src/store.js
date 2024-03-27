export default class Writeable {
    constructor(value) {
        this.val = value;
        this.subscribers = [];
    }
    subscribe(listener) {
        this.subscribers.push(listener);
        listener(this.val);
        return () => this.subscribers = this.subscribers.filter(l => l != listener);
    }

    set(value) {
        this.val = value;
        this.subscribers.forEach(l => l(this.val));
    }
}
