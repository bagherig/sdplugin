const defaultRecurringEvents = {
    "Jungle": {
        'interval': 1,
        'alertSound': 'default'
    },
    "Power.R": {
        'interval': 2,
        'alertSound': 'default'
    },
    "Bounty.R": {
        'interval': 3,
        'alertSound': 'default'
    },
    "Exp.R": {
        'interval': 7,
        'alertSound': 'default'
    }
};

const defaultSpecialEvents = {
    "Shards": {
        'times': [15],
        'alertSound': 'default'
    },
    "Neutrals": {
        'times': [7, 17, 27, 37, 60],
        'alertSound': 'default'
    },
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