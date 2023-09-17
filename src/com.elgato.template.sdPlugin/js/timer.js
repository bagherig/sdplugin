
for (const ev of Object.values(Events)) {
    $PI.on(ev, (e) => {
        console.log('$PI', ev, e);
    })
}



$PI.on('didReceiveGlobalSettings', function (event) {
    globalSettings = event.payload.settings;
    loadSettings();
});

$PI.on('connected', function (event) {
    $PI.getGlobalSettings();
});


function loadSettings() {
    // Populate the input fields with the retrieved settings
    document.getElementById("recurringEvents").value = JSON.stringify(getSetting("recurringEvents"));
    document.getElementById("specialEvents").value = JSON.stringify(getSetting("specialEvents"));
    document.getElementById("timeUnit").value = getSetting("timeUnit");
    document.getElementById("alertTime").value = getSetting("alertTime");
    document.getElementById("alertSound").value = getSetting("alertSound");
}

function saveSettings() {
    // Get values from input fields
    const recurringEvents = document.getElementById("recurringEvents").value;
    const specialEvents = document.getElementById("specialEvents").value;
    const timeUnit = document.getElementById("timeUnit").value;
    const alertTime = document.getElementById("alertTime").value;
    const alertSound = document.getElementById("alertSound").value;

    // Save the settings using the Stream Deck SDK
    $PI.setGlobalSettings({
        recurringEvents: JSON.parse(recurringEvents),
        specialEvents: JSON.parse(specialEvents),
        timeUnit: timeUnit,
        alertTime: parseInt(alertTime),
        alertSound: alertSound
    });
    $PI.getGlobalSettings();
}

function resetToDefaultSettings() {
    $PI.setGlobalSettings(defaultSettings);
    $PI.getGlobalSettings();
}


