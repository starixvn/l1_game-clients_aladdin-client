import { _decorator, Component, Node, sp, Sprite, SpriteFrame, Tween, tween, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass("rocket")
export class rocket extends Component {
    @property(Node)
    nodeRocketContainer: Node = null;

    @property(Node)
    nodeRocket: Node = null;

    @property(Sprite)
    sprRocketLine: Sprite = null;

    @property(SpriteFrame)
    fraLevel1Line: SpriteFrame = null;

    @property(SpriteFrame)
    fraLevel2Line: SpriteFrame = null;

    @property(SpriteFrame)
    fraLevel3Line: SpriteFrame = null;

    @property(sp.Skeleton)
    skeExplosion: sp.Skeleton = null;

    @property(Node)
    nodePoint1: Node = null;

    @property(Node)
    nodePoint2: Node = null;

    @property(Node)
    nodePoint3: Node = null;

    @property(Node)
    nodePoint4: Node = null;

    point1Position = v3(0, 0, 0);
    point2Position = v3(0, 0, 0);
    point3Position = v3(0, 0, 0);
    point4Position = v3(0, 0, 0);
    defaultAngle = -90;
    level1Multiplier = 5;
    level2Multiplier = 10;
    targetPoint;
    points = [];
    maxMutiplierFly = 2;
    maxMutiplierFlyTemp = 0;
    currentMultiplier = 0;
    linePercent = 0;
    speed = 0.005;
    dataServerReturnTime = 0;
    isReady = false;
    firstMultiplierRound = false;
    angleTween: Tween<Node>;
    flyTween: Tween<Node>;
    explositionTween: Tween<Node>;
    skeRocket: sp.Skeleton;
    flyInterval;
    rocketIntervalTime = 1000 / 40;

    onLoad() {
        this.isReady = true;
        this.nodeRocket.active = false;

        this.point1Position = this.nodePoint1.position;
        this.point2Position = this.nodePoint2.position;
        this.point3Position = this.nodePoint3.position;
        this.point4Position = this.nodePoint4.position;

        this.targetPoint = { x: this.point1Position.x, y: this.point1Position.y, speed: this.speed, t: this.dataServerReturnTime };
        //Define the bezier curve movement of the rocket
        this.points = [
            { x: this.targetPoint.x, y: this.targetPoint.y, t: 0 },
            { x: this.point2Position.x, y: this.point2Position.y },
            { x: this.point3Position.x, y: this.point3Position.y },
            { x: this.point4Position.x, y: this.point4Position.y, t: 10 },
        ];
        this.updateRocketPosition(this.point1Position);
    }

    private moveBallInBezierCurve() {
        let [p0, p1, p2, p3] = this.points;

        if (this.targetPoint.x >= p3.x - 10) {
            this.flyInterval && clearInterval(this.flyInterval);
            return;
        }

        //Calculate the coefficients based on where the rocket currently is in the animation
        let cx = 3 * (p1.x - p0.x);
        let bx = 3 * (p2.x - p1.x) - cx;
        let ax = p3.x - p0.x - cx - bx;

        let cy = 3 * (p1.y - p0.y);
        let by = 3 * (p2.y - p1.y) - cy;
        let ay = p3.y - p0.y - cy - by;

        let t = this.targetPoint.t;

        //Increment t value by speed
        this.targetPoint.t += this.targetPoint.speed;

        //Calculate new X & Y positions of rocket
        let xt = ax * (t * t * t) + bx * (t * t) + cx * t + p0.x;
        let yt = ay * (t * t * t) + by * (t * t) + cy * t + p0.y;

        // 4s -> m = 2
        // 8s -> m = 5
        // 10 -> m = 7.25
        // 12 -> m = 10

        if (this.targetPoint.t <= 0.2) {
            console.log("---level0---", this.targetPoint.t);
        }

        if (this.targetPoint.t > 0.2) {
            console.log("---level1---", this.targetPoint.t);
            this.targetPoint.speed = 0.0035;
        }

        if (this.targetPoint.t > 0.3) {
            console.log("---level1---", this.targetPoint.t);
            this.targetPoint.speed = 0.0025;
        }

        if (this.targetPoint.t > 0.5) {
            console.log("---level2---", this.targetPoint.t);
            this.targetPoint.speed = 0.0015;
        }

        if (this.targetPoint.t > 0.92) {
            console.log("---level3---", this.targetPoint.t);
            this.targetPoint.speed = 0.0001;
        }

        //We draw the rocket to the canvas in the new location
        this.targetPoint.x = xt;
        this.targetPoint.y = yt;

        const deltaX = Math.abs(xt - this.nodeRocketContainer.position.x);
        const deltaY = Math.abs(yt - this.nodeRocketContainer.position.y);
        const angle = this.defaultAngle + (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
        this.updateRocketAngle(angle, true, this.rocketIntervalTime / 1000);
        this.updateRocketPosition(this.targetPoint, true, this.rocketIntervalTime / 1000);
    }

    private updateRocketAngle(angle: number, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.angleTween?.stop();
            this.angleTween = tween(this.nodeRocketContainer)
                .to(duration, { eulerAngles: v3(0, 0, angle) }, { easing: "linear" })
                .start();
        } else {
            this.nodeRocketContainer.eulerAngles = v3(0, 0, angle);
        }
    }

    private animate() {
        this.nodeRocket.active = true;
        this.moveBallInBezierCurve();
    }

    private updateRocketPosition(targetPoint, isAnimated = false, duration = 0.1) {
        if (isAnimated) {
            this.flyTween?.stop();
            this.flyTween = tween(this.nodeRocketContainer)
                .to(duration, { position: v3(targetPoint.x, targetPoint.y, this.nodeRocketContainer.position.z) }, { easing: "linear" })
                .start();
        } else {
            this.nodeRocketContainer.position = v3(targetPoint.x, targetPoint.y, this.nodeRocketContainer.position.z);
        }
    }

    onStart() {
        this.flyInterval && clearInterval(this.flyInterval);
        this.flyInterval = setInterval(() => {
            this.animate();
        }, this.rocketIntervalTime);
    }

    onReset() {
        this.flyInterval && clearInterval(this.flyInterval);
        this.updateRocketAngle(this.defaultAngle);
        this.resetStartPosition();
        this.targetPoint.speed = this.speed;
    }

    private resetStartPosition() {
        this.updateRocketPosition(this.point1Position);
        this.nodeRocketContainer.position = v3(this.point1Position.x, this.point1Position.y, this.nodeRocketContainer.position.z);

        this.targetPoint.x = this.point1Position.x;
        this.targetPoint.y = this.point1Position.y;
        this.targetPoint.t = this.dataServerReturnTime;
    }
}
