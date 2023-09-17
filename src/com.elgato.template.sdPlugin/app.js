/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const timerAction = new Action('com.moeenbagheri.dota2plugin.main');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();


let timerValue = 0;
let timerRunning = false;
let timerInterval = null;

let timerButton = null;

function startTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerValue++;
        updateMainButtonDisplay();
    }, 1000);
}

function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resumeTimer() {
    startTimer();
}

function incrementTimer() {
    timerValue++;
    updateMainButtonDisplay();
}

function decrementTimer() {
    if (timerValue > 0) {
        timerValue--;
        updateMainButtonDisplay();
    }
}

function updateMainButtonDisplay() {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if ($SD && $SD.websocket && timerButton) {
        $SD.websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": timerButton,  // Use the stored context
            "payload": {
                "title": displayTime,
                "target": 0
            }
        }));
    }
    checkForEvents();
}

function checkForEvents() {
    const settings = $SD.getSettings() || {};
    const recurringEvents = JSON.parse(settings.recurringEvents || "{}");
    const specialEvents = JSON.parse(settings.specialEvents || "{}");
    const alertTime = settings.alertTime || 5;

    for (const eventName in recurringEvents) {
        const interval = settings.timeUnit === "minutes" ? recurringEvents[eventName] * 60 : recurringEvents[eventName];
        if ((timerValue + alertTime) % interval === 0) {
            triggerEvent(eventName);
        }
    }

    for (const eventName in specialEvents) {
        const eventTimes = settings.timeUnit === "minutes" ? specialEvents[eventName].map(t => t * 60) : specialEvents[eventName];
        if (eventTimes.includes(timerValue + alertTime)) {
            triggerEvent(eventName);
        }
    }
}

function triggerEvent(eventName) {
    const soundSelection = $SD.getSettings().soundSelection || "default";
    const soundFilePath = `actions/template/assets/alert.mp3`;
    playSound(soundFilePath);

    const iconFilePath = `actions/template/assets/bounty.jpg`;
    displayIcon(iconFilePath);
    eventQueue.push(eventName);

    if (eventQueue.length === 1) {
        displayNextEvent(iconFilePath);
    }
}

function displayNextEvent() {
    if (eventQueue.length === 0) return;
    const currentEvent = eventQueue[0];
    const iconFilePath = `actions/template/assets/bounty.jpg`;
    displayIcon(iconFilePath);

    setTimeout(() => {
        eventQueue.shift();
        if (eventQueue.length > 0) {
            setTimeout(displayNextEvent, eventSwitchInterval);
        }
    }, eventDisplayDuration);
}

function playSound(soundFilePath) {
    fetch(soundFilePath)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(buffer => {
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start();
        })
        .catch(error => {
            console.error("Error playing sound:", error);
        });
}

function displayIcon(iconFilePath) {
    $SD.setImage(iconFilePath);
}

timerAction.onKeyUp(({ action, context, device, event, payload }) => {
    timerButton = context;  // Store the context
    if (timerRunning) {
        pauseTimer();
    } else {
        resumeTimer();
    }
});

const incrementAction = new Action('com.elgato.increment');
const decrementAction = new Action('com.elgato.decrement');

incrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    incrementTimer();
});

decrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    decrementTimer();
});

for (const ev of Object.values(Events)) {
    $SD.on(ev, (e) => {
        console.log(ev, e);
    })
}
$SD.onConnected(function (event) {
    // Code to execute when an action is added to the Stream Deck
    console.log("Action added to the Stream Deck! onConnected", event);
});