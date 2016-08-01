/**
 * Created by lingjianfeng on 15/4/2.
 */

var AttackTower = TowerBase.extend({
    ctor : function(){
        this._super("#gp_attackTower.png");
        this.loadConfig();
        this.schedule(this.shoot, 0.8);
    },
    loadConfig : function(){
        this._super();
        // 配置[视野]
        this.scope = 520;
        // 配置[杀伤力]
        this.lethality = 2;
        // 配置[子弹速度]
        this.bulletSpeed = 2;
        // 配置[新建一个所需多少两银子]
        this.moneyValue = 250;
    },
    shoot : function(){
        var instance = GameManager.getInstance();
        this.findNearestEnemy();
        if(this.nearestEnemy != null && this.nearestEnemy.getCurrHp() > 0 ){
            var currBullet = this.createArrowTowerBullet();
            this.addChild(currBullet);
            instance.getBulletVector().push(currBullet);

            var shootVector = cc.pNormalize(cc.pSub(this.nearestEnemy.getPosition(), this.getPosition()));
            var normalizedShootVector = cc.pNeg(shootVector);

            // 这里貌似有问题
            var farthestDistance = GC.w;
            var overshotVector = cc.pMult(normalizedShootVector, farthestDistance);
            var offscreenPoint = cc.pSub(currBullet.getPosition(), overshotVector);

            var move = cc.moveTo(this.bulletSpeed, offscreenPoint);

            var callBack = cc.callFunc(this.removeBullet, this);
            var action = cc.sequence(move, callBack);
            currBullet.runAction(action);

        }
    },
    createArrowTowerBullet : function(){
        var node = new Bullet("#gp_bullet.png");
        node.setLethality(this.lethality);
        node.setPosition(this.getContentSize().width / 2, this.getContentSize().height * 0.8);
        return node;
    },
    removeBullet : function(sender){
        sender.setIsDie(true);
        cc.log("removeBullet", sender.getName())
    }
});
