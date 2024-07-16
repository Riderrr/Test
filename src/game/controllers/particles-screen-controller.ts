import { ParticlesScreenView } from "../views/particles-scene/particles-screen-view";
import { EventEmitter } from "../../utils/event-emitter";

// Particles screen controller class
export class ParticlesScreenController {
    public onShowStartScreen = new EventEmitter();

    private _particlesScreenView: ParticlesScreenView;
    constructor(particlesScreenView: ParticlesScreenView) {
        this._particlesScreenView = particlesScreenView;

        // Back button click event
        this._particlesScreenView.on("backButtonClick", () => {
            this._particlesScreenView.Hide();
            this.onShowStartScreen.emit("backButtonClick");
        });
    }

    // Show particles screen
    public ShowParticlesScreen(): void {
        this._particlesScreenView.Show();
    }
}
