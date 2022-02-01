import Debug from "./Debug";
import BGMDatabase from "./BGMDatabase";

const debug = new Debug({
    filename: `BGMSelector`
})

export default class BGMSelector {

    static selectedIdx = 0;
    static BGMData = {};

    static async initialize() {
        debug.log(`Initializing...`);
        this.BGMData = await (await fetch(`data/BGMList.json`)).json();

        for (const title in this.BGMData) {
            this.BGMData[title].coverImage = BGMDatabase.getCoverImage(title);
        }

    }

    static getBGMListInfo() {
        return this.BGMData;
    }

    static onBGMSelected(e) {
        // debug.log(e)

        if (e.key === `ArrowLeft`) {
            this.selectedIdx = (this.BGMData.length + this.selectedIdx - 1) % this.BGMData.length;
            debug.log(`Selected title : [${this.selectedIdx}] ${this.BGMData[this.selectedIdx].title}`);
        } else if (e.key === `ArrowRight`) {
            this.selectedIdx = (this.selectedIdx + 1) % this.BGMData.length;
            debug.log(`Selected title : [${this.selectedIdx}] ${this.BGMData[this.selectedIdx].title}`);
        } else if ((e.key === `Enter`) || (e.key === ` `)) {
            debug.log(`Selected`);
        }
    }
}