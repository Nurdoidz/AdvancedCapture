const CSV_PATH = 'Path to CSV file';
module.exports = {
    entry: csv,
    settings: {
        name: 'AdvancedCaptureCSV',
        author: 'Nurdoidz',
        options: {
            [CSV_PATH]: {
                type: 'text',
                defaultValue: 'Scripts/QuickAdd/AdvancedCapture/Export.csv',
                placeholder: 'path/to/export.csv'
            }
        }
    }
};
async function csv(quickAdd, settings) {
    info('Starting CSV export');
    const Obsidian = quickAdd.app;
    const variables = quickAdd.variables;
    if (!('csvKeyExport' in variables) || !('csvValueExport' in variables)) {
        throw new Error('Missing csvExport in global variables');
    }
    const path = new Path(replaceInString(variables, settings[CSV_PATH]));
    if (!path.isFile())
        throw new Error('Path is not a file');
    let file = Obsidian.vault.getAbstractFileByPath(path);
    if (!file) {
        warn('CSV file not found; trying to create', { Path: path });
        await ensureFolderExists(path, Obsidian.vault);
        file = await Obsidian.vault.create(path.toString(), `${variables.csvKeyExport}\n${variables.csvValueExport}\n`);
        info('CSV file successfully created with export', { Path: path, Header: variables.csvKeyExport, Row: variables.csvValueExport });
    }
    else {
        let contents = await Obsidian.vault.read(file);
        if (!contents.endsWith('\n'))
            contents += '\n';
        contents += `${variables.csvValueExport}\n`;
        Obsidian.vault.modify(file, contents);
        info('CSV file successfully updated with export', { Path: path, Row: variables.csvValueExport });
    }
    info('Stopping CSV export');
}

async function ensureFolderExists(path, vault) {
    info('Inside ensureFolderExists');
    if (!path.hasFolder())
        return;
    if (!vault.getAbstractFileByPath(path.getFolder())) {
        await vault.createFolder(path.getFolder());
    }
}function parseJsonToConfig(jsonString) {
    const obj = JSON.parse(jsonString);
    if (obj && typeof obj === 'object')
        return obj;
    throw new SyntaxError('JSON is not valid config format');
}function replaceInString(vars, str) {
    if (typeof str === 'undefined')
        return '';
    let result = str;
    const reMatchVar = RegExp(/var\(--(\w+?)\)/);
    if (reMatchVar.test(result)) {
        const match = result.match(reMatchVar)[0]
            .replace(reMatchVar, '$1');
        if (match in vars)
            result = result.replace(reMatchVar, vars[match]);
        else {
            warn(`Variable '${match}' not found`, { Variables: vars });
            result = result.replace(reMatchVar, '');
        }
        if (reMatchVar.test(result))
            result = replaceInString(vars, result);
    }
    return result;
}function replaceRecursively(variables, obj) {
    return applyRecursive(obj, (o) => {
        o = replaceInString(variables, o);
        return booleanizeString(o);
    });
}function shouldQuote(value) {
    const matchNonString = RegExp(/^(\d*([.]\d+)?)$|^true$|^false$/gm);
    return !matchNonString.test(value);
}class DefaultConfig {
    constructor(config) {
        this.variables = {};
        this.dateExport = DateTimeExportConfig.newDate();
        this.timeExport = DateTimeExportConfig.newTime();
        if (config)
            Object.assign(this, config);
    }
}class SampleConfig extends DefaultConfig {
    constructor() {
        super(...arguments);
        this.categories = {
            Exercise: {
                icon: '⚾',
                enableComment: true,
                commentExport: {
                    csv: {
                        include: true,
                        keyPrefix: '',
                        keySuffix: '',
                        valuePrefix: '',
                        valueSuffix: ''
                    },
                    print: {
                        include: true,
                        prefix: '',
                        suffix: '',
                        separator: ' - ',
                        internalLink: false,
                        externalLink: '',
                        style: {
                            bold: false,
                            italics: false,
                            strikethrough: false,
                            highlight: false,
                            code: false
                        }
                    }
                },
                fields: [
                    {
                        name: 'Activity',
                        prompt: 'suggester',
                        listPath: 'Lists/Activities.md',
                        required: true,
                        hasIcons: true,
                        export: {
                            csv: {
                                include: true,
                                keyPrefix: '',
                                keySuffix: '',
                                valuePrefix: '',
                                valueSuffix: ''
                            },
                            print: {
                                include: true,
                                prefix: '',
                                suffix: '',
                                separator: ' - ',
                                internalLink: true,
                                externalLink: '',
                                style: {
                                    bold: false,
                                    italics: true,
                                    strikethrough: false,
                                    highlight: false,
                                    code: false
                                }
                            }
                        }
                    },
                    {
                        name: 'Rating',
                        prompt: 'inputPrompt',
                        listPath: '',
                        required: false,
                        hasIcons: false,
                        export: new DefaultExportConfig()
                    }
                ]
            }
        };
    }
}class Categor {
    constructor() {
        this.icon = '';
        this.iconExport = new DefaultExportConfig();
        this.enableComment = false;
        this.commentExport = new DefaultExportConfig();
        this.todo = false;
    }
}class Fields {
    constructor() {
        this.name = '';
        this.listPath = '';
        this.required = false;
        this.hasIcons = false;
        this.export = new DefaultExportConfig();
    }
}class Input {
    constructor() {
        this.fields = [];
    }
    add(input, config, key) {
        if (!config)
            config = new DefaultExportConfig();
        if (input)
            this.fields.push(new Field(input, config, key));
    }
    addField(field) {
        if (field)
            this.fields.push(field);
    }
    getMarkdownExport() {
        return this.fields.reduce((acc, field) => {
            if (field.shouldIncludePrint()) {
                if (acc === '')
                    return field.getPrintString();
                if (!field.hasInput())
                    return acc;
                return acc + field.getSeparator() + field.getPrintString();
            }
            return acc;
        }, '');
    }
    getCsvKeyExport() {
        return this.fields.map(field => {
            if (field.shouldIncludeCsv())
                return field.getFieldKey().replace(/,/, '');
            return null;
        }).filter(key => key).join(',');
    }
    getCsvValueExport() {
        return this.fields.map(field => {
            if (field.shouldIncludeCsv())
                return field.getFieldValue();
            return null;
        }).filter(key => key).join(',');
    }
}class Field {
    constructor(input, config, key) {
        this.input = '';
        this.key = '';
        this.config = new DefaultExportConfig();
        this.input = input;
        this.key = key;
        if (config)
            Object.assign(this.config, config);
    }
    getSeparator() {
        return this.config.print?.separator ?? ' - ';
    }
    getPrintString() {
        let result = this.input;
        result = `${this.config.print?.prefix ?? ''}${result}${this.config.print?.suffix ?? ''}`;
        if (this.config.print?.internalLink)
            result = `[[${result}]]`;
        else if (this.config.print?.externalLink) {
            result = `[${result}](${this.config.print.externalLink})`;
        }
        return Style.applyStyle(result, new Style(this.config.print?.style));
    }
    getFieldKey() {
        return `${this.config.csv?.keyPrefix ?? ''}${this.key}${this.config.csv?.keySuffix ?? ''}`;
    }
    getFieldValue() {
        const result = `${this.config.csv?.valuePrefix
            ?? ''}${this.input}${this.config.csv?.valueSuffix ?? ''}`;
        if (shouldQuote(this.input))
            return `"${result}"`;
        return result;
    }
    shouldIncludePrint() {
        return (this.config.print?.include ?? false) === true;
    }
    shouldIncludeCsv() {
        return (this.config.csv?.include ?? false) === true;
    }
    hasInput() {
        return this.input.length > 0;
    }
}class DefaultExportConfig {
    constructor(csv, print) {
        this.csv = {
            include: false,
            keyPrefix: '',
            keySuffix: '',
            valuePrefix: '',
            valueSuffix: ''
        };
        this.print = {
            include: false,
            prefix: '',
            suffix: '',
            separator: ' - ',
            internalLink: false,
            externalLink: '',
            style: new Style()
        };
        if (csv)
            Object.assign(this.csv, csv);
        if (print)
            Object.assign(this.print, print);
    }
}class DateTimeExportConfig {
    constructor(defaultFormat, csv, print) {
        this.csv = {
            include: false,
            format: '',
            keyPrefix: '',
            keySuffix: '',
            valuePrefix: '',
            valueSuffix: ''
        };
        this.print = {
            include: false,
            format: '',
            prefix: '',
            suffix: '',
            separator: ' - ',
            internalLink: false,
            externalLink: '',
            style: new Style()
        };
        this.csv.format = defaultFormat;
        this.print.format = defaultFormat;
        if (csv)
            Object.assign(this.csv, csv);
        if (print)
            Object.assign(this.print, print);
    }
    static newDate(csv, print) {
        return new DateTimeExportConfig('YYYY-MM-DD', csv, print);
    }
    static newTime(csv, print) {
        return new DateTimeExportConfig('HH:mm:ss', csv, print);
    }
}class Style {
    constructor(obj) {
        this.bold = false;
        this.italics = false;
        this.strikethrough = false;
        this.highlight = false;
        this.code = false;
        if (obj)
            Object.assign(this, obj);
    }
    withBold() {
        this.bold = true;
        return this;
    }
    withItalics() {
        this.italics = true;
        return this;
    }
    withStrikethrough() {
        this.strikethrough = true;
        return this;
    }
    withHighlight() {
        this.highlight = true;
        return this;
    }
    withCode() {
        this.code = true;
        return this;
    }
    apply(str) {
        let result = str;
        if (this.bold)
            result = `**${result}**`;
        if (this.italics)
            result = `_${result}_`;
        if (this.strikethrough)
            result = `~~${result}~~`;
        if (this.highlight)
            result = `==${result}==`;
        if (this.code)
            result = `\`${result}\``;
        return result;
    }
    static applyStyle(str, style) {
        return style.apply(str);
    }
}function booleanizeString(str) {
    if (str === 'false')
        return false;
    if (str === 'true')
        return true;
    return str;
}function applyRecursive(obj, func) {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return func(obj);
    }
    else if (Array.isArray(obj))
        return obj.map((item) => applyRecursive(item, func));
    else if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj)
            newObj[key] = applyRecursive(obj[key], func);
        return newObj;
    }
    return obj;
}class Path {
    constructor(path) {
        this.reMatchFile = RegExp(/([^/]+)\.(\w+)$/);
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
        if (ext)
            return this.extension === ext.trim();
        return this.basename !== '' && this.extension !== '';
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
        if (this.isFile())
            return `${this.basename}.${this.extension}`;
        return '';
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
        return `${this.folder}${this.hasFolder() && this.isFile() ? '/' : ''}${this.getFile()}`;
    }
}function info(message, obj) {
    if (!obj) {
        console.log(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.reset);
    debugObj(obj);
    console.groupEnd();
}function error(message, obj) {
    if (!obj) {
        console.error(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.red);
    debugObj(obj);
    console.groupEnd();
}function warn(message, obj) {
    if (!obj) {
        console.warn(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.orange);
    debugObj(obj);
    console.groupEnd();
}function debugObj(obj) {
    Object.keys(obj).forEach((key, i) => {
        console.info(debug.object(key), ...debug.objectColors, Object.values(obj)[i]);
    });
}const colors = {
    reset: 'color: inherit',
    blue: 'color: #27C6F1',
    pink: 'color: #D927F1',
    red: 'color: #F12727',
    orange: 'color: #F18C27'
};const debug = {
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
