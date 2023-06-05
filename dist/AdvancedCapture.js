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
let Variables;
let Obsidian;
async function main(quickAdd, settings) {
    Settings = settings;
    QuickAdd = quickAdd.quickAddApi;
    Variables = quickAdd.variables;
    Obsidian = quickAdd.app;
    info('!Starting');
    if (!await readConfig()) {
        error('Failed to read config file');
        return;
    }
    if (!('config' in Variables)) {
        info('!Stopping');
        return;
    }
    info('Read config OK');
    info('!Stopping');
}
async function readConfig() {
    info('!Reading config', { Path: Settings[CONFIG_PATH] });
    const path = new Path(Settings[CONFIG_PATH]);
    if (!path.isFile('json')) {
        error('Invalid config path', { Path: path });
        return false;
    }
    let file = Obsidian.vault.getAbstractFileByPath(path);
    if (!file) {
        warn('No config found', { Path: path });
        info('!Creating config', { Path: path });
        await ensureFolderExists(path);
        file = await Obsidian.vault.create(path, '');
        if (!file) {
            error('Failed to create config', { Path: path });
            return false;
        }
    }
    const content = await Obsidian.vault.read(file);
    const config = tryParseJSONObject(content);
    if (!config)
        if (!content.trim()) {
            if (await QuickAdd.yesNoPrompt(`No config found. Want to create a sample at '${path}'?`)) {
                Obsidian.vault.modify(file, JSON.stringify(getSampleConfig(), null, 2));
                info('!Created config', { Path: path });
            }
        }
        else {
            error('Could not parse config', { Path: path });
            return false;
        }
    if (config)
        Variables.config = config;
    return true;
}
function replaceVar(str) {
    let result = str;
    const reMatchVar = RegExp(/var\(--(\w+?)\)/);
    if (reMatchVar.test(result)) {
        let match = result.match(reMatchVar)[0];
        match = match.replace(reMatchVar, '$1');
        if (match in Variables)
            result = result.replace(reMatchVar, Variables[match]);
        else {
            warn('Variable not found', { Variable: match, Variables: Variables });
            result = result.replace(reMatchVar, '');
        }
    }
    if (reMatchVar.test(result))
        result = replaceVar(result);
    return result;
}
async function ensureFolderExists(path) {
    if (!path.hasFolder())
        return;
    if (!Obsidian.vault.getAbstractFileByPath(path.getFolder))
        await Obsidian.vault.createFolder(path.getFolder);
}
function tryParseJSONObject(jsonString) {
    try {
        const obj = JSON.parse(jsonString);
        if (obj && typeof obj === 'object')
            return obj;
    }
    catch (e) {
        return undefined;
    }
    return undefined;
}
function getSampleConfig() {
    return {
        'categories': {
            'Exercise': {
                'icon': '🏊‍♂️',
                'fields': [
                    {
                        'name': 'Activity',
                        'prompt': 'suggester',
                        'listPath': 'Journal/Exercise Activities.md',
                        'format': 'italics',
                        'hasIcons': true,
                        'write': true
                    },
                    {
                        'name': 'Rating',
                        'prompt': 'inputPrompt',
                        'format': 'bold',
                        'dataView': 'rating',
                        'suffix': '/10',
                        'write': true
                    }
                ]
            }
        }
    };
}
class Path {
    constructor(path) {
        this.reMatchFile = RegExp(/([^/]+)\.(\w+)$/);
        path = replaceVar(path);
        path = this.trimPath(path);
        this.folder = this.extractFolder(path);
        this.basename = this.extractBasename(path);
        this.extension = this.extractExtension(path);
        this.isRootFolder = !this.folder && !this.basename && !this.extension;
    }
    trimPath(path) {
        return path.trim()
            .replace(/[\n\r]/g, '')
            .replace(/\/{2,}/g, '/')
            .replace(/^\//, '')
            .replace(/^\/(.+)/g, '$1');
    }
    extractFolder(path) {
        if (path === '')
            return '';
        if (path.includes('/')) {
            if (path.endsWith('/'))
                return path.substring(0, path.length - 1);
            if (this.reMatchFile.test(path))
                return path.split('/').slice(0, -1).join('/');
            return path;
        }
        if (!this.reMatchFile.test(path))
            return path;
        return '';
    }
    extractBasename(path) {
        if (path === '')
            return '';
        if (this.reMatchFile.test(path))
            return path.match(this.reMatchFile)[1];
        return '';
    }
    extractExtension(path) {
        if (path === '')
            return '';
        if (this.reMatchFile.test(path))
            return path.match(this.reMatchFile)[2];
        return '';
    }
    isFile(ext) {
        return this.extension === ext;
    }
    isFolder() {
        if (this.isRootFolder)
            return true;
        return this.folder !== '' && this.basename === '';
    }
    getFolder() {
        return this.folder;
    }
    getFile() {
        return `${this.basename}.${this.extension}`;
    }
    getBasename() {
        return this.basename;
    }
    getExtension() {
        return this.extension;
    }
    hasFolder() {
        return this.folder !== '';
    }
    toString() {
        if (this.isRootFolder)
            return '';
        if (this.folder)
            return `${this.folder}/${this.basename}.${this.extension}`;
        return `${this.basename}.${this.extension}`;
    }
}
function info(message, obj) {
    if (message.startsWith('!'))
        message = message.substring(1);
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
    object: (str) => `%c${str}:%c `,
    prefixColors: [colors.blue, colors.reset],
    objectColors: [colors.pink, colors.reset],
    singleKey: (obj) => {
        const [key, value] = Object.entries(obj)[0];
        return `%c${key}:%c ${value}`;
    },
    singleKeyColors: [colors.pink, colors.reset]
};
