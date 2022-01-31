import Debug from "./Debug";
import BGMPlayer from "./BGMPlayer";
import BGMSelector from "./BGMSelector";
import KeyboardEventListener from "./KeyboardEventListener";
import NoteCreator from "./NoteCreator";
// import LoadingController from "./LoadingController";

(() => {
    window.onload = async () => {

        const debug = new Debug({
            filename: `MainPlayer`
        });
        debug.log(`Start`);

        await BGMPlayer.initialize();
        await BGMSelector.initialize();
        NoteCreator.initialize();
        // document.getElementById("test").src = BGMPlayer.getCoverImage("Night Beach Memories");


        debug.log(BGMSelector.getBGMListInfo());

        KeyboardEventListener.setCurrentMode("GamePlaying");
        // KeyboardEventListener.setCurrentMode("SelectBGM");
        KeyboardEventListener.addKeyboardEventListener();

        // Test
        // const bgmReady = awiat BGMPlayer

        document.onclick = async () => {
            const player = await BGMPlayer.setVideo(`두근두근! 드디어!! 대모험 시작!!!`);
            player.play();
        }

        NoteCreator.start();
    };
})();