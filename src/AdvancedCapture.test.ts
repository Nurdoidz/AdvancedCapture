import { Path, getSampleConfig } from './AdvancedCapture';
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
