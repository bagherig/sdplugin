let localSettings = {};
const displayAction = new Action('com.bagherig.dota2.display');

displayAction.onDidReceiveSettings(function (event) {
    localSettings = event.payload.settings;
    loadSettings();
});

$PI.on('connected', function (event) {
    $PI.getSettings();
    document.getElementById("role").addEventListener("change", saveSettings);
});

function loadSettings() {
    // Populate the input fields with the retrieved settings
    document.getElementById("role").value = getSetting(`role`) || 'event';
}

function saveSettings() {
    // Get values from input fields
    const role = document.getElementById("role").value;
    console.log(role);

    // Save the settings using the Stream Deck SDK
    localSettings[`role`] = role;
    $PI.setSettings(localSettings);
    $PI.getSettings();
}