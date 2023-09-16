document.addEventListener("DOMContentLoaded", function() {
    // Load current settings
    loadSettings();

    // Add event listener for the save button
    document.getElementById("saveSettings").addEventListener("click", saveSettings);
});

function loadSettings() {
    // Retrieve settings using the Stream Deck SDK
    const settings = $PI.getSettings();

    // Populate the input fields with the retrieved settings
    document.getElementById("recurringEvents").value = settings.recurringEvents || "";
    document.getElementById("specialEvents").value = settings.specialEvents || "";
    document.getElementById("timeUnit").value = settings.timeUnit || "seconds";
    document.getElementById("alertTime").value = settings.alertTime || 5;
    document.getElementById("soundSelection").value = settings.soundSelection || "default";
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

