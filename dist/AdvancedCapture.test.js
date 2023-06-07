"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdvancedCapture_1 = require("./AdvancedCapture");
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Path', () => {
    (0, vitest_1.describe)('File name', () => {
        (0, vitest_1.it)('should not have file given "" as path', () => {
            const path = new AdvancedCapture_1.Path('');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given " " as path', () => {
            const path = new AdvancedCapture_1.Path(' ');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "/" as path', () => {
            const path = new AdvancedCapture_1.Path('/');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "abc" as path', () => {
            const path = new AdvancedCapture_1.Path('abc');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given ".abc" as path', () => {
            const path = new AdvancedCapture_1.Path('.abc');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "abc/" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "/abc" as path', () => {
            const path = new AdvancedCapture_1.Path('/abc');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "abc/def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/def');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should not have file given "a//b///c" as path', () => {
            const path = new AdvancedCapture_1.Path('a//b///c');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should have "a.b" file given "a.b" as path', () => {
            const path = new AdvancedCapture_1.Path('a.b');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('a.b');
            (0, vitest_1.expect)(path.hasFile()).toBe(true);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('a');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('b');
        });
        (0, vitest_1.it)('should not have file given "a." as path', () => {
            const path = new AdvancedCapture_1.Path('a.');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.it)('should have "abc.def" file given "abc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc.def');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('abc.def');
            (0, vitest_1.expect)(path.hasFile()).toBe(true);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('abc');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('def');
        });
        (0, vitest_1.it)('should have "bc.def" file given "a/bc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('a/bc.def');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('bc.def');
            (0, vitest_1.expect)(path.hasFile()).toBe(true);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('bc');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('def');
        });
        (0, vitest_1.it)('should not have file given "a/.bc" as path', () => {
            const path = new AdvancedCapture_1.Path('a/.bc');
            (0, vitest_1.expect)(path.getFile()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFile()).toBe(false);
            (0, vitest_1.expect)(path.getBasename()).toStrictEqual('');
            (0, vitest_1.expect)(path.getExtension()).toStrictEqual('');
        });
        (0, vitest_1.test)('isFile("doc") should return true given "a.doc" as path', () => {
            const path = new AdvancedCapture_1.Path('a.doc');
            (0, vitest_1.expect)(path.isFile('doc')).toBe(true);
        });
        (0, vitest_1.test)('isFile("doc") should return false given ".doc" as path', () => {
            const path = new AdvancedCapture_1.Path('.doc');
            (0, vitest_1.expect)(path.isFile('doc')).toBe(false);
        });
        (0, vitest_1.test)('isFile("csv") should return false given "a.doc" as path', () => {
            const path = new AdvancedCapture_1.Path('a.doc');
            (0, vitest_1.expect)(path.isFile('csv')).toBe(false);
        });
        (0, vitest_1.test)('isFile(" doc") should return true given "a.doc" as path', () => {
            const path = new AdvancedCapture_1.Path('a.doc');
            (0, vitest_1.expect)(path.isFile(' doc')).toBe(true);
        });
        (0, vitest_1.test)('isFile("doc ") should return true given "a.doc" as path', () => {
            const path = new AdvancedCapture_1.Path('a.doc');
            (0, vitest_1.expect)(path.isFile('doc ')).toBe(true);
        });
        (0, vitest_1.test)('isFile("do c") should return false given "a.doc" as path', () => {
            const path = new AdvancedCapture_1.Path('a.doc');
            (0, vitest_1.expect)(path.isFile('do c')).toBe(false);
        });
    });
    (0, vitest_1.describe)('Folder', () => {
        (0, vitest_1.it)('should not have folder given "" as path', () => {
            const path = new AdvancedCapture_1.Path('');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFolder()).toBe(false);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should not have folder given " " as path', () => {
            const path = new AdvancedCapture_1.Path(' ');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFolder()).toBe(false);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should not have folder given "/" as path', () => {
            const path = new AdvancedCapture_1.Path('/');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFolder()).toBe(false);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have "abc" folder given "abc" as path', () => {
            const path = new AdvancedCapture_1.Path('abc');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('abc');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have ".abc" folder given ".abc" as path', () => {
            const path = new AdvancedCapture_1.Path('.abc');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('.abc');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have "abc" folder given "abc/" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('abc');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have "abc" folder given "/abc" as path', () => {
            const path = new AdvancedCapture_1.Path('/abc');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('abc');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have "abc/def" folder given "abc/def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/def');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('abc/def');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should have "a/b/c" folder given "a//b///c" as path', () => {
            const path = new AdvancedCapture_1.Path('a//b///c');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('a/b/c');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should not have folder given "a.b" as path', () => {
            const path = new AdvancedCapture_1.Path('a.b');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFolder()).toBe(false);
            (0, vitest_1.expect)(path.isFolder()).toBe(false);
        });
        (0, vitest_1.it)('should have "a." folder given "a." as path', () => {
            const path = new AdvancedCapture_1.Path('a.');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('a.');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
        (0, vitest_1.it)('should not have folder given "abc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc.def');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('');
            (0, vitest_1.expect)(path.hasFolder()).toBe(false);
            (0, vitest_1.expect)(path.isFolder()).toBe(false);
        });
        (0, vitest_1.it)('should have "a" folder given "a/bc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('a/bc.def');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('a');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(false);
        });
        (0, vitest_1.it)('should have "a/.bc" folder given "a/.bc" as path', () => {
            const path = new AdvancedCapture_1.Path('a/.bc');
            (0, vitest_1.expect)(path.getFolder()).toStrictEqual('a/.bc');
            (0, vitest_1.expect)(path.hasFolder()).toBe(true);
            (0, vitest_1.expect)(path.isFolder()).toBe(true);
        });
    });
    (0, vitest_1.describe)('Root', () => {
        (0, vitest_1.it)('should have isRootFolder as true given "" as path', () => {
            const path = new AdvancedCapture_1.Path('');
            (0, vitest_1.expect)(path.isRootFolder).toBe(true);
        });
        (0, vitest_1.it)('should have isRootFolder as true given " " as path', () => {
            const path = new AdvancedCapture_1.Path(' ');
            (0, vitest_1.expect)(path.isRootFolder).toBe(true);
        });
        (0, vitest_1.it)('should have isRootFolder as true given "/" as path', () => {
            const path = new AdvancedCapture_1.Path('/');
            (0, vitest_1.expect)(path.isRootFolder).toBe(true);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "abc" as path', () => {
            const path = new AdvancedCapture_1.Path('abc');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given ".abc" as path', () => {
            const path = new AdvancedCapture_1.Path('.abc');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "abc/" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "/abc" as path', () => {
            const path = new AdvancedCapture_1.Path('/abc');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "abc/def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/def');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "a//b///c" as path', () => {
            const path = new AdvancedCapture_1.Path('a//b///c');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "a.b" as path', () => {
            const path = new AdvancedCapture_1.Path('a.b');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "a." as path', () => {
            const path = new AdvancedCapture_1.Path('a.');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "abc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc.def');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "a/bc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('a/bc.def');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
        (0, vitest_1.it)('should have isRootFolder as false given "a/.bc" as path', () => {
            const path = new AdvancedCapture_1.Path('a/.bc');
            (0, vitest_1.expect)(path.isRootFolder).toBe(false);
        });
    });
    (0, vitest_1.describe)('toString()', () => {
        (0, vitest_1.it)('should return "" given "" as path', () => {
            const path = new AdvancedCapture_1.Path('');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('');
        });
        (0, vitest_1.it)('should return "" given " " as path', () => {
            const path = new AdvancedCapture_1.Path(' ');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('');
        });
        (0, vitest_1.it)('should return "" given "/" as path', () => {
            const path = new AdvancedCapture_1.Path('/');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('');
        });
        (0, vitest_1.it)('should return "abc" given "abc" as path', () => {
            const path = new AdvancedCapture_1.Path('abc');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('abc');
        });
        (0, vitest_1.it)('should return ".abc" given ".abc" as path', () => {
            const path = new AdvancedCapture_1.Path('.abc');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('.abc');
        });
        (0, vitest_1.it)('should return "abc" given "abc/" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('abc');
        });
        (0, vitest_1.it)('should return "abc" given "/abc" as path', () => {
            const path = new AdvancedCapture_1.Path('/abc');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('abc');
        });
        (0, vitest_1.it)('should return "abc/def" given "abc/def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc/def');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('abc/def');
        });
        (0, vitest_1.it)('should return "a/b/c" given "a//b///c" as path', () => {
            const path = new AdvancedCapture_1.Path('a//b///c');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('a/b/c');
        });
        (0, vitest_1.it)('should return "a.b" given "a.b" as path', () => {
            const path = new AdvancedCapture_1.Path('a.b');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('a.b');
        });
        (0, vitest_1.it)('should return "a." given "a." as path', () => {
            const path = new AdvancedCapture_1.Path('a.');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('a.');
        });
        (0, vitest_1.it)('should return "abc.def" given "abc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('abc.def');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('abc.def');
        });
        (0, vitest_1.it)('should return "a/bc.def" given "a/bc.def" as path', () => {
            const path = new AdvancedCapture_1.Path('a/bc.def');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('a/bc.def');
        });
        (0, vitest_1.it)('should return "a/.bc" given "a/.bc" as path', () => {
            const path = new AdvancedCapture_1.Path('a/.bc');
            (0, vitest_1.expect)(path.toString()).toStrictEqual('a/.bc');
        });
    });
});
(0, vitest_1.describe)('Sample config', () => {
    (0, vitest_1.it)('should return an object', () => {
        (0, vitest_1.expect)((0, AdvancedCapture_1.getSampleConfig)()).toBeTypeOf('object');
    });
});
(0, vitest_1.describe)('Variables.replaceInString()', () => {
    (0, vitest_1.it)('should return "" given ""', () => {
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('')).toStrictEqual('');
    });
    (0, vitest_1.it)('should return "abc" given "abc" as string', () => {
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('abc')).toStrictEqual('abc');
    });
    (0, vitest_1.it)('should return "bar" given "var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(AdvancedCapture_1.Variables, { foo: 'bar' });
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('var(--foo)')).toStrictEqual('bar');
    });
    (0, vitest_1.it)('should return "barbar" given "var(--foo)var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(AdvancedCapture_1.Variables, { foo: 'bar' });
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('var(--foo)var(--foo)')).toStrictEqual('barbar');
    });
    (0, vitest_1.it)('should return "bar bar" given "var(--foo) var(--foo)" as string, with { foo: "bar" }', () => {
        Object.assign(AdvancedCapture_1.Variables, { foo: 'bar' });
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('var(--foo) var(--foo)')).toStrictEqual('bar bar');
    });
    (0, vitest_1.it)('should return "bar" given "var(--foo)" as string, with { foo: "var(--bar), bar: "bar" }', () => {
        Object.assign(AdvancedCapture_1.Variables, { foo: 'var(--bar)' });
        Object.assign(AdvancedCapture_1.Variables, { bar: 'bar' });
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('var(--foo)')).toStrictEqual('bar');
    });
    (0, vitest_1.it)('should return "Pikachu likes ." given "Pikachu likes var(--pref).", with no "pref" variable', () => {
        (0, vitest_1.expect)(AdvancedCapture_1.Variables.replaceInString('Pikachu likes var(--pref).')).toStrictEqual('Pikachu likes .');
    });
});
(0, vitest_1.describe)('Style class', () => {
    (0, vitest_1.it)('should have no styles by default', () => {
        const style = new AdvancedCapture_1.Style();
        (0, vitest_1.expect)(style.bold).toBe(false);
        (0, vitest_1.expect)(style.italics).toBe(false);
        (0, vitest_1.expect)(style.strikethrough).toBe(false);
        (0, vitest_1.expect)(style.highlight).toBe(false);
    });
    (0, vitest_1.it)('should return "x" with no styles', () => {
        const style = new AdvancedCapture_1.Style();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('x');
    });
    (0, vitest_1.it)('should return "**x**" with only bold', () => {
        const style = new AdvancedCapture_1.Style().withBold();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('**x**');
    });
    (0, vitest_1.it)('should return "_x_" with only italics', () => {
        const style = new AdvancedCapture_1.Style().withItalics();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('_x_');
    });
    (0, vitest_1.it)('should return "~~x~~" with only strikethrough', () => {
        const style = new AdvancedCapture_1.Style().withStrikethrough();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('~~x~~');
    });
    (0, vitest_1.it)('should return "==x==" with only highlight', () => {
        const style = new AdvancedCapture_1.Style().withHighlight();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('==x==');
    });
    (0, vitest_1.it)('should return "`x`" with only code', () => {
        const style = new AdvancedCapture_1.Style().withCode();
        (0, vitest_1.expect)(style.apply('x')).toStrictEqual('`x`');
    });
    (0, vitest_1.it)('should have bold as true given object with bold=true property', () => {
        const style = new AdvancedCapture_1.Style({ bold: true });
        (0, vitest_1.expect)(style.bold).toBe(true);
    });
    (0, vitest_1.it)('should have italics as true given object with italics=true property', () => {
        const style = new AdvancedCapture_1.Style({ italics: true });
        (0, vitest_1.expect)(style.italics).toBe(true);
    });
    (0, vitest_1.it)('should have strikethrough as true given object with strikethrough=true property', () => {
        const style = new AdvancedCapture_1.Style({ strikethrough: true });
        (0, vitest_1.expect)(style.strikethrough).toBe(true);
    });
    (0, vitest_1.it)('should have highlight as true given object with highlight=true property', () => {
        const style = new AdvancedCapture_1.Style({ highlight: true });
        (0, vitest_1.expect)(style.highlight).toBe(true);
    });
    (0, vitest_1.it)('should have code as true given object with code=true property', () => {
        const style = new AdvancedCapture_1.Style({ code: true });
        (0, vitest_1.expect)(style.code).toBe(true);
    });
    (0, vitest_1.describe)('Actual count vs applied', () => {
        function generateArrangements(e) {
            const result = [];
            const helper = (h) => {
                if (h.length <= e.length)
                    result.push(h);
                for (let i = 0; i < e.length; i++)
                    if (!h.includes(e[i]))
                        helper([...h, e[i]]);
            };
            helper([]);
            return result;
        }
        function getStyleCounts(styles) {
            const result = {};
            const namePerms = generateArrangements(Object.keys(styles));
            for (const style of Object.keys(styles))
                result[style] = namePerms.reduce((acc, curr) => {
                    return acc + curr.filter((sty) => sty === style).length;
                }, 0);
            return result;
        }
        function getTextPerms(styles) {
            const stylePerms = generateArrangements(Object.values(styles));
            const result = [];
            for (const perm of stylePerms) {
                let str = 'x';
                for (const style of perm)
                    str = style.apply(str);
                result.push(str);
            }
            return result;
        }
        function getRegexCounts(patterns, textPerms) {
            const result = Object.keys(patterns).reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {});
            textPerms.forEach((str) => {
                Object.keys(patterns).forEach((pat) => {
                    if (str.match(patterns[pat]))
                        result[pat]++;
                });
            });
            return result;
        }
        const styles = {
            bold: new AdvancedCapture_1.Style().withBold(),
            italics: new AdvancedCapture_1.Style().withItalics(),
            strikethrough: new AdvancedCapture_1.Style().withStrikethrough(),
            highlight: new AdvancedCapture_1.Style().withHighlight(),
            code: new AdvancedCapture_1.Style().withCode()
        };
        const patterns = {
            bold: /\*\*.*\*\*/,
            italics: /_.*_/,
            strikethrough: /~~.*~~/,
            highlight: /==.*==/,
            code: /`.*`/
        };
        const styleCounts = getStyleCounts(styles);
        const regexCounts = getRegexCounts(patterns, getTextPerms(styles));
        for (const style of Object.keys(styles))
            (0, vitest_1.test)(`${styles[style]} regex count should match apply count`, () => {
                (0, vitest_1.expect)(regexCounts[style]).toEqual(styleCounts[style]);
            });
    });
});
