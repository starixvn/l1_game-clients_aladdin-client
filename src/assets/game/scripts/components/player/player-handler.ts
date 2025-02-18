import gc from "@sg/game-client-base";
import inversify from "inversify";
import { Player, PlayerChipMessage, PlayerStore, PlayerWinMessage } from "./player-store";

const { injectable, inject } = inversify;
import { IAroundTablePlayers } from "../../../../../extensions/shared-components/assets/game/around-table-player/scripts/stores/around-table-players-chip-store";

@injectable()
export class PlayerHandlers {
    @inject(PlayerStore) private readonly playerStore: PlayerStore;
   
    addPlayer(player: IAroundTablePlayers) {
        this.playerStore.players.push(new Player({
            id: player.id,
            name: player.name,
            red: player.red,
            avatarId: player.avatarId,
            type: player.type,
            rate: player.rate,
            multiplier: 0
        }));
    }

    removePlayer(id: string) {
        const index = this.playerStore.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.playerStore.players.splice(index, 1);
        }
    }

    updatePlayerInfo() {
        this.playerStore.updatePlayerInfoIndex = -1;
    }

    updatePlayerStatus(status: PlayerWinMessage) {
        const index = this.playerStore.players.findIndex(p => p.id === status.playerId);
        if (index !== -1) {
            this.playerStore.players[index].status = status;
            status.win && (
                this.playerStore.players[index].red += status.bet,
                this.playerStore.updatePlayerInfoIndex = index
            );
        }
    }

    updatePlayerRed(message: PlayerChipMessage) {
        const index = this.playerStore.players.findIndex(p => p.id === message.playerId);
        if (index !== -1) {
            this.playerStore.players[index].red = message.red;
            this.playerStore.updatePlayerInfoIndex = index;
        }
    }

    eventHandleList = [
        {
            name: PlayerWinMessage.eventName,
            handle: this.updatePlayerStatus
        },
        {
            name: PlayerChipMessage.eventName,
            handle: this.updatePlayerRed
        }
    ];
}