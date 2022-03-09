import Debug from "./Common/Debug";
import BGMDatabase from "./BGMDatabase";
import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import BGMSelector from "./SelectBGMScreen/BGMSelector";
import DOMConatiners from "./Common/DOMConatiners"
import KeyboardEventListener from "./Common/KeyboardEventListener";
import NoteRenderController from "./GamePlayScreen/NoteRenderController";
import SFXPlayer from "./Common/SFXPlayer";
import LoadingController from "./Common/LoadingController"
import TitleScreenController from "./TitleScreen/TitleScreenController"
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
        // DOMConatiners.showMainContainer(DOMConatiners.MainContainer.LoadingScreen);
        LoadingController.showInitialLoading();
        SFXPlayer.initialize();
        await BGMDatabase.initialize();
        await BGMSelector.initialize();
        await BGMPlayer.initialize();
        NoteRenderController.initialize();
        // document.getElementById("test").src = BGMPlayer.getCoverImage("Night Beach Memories");


        // debug.log(BGMSelector.getBGMListInfo());

        // KeyboardEventListener.setCurrentMode("SelectBGM");
        // KeyboardEventListener.setCurrentMode("SelectBGM");
        KeyboardEventListener.addKeyboardEventListener();

        // const bgmReady = awiat BGMPlayer


        // Disable mouse left click
        document.onclick = (event) => {
            event.preventDefault();
        }

        // Disable mouse right click
        document.oncontextmenu = (event) => {
            event.preventDefault();
        };
        
        // Test & to load all images, delay 3 seconds
        // await (() => {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(resolve, 2000);
        //     })
        // })();

        LoadingController.hideInitialLoading();
        // await TitleScreenController.initialize();

        // DOMConatiners.showMainContainer(DOMConatiners.MainContainer.TitleScreen);

        // Test
        // BGMSelector.playBGMPreview();
        // DOMConatiners.showMainContainer(DOMConatiners.MainContainer.SelectMusicScreen);

        // Game Play Test

        // Game Play Test
        // DOMConatiners.showMainContainer(DOMConatiners.MainContainer.TitleScreen);
        DOMConatiners.showMainContainer(DOMConatiners.MainContainer.GamePlayScreen);
        let clicked = false;
        document.onclick = async (e) => {
            if (clicked === false) {
                clicked = true;
                // GamePlayScreenController.startGameByTitle(`두근두근! 드디어!! 대모험 시작!!!`, NoteRenderController.Difficulty.HARD);
                GamePlayScreenController.startGameByTitle(`아기 알파카는 오늘도 꿈을 꾸고 있어요`, NoteRenderController.Difficulty.NORMAL);
            }
        }
    };
})();