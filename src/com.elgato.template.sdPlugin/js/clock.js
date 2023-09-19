class Clock {
    constructor(updateCallback) {
        this.time = 0;
        this.interval = null;
        this.running = false;
        this.updateCallback = updateCallback;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.interval = setInterval(() => {
                this.time++;
                this.updateCallback(this.time);
            }, 1000);
        }
    }

    pause() {
        if (this.running) {
            clearInterval(this.interval);
            this.running = false;
        }
    }

    reset() {
        this.pause();
        this.time = 0;
        this.updateCallback(this.time);
    }

    increment(val=1) {
        this.time += val;
        this.updateCallback(this.time);
    }

    decrement(val=1) {
        this.time -= val;
        this.updateCallback(this.time);
    }
}
