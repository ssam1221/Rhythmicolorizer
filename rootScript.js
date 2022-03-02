function keyPressHandler() {};
window.onload = () => {
    document.getElementById(`gameplay`).focus();
    const aTags = document.getElementsByTagName(`a`);
    for (const a of aTags) {
        a.onmouseover = function () {
            const rgb = {
                r: parseInt(Math.random() * 255).toString(16).padStart(2, `0`),
                g: parseInt(Math.random() * 255).toString(16).padStart(2, `0`),
                b: parseInt(Math.random() * 255).toString(16).padStart(2, `0`),
            }
            this.style.color = `#${rgb.r}${rgb.g}${rgb.b}`;
        };
        a.onmouseleave = function () {
            this.style.color = `black`;
        };
    }
    keyPressHandler = function ({
        event,
        key
    }) {
        const noteKeyArray = `asdl;'`;
        const otherKeyArray = [
            `Escape`, `Enter`, `ArrowDown`, `ArrowUp`, `ArrowLeft`, `ArrowRight`
        ]
        const noteKeyIndex = noteKeyArray.indexOf(key);
        const otherKeyIndex = otherKeyArray.indexOf(key);
        if (noteKeyIndex > -1) {
            if (event === `keydown`) {
                document.getElementById(`keyPress_${noteKeyIndex}`).style.backgroundColor = `white`;
            } else if (event === `keyup`) {
                document.getElementById(`keyPress_${noteKeyIndex}`).style.backgroundColor = ``;
            }
        } else if (otherKeyIndex > -1) {
            if (event === `keydown`) {
                document.getElementById(`keyPress_${key}`).style.backgroundColor = `white`;
            } else if (event === `keyup`) {
                document.getElementById(`keyPress_${key}`).style.backgroundColor = ``;
            }
        }
    }
}