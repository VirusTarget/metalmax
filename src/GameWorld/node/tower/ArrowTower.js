/**
 * Created by lingjianfeng on 15/4/2.
 */


var ArrowTower = TowerBase.extend({
    basePlate : null,
    rotateArrow : null,
    ctor : function(){
        this._super();
        // 加载[配置]
        this.loadConfig();
        // 记载[]
        this.loadBasePlate();
        this.loadRotateArrow();

        this.schedule(this.onRotateAndShoot, 0.5);
    },
    loadConfig : function(){
        this._super();
        // 配置[视野]
        this.scope = 120;
        // 配置[杀伤力]
        this.lethality = 2;
        // 配置[子弹速度]
        this.bulletSpeed = 2;
        // 配置[新建一个所需多少两银子]
        this.moneyValue = 150;
    },
    // 加载金属地盘
    loadBasePlate : function(){
        var node = new cc.Sprite("#gp_basePlate.png");
        this.addChild(node);

        this.basePlate = node;
    },
    loadRotateArrow : function(){
        var node = new cc.Sprite("#gp_arrow.png");
        this.addChild(node);
        node.setPosition(0, this.basePlate.height / 4);

        this.rotateArrow = node;
    },
    onRotateAndShoot : function(){
        this.findNearestEnemy();
        if (this.nearestEnemy != null){
            var rotateVector = cc.pSub(this.nearestEnemy.getPosition(), this.getPosition());
            var rotateRadians = cc.pToAngle(rotateVector);
            var rotateDegrees = cc.radiansToDegrees(-1 * rotateRadians);

            // speed表示炮塔旋转的速度，0.5 / M_PI其实就是 1 / 2PI，它表示1秒钟旋转1个圆
            var speed = 0.5 / cc.PI;
            // rotateDuration表示旋转特定的角度需要的时间，计算它用弧度乘以速度。
            var rotateDuration = Math.abs(rotateRadians * speed);

            var move = cc.rotateTo(rotateDuration, rotateDegrees);
            var callBack = cc.callFunc(this.shoot, this);
            var action = cc.sequence(move, callBack);
            this.rotateArrow.runAction(action);
        }

    },
    shoot : function(){
        var instance = GameManager.getInstance();

        if(this.nearestEnemy != null && this.nearestEnemy.getCurrHp() > 0 ){
            var currBullet = this.createArrowTowerBullet();
            this.addChild(currBullet);
            instance.bulletVector.push(currBullet);

            var shootVector = cc.pNormalize(cc.pSub(this.nearestEnemy.getPosition(), this.getPosition()));
            var normalizedShootVector = cc.pNeg(shootVector);

            var farthestDistance = GC.w;
            var overshotVector = cc.pMult(normalizedShootVector, farthestDistance);
            var offscreenPoint = cc.pSub(this.rotateArrow.getPosition(), overshotVector);

            cc.log("offscreenPoint , offscreenPoint", offscreenPoint);

            var move = cc.moveTo(this.bulletSpeed, offscreenPoint);
            var callBack = cc.callFunc(this.removeBullet, this);
            var action = cc.sequence(move, callBack);
            currBullet.runAction(action);
        }
    },
    createArrowTowerBullet : function(){
        var node = new Bullet("#gp_arrowBullet.png");
        node.setLethality(this.lethality);
        node.setPosition(this.rotateArrow.getPosition());
        node.setRotation(this.rotateArrow.getRotation());
        return node;
    },
    removeBullet : function(sender){
        sender.setIsDie(true);
        cc.log("removeBullet", sender.isDie)
    }
});