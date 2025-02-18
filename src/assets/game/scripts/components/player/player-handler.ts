import gc from "@sg/game-client-base";
import inversify from "inversify";
import { Player, PlayerStore } from "./player-store";

const { injectable, inject } = inversify;

@injectable()
export class PlayerHandlers {
    @inject(PlayerStore) private readonly playerStore: PlayerStore;
   
    addPlayer(player: Player) {
        this.playerStore.players.push(player);
    }

    removePlayer(id: string) {
        const index = this.playerStore.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.playerStore.players.splice(index, 1);
        }
    }
}