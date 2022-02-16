import TitleScreenController from "../TitleScreen/TitleScreenController";
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
                case DOMConatiners.MainContainer.TitleScreen:
                    TitleScreenController.onkeyEvent(e);
                    break;
                case DOMConatiners.MainContainer.LoadingScreen:

                    break;
                case DOMConatiners.MainContainer.SelectMusicScreen:
                    BGMSelector.onBGMSelectorKeyPressed(e);
                    break;
                case DOMConatiners.MainContainer.GamePlayScreen:
                    NoteCreator.onkeypress(e);
                    break;
            }
        });
    }
}