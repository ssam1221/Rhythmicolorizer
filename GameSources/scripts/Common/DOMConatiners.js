/**
 * @class DOMContainers
 * @description All DOM div elements are initialized from this code
 */

import Debug from "./Debug";

const debug = new Debug({
    filename: `DOMConatinerController`
})

export default class DOMConatiners {

    static currentDisplayingContainer = null;

    static MainContainer = {
        TitleScreen: `TitleScreen`,
        LoadingScreen: `LoadingScreen`,
        SelectMusicScreen: `SelectMusicScreen`,
        GamePlayScreen: `GamePlayScreen`
    }

    static Containers = {
        FadeOverlay: null,
        Main: {
            LoadingScreen: null,
            GamePlayScreen: null,
            SelectMusicScreen: null,
        },
        TitleScreenContainer: {
            YoutubePlayer: null,
        },
        LoadingScreenContainer: {
            InitialLoading: null,
            PlayLoading: null,
            InitialLoadingTips: null,
        },
        SelectMusicScreenContainer: {
            CoverImageContainer: null,
            CoverImages: null,
            SelectedMusicInfoContainer: null,
            SelectMusicScreen_SelectedMusicInfo: null,
            BGMSelected: null,
        },
        GamePlayScreenContainer: {
            ComboCount: null,
            GameScore: null,
            Difficulty: null,
            GetReadyText: null,
            keynotesContainerBackground: null,
            pressedkeynotesContainer: null,
            keynotesContainerContainer: null,
            keynotesContainers: null,
            keynoteCheckerContainer: null,
            keynoteCheckers: null,
            pointDisplayContainer: null,
            BGMPreviewPlayer: null,
        }
    }

    static initialize() {
        debug.log(`Initialize...`);
        this.Containers.FadeOverlay = document.getElementById(`FadeOverlay`);
        for (const mainContainerName in this.MainContainer) {
            this.Containers.Main[mainContainerName] = document.getElementById(mainContainerName);
        }
        this.Containers.TitleScreenContainer.YoutubePlayerContainer = document.getElementById(`TitleScreenYoutubeVideoContainer`);
        this.Containers.LoadingScreenContainer.InitialLoading = document.getElementById(`InitialLoading`);
        this.Containers.LoadingScreenContainer.PlayLoading = document.getElementById(`PlayLoading`);
        this.Containers.LoadingScreenContainer.InitialLoadingTips = document.getElementById(`InitialLoadingTips`);

        this.Containers.GamePlayScreenContainer.ComboCount = document.getElementById(`ComboCount`);
        this.Containers.GamePlayScreenContainer.GameScore = document.getElementById(`GameScore`);
        this.Containers.GamePlayScreenContainer.Difficulty = document.getElementById(`Difficulty`);
        this.Containers.GamePlayScreenContainer.GetReadyText = document.getElementById(`getReadyText`);
        this.Containers.GamePlayScreenContainer.keynotesContainerBackground = document.getElementById(`keynotesContainerBackground`);
        this.Containers.GamePlayScreenContainer.pressedkeynotesContainer = document.getElementById(`keynotePressedContainer`);
        this.Containers.GamePlayScreenContainer.keynotesContainerContainer = document.getElementById(`keynotesContainer`);
        this.Containers.GamePlayScreenContainer.keynotesContainers = document.getElementsByClassName(`keynotesContainer`);
        this.Containers.GamePlayScreenContainer.keynoteCheckerContainer = document.getElementById(`keynoteChecker`);
        this.Containers.GamePlayScreenContainer.keynoteCheckers = document.getElementsByClassName(`keynoteChecker`);
        this.Containers.GamePlayScreenContainer.pointDisplayContainer = document.getElementById(`pointDisplay`);

        this.Containers.SelectMusicScreenContainer.BGMPreviewPlayer = document.getElementById(`BGMPreviewPlayer`);
        this.Containers.SelectMusicScreenContainer.CoverImageContainer = document.getElementById(`SelectMusicScreen_CoverImageContainer`);
        this.Containers.SelectMusicScreenContainer.SelectedMusicInfoContainer = document.getElementById(`SelectMusicScreen_SelectedMusicInfo`);
        this.Containers.SelectMusicScreenContainer.BGMSelected = document.getElementById(`BGMSelected`);
    }


    static get() {
        return this.Containers;
    }

    static getCurrentMainContainerName() {
        return this.currentDisplayingContainer;
    }

    static hideAll() {
        for (const _container in this.Containers.Main) {
            this.Containers.Main[_container].style.display = `none`;
        }
    }

    static showMainContainer(containerName) {
        debug.log(`Show Main container : `, containerName);
        if (containerName in this.Containers.Main === true) {
            this.currentDisplayingContainer = containerName;
            for (const _container in this.Containers.Main) {
                this.Containers.Main[_container].style.display = `none`;
            }
            this.Containers.Main[containerName].style.display = `inline-block`;
        }
        else {
            debug.error(`Unknown container name : `, containerName);
        }
    }
}