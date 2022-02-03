export default class SFXPlayer {
    static SfxPlayerContainer;

    static NUM_AUDIO_TAG = 100;
    static AudioTags = [];
    static currentAudioTagIndex = 0;

    static initialize() {
        this.SfxPlayerContainer = document.getElementById(`sfxPlayerContainer`);
        for (let i = 0; i < this.NUM_AUDIO_TAG; i++) {
            const audioTag = document.createElement(`audio`);
            audioTag.id = `SFXPlayer_${i}`
            audioTag.setAttribute = (`class`, `SFXPlayer`);
            this.SfxPlayerContainer.appendChild(audioTag);
            this.AudioTags[i] = audioTag;
        }
    }

    static play(src) {
        if (typeof src !== `string`) {
            return;
        }
        this.AudioTags[this.currentAudioTagIndex].src = src;
        this.AudioTags[this.currentAudioTagIndex].play();
        this.currentAudioTagIndex = (++this.currentAudioTagIndex) % this.NUM_AUDIO_TAG;
    }
}