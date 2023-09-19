
const timerUpdateCallback = (time) => {
    updateTimer(time);
    checkForEvents();
};

const timer = new Clock(timerUpdateCallback);

function setEvents() {
    $SD.on(Events.didReceiveGlobalSettings, function (event) {
        globalSettings = event.payload.settings;
    });

    $SD.on(Events.connected, function (event) {
        // Request global settings when the plugin connects
        $SD.getGlobalSettings();
        timer.reset();
    });

    // timerAction
    timerAction.onWillAppear(event => {
        timerContext = event.context;
    });

    timerAction.onKeyDown(({ action, context, device, event, payload }) => {
        timerTimeout = setTimeout(() => timer.reset(), 1500);
    });

    timerAction.onKeyUp(event => {
        clearTimeout(timerTimeout);
        if (timer.running)
            timer.pause();
        else
            timer.start();
    });

    // incrementAction
    incrementAction.onWillAppear(event => {
        incrementContext = event.context;
        $SD.getSettings(incrementContext);
    });

    incrementAction.onDidReceiveSettings(event => {
        const step = event.payload.settings.step || 1;
        $SD.setTitle(event.context, `${step}`, 0);
        incSteps[event.context] = parseInt(step);
    });

    incrementAction.onKeyUp(event => {
        timer.increment(parseInt(incSteps[event.context]));
    });

    // decrementAction
    decrementAction.onWillAppear(event => {
        decrementContext = event.context;
        $SD.getSettings(decrementContext);
    });

    decrementAction.onDidReceiveSettings(event => {
        const step = event.payload.settings.step || 1;
        $SD.setTitle(event.context, `${step}`, 0);
        decSteps[event.context] = parseInt(step);
    });

    decrementAction.onKeyUp(event => {
        timer.decrement(parseInt(decSteps[event.context]));
    });

    // displayAction
    displayAction.onWillAppear(event => {
        displayContext = event.context;
    });

    displayAction.onKeyDown(({ action, context, device, event, payload }) => {
        displayTimeout = setTimeout(addDisplay, 1500);
    });

    displayAction.onKeyUp(event => {
        clearTimeout(displayTimeout);
    });

    // muteAction
    muteAction.onWillAppear(event => {
        muteContext = event.context;
    });

    muteAction.onKeyUp(event => {
        toggleMute();
    });
}
setEvents();

function updateTimer(currentTime) {
    let displayTime = `–${(-currentTime).toString().padStart(2, '0')}`;
    if (currentTime >= 0) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if ($SD && timerContext) {
        $SD.setTitle(timerContext, displayTime, 0);
    }
}

function checkForEvents() {
    const timeUnit = getGlobalSetting('timeUnit');

    const recurringEvents = getGlobalSetting('recurringEvents');
    for (const [eventName, eventData] of Object.entries(recurringEvents)) {
        const mult = timeUnit === "minutes" ? 60 : 1;
        const start = eventData.start * mult;
        const end = eventData.end * mult;
        const interval = eventData.interval * mult;

        const shiftedTime = timer.time + parseInt(eventData.alertTime);
        const isStarted = (!start || parseInt(start) < shiftedTime);
        const isTime = (shiftedTime && (shiftedTime % interval) === 0);
        const isEnded = (end && parseInt(end) < shiftedTime);

        if (isStarted && isTime && !isEnded) {
            triggerEvent(eventName, eventData);
        }
    }

    const specialEvents = getGlobalSetting('specialEvents');
    for (const [eventName, eventData] of Object.entries(specialEvents)) {
        let eventTimes = specialEvents[eventName].times;
        eventTimes = timeUnit === "minutes" ? eventTimes.map(t => t * 60) : eventTimes;
        const shiftedTime = timer.time + parseInt(eventData.alertTime);

        if (eventTimes.includes(shiftedTime)) {
            triggerEvent(eventName, specialEvents[eventName]);
        }
    }
}

function triggerEvent(eventName, eventData) {
    // Play the sound
    if (!isMuted) playSound(eventData.alertSound);

    if (eventData.isDisplayed) {
        addDisplay(eventName);
        setTimeout(removeDisplay, (parseInt(eventData.alertTime) + 5) * 1000);
    }
}

function addDisplay(eventName = "") {
    if ($SD && displayContext) {
        displayText = eventName ? (displayText ? displayText + '\n' + eventName : eventName) : "";
        $SD.setTitle(displayContext, displayText, 0);
    }
}

function removeDisplay() {
    if ($SD && displayContext) {
        $SD.setTitle(displayContext, "", 0);
    }
}

// Function to toggle mute/unmute state
function toggleMute() {
    isMuted = !isMuted;
    if ($SD && muteContext) {
        $SD.setState(muteContext, isMuted); // Set the button state
    }
}
