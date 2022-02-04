import BGMPlayer from "./GamePlayScreen/BGMPlayer";
import NoteCreator from "./GamePlayScreen/NoteCreator";

export default class GamePlayScreenController {

    static startGameByTitle(title, difficulty) {
        BGMPlayer.setVideo(title, ({
            status,
            payload
        }) => {
            if (status === `GameReady`) {
                NoteCreator.start(title, difficulty);
                payload.play();
            } else if (status === `GameCompleted`) {}
        });
    }
}