/*
 * AdvancedCapture for QuickAdd by Nurdoidz
 *
 * Version UNRELEASED
 * https://github.com/Nurdoidz/AdvancedCapture
 *
 * ------------------------------------------------------------------------- */

import { replaceInString, Path, Input, info, Config, ensureFolderExists, warn,
    SampleConfig, parseJsonToConfig, Categories, QaVariables, Field, Fields,
    replaceRecursively, error, DefaultConfig, Fieldable, ConfigExportable, Processable } from 'Common';

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
    // TODO: Add an opt-in setting for enabling input processing (eval).
};

let Obsidian: any;
let QuickAdd: any;

async function capture(quickAdd: any, settings: any): Promise<void> {

    info('Starting capture');

    Obsidian = quickAdd.app;
    QuickAdd = quickAdd.quickAddApi;

    const config = await getConfig(
        new Path(replaceInString(quickAdd.variables, settings[CONFIG_PATH])));
    quickAdd.variables = Object.assign(<object>config.variables, quickAdd.variables);
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
        input.addField(await promptField(category.fields![i], variables));
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

async function getConfig(path: Path): Promise<Config> {

    info('Looking for config file', { Path: path });
    if (!path.isFile('json')) throw new Error('Path to config is not a json file');

    let file = Obsidian.vault.getAbstractFileByPath(path);
    if (!file) {
        warn('No config found', { Path: path });
        info('Creating sample config', { Path: path });
        await ensureFolderExists(path, Obsidian.vault);
        const sample = new SampleConfig();
        file = await Obsidian.vault.create(path.toString(), JSON.stringify(sample, null, 4));
        if (!file) throw new Error('Failed to create sample config');
        info('Created sample config', { Path: path, Config: sample });
    }
    info('Config found', { Path: path });

    info('Reading config', { Path: path });
    const content = await Obsidian.vault.read(file);

    return new DefaultConfig(parseJsonToConfig(content));
}

// eslint-disable-next-line max-len
async function promptCategory(cats: Categories | undefined, vars: QaVariables): Promise<string | undefined> {

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
        if (categories[item].icon) l[i] = `${categories[item].icon} ${item}`;
    });
    info('Prompting for category', { List: display });
    return await QuickAdd.suggester(display, actual);
}

async function promptField(field: Fieldable, vars: QaVariables): Promise<Field | undefined> {

    field = Object.assign(new Fields(), field);
    field = replaceRecursively(vars, field);
    field.name = field.name.replace(/[,]/g, '');

    let input: string;
    let file;
    let path;
    info('Prompting for input', { Field: field });
    switch (field.prompt) {
    case 'wideInputPrompt':
    case 'inputPrompt': // TODO: Add '(Required)' to prompt
        if (field.prompt === 'wideInputPrompt') input = await QuickAdd.wideInputPrompt(field.name);
        else input = await QuickAdd.inputPrompt(field.name);
        input = replaceInString(vars, input);
        if (!input) {
            if (field.required === true) throw new Error('No input received for required field');
            input = '';
        }
        break;
    case 'yesNoPrompt':
        input = await QuickAdd.yesNoPrompt(field.name);
        if (typeof input !== 'boolean') {
            if (field.required === true) throw new Error('No input received for required field');
            input = 'false';
        }
        input = input.toString();
        break;
    case 'suggester':
        path = new Path(replaceInString(vars, field.listPath));
        file = Obsidian.vault.getAbstractFileByPath(path);
        if (!file) {
            info('File for list not found; trying to create',
                { Path: path, Field: field.name });
            await ensureFolderExists(path, Obsidian.vault);
            file = await Obsidian.vault.create(path.toString(), '');
            if (!file) {
                error('Failed to create file for list',
                    { Path: path, Field: field.name });
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
                content.split('\n').forEach((line: string) => {
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
                    if (icon) icon = icon.replace(/\s/g, '');
                    if (!icon) warn('Invalid icon', { Icon: icon });
                }
                if (field.hasIcons === !!icon) {
                    const name = (await QuickAdd.inputPrompt(`Name for new ${field.name}`)).trim();
                    if (name) {
                        content += `${(icon ? `${icon} ` : '') + name}\n`;
                        Obsidian.vault.modify(file, content);
                        info('Added new item', { Path: field.listPath, Icon: icon, Name: name });
                    }
                    else warn('Invalid item name', { Name: name });
                }
            }
        }
        while (input === '!add');

        if (!input) {
            if (field.required === true) throw new Error('No input received for required field');
            input = '';
        }
        break;
    default:
        error('Unsupported prompt type', { Prompt: field.prompt, Field: field.name });
        throw new Error('Unsupported prompt type');
    }

    if (input) info('Captured input for field', { Field: field.name, Input: input });
    else info('No input captured for field', { Field: field.name });

    if (field.variable.length > 0) vars[field.variable] = input;

    return new Field(input, field.export, field.name, field.process);
}

async function promptComment(
    vars: QaVariables, config: ConfigExportable | undefined, process: Processable | undefined): Promise<Field> {

    info('Prompting for comment');
    return new Field(
        replaceInString(vars, await QuickAdd.inputPrompt('Comment')), config, 'Comment', process);
}
