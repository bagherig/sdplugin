/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const timerAction = new Action('com.elgato.main.action');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const defaultRecurringEvents = {
    "Event1": 60,  // Example: Event1 occurs every 60 seconds/minutes based on the user's choice
    "Event2": 120
};

const defaultSpecialEvents = {
    "SpecialEvent1": [30, 90],  // Example: SpecialEvent1 occurs at 30 and 90 seconds/minutes based on the user's choice
};

let timerValue = 0;
let timerRunning = false;
let timerInterval = null;

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
    // Update the main button's display with the timer value in "MM:SS" format
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // TODO: Update the main button's display with displayTime

    // Check for events
    checkForEvents();
}

function checkForEvents() {
    const settings = $SD.getSettings();

    // Convert dictionaries from string to object
    const recurringEvents = JSON.parse(settings.recurringEvents || "{}");
    const specialEvents = JSON.parse(settings.specialEvents || "{}");

    const alertTime = settings.alertTime || 5;

    // Check recurring events
    for (const eventName in recurringEvents) {
        const interval = settings.timeUnit === "minutes" ? recurringEvents[eventName] * 60 : recurringEvents[eventName];
        if ((timerValue + alertTime) % interval === 0) {
            triggerEvent(eventName);
        }
    }

    // Check special events
    for (const eventName in specialEvents) {
        const eventTimes = settings.timeUnit === "minutes" ? specialEvents[eventName].map(t => t * 60) : specialEvents[eventName];
        if (eventTimes.includes(timerValue + alertTime)) {
            triggerEvent(eventName);
        }
    }
}

function triggerEvent(eventName) {
    // Play the sound
    const soundSelection = $SD.getSettings().soundSelection || "default";
    const soundFilePath = `actions/template/assets/alert.mp3`; // Replace with the actual path to the sound files
    playSound(soundFilePath);

    // Display the icon
    const iconFilePath = `actions/template/assets/bounty.jpg`; // Replace with the actual path to the icon files
    displayIcon(iconFilePath);

	// Add the event to the queue
    eventQueue.push(eventName);

    // If this is the only event in the queue, start displaying it
    if (eventQueue.length === 1) {
        displayNextEvent(iconFilePath);
    }
}

function displayNextEvent() {
    if (eventQueue.length === 0) return;

    const currentEvent = eventQueue[0];

    // Display the icon for the current event
    const iconFilePath = `actions/template/assets/bounty.jpg`; // Replace with the actual path to the icon files
    displayIcon(iconFilePath);

    // Set a timeout to remove the current event from the queue and display the next one
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
    // TODO: Use the Stream Deck SDK's setImage method to display the icon on the main button
    $SD.setImage(iconFilePath);
}


$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
    console.log('Stream Deck connected!');
});

// On app startup
document.addEventListener("DOMContentLoaded", function() {
    const settings = $SD.getSettings() || {};

    // Check if recurringEvents and specialEvents are set, if not, set them to default values
    if (!settings.recurringEvents) {
        $SD.setSettings({ recurringEvents: JSON.stringify(defaultRecurringEvents) });
    }

    if (!settings.specialEvents) {
        $SD.setSettings({ specialEvents: JSON.stringify(defaultSpecialEvents) });
    }
});

timerAction.onKeyUp(({ action, context, device, event, payload }) => {
    if (timerRunning) {
        pauseTimer();
    } else {
        resumeTimer();
    }
});

// timerAction.onDialRotate(({ action, context, device, event, payload }) => {
//     console.log('Your dial code goes here!');
// });

const incrementAction = new Action('com.elgato.increment');
const decrementAction = new Action('com.elgato.decrement');

incrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    incrementTimer();
});

decrementAction.onKeyUp(({ action, context, device, event, payload }) => {
    decrementTimer();
});