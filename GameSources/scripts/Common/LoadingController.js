import Debug from "./Debug";
import DOMConatiners from "./DOMConatiners";

const debug = new Debug({
    filename: `LoadingController`
})

function show(el) {
    el.style.display = `inline-block`;
}

function hide(el) {
    el.style.display = `none`;
}



function getHint() {
    const hints = [
        // Real hints
        `이 게임은 키보드로만 플레이가 가능합니다.<br>모바일에서는 지원하지 않습니다.`,
        `최적화된 환경을 위해 이어폰이나 헤드셋을 권장합니다.`,
        `난이도가 너무 어렵다면 한 단계 낮춰서 도전하세요.`,
        `같은 난이도여도 곡마다 어려운 정도가 다릅니다.`,
        `만점은 1,000,000점 입니다.`,
        `인터넷이 느리면 음악 재생과 채보 싱크가 맞지 않을 수 있습니다.<br>무선보다는 유선 인터넷을 권장합니다.`,

        // WTF Hints
        `아무리 해도 클리어를 하지 못한다면 장비 탓입니다.<br>모니터, 컴퓨터와 키보드를 교체합시다.`,
        `일부 곡 및 난이도는 개발자가 클리어하지 못하였을 수도 있습니다.<br>클리어가 가능한지 테스트 해 주세요.`,
        `이 게임은 Chrome 브라우저에 최적화 되었습니다.<br>설마 IE를 아직도...?`,

        // Joke
        `피자에... 파인애플?`,
        `치코리타의 대폭발!<br>효과가 별로인 듯하다...<br>치코리타는 쓰러졌다!`,
        `인생 최대의 난제<br>오늘 점심 뭐먹지`,
        `당신은 부먹입니까, 찍먹입니까?<br>그 이유를 800자 내로 서술하세요.`,
        `로또 1등하는 방법은 간단합니다.<br>적절한 6개의 중복되지 않는 수를 선택하세요.`,
        `방정식 x^n+y^n=z^n (n>=3)에는 자명하지 않은<br>정수 해의 쌍 (x,y,z) 값이 존재하지 않습니다.<br>- 페르마의 마지막 정리-`,
    ];
    return hints[parseInt(Math.random() * hints.length)];
}

function setHintText({
    element
}) {
    DOMConatiners.get().LoadingScreenContainer[element].innerHTML = getHint();
}

export default class LoadingController {


    static showInitialLoading() {
        console.log(DOMConatiners.get().FadeOverlay)
        show(DOMConatiners.get().LoadingScreenContainer.InitialLoading);
        DOMConatiners.get().FadeOverlay.setAttribute(`class`, `MainContainer MainOverlayFadeIn`);
        setHintText({
            element: `InitialLoadingTips`
        });
    }

    static hideInitialLoading() {
        hide(DOMConatiners.get().LoadingScreenContainer.InitialLoading);
        DOMConatiners.get().FadeOverlay.setAttribute(`class`, `MainContainer MainOverlayFadeOut`);
    }

    static showPlayLoading() {
        DOMConatiners.get().FadeOverlay.setAttribute(`class`, `MainContainer MainOverlayFadeIn`);
        show(DOMConatiners.get().LoadingScreenContainer.PlayLoading);
        setHintText({
            element: `InitialLoadingTips`
        });
    }

    static hidePlayLoading() {
        DOMConatiners.get().FadeOverlay.setAttribute(`class`, `MainContainer MainOverlayFadeOut`);
        hide(DOMConatiners.get().LoadingScreenContainer.PlayLoading);
    }
}