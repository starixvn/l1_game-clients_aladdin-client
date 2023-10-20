import { _decorator, Component, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass()
export class RocketStore extends Component {
    _position = v3(0, 0, 0);

    set position(position) {
        this._position = position;
    }

    get position() {
        return this._position;
    }
}
