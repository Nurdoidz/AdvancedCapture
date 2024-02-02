const NOTE_PATH = 'Path to note';
const CREATE_NOTE = 'Create note if it doesn\'t exist';
const TARGET = 'Target';
const CUSTOM_VARIABLE = 'Custom capture variable';
const FILE_INSERT_MODE = 'File insert mode';
const FILE_PADDING = 'File padding';
const SECTION_MATCH = 'Section match';
const SECTION_MATCH_INDEX = 'Section match index';
const CREATE_SECTION = 'Create section if it doesn\'t exist';
const SECTION_INSERT_MODE = 'Section insert mode';
const SECTION_PADDING = 'Section padding';
const BLOCK_TYPE = 'Block type';
const BLOCK_MATCH = 'Block match';
const BLOCK_MATCH_INDEX = 'Block match index';
const CREATE_CODE_BLOCK = 'Create code block if it doesn\'t exist';
const BLOCK_INSERT_MODE = 'Block insert mode';
const BLOCK_PADDING = 'Block padding';
const LINE_MATCH = 'Line match';
const LINE_MATCH_INDEX = 'Line match index';
const LINE_INSERT_MODE = 'Line insert mode';
const LINE_PADDING = 'Line padding';
const STRING_MATCH = 'String match';
const STRING_MATCH_INDEX = 'String match index';
const STRING_INSERT_MODE = 'String insert mode';
module.exports = {
    entry: noteExport,
    settings: {
        name: 'AdvancedCapture',
        author: 'Nurdoidz',
        options: {
            [NOTE_PATH]: {
                type: 'text',
                defaultValue: '',
                placeholder: 'path/to/note.md'
            },
            [CREATE_NOTE]: {
                type: 'checkbox',
                defaultValue: false
            },
            [TARGET]: {
                type: 'dropdown',
                defaultValue: 'File',
                options: [
                    'File',
                    'Section',
                    'Block',
                    'Line',
                    'String'
                ]
            },
            [CUSTOM_VARIABLE]: {
                type: 'text',
                defaultValue: '',
                placeholder: 'markdownExport'
            },
            [FILE_INSERT_MODE]: {
                type: 'dropdown',
                defaultValue: 'Append',
                options: [
                    'Append',
                    'Prepend',
                    'Replace'
                ]
            },
            [FILE_PADDING]: {
                type: 'text',
                defaultValue: '0,1',
                placeholder: '0,1'
            },
            [SECTION_MATCH]: {
                type: 'text',
                defaultValue: '',
                placeholder: '# Header'
            },
            [SECTION_MATCH_INDEX]: {
                type: 'text',
                defaultValue: '',
                placeholder: '1, 3-5'
            },
            [CREATE_SECTION]: {
                type: 'text',
                defaultValue: '',
                placeholder: '# Header'
            },
            [SECTION_INSERT_MODE]: {
                type: 'dropdown',
                defaultValue: 'Bottom',
                options: [
                    'Top',
                    'Bottom',
                    'Prepend',
                    'Append',
                    'Replace'
                ]
            },
            [SECTION_PADDING]: {
                type: 'text',
                defaultValue: '0,1',
                placeholder: '0,1'
            },
            [BLOCK_TYPE]: {
                type: 'dropdown',
                defaultValue: 'Disabled',
                options: [
                    'Disabled',
                    'Paragraph',
                    'Unordered List',
                    'Ordered List',
                    'Task List',
                    'Blockquote',
                    'Code Block',
                    'YAML'
                ]
            },
            [BLOCK_MATCH]: {
                type: 'text',
                defaultValue: '',
                placeholder: '```java'
            },
            [BLOCK_MATCH_INDEX]: {
                type: 'text',
                defaultValue: '',
                placeholder: '1, 3-5'
            },
            [CREATE_CODE_BLOCK]: {
                type: 'text',
                defaultValue: '',
                placeholder: '```java'
            },
            [BLOCK_INSERT_MODE]: {
                type: 'dropdown',
                defaultValue: 'Bottom',
                options: [
                    'Top',
                    'Bottom',
                    'Prepend',
                    'Append',
                    'Replace'
                ]
            },
            [BLOCK_PADDING]: {
                type: 'text',
                defaultValue: '0,1',
                placeholder: '0,1'
            },
            [LINE_MATCH]: {
                type: 'text',
                defaultValue: '',
                placeholder: '#mytag'
            },
            [LINE_MATCH_INDEX]: {
                type: 'text',
                defaultValue: '',
                placeholder: '1, 3-5'
            },
            [LINE_INSERT_MODE]: {
                type: 'dropdown',
                defaultValue: 'Append',
                options: [
                    'Prepend',
                    'Append',
                    'Replace'
                ]
            },
            [LINE_PADDING]: {
                type: 'text',
                defaultValue: '0',
                placeholder: '0'
            },
            [STRING_MATCH]: {
                type: 'text',
                defaultValue: '',
                placeholder: '#mytag'
            },
            [STRING_MATCH_INDEX]: {
                type: 'text',
                defaultValue: '',
                placeholder: '1, 3-5'
            },
            [STRING_INSERT_MODE]: {
                type: 'dropdown',
                defaultValue: 'Append',
                options: [
                    'Prepend',
                    'Append',
                    'Replace'
                ]
            }
        }
    }
};
let Obsidian;
let QuickAdd;
async function noteExport(quickAdd, settings) {
    info('Starting');
    Obsidian = quickAdd.app;
    QuickAdd = quickAdd.quickAddApi;
    const VAR = quickAdd.variables;
    if (!('markdownExport' in VAR)) {
        throw new Error('Missing markdownExport in global variables');
    }
    const PATH = new Path(replaceInString(VAR, settings[NOTE_PATH]));
    if (!PATH.isFile())
        throw new Error(`${PATH} is not a file`);
    let file = Obsidian.vault.getAbstractFileByPath(PATH);
    if (!file) {
        if (!settings[CREATE_NOTE])
            throw new Error(`${PATH} does not exist`);
        warn('Note not found; trying to create', { Path: PATH });
        await ensureFolderExists(PATH, Obsidian.vault);
        file = await Obsidian.vault.create(PATH.toString(), '');
        info('Note file successfully created', { Path: PATH });
    }
    const lines = (await Obsidian.vault.read(file)).split('\n');
    const customVariable = replaceInString(VAR, settings[CUSTOM_VARIABLE]);
    const content = customVariable.length > 0 ? customVariable : VAR.markdownExport;
    const reMatchNumCommaNum = /^(\d+)(?:,(\d+))?$/;
    if (settings[TARGET] === 'File') {
        switch (settings[FILE_INSERT_MODE]) {
            case 'Append':
                lines.push(content);
                break;
            case 'Prepend':
                lines.unshift(content);
                break;
            case 'Replace':
                lines.length = 0;
                lines.push(content);
                break;
        }
    }
    if (settings[FILE_PADDING] === '')
        pad(lines, 0, 1);
    else if (!reMatchNumCommaNum.test(settings[FILE_PADDING])) {
        throw new Error(`${settings[FILE_PADDING]} is not valid syntax for file padding`);
    }
    else {
        pad(lines, settings[FILE_PADDING].match(reMatchNumCommaNum)[1], settings[FILE_PADDING].match(reMatchNumCommaNum)[2]);
    }
    Obsidian.vault.modify(file, lines.join('\n'));
    info('Note successfully updated with export', { Path: PATH, Line: VAR.markdownExport });
}
function pad(arr, top, bottom) {
    if (arr.length === 0)
        throw new Error('Cannot pad an empty array');
    if (!(top >= 0))
        throw new Error('Top padding must be >= 0');
    if (bottom === undefined)
        bottom = top;
    else if (!(bottom >= 0))
        throw new Error('Bottom padding must be >= 0');
    let start = 0;
    let end = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 0) {
            start = i;
            break;
        }
    }
    for (let i = start; i < arr.length; i++) {
        if (arr[i].length > 0) {
            end = i;
            break;
        }
    }
    const result = arr.slice(start, end + 1);
    for (let i = 0; i < top; i++) {
        result.unshift('');
    }
    for (let i = 0; i < bottom; i++) {
        result.push('');
    }
    return result;
}

async function ensureFolderExists(path, vault) {
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
        this.variable = '';
        this.listPath = '';
        this.required = false;
        this.hasIcons = false;
        this.export = new DefaultExportConfig();
        this.process = new DefaultProcessConfig();
    }
}class DefaultProcessConfig {
    constructor() {
        this.csv = '';
        this.print = '';
        this.input = '';
    }
}class Input {
    constructor() {
        this.fields = [];
    }
    add(input, config, key, process) {
        if (!config)
            config = new DefaultExportConfig();
        if (input)
            this.fields.push(new Field(input, config, key, process));
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
                return field.getFieldKey().replace(/[,]/g, '');
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
    constructor(input, config, key, process) {
        this.input = '';
        this.key = '';
        this.config = new DefaultExportConfig();
        this.process = new DefaultProcessConfig();
        this.input = input;
        this.key = key;
        if (config)
            Object.assign(this.config, config);
        if (process)
            Object.assign(this.process, process);
    }
    getSeparator() {
        return this.config.print?.separator ?? ' - ';
    }
    getPrintString() {
        let result = this.input;
        if (this.process.input) {
            const lambda = eval(this.process.input);
            result = lambda(result);
        }
        if (this.process.print) {
            const lambda = eval(this.process.print);
            result = lambda(result);
        }
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
        let result = this.input;
        if (this.process.input) {
            const lambda = eval(this.process.input);
            result = lambda(result);
        }
        if (this.process.csv) {
            const lambda = eval(this.process.csv);
            result = lambda(result);
        }
        result = `${this.config.csv?.valuePrefix
            ?? ''}${result}${this.config.csv?.valueSuffix ?? ''}`;
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
