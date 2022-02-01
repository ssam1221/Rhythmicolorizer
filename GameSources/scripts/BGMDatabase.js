import Debug from "./Debug";

const debug = new Debug({
    filename: `BGMDatabase`
});

export default class BGMDatabase {

    static BGMDataList = {};

    static player;

    static async initialize() {
        try {
            debug.log(`Initializing...`);
            this.BGMDataList = await (await fetch(`data/BGMList.json`)).json();
            // debug.log(this.BGMDataList)

            for (let idx = 0; idx < this.BGMDataList.length; idx++) {
                const BGMData = this.BGMDataList[idx];
                this.BGMDataList[idx].coverImage = this.getCoverImage(BGMData.title);
                const noteList = await (await fetch(`data/notes/${BGMData.title}.json`)).json();
                this.BGMDataList[idx].data.noteList = noteList;
                // debug.log(noteList);
                debug.log(`Loading [${BGMData.title}]...`)
            }
            debug.log(`BGM Data : `, this.BGMDataList);
        } catch (err) {
            debug.error(err);
        }
    }

    static getCoverImage(title) {
        return `data/coverImages/${title}.png`;
    }

    static getDataByTitle(title) {
        for (const bgm of this.BGMDataList) {
            if (bgm.title === title) {
                return bgm;
            }
        }
        return null;
    }

    static getDataByIndex(idx) {
        return this.BGMDataList[idx];
    }
}