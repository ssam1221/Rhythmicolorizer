const {
    dir
} = require("console");
const fs = require(`fs`);
const xlsx = require(`xlsx`);

const DIFFICULTY = [`Easy`, `Normal`, `Hard`, `Xtreme`];

const xlsFiles = fs.readdirSync(`./xlsFiles`);

function isValidSheet(sheetName) {
    for (const diff of DIFFICULTY) {
        if (diff === sheetName) {
            return true;
        }
    }
    return false;
}

for (const xlsFile of xlsFiles) {
    if (xlsFile.indexOf(`~`) > -1) {
        continue;
    }
    const jsonFile = `${xlsFile}`.replace(`xlsx`, `json`);
    console.log(`Converting [${xlsFile}] to [${jsonFile}]...`);
    const workbook = xlsx.readFile(`./xlsFiles/${xlsFile}`);
    const sheetnames = Object.keys(workbook.Sheets);

    const noteData = {};
    for (const difficulty of sheetnames) {
        if (false === isValidSheet(difficulty)) {
            continue;
        }
        const CAPITALIZE_DIFFICULITY = difficulty.toUpperCase();
        noteData[CAPITALIZE_DIFFICULITY] = [];
        const noteList = xlsx.utils.sheet_to_json(workbook.Sheets[difficulty]);
        for (const note of noteList) {
            if (!note.key || !note.direction || !note.timestamp) {
                continue;
            }
            let direction = 0;
            switch (note.direction) {
                case `l`:
                    direction = 0;
                    break;
                case `r`:
                    direction = 1;
                    break;
                case `b`:
                    direction = 2;
                    break;
            }

            noteData[CAPITALIZE_DIFFICULITY].push({
                key: note.key,
                direction: direction,
                timestamp: note.timestamp
            });
        }
    }

    fs.writeFileSync(`./NoteData/${jsonFile}`, JSON.stringify(noteData, null, 4));
}

// Copy files to note data
const noteFiles = fs.readdirSync(`./NoteData`);
for (const noteFile of noteFiles) {
    console.log(`Copying [${noteFile}] to [GameSources/data/notes/${noteFile}]...`);
    fs.copyFileSync(`./NoteData/${noteFile}`, `../GameSources/data/notes/${noteFile}`);
}

console.log(`Complete.`);