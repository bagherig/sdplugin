
// Timer Action
const timerAction = new Action('com.moeenbagheri.dota2plugin.timer');
let timerContext = null;

let timerValue = 0;
let timerRunning = false;
let timerInterval = null;
let resetTimeout = null;

// Increment Action
const incrementAction = new Action('com.moeenbagheri.dota2plugin.increment');
let incrementContext = null;

// Decrement Action
const decrementAction = new Action('com.moeenbagheri.dota2plugin.decrement');
let decrementContext = null;

// EventDisplay Action
const eventDisplayAction = new Action('com.moeenbagheri.dota2plugin.eventDisplay');
let eventDisplayContext = null;


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let globalSettings = {};
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

function getSetting(name) {
    return globalSettings?.[name] || defaultSettings[name];
}