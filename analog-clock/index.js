import { LitElement, css, svg } from 'https://cdn.skypack.dev/lit';

/**
 * 秒針の角度
 * @param {Date} date
 * @returns {number} degree
 */
function getSecondDegree(date) {
    return (date.getSeconds() / 60) * 360;
}

/**
 * 短針の角度
 * @param {Date} date
 * @returns {number} degree
 */
function getMinuteDegree(date) {
    const m = date.getMinutes() + date.getSeconds() / 60;
    return (m / 60) * 360;
}

/**
 * 長針の角度
 * @param {Date} date
 * @returns {number} degree
 */
function getHourDegree(date) {
    const h = date.getHours() + date.getMinutes() / 60;
    return (h / 12) * 360;
}

/**
 * アナログ時計
 */
export class AnalogClockElement extends LitElement {
    constructor() {
        super();
        this.time = new Date();
        this._id = undefined;
    }

    static get properties() {
        return { time: { type: Number, state: true } };
    }

    static get styles() {
        return css`
        svg {
            width: min(400px, 100%);
        }
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this._id = setInterval(() => {
            this.time = new Date();
        }, 1000 / 30);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearInterval(this._id);
    }

    /**
     * 太い目盛
     * @param {number} i 0 ~ 11
     * @returns {TemplateResult}
     */
    thick(i) {
        return svg`
        <line x1="50" y1="5" x2="50" y2="10" stroke="black"
            transform="rotate(${i / 12 * 360} 50 50)" />
        `;
    }

    /**
     * 細い目盛
     * @param {number} i 0 ~ 59
     * @returns {TemplateResult}
     */
    thin(i) {
        return svg`
        <line x1="50" y1="5" x2="50" y2="8" stroke="black" stroke-width="0.5"
            transform="rotate(${i / 60 * 360} 50 50)" />
        `;
    }

    /**
     * 時計の針
     * @param {{ degree: number, color: string, width: number, length: number}} param0
     * @returns {TemplateResult}
     */
    hand({ degree, color, width, length }) {
        return svg`
        <line transform="rotate(${ degree } 50 50)"
            x1="50" y1="50" x2="50" y2="${50 - length}" stroke="${color}" stroke-width="${width}" />
        `;
    }

    /**
     * 数字
     * @param {number} i 0 ~ 11
     * @returns {TemplateResult}
     */
    num(i) {
        return svg`
        <g transform="rotate(${ i / 12 * 360 } 50 50)">
            <text text-anchor="middle" dominant-baseline="central" font-size="10"
                x="50" y="15">
                ${i === 0 ? 12 : i}
            </text>
        </g>
        `;
    }

    render() {
        return svg`
        <svg viewBox="0 0 100 100" width="200">
            <!-- 外側の円 -->
            <circle r="45" cx="50" cy="50" fill="transparent" stroke="black"></circle>

            <g>
                <!-- 太い目盛 -->
                ${Array(12).fill(0).map((_, i) => i).map(this.thick)}

                <!-- 数字 -->
                ${Array(12).fill(0).map((_, i) => i).map(this.num)}

                <!-- 細い目盛 -->
                ${Array(60)
                    .fill(0)
                    .map((_, i) => i)
                    .filter(i => i % 5 !== 0)
                    .map(this.thin)
                }
            </g>

            <!-- 短針 -->
            ${this.hand({
                degree: getHourDegree(this.time),
                color: "red",
                width: 2,
                length: 20
            })}

            <!-- 長針 -->
            ${this.hand({
                degree: getMinuteDegree(this.time),
                color: "blue",
                width: 1,
                length: 40
            })}

            <!-- 秒針 -->
            ${this.hand({
                degree: getSecondDegree(this.time),
                color: "black",
                width: 0.5,
                length: 40
            })}

            <!-- 中心の丸 -->
            <circle r="1.5" cx="50" cy="50"></circle>
        </svg>
        `;
    }
}

customElements.define('analog-clock-element', AnalogClockElement);
