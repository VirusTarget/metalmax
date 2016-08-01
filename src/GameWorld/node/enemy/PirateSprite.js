/**
 * Created by lingjianfeng on 15/4/2.
 */


var PirateSprite = EnemyBase.extend({
    ctor : function(){
        this._super("#enemyRight2_1.png");
        this.loadConfig();
        return true;
    },
    loadConfig : function(){
        this._super();
        this.moneyValue = 800;
    },
    loadAnimation : function(dir){
        this.stopActionByTag(998);
        var frames = [];
        for (var i = 1; i <= 4; i++) {
            var prefix = dir == 0 ? "enemyRight2_" : "enemyLeft2_";
            var str = prefix + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        var animation = new cc.Animation(frames, 0.1);
        var animate = cc.animate(animation).repeatForever();
        animate.tag = 998;
        this.runAction(animate);
    },
    onExpload : function(){
        this._super();
        var frames = [];
        for (var i = 1; i <= 6; i++) {
            var prefix = "explode2_";
            var str = prefix + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }
        var animation = new cc.Animation(frames, 0.1);
        var animate = cc.animate(animation);
        var callBack = cc.callFunc(function(){
            this.isDie = true;
        }.bind(this));
        var action = cc.sequence(animate, callBack);
        this.runAction(action);
    }
});