/**
 * Created by lingjianfeng on 15/4/1.
 */


var MMBackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        // 加载[背景]
        this.loadBg();
        return true;
    },
    loadBg : function(){
        var node = new cc.Sprite(res.start_bg_png);
        this.addChild(node);
        node.setPosition(GC.w2, GC.h2+100);
    }
});
