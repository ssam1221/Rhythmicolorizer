const fs = require(`fs`);
const xlsx = require(`xlsx`);

const DIFFICULTY = [`Easy`, `Normal`, `Hard`];

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
    const jsonFile = `${xlsFile}`.replace(`xlsx`, `json`);
    console.log(`Converting [${xlsFile}] to [${jsonFile}]...`);
    const workbook = xlsx.readFile(`./xlsFiles/${xlsFile}`);
    const sheetnames = Object.keys(workbook.Sheets);

    const noteData = {};
    for (const difficulty of sheetnames) {
        if (false === isValidSheet(difficulty)) {
            continue;
        }
        let noteList = xlsx.utils.sheet_to_json(workbook.Sheets[difficulty]);
        noteData[difficulty] = noteList;
    }

    fs.writeFileSync(`./NoteData/${jsonFile}`, JSON.stringify(noteData, null, 4));
}
console.log(`Complete.`);