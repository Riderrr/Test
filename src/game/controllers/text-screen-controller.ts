import { TextScreenView } from "../views/text-screen/text-screen-view";
import { EventEmitter } from "../../utils/event-emitter";
import { texts } from "../data/text-data";

// Text screen controller class
export class TextScreenController {
    public onBackBtnClick = new EventEmitter();
    private _generateTextInterval = 2;
    private _timer = 0;
    private _canGenerateText = false;

    private _textScreenView: TextScreenView;
    constructor(textScreenView: TextScreenView) {
        this._textScreenView = textScreenView;
        // Back button click event
        this._textScreenView.on("backButtonClick", () => {
            this.onBackBtnClick.emit("backButtonClick");
            this.HideTextScreen();
        });
    }

    // Show text screen
    public ShowTextScreen(): void {
        this._textScreenView.Show();
        this._canGenerateText = true;
        this._timer = this._generateTextInterval;
    }

    // Hide text screen
    public HideTextScreen(): void {
        this._textScreenView.Hide();
        this._canGenerateText = false;
    }

    // Generate new text
    public GenerateNewText(): void {
        const randomFontSize = Math.floor(Math.random() * 40) + 20;
        this._textScreenView.DrawText(texts[Math.floor(Math.random() * texts.length)], randomFontSize);
    }

    // Generate new text every this._generateTextInterval seconds
    public Update(deltaTime: number): void {
        if (!this._canGenerateText) return;

        if (this._timer >= this._generateTextInterval) {
            this._timer = 0;
            this.GenerateNewText();
        }
        this._timer += deltaTime;
    }
}
