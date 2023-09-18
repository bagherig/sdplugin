$PI.on('didReceiveGlobalSettings', function (event) {
    globalSettings = event.payload.settings;
    loadSettings();
});

$PI.on('connected', function (event) {
    $PI.getGlobalSettings();

    document.getElementById("addRecurringEvent").addEventListener("click", () =>
        addRecurringEventRow()
    );
    document.getElementById("addSpecialEvent").addEventListener("click", () =>
        addSpecialEventRow()
    );
    document.getElementById("recurringEventsTable").addEventListener("change", event => {
        if (event.target.value === "addSound") {
            const soundUpload = document.getElementById("soundUpload");
            soundUpload.click();
        }
    });
    document.getElementById("specialEventsTable").addEventListener("change", event => {
        if (event.target.value === "addSound") {
            const soundUpload = document.getElementById("soundUpload");
            soundUpload.click();
        }
    });
    document.getElementById("soundUpload").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            saveSound(file);
        }
    });
});

function addRecurringEventRow(eventName, eventData) {
    const tableBody = document.getElementById("recurringEventsTable").querySelector("tbody");

    const row = tableBody.insertRow();
    const headerCell = row.insertCell(0);
    const intervalCell = row.insertCell(1);
    const alertSoundCell = row.insertCell(2);
    const alertTimeCell = row.insertCell(3);
    const actionsCell = row.insertCell(4);

    headerCell.innerHTML = `<input type="text" value="${eventName ?? "Event Name"}">`;
    intervalCell.innerHTML = `<input type="number" value="${eventData?.interval ?? 5}">`;
    alertSoundCell.innerHTML = `<select>${generateSoundOptions(eventData?.alertSound ?? 'Default')}</select>`;
    alertTimeCell.innerHTML = `<input type="number" value="${eventData?.alertTime ?? 15}">`;
    actionsCell.innerHTML = '<button onclick="removeRecurringEventRow(this)">Remove</button>';
}

function generateSoundOptions(selectedSound) {
    return globalSettings.soundOptions.map(sound =>
        `<option value="${sound}" ${sound === selectedSound ? 'selected' : ''}>${sound}</option>`
    ).join('');
}

function removeRecurringEventRow(buttonElement) {
    const row = buttonElement.closest("tr");
    row.parentNode.removeChild(row);
}

function addSpecialEventRow(eventName, eventData) {
    const tableBody = document.getElementById("specialEventsTable").querySelector("tbody");

    const row = tableBody.insertRow();
    const headerCell = row.insertCell(0);
    const timesCell = row.insertCell(1);
    const alertSoundCell = row.insertCell(2);
    const alertTimeCell = row.insertCell(3);
    const actionsCell = row.insertCell(4);

    headerCell.innerHTML = `<input type="text" value="${eventName ?? "Event Name"}">`;
    timesCell.innerHTML = `<input type="text" value="${eventData?.times ?? "5, 10"}">`;
    alertSoundCell.innerHTML =  `<select id="alertSound">
            <option value="default">Default Sound</option>
            <!-- Additional sound options can be added here -->
        </select> `;
    alertTimeCell.innerHTML = `<input type="number" value="${eventData?.alertTime ?? 15}">`;
    actionsCell.innerHTML = '<button onclick="removeSpecialEventRow(this)">Remove</button>';
}

function removeSpecialEventRow(buttonElement) {
    const row = buttonElement.closest("tr");
    row.parentNode.removeChild(row);
}

function loadSettings() {
    // Populate the input fields with the retrieved settings
    document.getElementById("timeUnit").value = getSetting("timeUnit");

    // Load recurring events
    const recurringEvents = globalSettings.recurringEvents || {};
    Object.entries(recurringEvents).forEach(([eventName, eventData]) => {
        addRecurringEventRow(eventName, eventData);
    });

    // Load special events
    const specialEvents = globalSettings.specialEvents || {};
    Object.entries(specialEvents).forEach(([eventName, eventData]) => {
        addSpecialEventRow(eventName, eventData);
    });
}

function saveSettings() {
    // Get values from input fields
    const timeUnit = document.getElementById("timeUnit").value;

    // Save recurring events
    const recurringEvents = {};
    const recurringRows = document.getElementById("recurringEventsTable").querySelectorAll("tbody tr");
    recurringRows.forEach(row => {
        const eventName = row.cells[0].querySelector("input").value;
        const interval = row.cells[1].querySelector("input").value;
        const alertSound = row.cells[2].querySelector("input").value;
        const alertTime = row.cells[3].querySelector("input").value;

        recurringEvents[eventName] = { interval, alertSound, alertTime };
    });

    // Save special events
    const specialEvents = {};
    const specialRows = document.getElementById("specialEventsTable").querySelectorAll("tbody tr");
    specialRows.forEach(row => {
        const eventName = row.cells[0].querySelector("input").value;
        const times = row.cells[1].querySelector("input").value.split(',').map(x => parseInt(x.trim()));
        const alertSound = row.cells[2].querySelector("input").value;
        const alertTime = row.cells[3].querySelector("input").value;

        specialEvents[eventName] = { times, alertSound, alertTime };
    });

    // Save the settings using the Stream Deck SDK
    $PI.setGlobalSettings({
        recurringEvents: recurringEvents,
        specialEvents: specialEvents,
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




for (const ev of Object.values(Events)) {
    $PI.on(ev, (e) => {
        console.log('$PI', ev, e);
    })
}
