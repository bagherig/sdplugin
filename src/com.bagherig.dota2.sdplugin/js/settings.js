const defaultRecurringEvents = {
    "Bounty": {
        "alertSound": "Coin Mario",
        "alertTime": 5,
        "end": "16",
        "interval": "3",
        "isDisplayed": true,
        "start": "1",
        "image": "static/images/bounty.jpg"
    },
    "Wisdom": {
        "alertSound": "Alarm 3",
        "alertTime": 30,
        "end": "60",
        "interval": "7",
        "isDisplayed": true,
        "start": "1",
        "image": "static/images/tome.webp"
    },
    "Wisdom 2": {
        "alertSound": "Alarm 3",
        "alertTime": 15,
        "end": "60",
        "interval": "7",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 40": {
        "alertSound": "Ping 3",
        "alertTime": 20,
        "end": "35",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 44": {
        "alertSound": "Ping 3",
        "alertTime": 16,
        "end": "10",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 48": {
        "alertSound": "Ping 3",
        "alertTime": 12,
        "end": "35",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 50": {
        "alertSound": "Ping 3",
        "alertTime": 10,
        "end": "10",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 51": {
        "alertSound": "Ping 3",
        "alertTime": 9,
        "end": "10",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 52": {
        "alertSound": "Ping 3",
        "alertTime": 8,
        "end": "10",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Jungle 53": {
        "alertSound": "Ping 4",
        "alertTime": 7,
        "end": "10",
        "interval": "1",
        "isDisplayed": false,
        "start": "1"
    },
    "Power": {
        "alertSound": "Short 5",
        "alertTime": 5,
        "end": "30",
        "interval": "2",
        "isDisplayed": false,
        "start": "1",
        "image": "static/images/arcane.jpg"
    }
};

const defaultSpecialEvents = {
    "Neutrals": {
        "alertSound": "Alarm 1",
        "alertTime": 0,
        "isDisplayed": true,
        "image": "static/images/neutrals.jpg",
        "times": [
            7,
            17,
            27,
            37,
            60
        ]
    },
    "Shards": {
        "alertSound": "Alarm 3",
        "alertTime": 0,
        "isDisplayed": true,
        "image": "static/images/shards.webp",
        "times": [
            15
        ]
    }
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
    'Ping 6',
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
    soundOptions: defaultSoundOptions
}

function getGlobalSetting(name) {
    return globalSettings?.[name] || defaultSettings[name];
}

function getSetting(name) {
    return localSettings?.[name];
}
