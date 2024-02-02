const CONFIG_PATH = 'Path to configuration file';
module.exports = {
    entry: capture,
    settings: {
        name: 'AdvancedCapture',
        author: 'Nurdoidz',
        options: {
            [CONFIG_PATH]: {
                type: 'text',
                defaultValue: 'Scripts/QuickAdd/AdvancedCapture/Config.json',
                placeholder: 'path/to/config.json'
            }
        }
    }
};
let Obsidian;
let QuickAdd;
async function capture(quickAdd, settings) {
    info('Starting capture');
    Obsidian = quickAdd.app;
    QuickAdd = quickAdd.quickAddApi;
    const config = await getConfig(new Path(replaceInString(quickAdd.variables, settings[CONFIG_PATH])));
    quickAdd.variables = Object.assign(config.variables, quickAdd.variables);
    const variables = quickAdd.variables;
    variables.date = QuickAdd.date.now(config.dateExport?.csv?.format);
    variables.time = QuickAdd.date.now(config.timeExport?.csv?.format);
    const input = new Input();
    input.add(variables.date, config.dateExport, 'Date');
    input.add(variables.time, config.timeExport, 'Time');
    const categoryName = await promptCategory(config.categories, variables);
    if (!categoryName || !config.categories) {
        info('Stopping');
        return;
    }
    variables.categoryName = categoryName;
    const category = config.categories[categoryName];
    variables.categoryIcon = category.icon;
    variables.categoryFullName = `${category.icon ? `${category.icon} ` : ''}${categoryName}`;
    input.add(category?.icon ?? '', category.iconExport, 'Icon');
    variables.todo = category.todo === true ? '- [ ] ' : ' ';
    for (let i = 0; i < (category.fields?.length ?? 0); i++) {
        input.addField(await promptField(category.fields[i], variables));
    }
    if (category.enableComment === true) {
        input.addField(await promptComment(variables, category.commentExport, category.commentProcess));
    }
    variables.input = input;
    variables.markdownExport = input.getMarkdownExport();
    variables.csvKeyExport = input.getCsvKeyExport();
    variables.csvValueExport = input.getCsvValueExport();
    Object.assign(quickAdd.variables, variables);
    info('Stored input in QuickAdd variables', { Variables: variables });
    info('Stopping capture');
}
async function getConfig(path) {
    info('Looking for config file', { Path: path });
    if (!path.isFile('json'))
        throw new Error('Path to config is not a json file');
    let file = Obsidian.vault.getAbstractFileByPath(path);
    if (!file) {
        warn('No config found', { Path: path });
        info('Creating sample config', { Path: path });
        await ensureFolderExists(path, Obsidian.vault);
        const sample = new SampleConfig();
        file = await Obsidian.vault.create(path.toString(), JSON.stringify(sample, null, 4));
        if (!file)
            throw new Error('Failed to create sample config');
        info('Created sample config', { Path: path, Config: sample });
    }
    info('Config found', { Path: path });
    info('Reading config', { Path: path });
    const content = await Obsidian.vault.read(file);
    return new DefaultConfig(parseJsonToConfig(content));
}
async function promptCategory(cats, vars) {
    if (!cats) {
        warn('No categories found');
        return undefined;
    }
    if (Object.keys(cats).length === 0) {
        warn('No categories found');
        return undefined;
    }
    if (Object.keys(cats).length === 1) {
        return Object.keys(cats)[0];
    }
    const categories = { ...cats };
    Object.keys(categories).forEach(cat => {
        categories[cat].icon = replaceInString(vars, categories[cat].icon);
    });
    const display = Object.keys(categories);
    const actual = [...display];
    display.forEach((item, i, l) => {
        if (categories[item].icon)
            l[i] = `${categories[item].icon} ${item}`;
    });
    info('Prompting for category', { List: display });
    return await QuickAdd.suggester(display, actual);
}
async function promptField(field, vars) {
    field = Object.assign(new Fields(), field);
    field = replaceRecursively(vars, field);
    field.name = field.name.replace(/[,]/g, '');
    let input;
    let file;
    let path;
    info('Prompting for input', { Field: field });
    switch (field.prompt) {
        case 'wideInputPrompt':
        case 'inputPrompt':
            if (field.prompt === 'wideInputPrompt')
                input = await QuickAdd.wideInputPrompt(field.name);
            else
                input = await QuickAdd.inputPrompt(field.name);
            input = replaceInString(vars, input);
            if (!input) {
                if (field.required === true)
                    throw new Error('No input received for required field');
                input = '';
            }
            break;
        case 'yesNoPrompt':
            input = await QuickAdd.yesNoPrompt(field.name);
            if (typeof input !== 'boolean') {
                if (field.required === true)
                    throw new Error('No input received for required field');
                input = 'false';
            }
            input = input.toString();
            break;
        case 'suggester':
            path = new Path(replaceInString(vars, field.listPath));
            file = Obsidian.vault.getAbstractFileByPath(path);
            if (!file) {
                info('File for list not found; trying to create', { Path: path, Field: field.name });
                await ensureFolderExists(path, Obsidian.vault);
                file = await Obsidian.vault.create(path.toString(), '');
                if (!file) {
                    error('Failed to create file for list', { Path: path, Field: field.name });
                    if (field.required === true) {
                        throw new Error('Could not create file for list for required field');
                    }
                    input = '';
                    break;
                }
                info('Created file for list', { Path: path, Field: field.name });
            }
            do {
                let content = (await Obsidian.vault.read(file)).trim();
                const display = [];
                if (content.length > 0) {
                    content.split('\n').forEach((line) => {
                        display.push(replaceInString(vars, line).trim());
                    });
                }
                content += '\n';
                display.push('✨ Add');
                const actual = display.slice(0, -1);
                actual.push('!add');
                input = await QuickAdd.suggester(display, actual);
                input = replaceInString(vars, input);
                if (!input) {
                    if (field.required === true) {
                        throw new Error('No input received for required field');
                    }
                    input = '';
                }
                if (input === '!add') {
                    info('Prompting for new item in list', { Path: field.listPath, Field: field.name });
                    let icon;
                    if (field.hasIcons === true) {
                        icon = await QuickAdd.inputPrompt(`Icon for new ${field.name}`);
                        if (icon)
                            icon = icon.replace(/\s/g, '');
                        if (!icon)
                            warn('Invalid icon', { Icon: icon });
                    }
                    if (field.hasIcons === !!icon) {
                        const name = (await QuickAdd.inputPrompt(`Name for new ${field.name}`)).trim();
                        if (name) {
                            content += `${(icon ? `${icon} ` : '') + name}\n`;
                            Obsidian.vault.modify(file, content);
                            info('Added new item', { Path: field.listPath, Icon: icon, Name: name });
                        }
                        else
                            warn('Invalid item name', { Name: name });
                    }
                }
            } while (input === '!add');
            if (!input) {
                if (field.required === true)
                    throw new Error('No input received for required field');
                input = '';
            }
            break;
        default:
            error('Unsupported prompt type', { Prompt: field.prompt, Field: field.name });
            throw new Error('Unsupported prompt type');
    }
    if (input)
        info('Captured input for field', { Field: field.name, Input: input });
    else
        info('No input captured for field', { Field: field.name });
    if (field.variable.length > 0)
        vars[field.variable] = input;
    return new Field(input, field.export, field.name, field.process);
}
async function promptComment(vars, config, process) {
    info('Prompting for comment');
    return new Field(replaceInString(vars, await QuickAdd.inputPrompt('Comment')), config, 'Comment', process);
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
