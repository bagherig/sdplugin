
// Timer Action
const timerAction = new Action('com.moeenbagheri.dota2plugin.timer');
let timerContext = null;
let timerTimeout = null;

// Increment Action
const incrementAction = new Action('com.moeenbagheri.dota2plugin.increment');
let incrementContext = null;
let incSteps = {};

// Decrement Action
const decrementAction = new Action('com.moeenbagheri.dota2plugin.decrement');
let decrementContext = null;
let decSteps = {};

// display Action
const displayAction = new Action('com.moeenbagheri.dota2plugin.display');
let displayContext = null;
let displayText = "";
let displayTimeout = null;

// mute Action
const muteAction = new Action('com.moeenbagheri.dota2plugin.mute');
let muteContext = null;
let isMuted = false; // Variable to track mute state

// Settings
let globalSettings = {};
let localSettings = {};