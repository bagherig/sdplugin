class Clock {
    constructor(updateCallback) {
        this.time = 0;
        this.intervalId = null;
        this.running = false;
        this.updateCallback = updateCallback;
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.intervalId = _setIntervalESD(() => {
                this.time++;
                this.updateCallback(this.time);
            }, 1000);
        }
    }

    pause() {
        if (this.running) {
            _clearTimeoutESD(this.intervalId); // Using the enhanced clearTimeout function
            this.running = false;
        }
    }

    reset() {
        this.pause();
        this.time = 0;
        this.updateCallback(this.time);
    }

    increment(val=1) {
        val = (typeof val === "string") ? parseInt(val) : val; // Corrected the type check
        this.time += val;
        this.updateCallback(this.time);
    }

    decrement(val=1) {
        val = (typeof val === "string") ? parseInt(val) : val; // Corrected the type check
        this.time -= val;
        this.updateCallback(this.time);
    }
}
