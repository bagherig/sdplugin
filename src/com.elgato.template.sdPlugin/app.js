
for (const ev of Object.values(Events)) {
    $SD.on(ev, (e) => {
        console.log(ev, e);
    })
}

function setEvents() {
    $SD.on(Events.didReceiveGlobalSettings, function (event) {
        globalSettings = event.payload.settings;
    });

    $SD.on(Events.connected, function (event) {
        // Request global settings when the plugin connects
        $SD.getGlobalSettings();
        resetTimer();
    });

    timerAction.onKeyDown(({ action, context, device, event, payload }) => {
        resetTimeout = setTimeout(resetTimer, 1500);
    });

    timerAction.onKeyUp(event => {
        clearTimeout(resetTimeout);
        clearInterval(timerInterval);
        timerContext = event.context;  // Store the context

        if (timerRunning)
            pauseTimer();
        else
            startTimer();
    });

    incrementAction.onKeyUp(event => {
        incrementContext = event.context;
        incrementTimer();
    });

    decrementAction.onKeyUp(event => {
        decrementContext = event.context;
        decrementTimer();
    });

    displayAction.onKeyDown(event => {
        displayContext = event.context;
        addDisplay('[SET]')
        setTimeout(addDisplay, 3000);
    });
}
setEvents();

function getTimerValue() {
    const timerValue = timerStart ? (Date.now() - timerStart) / 1000 : 0;
    return Math.floor(timerValue + timerOffset);
}

function startTimer() {
    timerRunning = true;
    timerOffset = getTimerValue();
    timerStart = Date.now();
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

// Functions
function pauseTimer() {
    timerRunning = false;
    clearInterval(timerInterval);
}

function resetTimer() {
    timerStart = timerOffset = 0;
    pauseTimer();
    updateTimer();
}

function incrementTimer() {
    timerOffset++;
    updateTimer();
}

function decrementTimer() {
    timerOffset--;
    updateTimer();
}

function updateTimer() {
    const timerValue = getTimerValue();
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    const displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if ($SD && $SD.websocket && timerContext) {
        $SD.websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": timerContext,  // Use the stored context
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
    const shiftedTime = getTimerValue() + alertTime;

    const recurringEvents = getSetting('recurringEvents');
    for (const eventName in recurringEvents) {
        let interval = recurringEvents[eventName].interval;
        interval = timeUnit === "minutes" ? interval * 60 : interval;
        if (shiftedTime % interval === 0) {
            triggerEvent(eventName);
        }
    }

    const specialEvents = getSetting('specialEvents');
    for (const eventName in specialEvents) {
        let eventTimes = specialEvents[eventName].times;
        eventTimes = timeUnit === "minutes" ? eventTimes.map(t => t * 60) : eventTimes;
        if (eventTimes.includes(shiftedTime)) {
            triggerEvent(eventName);
        }
    }
}

function triggerEvent(eventName) {
    // Play the sound
    const alertSound = getSetting('alertSound');
    playSound(`static/alerts/${alertSound}.mp3`);
    addDisplay(eventName);
    setTimeout(removeDisplay, (globalSettings.alertTime + 5) * 1000);
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

function addDisplay(eventName="") {
    if ($SD && $SD.websocket && displayContext) {
        displayText = eventName ? (displayText ? displayText + '\n' + eventName : eventName) : "";
        $SD.websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": displayContext,
            "payload": {
                "title": displayText,
                "target": 0
            }
        }));
    }
}

function removeDisplay() {
    if ($SD && $SD.websocket && displayContext) {
        displayText = displayText.split('\n').slice(1).join('\n');
        $SD.websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": displayContext,
            "payload": {
                "title": displayText,
                "target": 0
            }
        }));
        setTimeout(removeDisplay, (globalSettings.alertTime + 5) * 1000);
    }
}
