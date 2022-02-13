import BGMSelector from "../SelectBGMScreen/BGMSelector";
import NoteCreator from "../GamePlayScreen/NoteCreator";

export default class KeyboardEventListener {


    static _currentMode = ``;


    static get getCurrentMode() {
        return this._currentMode;
    }

    static setCurrentMode(curMode) {
        this._currentMode = curMode;
    }

    static addKeyboardEventListener() {
        document.addEventListener(`keydown`, (e) => {
            // console.log(`addKeyboardEventListener : `, e)

            switch (this._currentMode) {
                case ``:

                    break;
                case `MainMenu`:
                    break;
                case `Loading`:

                    break;
                case `SelectBGM`:
                    BGMSelector.onBGMSelected(e);
                    break;
                case `GamePlaying`:
                    NoteCreator.onkeypress(e);
                    break;
            }
        });
    }
}