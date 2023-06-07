/*
 * AdvancedCapture for QuickAdd by Nurdoidz
 *
 * Version UNRELEASED
 * https://github.com/Nurdoidz/AdvancedCapture
 *
 * ------------------------------------------------------------------------- */

const CONFIG_PATH = 'Path to configuration file';
const DATE_FORMAT = 'Date format';
const TIME_FORMAT = 'Time format';

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
            [DATE_FORMAT]: {
                type: 'text',
                defaultValue: 'YYYY-MM-DD',
                placeholder: 'YYYY-MM-DD'
            },
            [TIME_FORMAT]: {
                type: 'text',
                defaultValue: 'HH:mm:ss',
                placeholder: 'HH:mm:ss'
            },
            'Debug': {
                type: 'checkbox',
                defaultValue: false
            }
        }
    }
};

let Settings: any;
let QuickAdd: any;
let Obsidian: any;
const Variables: StringReplaceable = {
    replaceInString: function(str: string): string {

        let result = str;
        const reMatchVar = RegExp(/var\(--(\w+?)\)/);
        if (reMatchVar.test(result)) {
            const match = result.match(reMatchVar)![0]
                .replace(reMatchVar, '$1');
            if (match in this) result = result.replace(reMatchVar, this[match]);
            else result = result.replace(reMatchVar, '');

            if (reMatchVar.test(result)) result = this.replaceInString(result);
        }
        return result;
    },
    fullReplace(obj: any): any {

        return applyRecursive(obj, (o) => {
            o = this.replaceInString(o);
            return replaceStringWithBoolean(o);
        });
    }
};
interface StringReplaceable {
    replaceInString(str: string): string
    fullReplace(obj: any): any
    [key: string]: any
}
export { Variables };

async function main(quickAdd: any, settings: any): Promise<void> {

    Settings = settings;
    QuickAdd = quickAdd.quickAddApi;
    Obsidian = quickAdd.app;
    Object.assign(Variables, quickAdd.variables);
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
    const input = new Input();
    stampDateTime(input);

    info('!Stopping');
}

async function readConfig(): Promise<boolean> {

    info('!Reading config', { Path: Settings[CONFIG_PATH] });

    const path = new Path(Variables.replaceInString(Settings[CONFIG_PATH]));
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
    if (!config) if (!content.trim()) {
        if (await QuickAdd.yesNoPrompt(`No config found. Want to create a sample at '${path}'?`)) {
            Obsidian.vault.modify(file, JSON.stringify(getSampleConfig(), null, 2));
            info('!Created config', { Path: path });
        }
    }
    else {
        error('Could not parse config', { Path: path });
        return false;
    }

    if (config) Variables.config = config;
    return true;
}

function stampDateTime(input: Input): void {

    input.addField(new DateTimeField(Variables.config.date));
    input.addField(new DateTimeField(Variables.config.time));
}

async function ensureFolderExists(path: Path): Promise<void> {

    if (!path.hasFolder()) return;
    if (!Obsidian.vault.getAbstractFileByPath(path.getFolder)) await Obsidian.vault.createFolder(path.getFolder);
}

function tryParseJSONObject(jsonString: string): object | undefined {

    try {
        const obj = JSON.parse(jsonString);
        if (obj && typeof obj === 'object') return obj;
    }
    catch (e) {
        return undefined;
    }
}

export function getSampleConfig(): object {

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

class Input {

    private fields: Field[] = [];

    add(input: string, config: FieldConfig) {

        this.fields.push(new Field(input, config));
    }

    addField(field: Field) {

        this.fields.push(field);
    }

}

class Field implements Printable, Exportable {

    protected input: string;
    protected config: FieldConfig;

    constructor(input: string, config: FieldConfig) {

        this.input = input;
        this.config = Variables.fullReplace(config);
    }

    getSeparator(): string {

        return Variables.replaceInString(this.config.print.separator);
    }

    getPrintString(): string {

        if (!this.config.print.include) return '';
        let result = this.input;
        result = `${this.config.print.prefix}${result}${this.config.print.suffix}`;
        if (this.config.print.internalLink) result = `[[${result}]]`;
        else if (this.config.print.externalLink) result = `[${result}](${this.config.print.externalLink})`;
        return Style.applyStyle(result, new Style(this.config.print.style));
    }

    getFieldKey(): string {

        if (!this.config.row.include) return '';
        return `${this.config.row.keyPrefix}${this.input}${this.config.row.keySuffix}`;
    }

    getFieldValue(): string {

        if (!this.config.row.include) return '';
        return `${this.config.row.valuePrefix}${this.input}${this.config.row.valueSuffix}`;
    }
}

class DateTimeField extends Field {

    constructor(config: DateTimeFieldConfig) {

        super('', config);
    }

    override getPrintString(): string {

        this.input = QuickAdd.date.now(this.config.print.format);
        return super.getPrintString();
    }

    override getFieldValue(): string {

        this.input = QuickAdd.date.now(this.config.row.format);
        return super.getFieldValue();
    }
}

class FieldConfig {

    row: { [key: string]: any } = {
        'include': false,
        'keyPrefix': '',
        'keySuffix': '',
        'valuePrefix': '',
        'valueSuffix': ''
    };
    print: { [key: string]: any } = {
        'include': false,
        'prefix': '',
        'suffix': '',
        'separator': ' - ',
        'internalLink': false,
        'externalLink': '',
        'style': {
            'bold': false,
            'italics': false,
            'strikethrough': false,
            'highlight': false
        }
    };

    constructor(row?: object, print?: object) {

        if (row) Object.assign(this.row, row);
        if (print) Object.assign(this.print, print);
    }
}

class DateTimeFieldConfig extends FieldConfig {

    private constructor(defaultFormat: string, row?: object, print?: object) {

        super(row, print);
        if (row) if ('format' in row) this.row.format = row.format;
        else this.row.format = defaultFormat;

        if (print) if ('format' in print) this.print.format = print.format;
        else this.print.format = defaultFormat;
    }

    newDate(row?: object, print?: object): DateTimeFieldConfig {

        return new DateTimeFieldConfig('YYYY-MM-DD', row, print);
    }

    newTime(row?: object, print?: object): DateTimeFieldConfig {

        return new DateTimeFieldConfig('HH:mm:ss', row, print);
    }

}

interface Printable {

    getSeparator(): string;
    getPrintString(): string;
}

interface Exportable {

    getFieldKey(): string;
    getFieldValue(): string;
}

export class Style {

    bold = false;
    italics = false;
    strikethrough = false;
    highlight = false;
    code = false;

    constructor(obj?: object) {

        if (obj) Object.assign(this, obj);
    }

    withBold(): Style {

        this.bold = true;
        return this;
    }

    withItalics(): Style {

        this.italics = true;
        return this;
    }

    withStrikethrough(): Style {

        this.strikethrough = true;
        return this;
    }

    withHighlight(): Style {

        this.highlight = true;
        return this;
    }

    withCode(): Style {

        this.code = true;
        return this;
    }

    apply(str: string): string {

        let result = str;
        if (this.bold) result = `**${result}**`;
        if (this.italics) result = `_${result}_`;
        if (this.strikethrough) result = `~~${result}~~`;
        if (this.highlight) result = `==${result}==`;
        if (this.code) result = `\`${result}\``;
        return result;
    }

    static applyStyle(str: string, style: Style): string {

        return style.apply(str);
    }
}

function replaceStringWithBoolean(str: string): string | boolean {

    if (str === 'false') return false;
    if (str === 'true') return true;
    return str;
}

function applyRecursive(obj: any, func: (arg: any) => any): any {

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') return func(obj);
    else if (Array.isArray(obj)) return obj.map((item) => applyRecursive(item, func));
    else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) newObj[key] = applyRecursive(obj[key], func);
        return newObj;
    }
    return obj;
}

export class Path {

    private folder: string;
    private basename: string;
    private extension: string;
    isRootFolder: boolean;
    private reMatchFile = RegExp(/([^/]+)\.(\w+)$/);

    constructor(path: string) {

        path = this.trimPath(path);
        this.folder = this.extractFolder(path);
        this.basename = this.extractBasename(path);
        this.extension = this.extractExtension(path);
        this.isRootFolder = !this.folder && !this.basename && !this.extension;
    }

    private trimPath(path: string): string {

        return path.trim()
            .replace(/[\n\r]/g, '')
            .replace(/\/{2,}/g, '/')
            .replace(/^\//, '')
            .replace(/^\/(.+)/g, '$1');
    }

    private extractFolder(path: string): string {

        if (path === '') return '';
        if (path.includes('/')) {
            if (path.endsWith('/')) return path.substring(0, path.length - 1);
            if (this.reMatchFile.test(path)) return path.split('/').slice(0, -1).join('/');
            return path;
        }
        if (!this.reMatchFile.test(path)) return path;
        return '';
    }

    private extractBasename(path: string): string {

        if (path === '') return '';
        if (this.reMatchFile.test(path)) return path.match(this.reMatchFile)![1];
        return '';
    }

    private extractExtension(path: string): string {

        if (path === '') return '';
        if (this.reMatchFile.test(path)) return path.match(this.reMatchFile)![2];
        return '';
    }

    isFile(ext: string): boolean {

        return this.extension === ext.trim();
    }

    isFolder(): boolean {

        if (this.isRootFolder) return true;
        return this.folder !== '' && this.basename === '';
    }

    getFolder(): string {

        return this.folder;
    }

    getFile(): string {

        if (this.hasFile()) return `${this.basename}.${this.extension}`;
        return '';
    }

    getBasename(): string {

        return this.basename;
    }

    getExtension(): string {

        return this.extension;
    }

    hasFolder(): boolean {

        return this.folder !== '';
    }

    hasFile(): boolean {

        return this.basename !== '' && this.extension !== '';
    }

    toString(): string {

        return `${this.folder}${this.hasFolder() && this.hasFile() ? '/' : ''}${this.getFile()}`;
    }
}

function info(message: string, obj?: object) {

    if (message.startsWith('!')) message = message.substring(1);
    else if (!Settings.Debug) return;

    if (!obj) {
        console.log(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.reset);
    debugObj(obj);
    console.groupEnd();
}

function error(message: string, obj?: object) {

    if (!obj) {
        console.error(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.red);
    debugObj(obj);
    console.groupEnd();
}

function warn(message: string, obj?: object) {

    if (!obj) {
        console.warn(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.orange);
    debugObj(obj);
    console.groupEnd();
}

function debugObj(obj: object) {

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
    object: (str: string) => `%c${str}:%c `,
    prefixColors: [colors.blue, colors.reset],
    objectColors: [colors.pink, colors.reset],
    singleKey: (obj: object) => {
        const [key, value] = Object.entries(obj)[0];
        return `%c${key}:%c ${value}`;
    },
    singleKeyColors: [colors.pink, colors.reset]
};
