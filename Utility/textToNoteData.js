const fs = require(`fs`);


const textFiles = fs.readdirSync(`./textFiles`);

for (const textFile of textFiles) {

    const fileData = fs.readFileSync(`./textFiles/${textFile}`).toString();
    let noteData = ``;

    for (let i = 0; i < fileData.length; i++) {
        if ((fileData[i] === `\n`) || ((fileData[i] === ` `))) {
            continue
        };
        noteData += `${fileData[i]}\n`;
    }


    fs.writeFileSync(`./result_${textFile}`, noteData);
}

console.log(`Complete.`);