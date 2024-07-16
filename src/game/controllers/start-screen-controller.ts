import { ButtonType, StartScreenView } from "../views/start-screen-view";
import { EventEmitter } from "../../utils/event-emitter";

// Start screen controller class
export class StartScreenController {
    public onShowCardsScreen = new EventEmitter();
    public onShowTextScreen = new EventEmitter();
    public onShowParticlesScreen = new EventEmitter();

    private _startScreenView: StartScreenView;
    constructor(startScreenView: StartScreenView) {
        this._startScreenView = startScreenView;
    }

    // Show start screen
    public ShowStartScreen(): void {
        this._startScreenView.Show();
        this.AttachListeners();
    }

    // Attach listeners bor buttons
    private AttachListeners(): void {
        this._startScreenView.on("buttonClick", (e) => {
            switch (e as ButtonType) {
                case ButtonType.Cards:
                    this.onShowCardsScreen.emit("showCardsScreen");
                    break;
                case ButtonType.Text:
                    this.onShowTextScreen.emit("showTextScreen");
                    break;
                case ButtonType.Particles:
                    this.onShowParticlesScreen.emit("showParticlesScreen");
                    break;
            }
        });
    }
}
