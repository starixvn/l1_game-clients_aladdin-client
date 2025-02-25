import { _decorator, Game, game } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { VisibilityHandlers } from "../visibility-handler";

const { ccclass } = _decorator;
const { handle } = Observer;

@ccclass
export class VisibilityContainer extends ObserverComponent {
    onLoad(): void {
        super.onLoad();
        game.on(Game.EVENT_SHOW, this.handleVisibilityChange, this);
        game.on(Game.EVENT_HIDE, this.handleVisibilityChange, this);
    }

    onDestroy(): void {
        game.off(Game.EVENT_SHOW, this.handleVisibilityChange, this);
        game.off(Game.EVENT_HIDE, this.handleVisibilityChange, this);
    }

    private handleVisibilityChange(): void {
        const isVisible = game.isPaused() !== false;
        this.updateVisibility(isVisible);
    }

    @handle(VisibilityHandlers, (handle, isVisible: boolean) => handle.updateVisibility(isVisible))
    private updateVisibility(isVisible: boolean) {
        return isVisible;
    }
} 