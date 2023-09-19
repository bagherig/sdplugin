
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
        const step = event.payload.settings.step;
        $SD.setTitle(event.context, `–${step}`, 0);
        incSteps[event.context] = parseInt(step);
    });

    incrementAction.onKeyUp(event => {
        timer.increment(incSteps[event.context]);
    });

    // decrementAction
    decrementAction.onWillAppear(event => {
        decrementContext = event.context;
        $SD.getSettings(decrementContext);
    });

    decrementAction.onDidReceiveSettings(event => {
        const step = event.payload.settings.step;
        $SD.setTitle(event.context, `–${step}`, 0);
        decSteps[event.context] = parseInt(step);
    });

    decrementAction.onKeyUp(event => {
        timer.decrement(decSteps[event.context]);
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
}
setEvents();

function updateTimer(currentTime) {
    let displayTime = `–${(-currentTime).toString().padStart(2, '0')}`;
    if (currentTime >= 0) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    if ($SD && $SD.websocket && timerContext) {
        $SD.setTitle(timerContext, displayTime, 0);
    }
}

function checkForEvents() {
    const timeUnit = getGlobalSetting('timeUnit');
    const alertTime = getGlobalSetting('alertTime');

    const recurringEvents = getGlobalSetting('recurringEvents');
    for (const [eventName, eventData] of Object.entries(recurringEvents)) {
        let interval = eventData.interval;
        interval = timeUnit === "minutes" ? interval * 60 : interval;
        const shiftedTime = timer.time + eventData.alertTime;
        if (shiftedTime && shiftedTime % interval === 0) {
            triggerEvent(eventName, eventData);
        }
    }

    const specialEvents = getGlobalSetting('specialEvents');
    for (const [eventName, eventData] of Object.entries(specialEvents)) {
        let eventTimes = specialEvents[eventName].times;
        eventTimes = timeUnit === "minutes" ? eventTimes.map(t => t * 60) : eventTimes;
        const shiftedTime = timer.time + eventData.alertTime;
        if (eventTimes.includes(shiftedTime)) {
            triggerEvent(eventName, specialEvents[eventName]);
        }
    }
}

function triggerEvent(eventName, eventData) {
    // Play the sound
    playSound(eventData.alertSound);
    addDisplay(eventName);
    setTimeout(removeDisplay, (eventData.alertTime + 5) * 1000);
}

function addDisplay(eventName = "") {
    if ($SD && $SD.websocket && displayContext) {
        displayText = eventName ? (displayText ? displayText + '\n' + eventName : eventName) : "";
        $SD.setTitle(displayContext, displayText, 0);
    }
}

function removeDisplay() {
    if ($SD && $SD.websocket && displayContext) {
        displayText = displayText.split('\n').slice(1).join('\n');
        $SD.setTitle(displayContext, displayText, 0);
        setTimeout(removeDisplay, (globalSettings.alertTime + 5) * 1000);
    }
}
