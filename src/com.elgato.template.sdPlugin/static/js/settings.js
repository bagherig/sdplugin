// Settings:
const defaultRecurringEvents = {
    "Jungle Creeps": 1,
    "Power Rune": 2,
    "Bounty Rune": 3,
    "Exp Rune": 7
};

const defaultSpecialEvents = {
    "SpecialEvent1": [30, 90],
};

const defaultSettings = {
    recurringEvents: defaultRecurringEvents,
    specialEvents: defaultSpecialEvents,
    timeUnit: "minutes",
    alertTime: 15,
    alertSound: "default"
}


let globalSettings = {}; // Store settings at the plugin level for easy access

function getSetting(name) {
    return globalSettings[name] || defaultSettings[name];
}