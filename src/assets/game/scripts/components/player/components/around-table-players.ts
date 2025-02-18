import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { remove, values } from "lodash-es";
import Observer from "observer";
import { IAroundTablePlayers, IHiddenPlayers } from "../../../../../../extensions/shared-components/assets/game/around-table-player/scripts/stores/around-table-players-chip-store";
import { AroundTablePlayerUtils } from "../../../../../../extensions/shared-components/assets/game/around-table-player/scripts/utils/around-table-player-utils";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AroundTablePlayerComponent } from "../../../../../../extensions/shared-components/assets/game/around-table-player/scripts/components/around-table-player-component";
import { PlayerHandlers } from "../player-handler";
import { Player } from "../player-store";
const { ccclass, property } = _decorator;

const { Rounds } = gc;
const { render, handle } = Observer;

@ccclass
export class AroundTablePlayers extends ObserverComponent {
    protected hiddenPlayers: IHiddenPlayers = {};
    aroundTablePlayerComponents: AroundTablePlayerComponent[] = [];

    onLoad(): void {
        super.onLoad();
        this.aroundTablePlayerComponents =
            this.node.getComponentsInChildren(AroundTablePlayerComponent).filter((component) => component && component.node.active) ?? [];
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.aroundTablePlayer)
    renderAroundTablePlayer(aroundTablePlayer: IAroundTablePlayers) {
        if (aroundTablePlayer) {
            this.addAroundTablePlayer(aroundTablePlayer);
            this.addNewPlayer(aroundTablePlayer);
        }
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.aroundTablePlayers)
    renderAroundTablePlayers(aroundTablePlayers: gc.GameServiceMessage.AroundTablePlayers) {
        if (aroundTablePlayers) {
            const players: IAroundTablePlayers[] = Object.values(aroundTablePlayers);
            // Real player is type equal false
            const sortedPlayers: IAroundTablePlayers[] = players.sort((playerA, playerB) => (playerA.type === false ? -1 : 1)); //NOSONAR

            sortedPlayers.forEach((player) => {
                this.addAroundTablePlayer(player);  
                this.addNewPlayer(player);
            });
        }
    }

    @handle(PlayerHandlers, (handle, player: Player) => handle.addPlayer(player))
    addAroundTablePlayer(player: Player) {
    }

    @handle(PlayerHandlers, (handle, id: string) => handle.removePlayer(id))
    removeAroundTablePlayer(id: string) {
    }

    protected addNewPlayer(aroundTablePlayer: IAroundTablePlayers) {
        const emptySlot = AroundTablePlayerUtils.getEmptyPlayerSlot(this.aroundTablePlayerComponents);
        if (emptySlot) {
            AroundTablePlayerUtils.addAroundTablePlayerInfo({
                playerComp: emptySlot,
                value: aroundTablePlayer,
            });

            return;
        }
    }

    @render(gc.AroundTablePlayers.AroundTablePlayersStore, (store) => store.outGamePlayerId)
    handleRemoveAroundTablePlayer(outGamePlayerId: gc.GameServiceMessage.RemoveAroundTablePlayer) {
        if (!outGamePlayerId) {
            return;
        }

        const playerSlot = AroundTablePlayerUtils.getAroundTablePlayerSlot(this.aroundTablePlayerComponents, outGamePlayerId.id);

        if (playerSlot) {
            AroundTablePlayerUtils.addAroundTablePlayerInfo({
                playerComp: playerSlot,
                value: null,
            });
            const playerIds = Object.keys(this.hiddenPlayers);

            if (playerIds.length > 0) {
                const newPlayerId = playerIds[0];
                const newPlayer = this.hiddenPlayers[newPlayerId];
                this.addNewPlayer(newPlayer);
                delete this.hiddenPlayers[newPlayerId];
            }
        } else {
            delete this.hiddenPlayers[outGamePlayerId.id];
            this.removeAroundTablePlayer(outGamePlayerId.id);
        }
    }

    updateHiddenPlayerStorage(playerChip: gc.GameServiceMessage.PlayerChip) {
        const player = this.hiddenPlayers?.[playerChip?.playerId];

        if (player) {
            player.idleCount = 0;
            player.red = playerChip.red;
            this.hiddenPlayers[playerChip.playerId] = player;
            AroundTablePlayerUtils.storePlayerToCache(player);
        }
    }

    @render(Rounds.RoundTimeStore, (store) => store.isStartPlacingBet)
    renderAroundTablePlayerWhenStartBet(isStartPlacingBet: boolean) {
        isStartPlacingBet && this.figureOutAroundTablePlayers();
    }

    protected async figureOutAroundTablePlayers() {
        const hiddenPlayers: IAroundTablePlayers[] = values(this.hiddenPlayers);
        for (const player of this.aroundTablePlayerComponents) {
            const aroundTablePlayer = player.aroundTablePlayer;

            if (!aroundTablePlayer) {
                return;
            }

            aroundTablePlayer.idleCount++;
            AroundTablePlayerUtils.storePlayerToCache(aroundTablePlayer);

            if (AroundTablePlayerUtils.isIdle(player)) {
                await this.handleIdleAroundTablePlayer(player, aroundTablePlayer, hiddenPlayers);
            }
        }

        const botAroundTablePlayerPlayerComps = AroundTablePlayerUtils.getBotAroundTablePlayerComps(this.aroundTablePlayerComponents);
        const realPlayers = AroundTablePlayerUtils.getRealPlayer(hiddenPlayers);

        for (const botAroundTablePlayer of botAroundTablePlayerPlayerComps) {
            const aroundTablePlayer = botAroundTablePlayer.aroundTablePlayer;
            const realPlayer = AroundTablePlayerUtils.findIdleRealPlayer(realPlayers);
            if (realPlayer) {
                await this.updateAroundTablePlayerInfoAndSwap(aroundTablePlayer, realPlayer, botAroundTablePlayer);
                delete this.hiddenPlayers[realPlayer.id];
                remove(realPlayers, realPlayer);
            }
        }
    }

    protected async handleIdleAroundTablePlayer(
        aroundTablePlayerComp: AroundTablePlayerComponent,
        aroundTablePlayer: IAroundTablePlayers,
        hiddenPlayers: IAroundTablePlayers[]
    ) {
        const oldPlayerData = aroundTablePlayer;
        const newPlayer = AroundTablePlayerUtils.findIdleHiddenPlayer(hiddenPlayers);

        if (newPlayer) {
            AroundTablePlayerUtils.addAroundTablePlayerInfo({
                playerComp: aroundTablePlayerComp,
                value: newPlayer,
            });
            delete this.hiddenPlayers[newPlayer.id];
            this.hiddenPlayers[oldPlayerData.id] = oldPlayerData;
            remove(hiddenPlayers, newPlayer);
        }
    }

    protected async updateAroundTablePlayerInfoAndSwap(
        aroundTablePlayer: IAroundTablePlayers,
        realPlayer: IAroundTablePlayers,
        botAroundTablePlayer: AroundTablePlayerComponent
    ) {
        this.hiddenPlayers[aroundTablePlayer.id] = aroundTablePlayer;
        AroundTablePlayerUtils.addAroundTablePlayerInfo({
            playerComp: botAroundTablePlayer,
            value: realPlayer,
        });
    }
}
