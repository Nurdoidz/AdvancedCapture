/*
 * AdvancedCapture CSV export for QuickAdd by Nurdoidz
 *
 * Version UNRELEASED
 * https://github.com/Nurdoidz/AdvancedCapture
 *
 * ------------------------------------------------------------------------- */

import { info, Path, replaceInString, warn, ensureFolderExists } from 'Common';

const CSV_PATH = 'Path to CSV file';

module.exports = {

    entry: csv,
    settings: {
        name: 'AdvancedCaptureCSV',
        author: 'Nurdoidz',
        options: {
            [CSV_PATH]: {
                type: 'text',
                defaultValue: 'Scripts/QuickAdd/AdvancedCapture/Export.csv',
                placeholder: 'path/to/export.csv'
            }
        }
    }
};

async function csv(quickAdd: any, settings: any): Promise<void> {

    info('Starting CSV export');

    const Obsidian = quickAdd.app;
    const variables: { csvKeyExport: string, csvValueExport: string } = quickAdd.variables;

    if (!('csvKeyExport' in variables) || !('csvValueExport' in variables)) {
        throw new Error('Missing csvExport in global variables');
    }

    const path = new Path(replaceInString(variables, settings[CSV_PATH]));
    if (!path.isFile()) throw new Error('Path is not a file');

    let file = Obsidian.vault.getAbstractFileByPath(path);
    if (!file) {
        warn('CSV file not found; trying to create', { Path: path });
        await ensureFolderExists(path, Obsidian.vault);
        file = await Obsidian.vault.create(
            path.toString(), `${variables.csvKeyExport}\n${variables.csvValueExport}\n`
        );
        info('CSV file successfully created with export',
            { Path: path, Header: variables.csvKeyExport, Row: variables.csvValueExport });
    }
    else {
        let contents: string = await Obsidian.vault.read(file);
        if (!contents.endsWith('\n')) contents += '\n';
        contents += `${variables.csvValueExport}\n`;
        Obsidian.vault.modify(file, contents);
        info('CSV file successfully updated with export',
            { Path: path, Row: variables.csvValueExport });
    }

    info('Stopping CSV export');
}
