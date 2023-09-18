
// Timer Action
const timerAction = new Action('com.moeenbagheri.dota2plugin.timer');
let timerContext = null;

let timerStart = null;
let timerOffset = 0;
let timerRunning = false;
let timerInterval = null;
let resetTimeout = null;

// Increment Action
const incrementAction = new Action('com.moeenbagheri.dota2plugin.increment');
let incrementContext = null;

// Decrement Action
const decrementAction = new Action('com.moeenbagheri.dota2plugin.decrement');
let decrementContext = null;

// display Action
const displayAction = new Action('com.moeenbagheri.dota2plugin.display');
let displayContext = null;
let displayText = "";


const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let globalSettings = {};