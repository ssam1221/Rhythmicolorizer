import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import NoteCreator from "./GamePlayScreen/NoteCreator";

export default class GamePlayScreenController {

    static startGameByTitle(title) {
        const player = BGMPlayer.setVideo(title, ({
            status,
            payload
        }) => {
            if (status === `GameReady`) {
                NoteCreator.start();
                payload.play();
            } else if (status === `GameCompleted`) {}
        });
    }
}