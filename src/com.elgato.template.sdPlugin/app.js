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

// Settings:
let globalSettings = {}; // Store settings at the plugin level for easy access
const defaultRecurringEvents = {
    "Event1": 3,
    "Event2": 120
};

const defaultSpecialEvents = {
    "SpecialEvent1": [30, 90],
};

const defaultSettings = {
    recurringEvents: defaultRecurringEvents,
    specialEvents: defaultSpecialEvents,
    timeUnit: "seconds",
    alertTime: 5,
    alertSound: `actions/template/assets/alert.mp3`
}


$SD.on('didReceiveGlobalSettings', function (event) {
    // Check if the settings are empty
    if (!event.payload.settings || Object.keys(event.payload.settings).length === 0) {
        // If they are, set them to the default values
        $SD.setGlobalSettings(defaultSettings);
    } else {
        // Otherwise, update the globalSettings variable with the received settings
        globalSettings = event.payload.settings;
    }
});

$SD.on('connected', function (event) {
    // Request global settings when the plugin connects
    $SD.getGlobalSettings();
});


// Functions
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
    for (const eventName in globalSettings.recurringEvents) {
        const interval = globalSettings.timeUnit === "minutes" ?
            globalSettings.recurringEvents[eventName] * 60 : globalSettings.recurringEvents[eventName];
        if ((timerValue + globalSettings.alertTime) % interval === 0) {
            triggerEvent(eventName);
            console.log(eventName);
        }
    }

    for (const eventName in globalSettings.specialEvents) {
        const eventTimes = globalSettings.timeUnit === "minutes" ?
            globalSettings.specialEvents[eventName].map(t => t * 60) : globalSettings.specialEvents[eventName];
        if (eventTimes.includes(timerValue + globalSettings.alertTime)) {
            triggerEvent(eventName);
        }
    }
}

function triggerEvent(eventName) {
    console.log(globalSettings.alertSound)

    // Play the sound
    playSound(globalSettings.alertSound);
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