import BGMSelector from "../SelectBGMScreen/BGMSelector";
import DOMConatiners from "./DOMConatiners";
import NoteCreator from "../GamePlayScreen/NoteCreator";

export default class KeyboardEventListener {
    static addKeyboardEventListener() {
        document.addEventListener(`keydown`, (e) => {
            // console.log(`addKeyboardEventListener : `, e)

            switch (DOMConatiners.getCurrentMainContainerName()) {
                case ``:

                    break;
                case `MainMenu`:
                    break;
                case `Loading`:

                    break;
                case `SelectMusicScreen`:
                    BGMSelector.onBGMSelectorKeyPressed(e);
                    break;
                case `GamePlayScreen`:
                    NoteCreator.onkeypress(e);
                    break;
            }
        });
    }
}