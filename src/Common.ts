export async function ensureFolderExists(path: Path, vault: any): Promise<void> {

    if (!path.hasFolder()) return;
    if (!vault.getAbstractFileByPath(path.getFolder())) {
        await vault.createFolder(path.getFolder());
    }
}

export function parseJsonToConfig(jsonString: string): Config {

    const obj = JSON.parse(jsonString);
    if (obj && typeof obj === 'object') return obj;
    throw new SyntaxError('JSON is not valid config format');
}

export function replaceInString(vars: QaVariables, str: string | undefined): string {

    if (typeof str === 'undefined') return '';
    let result = str;
    const reMatchVar = RegExp(/var\(--(\w+?)\)/);
    if (reMatchVar.test(result)) {
        const match = result.match(reMatchVar)![0]
            .replace(reMatchVar, '$1');
        if (match in vars) result = result.replace(reMatchVar, vars[match]);
        else {
            warn(`Variable '${match}' not found`, { Variables: vars });
            result = result.replace(reMatchVar, '');
        }

        if (reMatchVar.test(result)) result = replaceInString(vars, result);
    }
    // info('replaceInString', { Before: str, Result: result });
    return result;
}

export function replaceRecursively(variables: QaVariables, obj: any): any {

    return applyRecursive(obj, (o) => {
        o = replaceInString(variables, o);
        return booleanizeString(o);
    });
}

export function shouldQuote(value: string): boolean {
    const matchNonString = RegExp(/^(\d*([.]\d+)?)$|^true$|^false$/gm);
    return !matchNonString.test(value);
}

export interface Config {

    variables?: QaVariables;
    dateExport?: DateTimeConfigExportable
    timeExport?: DateTimeConfigExportable
    categories?: Categories
}

export class DefaultConfig implements Config {

    variables = {};
    dateExport = DateTimeExportConfig.newDate();
    timeExport = DateTimeExportConfig.newTime();

    constructor(config?: Config) {

        if (config) Object.assign(this, config);
    }
}

export class SampleConfig extends DefaultConfig {

    categories = {
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

export interface Categories {

    [key: string]: Category
}

interface Category {

    icon?: string;
    iconExport?: ConfigExportable;
    enableComment?: boolean;
    commentExport?: ConfigExportable;
    todo?: boolean;
    fields?: Fieldable[];
}

export class Categor implements Category {

    icon = '';
    iconExport = new DefaultExportConfig();
    enableComment = false;
    commentExport = new DefaultExportConfig();
    todo = false;
}

export interface Fieldable {

    name: string;
    prompt?: 'inputPrompt' | 'suggester' | 'wideInputPrompt' | 'yesNoPrompt';
    listPath?: string;
    required?: boolean;
    hasIcons?: boolean;
    export?: ConfigExportable;
}

export class Fields implements Fieldable {

    name = '';
    listPath = '';
    required = false;
    hasIcons = false;
    export = new DefaultExportConfig();
}

export interface QaVariables {

    [key: string]: any
}

export class Input {

    private fields: Field[] = [];

    add(input: string, config: ConfigExportable | undefined, key: string) {

        if (!config) config = new DefaultExportConfig();
        if (input) this.fields.push(new Field(input, config, key));
    }

    addField(field?: Field) {

        if (field) this.fields.push(field);
    }

    getMarkdownExport(): string {

        return this.fields.reduce((acc, field) => {
            if (field.shouldIncludePrint()) {
                if (acc === '') return field.getPrintString();
                if (!field.hasInput()) return acc;
                return acc + field.getSeparator() + field.getPrintString();
            }
            return acc;
        }, '');
    }

    getCsvKeyExport(): string {

        return this.fields.map(field => {
            if (field.shouldIncludeCsv()) return field.getFieldKey().replace(/,/, '');
            return null;
        }).filter(key => key).join(',');
    }

    getCsvValueExport(): string {

        return this.fields.map(field => {
            if (field.shouldIncludeCsv()) return field.getFieldValue();
            return null;
        }).filter(key => key).join(',');
    }
}

export class Field implements Printable, Exportable {

    protected input = '';
    private key = '';
    protected config: ConfigExportable = new DefaultExportConfig();

    constructor(input: string, config: ConfigExportable | undefined, key: string) {

        this.input = input;
        this.key = key;
        if (config) Object.assign(this.config, config);
    }

    getSeparator(): string {

        return this.config.print?.separator ?? ' - ';
    }

    getPrintString(): string {

        let result = this.input;
        result = `${this.config.print?.prefix ?? ''}${result}${this.config.print?.suffix ?? ''}`;
        if (this.config.print?.internalLink) result = `[[${result}]]`;
        else if (this.config.print?.externalLink) {
            result = `[${result}](${this.config.print.externalLink})`;
        }
        return Style.applyStyle(result, new Style(this.config.print?.style));
    }

    getFieldKey(): string {

        return `${this.config.csv?.keyPrefix ?? ''}${this.key}${this.config.csv?.keySuffix ?? ''}`;
    }

    getFieldValue(): string {

        const result = `${this.config.csv?.valuePrefix
            ?? ''}${this.input}${this.config.csv?.valueSuffix ?? ''}`;
        if (shouldQuote(this.input)) return `"${result}"`;
        return result;
    }

    shouldIncludePrint(): boolean {

        return (this.config.print?.include ?? false) === true;
    }

    shouldIncludeCsv(): boolean {

        return (this.config.csv?.include ?? false) === true;
    }

    hasInput(): boolean {

        return this.input.length > 0;
    }
}

export interface ConfigExportable {

    csv?: {
        include?: boolean,
        keyPrefix?: string,
        keySuffix?: string,
        valuePrefix?: string,
        valueSuffix?: string
    }
    print?: {
        include?: boolean,
        prefix?: string,
        suffix?: string,
        separator?: string,
        internalLink?: boolean,
        externalLink?: string,
        style?: Styleable
    }
}

export class DefaultExportConfig implements ConfigExportable {

    csv = {
        include: false,
        keyPrefix: '',
        keySuffix: '',
        valuePrefix: '',
        valueSuffix: ''
    };
    print = {
        include: false,
        prefix: '',
        suffix: '',
        separator: ' - ',
        internalLink: false,
        externalLink: '',
        style: new Style()
    };

    constructor(csv?: object, print?: object) {

        if (csv) Object.assign(this.csv, csv);
        if (print) Object.assign(this.print, print);
    }
}

interface DateTimeConfigExportable extends ConfigExportable {

    csv?: {
        include?: boolean,
        format?: string,
        keyPrefix?: string,
        keySuffix?: string,
        valuePrefix?: string,
        valueSuffix?: string
    }
    print?: {
        include?: boolean,
        format?: string,
        prefix?: string,
        suffix?: string,
        separator?: string,
        internalLink?: boolean,
        externalLink?: string,
        style?: Styleable
    }
}

export class DateTimeExportConfig implements DateTimeConfigExportable {

    csv = {
        include: false,
        format: '',
        keyPrefix: '',
        keySuffix: '',
        valuePrefix: '',
        valueSuffix: ''
    };
    print = {
        include: false,
        format: '',
        prefix: '',
        suffix: '',
        separator: ' - ',
        internalLink: false,
        externalLink: '',
        style: new Style()
    };

    private constructor(defaultFormat: string, csv?: object, print?: object) {

        this.csv.format = defaultFormat;
        this.print.format = defaultFormat;
        if (csv) Object.assign(this.csv, csv);
        if (print) Object.assign(this.print, print);
    }

    static newDate(csv?: object, print?: object): DateTimeExportConfig {

        return new DateTimeExportConfig('YYYY-MM-DD', csv, print);
    }

    static newTime(csv?: object, print?: object): DateTimeExportConfig {

        return new DateTimeExportConfig('HH:mm:ss', csv, print);
    }

}

export interface Printable {

    getSeparator(): string;
    getPrintString(): string;
}

export interface Exportable {

    getFieldKey(): string;
    getFieldValue(): string;
}

interface Styleable {

    bold?: boolean;
    italics?: boolean;
    strikethrough?: boolean;
    highlight?: boolean;
    code?: boolean;
}

export class Style implements Styleable {

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

export function booleanizeString(str: string): string | boolean {

    if (str === 'false') return false;
    if (str === 'true') return true;
    return str;
}

export function applyRecursive(obj: any, func: (arg: any) => any): any {

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
        return func(obj);
    }
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

    isFile(ext?: string): boolean {

        if (ext) return this.extension === ext.trim();
        return this.basename !== '' && this.extension !== '';
    }

    isFolder(): boolean {

        if (this.isRootFolder) return true;
        return this.folder !== '' && this.basename === '';
    }

    getFolder(): string {

        return this.folder;
    }

    getFile(): string {

        if (this.isFile()) return `${this.basename}.${this.extension}`;
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

    toString(): string {

        return `${this.folder}${this.hasFolder() && this.isFile() ? '/' : ''}${this.getFile()}`;
    }
}


export function info(message: string, obj?: object) {

    if (!obj) {
        console.log(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.reset);
    debugObj(obj);
    console.groupEnd();
}

export function error(message: string, obj?: object) {

    if (!obj) {
        console.error(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.red);
    debugObj(obj);
    console.groupEnd();
}

export function warn(message: string, obj?: object) {

    if (!obj) {
        console.warn(debug.prefix + message, ...debug.prefixColors);
        return;
    }
    console.groupCollapsed(debug.prefix + message, colors.blue, colors.orange);
    debugObj(obj);
    console.groupEnd();
}

export function debugObj(obj: object) {

    Object.keys(obj).forEach((key, i) => {
        console.info(
            debug.object(key), ...debug.objectColors, Object.values(obj)[i]
        );
    });
}

export const colors = {

    reset: 'color: inherit',
    blue: 'color: #27C6F1',
    pink: 'color: #D927F1',
    red: 'color: #F12727',
    orange: 'color: #F18C27'
};

export const debug = {

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
