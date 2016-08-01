/**
 * Created by lingjianfeng on 15/4/2.
 */


var TowerBase = cc.Sprite.extend({
    nearestEnemy    : null,
    scope           : 0,    // 塔的视线范围
    lethality       : 0,    // 杀伤力
    bulletSpeed     : 0,    // 子弹速度
    moneyValue      : 0,
    ctor : function(aTexture){
        this._super(aTexture);
        this.loadConfig();
        return true;
    },
    // override
    loadConfig : function(){
    },
    findNearestEnemy : function(){
        var enemyVector = GameManager.getInstance().getEnemyVector();
        var currMinDistant = this.scope;
        var node = null;
        for(var i = 0; i < enemyVector.length; i++){
            var enemy = enemyVector[i];
            var distance = cc.pDistance(this.getPosition(), enemy.getPosition());
            if (distance < currMinDistant) {
                currMinDistant = distance;
                node = enemy;
            }
        }
        this.nearestEnemy = node;
    },
    getMoneyValue : function(){
        return this.moneyValue;
    }
});