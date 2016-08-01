/**
 * Created by lingjianfeng on 15/4/2.
 */

var EnemyBase = cc.Sprite.extend({
    pointsVector    : [],
    currPosIndex    : 0,
    speed           : 400,
    callBack        : null,  // 回调函数[敌人进攻成功回调]
    dir             : 0, // 0 向右， 1向左
    isSucceed       : false,
    hp              : 0,
    maxHp           : 0,
    hpBar           : null,
    hpBarBg         : null,
    isDie           : false,
    moneyValue      : 0,
    ctor : function(aTexture){
        this._super(aTexture);
        this.loadConfig();
        this.loadInit();
        this.loadHpBar();
        this.runFllowPoint();
        return true;
    },
    loadConfig : function(){
        var instance = GameManager.getInstance();
        this.pointsVector = instance.getPointVector();
    },
    loadInit : function(){
        var pos = this.pointsVector[0];
        this.setPosition(pos.x, pos.y);
    },
    // overwrite me
    loadAnimation : function(){
        cc.log("please overwrite me!");
    },
    loadHpBar : function(){
        var hpBg = new cc.Sprite("#gp_hpBg.png");
        this.addChild(hpBg);
        hpBg.setPosition(this.width / 2, this.height);

        var bar = new cc.ProgressTimer(new cc.Sprite("#gp_hp.png"));
        hpBg.addChild(bar);
        bar.setPosition(hpBg.width / 2, hpBg.height / 3 * 2);
        bar.setType(cc.ProgressTimer.TYPE_BAR);
        bar.setMidpoint(cc.p(0, 0.5));
        bar.setBarChangeRate(cc.p(1, 0));
        bar.setPercentage(100);

        this.hpBar = bar;
        this.hpBarBg = hpBg;
    },
    runFllowPoint : function(){
        // 条件判断[如果敌人走完了路程]
        if (this.currPosIndex == this.pointsVector.length - 1){
            this.isSucceed = true;
            // 函数回调
            (this.callBack && typeof(this.callBack) === "function") && this.callBack();
            return;
        }

        var nextPos = this.pointsVector[this.currPosIndex + 1];

        // TODO 用引擎封装好的。
        //var distance = Math.sqrt((this.x - nextPos.x) * (this.x - nextPos.x)  + (this.y - nextPos.y) * (this.y - nextPos.y));
        var distance = cc.pDistance(this.getPosition(), nextPos);
        var time = distance / this.speed;

        var move = cc.moveTo(time, nextPos);
        var call = cc.callFunc(this.runFllowPoint, this);
        var action = cc.sequence(move, call);
        this.runAction(action);

        // 方向判断
        this.dir = nextPos.x - this.x >= 0 ? 0 : 1;
        this.onChangeDirection();

        this.currPosIndex++;
    },
    onChangeDirection : function(){
        this.loadAnimation(this.dir);
    },
    onHurt : function(hurt){
        var tmpHp = this.hp - hurt;
        this.hp = tmpHp < 0 ? 0 : tmpHp;
        this.hpBar.setPercentage(this.hp / this.maxHp * 100);

        if (this.hp <= 0){
            this.onDie();
        }
    },
    onDie : function(){
        this.stopAllActions();
        this.onExpload();
    },
    onExpload : function(){
        this.hpBarBg.setVisible(false);
        this.setAnchorPoint(0.5, 0.25);
    },
    setCallback : function(callBack){
        this.callBack = callBack;
    },
    setMaxHp : function(hp){
        this.maxHp = hp;
        this.hp = hp;
    },
    getCurrHp : function(){
        return this.hp;
    },
    getMoneyValue : function(){
        return this.moneyValue;

    }
});
