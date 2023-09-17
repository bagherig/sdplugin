
for (const ev of Object.values(Events)) {
    $SD.on(ev, (e) => {
        console.log(ev, e);
    })
}

// Events

timerAction.onKeyDown(({ action, context, device, event, payload }) => {
    resetTimeout = setTimeout(resetTimer, 2000);
});

timerAction.onKeyUp(event => {
    clearTimeout(resetTimeout);
    clearInterval(timerInterval);
    timerContext = event.context;  // Store the context

    if (timerRunning)
        pauseTimer();
    else
        resumeTimer();
});

incrementAction.onKeyUp(event => {
    eventDisplayContext = event.context;
    incrementTimer();
});

decrementAction.onKeyUp(event => {
    console.log('aaaaa')
    eventDisplayContext = event.context;
    decrementTimer();
});

eventDisplayAction.onKeyUp(event => {
    console.log('heaerea');
    if (!eventDisplayContext)
        updateEventDisplay('[SET]')

    eventDisplayContext = event.context;
});


$SD.on(Events.didReceiveGlobalSettings, function (event) {
    globalSettings = event.payload.settings;
});

$SD.on(Events.connected, function (event) {
    // Request global settings when the plugin connects
    $SD.getGlobalSettings();
});


function startTimer() {
    timerRunning = true;
    timerInterval = setInterval(() => {
        timerValue++;
        updateDisplay();
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

function resetTimer() {
    timerValue = 0;
    updateDisplay();
}

function incrementTimer() {
    timerValue++;
    updateDisplay();
}

function decrementTimer() {
    if (timerValue > 0) {
        timerValue--;
        updateDisplay();
    }
}

function updateDisplay() {
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
    updateEventDisplay(eventName);
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

console.log(eventDisplayAction)
function updateEventDisplay(eventName) {
    console.log($SD, $SD.websocket, eventDisplayContext)
    if ($SD && $SD.websocket && eventDisplayContext) {
        $SD.websocket.send(JSON.stringify({
            "event": "setTitle",
            "context": eventDisplayContext,
            "payload": {
                "title": eventName,
                "target": 0
            }
        }));
    }
}
