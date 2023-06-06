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
