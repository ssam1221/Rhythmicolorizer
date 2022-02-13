import Debug from "./Common/Debug";
import BGMDatabase from "./BGMDatabase";
import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import BGMSelector from "./SelectBGMScreen/BGMSelector";
import DOMConatiners from "./Common/DOMConatiners"
import KeyboardEventListener from "./Common/KeyboardEventListener";
import NoteCreator from "./GamePlayScreen/NoteCreator";
import SFXPlayer from "./Common/SFXPlayer";

import GamePlayScreenController from "./GamePlayScreenController"
// import LoadingController from "./LoadingController";
(() => {
    window.onload = async () => {
        Debug.setDebugMode(`debug`);
        const debug = new Debug({
            filename: `MainPlayer`
        });
        debug.log(`Start`);
        DOMConatiners.initialize();
        SFXPlayer.initialize();
        await BGMDatabase.initialize();
        await BGMSelector.initialize();
        // await BGMPlayer.initialize();
        // NoteCreator.initialize();
        // document.getElementById("test").src = BGMPlayer.getCoverImage("Night Beach Memories");


        // debug.log(BGMSelector.getBGMListInfo());

        KeyboardEventListener.setCurrentMode("SelectBGM");
        // KeyboardEventListener.setCurrentMode("SelectBGM");
        KeyboardEventListener.addKeyboardEventListener();

        // const bgmReady = awiat BGMPlayer
        document.oncontextmenu = (event) => {
            debug.log(`Right click`);
            event.preventDefault();
        };

        BGMSelector.show();


        // Game Play Test
        // document.onclick = async (e) => {
        //     GamePlayScreenController.startGameByTitle(`두근두근! 드디어!! 대모험 시작!!!`, NoteCreator.Difficulty.HARD);
        // }

    };
})();