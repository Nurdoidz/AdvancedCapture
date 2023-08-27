import { info, Path, replaceInString, warn, ensureFolderExists } from 'Common';

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

let Obsidian: any;
let QuickAdd: any;

async function noteExport(quickAdd: any, settings: any): Promise<void> {

    info('Starting');

    Obsidian = quickAdd.app;
    QuickAdd = quickAdd.quickAddApi;
    const VAR = quickAdd.variables;

    if (!('markdownExport' in VAR)) {
        throw new Error('Missing markdownExport in global variables');
    }

    const PATH = new Path(replaceInString(VAR, settings[NOTE_PATH]));
    if (!PATH.isFile()) throw new Error(`${PATH} is not a file`);

    let file = Obsidian.vault.getAbstractFileByPath(PATH);
    if (!file) {
        if (!settings[CREATE_NOTE]) throw new Error(`${PATH} does not exist`);
        warn('Note not found; trying to create', { Path: PATH });
        await ensureFolderExists(PATH, Obsidian.vault);
        file = await Obsidian.vault.create(PATH.toString(), '');
        info('Note file successfully created', { Path: PATH });
    }

    const lines: string[] = (await Obsidian.vault.read(file)).split('\n');
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
    if (settings[FILE_PADDING] === '') pad(lines, 0, 1);
    else if (!reMatchNumCommaNum.test(settings[FILE_PADDING])) {
        throw new Error(`${settings[FILE_PADDING]} is not valid syntax for file padding`);
    }
    else {
        pad(lines, settings[FILE_PADDING].match(reMatchNumCommaNum)[1],
            settings[FILE_PADDING].match(reMatchNumCommaNum)[2]);
    }
    Obsidian.vault.modify(file, lines.join('\n'));
    info('Note successfully updated with export', { Path: PATH, Line: VAR.markdownExport });
}

function pad(arr: string[], top: number, bottom: number | undefined): string[] {

    if (arr.length === 0) throw new Error('Cannot pad an empty array');
    if (!(top >= 0)) throw new Error('Top padding must be >= 0');
    if (bottom === undefined) bottom = top;
    else if (!(bottom >= 0)) throw new Error('Bottom padding must be >= 0');

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
