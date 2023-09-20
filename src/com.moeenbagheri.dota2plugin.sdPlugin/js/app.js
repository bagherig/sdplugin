
const PORT = 8084;
const ws = new WebSocket(`ws://localhost:${PORT}`);

// Timer
const timer = new Clock((time) => {
    updateTimer(time);
    checkForEvents();
});

// Settings
let globalSettings = {};

// Timer Action
const timerAction = new Action('com.moeenbagheri.dota2plugin.timer');
let timerContext = null;
let timerTimeout = null;

// Increment Action
const incrementAction = new Action('com.moeenbagheri.dota2plugin.increment');
let incrementSteps = {};

// Decrement Action
const decrementAction = new Action('com.moeenbagheri.dota2plugin.decrement');
let decrementSteps = {};

// display Action
const displayAction = new Action('com.moeenbagheri.dota2plugin.display');
let displayContext = null;
let displayText = "";
let displayTimeout = null;

// mute Action
const muteAction = new Action('com.moeenbagheri.dota2plugin.mute');
let muteContext = null;
let isMuted = false; // Variable to track mute state

// image Action
const imageAction = new Action('com.moeenbagheri.dota2plugin.image');
let imageShowings = {};
let imageTimeouts = {};


function setEvents() {
    ws.onopen = () => {
        console.log('Connected to the WebSocket server');
    };

    ws.onmessage = (event) => {
        const gameState = JSON.parse(event.data);
        console.log(gameState);
        // TODO: Process the game state data and update the plugin
        // For example:
        // const playerHealth = gameState.player.health;
        // Update the plugin's display with the player's health
    };

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
        incrementSteps[event.context] = 1;
        $SD.getSettings(event.context);
    });

    incrementAction.onDidReceiveSettings(event => {
        const step = event.payload.settings.step || 1;
        $SD.setTitle(event.context, `${step}`, 0);
        incrementSteps[event.context] = parseInt(step);
    });

    incrementAction.onKeyUp(event => {
        timer.increment(parseInt(incrementSteps[event.context]));
    });

    // decrementAction
    decrementAction.onWillAppear(event => {
        decrementSteps[event.context] = 1;
        $SD.getSettings(event.context);
    });

    decrementAction.onDidReceiveSettings(event => {
        const step = event.payload.settings.step || 1;
        $SD.setTitle(event.context, `${step}`, 0);
        decrementSteps[event.context] = parseInt(step);
    });

    decrementAction.onKeyUp(event => {
        timer.decrement(parseInt(decrementSteps[event.context]));
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

    // imageAction
    imageAction.onWillAppear(event => {
        removeDisplayImage(event.context);
    });

    imageAction.onKeyUp(event => {
        removeDisplayImage(event.context);
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
        addDisplayName(eventName);
        setTimeout(removeDisplayName, (parseInt(eventData.alertTime) + Math.max(parseInt(eventData.alertTime), 10)) * 1000);

        if (eventData.image) {
            addDisplayImage(eventData.image, (parseInt(eventData.alertTime) + Math.max(parseInt(eventData.alertTime), 30)) * 1000);
        }
    }
}

function addDisplayName(eventName = "") {
    if ($SD && displayContext) {
        displayText = eventName ? (displayText ? displayText + '\n' + eventName : eventName) : "";
        $SD.setTitle(displayContext, displayText, 0);
    }
}

function removeDisplayName() {
    if ($SD && displayContext) {
        displayText = displayText ? displayText.split('\n').slice(1).join('\n') : "";
        $SD.setTitle(displayContext, displayText, 0);
    }
}

function addDisplayImage(eventImage, duration=0, context=null) {
    if ($SD) {
        if (!context) {
            for ([imageContext, isBusy] of Object.entries(imageShowings)) {
                if (!isBusy) {
                    context = imageContext;
                    break;
                }
            }
        }
        if (context) {
            $SD.setImage(context, eventImage, 0);
            imageShowings[context] = true;
            if (duration > 0)
                imageTimeouts[context] = setTimeout(() => removeDisplayImage(context), duration);
        }
    }
}

function removeDisplayImage(context) {
    if ($SD && context) {
        $SD.setImage(context, `../static/images/blank.png`, 0);
        imageShowings[context] = false;
        clearTimeout(imageTimeouts[context]);
    }
}

// Function to toggle mute/unmute state
function toggleMute() {
    isMuted = !isMuted;
    if ($SD && muteContext) {
        $SD.setState(muteContext, isMuted); // Set the button state
    }
}