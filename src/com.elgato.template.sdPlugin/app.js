/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const timerAction = new Action('com.moeenbagheri.dota2plugin.main');
const incrementAction = new Action('com.elgato.increment');
const decrementAction = new Action('com.elgato.decrement');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();


let timerValue = 0;
let timerRunning = false;
let timerInterval = null;

let timerButton = null;


$SD.on('didReceiveGlobalSettings', function (event) {
    globalSettings = event.payload.settings;
});

$SD.on('connected', function (event) {
    // Request global settings when the plugin connects
    $SD.getGlobalSettings();
});


function startTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerValue++;
        updateMainButtonDisplay();
    }, 1000);
}

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
    const timeUnit = getSetting('timeUnit');
    const alertTime = getSetting('alertTime');
    const currTime = timerValue + alertTime;

    const recurringEvents = getSetting('recurringEvents');
    for (const eventName in recurringEvents) {
        const interval = timeUnit === "minutes" ?
            recurringEvents[eventName] * 60 : recurringEvents[eventName];
        if (currTime % interval === 0) {
            triggerEvent(eventName);
        }
    }

    const specialEvents = getSetting('specialEvents');
    for (const eventName in specialEvents) {
        const eventTimes = timeUnit === "minutes" ?
            specialEvents[eventName].map(t => t * 60) : specialEvents[eventName];
        if (eventTimes.includes(currTime)) {
            triggerEvent(eventName);
        }
    }
}

function triggerEvent(eventName) {
    // Play the sound
    const alertSound = getSetting('alertSound');
    playSound(`static/alerts/${alertSound}.mp3`);
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

incrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    incrementTimer();
});

decrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    decrementTimer();
});


// for (const ev of Object.values(Events)) {
//     $SD.on(ev, (e) => {
//         console.log(ev, e);
//     })
// }