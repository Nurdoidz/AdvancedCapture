import { Path, getSampleConfig, Variables, Style, replaceStringWithBoolean } from './AdvancedCapture';
import { describe, expect, it, test } from 'vitest';

describe('Path', () => {
    describe('File name', () => {
        it('should not have file given "" as path', () => {
            const path = new Path('');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given " " as path', () => {
            const path = new Path(' ');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "/" as path', () => {
            const path = new Path('/');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "abc" as path', () => {
            const path = new Path('abc');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given ".abc" as path', () => {
            const path = new Path('.abc');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "abc/" as path', () => {
            const path = new Path('abc/');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "/abc" as path', () => {
            const path = new Path('/abc');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "abc/def" as path', () => {
            const path = new Path('abc/def');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should not have file given "a//b///c" as path', () => {
            const path = new Path('a//b///c');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should have "a.b" file given "a.b" as path', () => {
            const path = new Path('a.b');
            expect(path.getFile()).toStrictEqual('a.b');
            expect(path.hasFile()).toBe(true);
            expect(path.getBasename()).toStrictEqual('a');
            expect(path.getExtension()).toStrictEqual('b');
        });
        it('should not have file given "a." as path', () => {
            const path = new Path('a.');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        it('should have "abc.def" file given "abc.def" as path', () => {
            const path = new Path('abc.def');
            expect(path.getFile()).toStrictEqual('abc.def');
            expect(path.hasFile()).toBe(true);
            expect(path.getBasename()).toStrictEqual('abc');
            expect(path.getExtension()).toStrictEqual('def');
        });
        it('should have "bc.def" file given "a/bc.def" as path', () => {
            const path = new Path('a/bc.def');
            expect(path.getFile()).toStrictEqual('bc.def');
            expect(path.hasFile()).toBe(true);
            expect(path.getBasename()).toStrictEqual('bc');
            expect(path.getExtension()).toStrictEqual('def');
        });
        it('should not have file given "a/.bc" as path', () => {
            const path = new Path('a/.bc');
            expect(path.getFile()).toStrictEqual('');
            expect(path.hasFile()).toBe(false);
            expect(path.getBasename()).toStrictEqual('');
            expect(path.getExtension()).toStrictEqual('');
        });
        test('isFile("doc") should return true given "a.doc" as path', () => {
            const path = new Path('a.doc');
            expect(path.isFile('doc')).toBe(true);
        });
        test('isFile("doc") should return false given ".doc" as path', () => {
            const path = new Path('.doc');
            expect(path.isFile('doc')).toBe(false);
        });
        test('isFile("csv") should return false given "a.doc" as path', () => {
            const path = new Path('a.doc');
            expect(path.isFile('csv')).toBe(false);
        });
        test('isFile(" doc") should return true given "a.doc" as path', () => {
            const path = new Path('a.doc');
            expect(path.isFile(' doc')).toBe(true);
        });
        test('isFile("doc ") should return true given "a.doc" as path', () => {
            const path = new Path('a.doc');
            expect(path.isFile('doc ')).toBe(true);
        });
        test('isFile("do c") should return false given "a.doc" as path', () => {
            const path = new Path('a.doc');
            expect(path.isFile('do c')).toBe(false);
        });
    });
    describe('Folder', () => {
        it('should not have folder given "" as path', () => {
            const path = new Path('');
            expect(path.getFolder()).toStrictEqual('');
            expect(path.hasFolder()).toBe(false);
            expect(path.isFolder()).toBe(true);
        });
        it('should not have folder given " " as path', () => {
            const path = new Path(' ');
            expect(path.getFolder()).toStrictEqual('');
            expect(path.hasFolder()).toBe(false);
            expect(path.isFolder()).toBe(true);
        });
        it('should not have folder given "/" as path', () => {
            const path = new Path('/');
            expect(path.getFolder()).toStrictEqual('');
            expect(path.hasFolder()).toBe(false);
            expect(path.isFolder()).toBe(true);
        });
        it('should have "abc" folder given "abc" as path', () => {
            const path = new Path('abc');
            expect(path.getFolder()).toStrictEqual('abc');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should have ".abc" folder given ".abc" as path', () => {
            const path = new Path('.abc');
            expect(path.getFolder()).toStrictEqual('.abc');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should have "abc" folder given "abc/" as path', () => {
            const path = new Path('abc/');
            expect(path.getFolder()).toStrictEqual('abc');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should have "abc" folder given "/abc" as path', () => {
            const path = new Path('/abc');
            expect(path.getFolder()).toStrictEqual('abc');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should have "abc/def" folder given "abc/def" as path', () => {
            const path = new Path('abc/def');
            expect(path.getFolder()).toStrictEqual('abc/def');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should have "a/b/c" folder given "a//b///c" as path', () => {
            const path = new Path('a//b///c');
            expect(path.getFolder()).toStrictEqual('a/b/c');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should not have folder given "a.b" as path', () => {
            const path = new Path('a.b');
            expect(path.getFolder()).toStrictEqual('');
            expect(path.hasFolder()).toBe(false);
            expect(path.isFolder()).toBe(false);
        });
        it('should have "a." folder given "a." as path', () => {
            const path = new Path('a.');
            expect(path.getFolder()).toStrictEqual('a.');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
        it('should not have folder given "abc.def" as path', () => {
            const path = new Path('abc.def');
            expect(path.getFolder()).toStrictEqual('');
            expect(path.hasFolder()).toBe(false);
            expect(path.isFolder()).toBe(false);
        });
        it('should have "a" folder given "a/bc.def" as path', () => {
            const path = new Path('a/bc.def');
            expect(path.getFolder()).toStrictEqual('a');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(false);
        });
        it('should have "a/.bc" folder given "a/.bc" as path', () => {
            const path = new Path('a/.bc');
            expect(path.getFolder()).toStrictEqual('a/.bc');
            expect(path.hasFolder()).toBe(true);
            expect(path.isFolder()).toBe(true);
        });
    });
    describe('Root', () => {
        it('should have isRootFolder as true given "" as path', () => {
            const path = new Path('');
            expect(path.isRootFolder).toBe(true);
        });
        it('should have isRootFolder as true given " " as path', () => {
            const path = new Path(' ');
            expect(path.isRootFolder).toBe(true);
        });
        it('should have isRootFolder as true given "/" as path', () => {
            const path = new Path('/');
            expect(path.isRootFolder).toBe(true);
        });
        it('should have isRootFolder as false given "abc" as path', () => {
            const path = new Path('abc');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given ".abc" as path', () => {
            const path = new Path('.abc');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "abc/" as path', () => {
            const path = new Path('abc/');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "/abc" as path', () => {
            const path = new Path('/abc');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "abc/def" as path', () => {
            const path = new Path('abc/def');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "a//b///c" as path', () => {
            const path = new Path('a//b///c');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "a.b" as path', () => {
            const path = new Path('a.b');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "a." as path', () => {
            const path = new Path('a.');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "abc.def" as path', () => {
            const path = new Path('abc.def');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "a/bc.def" as path', () => {
            const path = new Path('a/bc.def');
            expect(path.isRootFolder).toBe(false);
        });
        it('should have isRootFolder as false given "a/.bc" as path', () => {
            const path = new Path('a/.bc');
            expect(path.isRootFolder).toBe(false);
        });
    });
    describe('toString()', () => {
        it('should return "" given "" as path', () => {
            const path = new Path('');
            expect(path.toString()).toStrictEqual('');
        });
        it('should return "" given " " as path', () => {
            const path = new Path(' ');
            expect(path.toString()).toStrictEqual('');
        });
        it('should return "" given "/" as path', () => {
            const path = new Path('/');
            expect(path.toString()).toStrictEqual('');
        });
        it('should return "abc" given "abc" as path', () => {
            const path = new Path('abc');
            expect(path.toString()).toStrictEqual('abc');
        });
        it('should return ".abc" given ".abc" as path', () => {
            const path = new Path('.abc');
            expect(path.toString()).toStrictEqual('.abc');
        });
        it('should return "abc" given "abc/" as path', () => {
            const path = new Path('abc/');
            expect(path.toString()).toStrictEqual('abc');
        });
        it('should return "abc" given "/abc" as path', () => {
            const path = new Path('/abc');
            expect(path.toString()).toStrictEqual('abc');
        });
        it('should return "abc/def" given "abc/def" as path', () => {
            const path = new Path('abc/def');
            expect(path.toString()).toStrictEqual('abc/def');
        });
        it('should return "a/b/c" given "a//b///c" as path', () => {
            const path = new Path('a//b///c');
            expect(path.toString()).toStrictEqual('a/b/c');
        });
        it('should return "a.b" given "a.b" as path', () => {
            const path = new Path('a.b');
            expect(path.toString()).toStrictEqual('a.b');
        });
        it('should return "a." given "a." as path', () => {
            const path = new Path('a.');
            expect(path.toString()).toStrictEqual('a.');
        });
        it('should return "abc.def" given "abc.def" as path', () => {
            const path = new Path('abc.def');
            expect(path.toString()).toStrictEqual('abc.def');
        });
        it('should return "a/bc.def" given "a/bc.def" as path', () => {
            const path = new Path('a/bc.def');
            expect(path.toString()).toStrictEqual('a/bc.def');
        });
        it('should return "a/.bc" given "a/.bc" as path', () => {
            const path = new Path('a/.bc');
            expect(path.toString()).toStrictEqual('a/.bc');
        });
    });
});

describe('Sample config', () => {
    it('should return an object', () => {
        expect(getSampleConfig()).toBeTypeOf('object');
    });
});

describe('Variables.replaceInString()', () => {
    it('should return "" given ""', () => {
        expect(Variables.replaceInString('')).toStrictEqual('');
    });
    it('should return "abc" given "abc" as string', () => {
        expect(Variables.replaceInString('abc')).toStrictEqual('abc');
    });
    it('should return "bar" given "var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(Variables, { foo: 'bar' });
        expect(Variables.replaceInString('var(--foo)')).toStrictEqual('bar');
    });
    it('should return "barbar" given "var(--foo)var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(Variables, { foo: 'bar' });
        expect(Variables.replaceInString('var(--foo)var(--foo)')).toStrictEqual('barbar');
    });
    it('should return "bar bar" given "var(--foo) var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(Variables, { foo: 'bar' });
        expect(Variables.replaceInString('var(--foo) var(--foo)')).toStrictEqual('bar bar');
    });
    it('should return "bar" given "var(--foo)" as string, with { foo: "var(--bar), bar: "bar" }', () => {
        Object.assign(Variables, { foo: 'var(--bar)' });
        Object.assign(Variables, { bar: 'bar' });
        expect(Variables.replaceInString('var(--foo)')).toStrictEqual('bar');
    });
    it('should return "Pikachu likes ." given "Pikachu likes var(--pref).", with no "pref" variable', () => {
        expect(Variables.replaceInString('Pikachu likes var(--pref).')).toStrictEqual('Pikachu likes .');
    });
});

describe('Style class', () => {
    it('should have no styles by default', () => {
        const style = new Style();
        expect(style.bold).toBe(false);
        expect(style.italics).toBe(false);
        expect(style.strikethrough).toBe(false);
        expect(style.highlight).toBe(false);
    });
    it('should return "x" with no styles', () => {
        const style = new Style();
        expect(style.apply('x')).toStrictEqual('x');
        expect(Style.applyStyle('x', style)).toStrictEqual('x');
    });
    it('should return "**x**" with only bold', () => {
        const style = new Style().withBold();
        expect(style.apply('x')).toStrictEqual('**x**');
        expect(Style.applyStyle('x', style)).toStrictEqual('**x**');
    });
    it('should return "_x_" with only italics', () => {
        const style = new Style().withItalics();
        expect(style.apply('x')).toStrictEqual('_x_');
        expect(Style.applyStyle('x', style)).toStrictEqual('_x_');
    });
    it('should return "~~x~~" with only strikethrough', () => {
        const style = new Style().withStrikethrough();
        expect(style.apply('x')).toStrictEqual('~~x~~');
        expect(Style.applyStyle('x', style)).toStrictEqual('~~x~~');
    });
    it('should return "==x==" with only highlight', () => {
        const style = new Style().withHighlight();
        expect(style.apply('x')).toStrictEqual('==x==');
        expect(Style.applyStyle('x', style)).toStrictEqual('==x==');
    });
    it('should return "`x`" with only code', () => {
        const style = new Style().withCode();
        expect(style.apply('x')).toStrictEqual('`x`');
        expect(Style.applyStyle('x', style)).toStrictEqual('`x`');
    });
    it('should have bold as true given object with bold=true property', () => {
        const style = new Style({ bold: true });
        expect(style.bold).toBe(true);
    });
    it('should have italics as true given object with italics=true property', () => {
        const style = new Style({ italics: true });
        expect(style.italics).toBe(true);
    });
    it('should have strikethrough as true given object with strikethrough=true property', () => {
        const style = new Style({ strikethrough: true });
        expect(style.strikethrough).toBe(true);
    });
    it('should have highlight as true given object with highlight=true property', () => {
        const style = new Style({ highlight: true });
        expect(style.highlight).toBe(true);
    });
    it('should have code as true given object with code=true property', () => {
        const style = new Style({ code: true });
        expect(style.code).toBe(true);
    });
    describe('Actual count vs applied', () => {
        interface kvObj {
            [key: string]: any
        }
        function generateArrangements(e: any): any[][] {

            const result: any[] = [];
            const helper = (h: any[]) => {
                if (h.length <= e.length) result.push(h);
                for (let i = 0; i < e.length; i++) if (!h.includes(e[i])) helper([...h, e[i]]);
            };
            helper([]);
            return result;
        }

        function getStyleCounts(styles: object): object {

            const result: kvObj = {};
            const namePerms = generateArrangements(Object.keys(styles));

            for (const style of Object.keys(styles)) result[style] = namePerms.reduce((acc, curr) => {
                return acc + curr.filter((sty: string) => sty === style).length;
            }, 0);
            return result;
        }

        function getTextPerms(styles: object): any[] {

            const stylePerms = generateArrangements(Object.values(styles));
            const result = [];
            for (const perm of stylePerms) {
                let str = 'x';
                for (const style of perm) str = style.apply(str);
                result.push(str);
            }
            return result;
        }


        function getRegexCounts(patterns: kvObj, textPerms: any[]) {

            const result: kvObj = Object.keys(patterns).reduce((acc: any, key) => {
                acc[key] = 0;
                return acc;
            }, {});

            textPerms.forEach((str) => {
                Object.keys(patterns).forEach((pat) => {
                    if (str.match(patterns[pat])) result[pat]++;
                });
            });
            return result;
        }

        const styles: kvObj = {
            bold: new Style().withBold(),
            italics: new Style().withItalics(),
            strikethrough: new Style().withStrikethrough(),
            highlight: new Style().withHighlight(),
            code: new Style().withCode()
        };

        const patterns: kvObj = {
            bold: /\*\*.*\*\*/,
            italics: /_.*_/,
            strikethrough: /~~.*~~/,
            highlight: /==.*==/,
            code: /`.*`/
        };

        const styleCounts: kvObj = getStyleCounts(styles);
        const regexCounts: kvObj = getRegexCounts(patterns, getTextPerms(styles));

        for (const style of Object.keys(styles)) test(`${style} regex count should match apply count`, () => {
            expect(regexCounts[style]).toEqual(styleCounts[style]);
        });
    });
});

describe('replaceStringWithBoolean()', () => {
    it('should return true given "true"', () => {
        expect(replaceStringWithBoolean('true')).toStrictEqual(true);
    });
    it('should return false given "false"', () => {
        expect(replaceStringWithBoolean('false')).toStrictEqual(false);
    });
    it('should return same string given variations of "true"', () => {
        expect(replaceStringWithBoolean(' true')).toStrictEqual(' true');
        expect(replaceStringWithBoolean(' true ')).toStrictEqual(' true ');
        expect(replaceStringWithBoolean('true ')).toStrictEqual('true ');
        expect(replaceStringWithBoolean('TRUE')).toStrictEqual('TRUE');
        expect(replaceStringWithBoolean('True')).toStrictEqual('True');
    });
    it('should return same string given variations of "false"', () => {
        expect(replaceStringWithBoolean(' false')).toStrictEqual(' false');
        expect(replaceStringWithBoolean(' false ')).toStrictEqual(' false ');
        expect(replaceStringWithBoolean('false ')).toStrictEqual('false ');
        expect(replaceStringWithBoolean('FALSE')).toStrictEqual('FALSE');
        expect(replaceStringWithBoolean('False')).toStrictEqual('False');
    });
    it('should return "" given ""', () => {
        expect(replaceStringWithBoolean('')).toStrictEqual('');
    });
    it('should return " " given " "', () => {
        expect(replaceStringWithBoolean(' ')).toStrictEqual(' ');
    });
});
