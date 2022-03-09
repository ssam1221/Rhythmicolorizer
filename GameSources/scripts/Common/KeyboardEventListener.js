import TitleScreenController from "../TitleScreen/TitleScreenController";
import BGMSelector from "../SelectBGMScreen/BGMSelector";
import DOMConatiners from "./DOMConatiners";
import GamePlayController from "../GamePlayScreen/GamePlayController";
import NoteRenderController from "../GamePlayScreen/NoteRenderController";

export default class KeyboardEventListener {

    static addKeyboardEventListener() {
        document.addEventListener(`keydown`, (e) => {
            // console.log(`addKeyboardEventListener : `, e)
            window.parent.keyPressHandler({
                event: `keydown`,
                key: e.key
            });
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
                    // Do not allow long press
                    if (!e.repeat) {
                        GamePlayController.onkeypress(e);
                    }
                    break;
            }
        });

        document.addEventListener(`keyup`, (e) => {
            // console.log(`addKeyboardEventListener : `, e)
            window.parent.keyPressHandler({
                event: `keyup`,
                key: e.key
            });

            switch (DOMConatiners.getCurrentMainContainerName()) {
                case ``:
                    break;
                    // case DOMConatiners.MainContainer.TitleScreen:
                    //     TitleScreenController.onkeyEvent(e);
                    //     break;
                    // case DOMConatiners.MainContainer.LoadingScreen:

                    //     break;
                    // case DOMConatiners.MainContainer.SelectMusicScreen:
                    //     BGMSelector.onBGMSelectorKeyPressed(e);
                    //     break;
                case DOMConatiners.MainContainer.GamePlayScreen:
                    GamePlayController.onkeyup(e);
                    break;
            }
        });
    }
}