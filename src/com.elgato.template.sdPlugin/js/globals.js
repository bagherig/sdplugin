
// Timer Action
const timerAction = new Action('com.moeenbagheri.dota2plugin.timer');
let timerContext = null;
let timerTimeout = null;

// Increment Action
const incrementAction = new Action('com.moeenbagheri.dota2plugin.increment');
let incrementSteps = {};

// Decrement Action
const decrementAction = new Action('com.moeenbagheri.dota2plugin.decrement');
let decrementSteps = {};

// display Action
const displayAction = new Action('com.moeenbagheri.dota2plugin.display');
let displayContext = null;
let displayText = "";
let displayTimeout = null;

// mute Action
const muteAction = new Action('com.moeenbagheri.dota2plugin.mute');
let muteContext = null;
let isMuted = false; // Variable to track mute state

// image Action
const imageAction = new Action('com.moeenbagheri.dota2plugin.image');
let imageShowings = {};
let imageTimeouts = {};

// Settings
let globalSettings = {};
