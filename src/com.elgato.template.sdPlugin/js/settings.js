const defaultRecurringEvents = {
    "Jungle": {
        'interval': 1,
        'alertSound': 'Ping 3',
        'alertTime': 20,
    },
    "Power.R": {
        'interval': 2,
        'alertSound': 'Ping Rune',
        'alertTime': 10,
    },
    "Bounty.R": {
        'interval': 3,
        'alertSound': 'Coin Mario',
        'alertTime': 12,
    },
    "Exp.R": {
        'interval': 7,
        'alertSound': 'Ping 4',
        'alertTime': 30,
    }
};

const defaultSpecialEvents = {
    "Shards": {
        'times': [15],
        'alertSound': 'IO Wisp',
        'alertTime': 0,
    },
    "Neutrals": {
        'times': [7, 17, 27, 37, 60],
        'alertSound': 'Short 2',
        'alertTime': 0,
    },
};

const defaultSoundOptions = [
    'Default',
    'Ping 1',
    'Ping 2',
    'Ping 3',
    'Ping 4',
    'Ping 5',
    'Short 1',
    'Short 2',
    'Short 3',
    'IO Wisp',
    'Ping Rune',
    'Coin Mario'
];

const defaultSettings = {
    recurringEvents: defaultRecurringEvents,
    specialEvents: defaultSpecialEvents,
    timeUnit: "minutes",
    alertTime: 15,
    soundOptions: defaultSoundOptions
}

function getSetting(name) {
    return globalSettings?.[name] || defaultSettings[name];
}