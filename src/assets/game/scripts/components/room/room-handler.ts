import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameServiceMessage } from "../../game-message";
import { IPlayer, RoomStore } from "./room-store";

const { injectable, inject } = inversify;

@injectable()
export class RoomHandler implements gc.Shared.IMultipleHandlers {
    @inject(RoomStore) protected readonly RoomStore: RoomStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    handlePlayer(player: IPlayer) {
        
    }

    eventHandleList = [
        {
            name: GameServiceMessage.Player.eventName,
            handle: this.handlePlayer,
        },
    ];
}
