import gc from "@sg/game-client-base";
import inversify from "inversify";

const { injectable, inject } = inversify;

@injectable()
export class BalanceInfoHandler implements gc.Shared.IHandler<number> {
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    handle() {}
    increaseBalance(balance: number) {
        this.mainPlayerStore.balance += balance;
    }

    descreaseBalance(balance: number) {
        this.mainPlayerStore.balance -= balance;
    }
}
