import Debug from "./Debug";
import BGMDatabase from "./BGMDatabase";
import BGMPlayer from "./BGMPlayer";
import BGMSelector from "./BGMSelector";
import KeyboardEventListener from "./KeyboardEventListener";
import NoteCreator from "./NoteCreator";
import SFXPlayer from "./SFXPlayer";
// import LoadingController from "./LoadingController";
(() => {
    window.onload = async () => {
        Debug.setDebugMode(`debug`);
        const debug = new Debug({
            filename: `MainPlayer`
        });
        debug.log(`Start`);
        SFXPlayer.initialize();
        await BGMDatabase.initialize();
        await BGMSelector.initialize();
        await BGMPlayer.initialize();
        NoteCreator.initialize();
        // document.getElementById("test").src = BGMPlayer.getCoverImage("Night Beach Memories");


        debug.log(BGMSelector.getBGMListInfo());

        KeyboardEventListener.setCurrentMode("GamePlaying");
        // KeyboardEventListener.setCurrentMode("SelectBGM");
        KeyboardEventListener.addKeyboardEventListener();

        // Test
        // const bgmReady = awiat BGMPlayer
        document.oncontextmenu = (event) => {
            debug.log(`Right click`);
            event.preventDefault();
        };
        document.onclick = async (e) => {
            console.log(e)
            const player = await BGMPlayer.setVideo(`두근두근! 드디어!! 대모험 시작!!!`);
            NoteCreator.start();
            player.play();
        }

    };
})();