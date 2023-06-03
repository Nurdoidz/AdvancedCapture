"use strict";
const CONFIG_PATH = 'Path to configuration file';
module.exports = {
    entry: main,
    settings: {
        name: 'AdvancedCapture',
        author: 'Nurdoidz',
        options: {
            [CONFIG_PATH]: {
                type: 'text',
                defaultValue: 'Scripts/QuickAdd/AdvancedCapture/Config.json',
                placeholder: 'path/to/config.json'
            },
            'Debug': {
                type: 'checkbox',
                defaultValue: false
            }
        }
    }
};
let Settings;
let QuickAdd;
function main(quickAdd, settings) {
    QuickAdd = quickAdd;
    Settings = settings;
    info('!Starting');
    info('!Stopping');
}
function info(message, obj) {
    if (message.startsWith('!')) {
        message = message.substring(1);
    }
    else if (!Settings.Debug)
        return;
    if (!obj) {
        console.log(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.reset);
    debugObj(obj);
    console.groupEnd();
}
function error(message, obj) {
    if (!obj) {
        console.error(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.red);
    debugObj(obj);
    console.groupEnd();
}
function warn(message, obj) {
    if (!obj) {
        console.warn(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.orange);
    debugObj(obj);
    console.groupEnd();
}
function debugObj(obj) {
    Object.keys(obj).forEach((key, i) => {
        console.info(debug.object(key), ...debug.objectColors, Object.values(obj)[i]);
    });
}
const colors = {
    reset: 'color: inherit',
    blue: 'color: #27C6F1',
    pink: 'color: #D927F1',
    red: 'color: #F12727',
    orange: 'color: #F18C27'
};
const debug = {
    prefix: '%c[AdvancedCapture]%c ',
    object: (str) => '%c' + str + ':%c ',
    prefixColors: [colors.blue, colors.reset],
    objectColors: [colors.pink, colors.reset],
    singleKey: (obj) => {
        const [key, value] = Object.entries(obj)[0];
        return '%c' + key + ':%c ' + value;
    },
    singleKeyColors: [colors.pink, colors.reset]
};
