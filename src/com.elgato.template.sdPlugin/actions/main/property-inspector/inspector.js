
for (const ev of Object.values(Events)) {
    $PI.on(ev, (e) => {
        console.log(ev, e);
    })
}

// Constants and Default Settings
const defaultRecurringEvents = {
    "Event1": 2,
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
    soundSelection: "default"
};



// Utility functions
function loadSettings(settings) {
    if (!settings) {
        $PI.setSettings(defaultSettings);
        settings = defaultSettings;
    }

    // Populate the input fields with the retrieved settings
    document.getElementById("recurringEvents").value = settings.recurringEvents;
    document.getElementById("specialEvents").value = settings.specialEvents;
    document.getElementById("timeUnit").value = settings.timeUnit;
    document.getElementById("alertTime").value = settings.alertTime;
    document.getElementById("soundSelection").value = settings.soundSelection;
}

function saveSettings() {
    // Get values from input fields
    const recurringEvents = document.getElementById("recurringEvents").value;
    const specialEvents = document.getElementById("specialEvents").value;
    const timeUnit = document.getElementById("timeUnit").value;
    const alertTime = document.getElementById("alertTime").value;
    const soundSelection = document.getElementById("soundSelection").value;

    // Save the settings using the Stream Deck SDK
    $PI.setSettings({
        recurringEvents: recurringEvents,
        specialEvents: specialEvents,
        timeUnit: timeUnit,
        alertTime: alertTime,
        soundSelection: soundSelection
    });
}
