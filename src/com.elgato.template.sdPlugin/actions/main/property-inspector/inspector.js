//
// for (const ev of Object.values(Events)) {
//     $PI.on(ev, (e) => {
//         console.log(ev, e);
//     })
// }

import {defaultSettings} from "../../../app";

$PI.on('connected', function (event) {
    console.log('hereeeee')
    $PI.getGlobalSettings();
});

$PI.on('didReceiveGlobalSettings', function (event) {
    // Check if the settings are empty
    loadSettings(event.payload.settings);
});


function loadSettings(settings) {
    // Populate the input fields with the retrieved settings
    document.getElementById("recurringEvents").value = JSON.stringify(settings.recurringEvents);
    document.getElementById("specialEvents").value = JSON.stringify(settings.specialEvents);
    document.getElementById("timeUnit").value = settings.timeUnit;
    document.getElementById("alertTime").value = settings.alertTime;
    document.getElementById("alertSound").value = settings.alertSound;
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
        alertTime: alertTime,
        alertSound: alertSound
    });
}

function resetToDefaultSettings() {
    $PI.setGlobalSettings(defaultSettings);
}

