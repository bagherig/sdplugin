let localSettings = {};
const decrementAction = new Action('com.bagherig.dota2.decrement');

decrementAction.onDidReceiveSettings(function (event) {
    localSettings = event.payload.settings;
    loadSettings();
});

$PI.on('connected', function (event) {
    $PI.getSettings();
    document.getElementById("step").addEventListener("change", saveSettings);
});

function loadSettings() {
    // Populate the input fields with the retrieved settings
    document.getElementById("step").value = getSetting(`step`) || 1;
}

function saveSettings() {
    // Get values from input fields
    const step = document.getElementById("step").value;

    // Save the settings using the Stream Deck SDK
    localSettings[`step`] = step;
    $PI.setSettings(localSettings);
    $PI.getSettings();
}