const defaultRecurringEvents = {
    "Jungle": {
        interval: 1,
        start: 1,
        end: 35,
        alertSound: 'Ping 3',
        alertTime: 18,
        isDisplayed: false,
    },
    "Power.R": {
        interval: 2,
        start: 1,
        end: 30,
        alertSound: 'Ping Rune',
        alertTime: 10,
        isDisplayed: false,
    },
    "Bounty.R": {
        interval: 3,
        start: 1,
        end: 60,
        alertSound: 'Coin Mario',
        alertTime: 12,
        isDisplayed: true,
    },
    "Exp.R": {
        interval: 7,
        start: 1,
        end: 60,
        alertSound: 'Ping 4',
        alertTime: 30,
        isDisplayed: true,
    }
};

const defaultSpecialEvents = {
    "Shards": {
        times: [15],
        alertSound: 'IO Wisp',
        alertTime: 0,
    },
    "Neutrals": {
        times: [7, 17, 27, 37, 60],
        alertSound: 'Short 2',
        alertTime: 0,
    },
};

const defaultSoundOptions = [
    'Alarm 1',
    'Alarm 2',
    'Alarm 3',

    'Coin Mario',
    'Default',
    'IO Wisp',

    'Ping 1',
    'Ping 2',
    'Ping 3',
    'Ping 4',
    'Ping 5',
    'Ping Rune',

    'Short 1',
    'Short 2',
    'Short 3',
    'Short 4',
    'Short 5',
    'Short 6',

    'Whoosh 1',
    'Whoosh 2',
    'Whoosh 3',
];

const defaultSettings = {
    recurringEvents: defaultRecurringEvents,
    specialEvents: defaultSpecialEvents,
    timeUnit: "minutes",
    alertTime: 15,
    soundOptions: defaultSoundOptions
}

function getGlobalSetting(name) {
    return globalSettings?.[name] || defaultSettings[name];
}

function getSetting(name) {
    return localSettings?.[name];
}
