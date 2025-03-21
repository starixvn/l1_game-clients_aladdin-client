import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;

@injectable()
export class CascadingSlotBoardHandlers implements gc.Shared.IHandler<void> {
    handle() {}
}
