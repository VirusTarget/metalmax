/**
 * Created by lingjianfeng on 15/4/2.
 */

var Bullet = cc.Sprite.extend({
    isDie : false,
    lethality : 1,
    ctor : function(aTexture){
        this._super(aTexture);
        return true;
    },
    setLethality : function(lethality){
        this.lethality = lethality;
    },
    getLethality : function(){
        return this.lethality;
    },
    setIsDie : function(isDie){
        this.isDie = isDie;
    },
    getIsDie : function(){
        return this.isDie;
    }
});