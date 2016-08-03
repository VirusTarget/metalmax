/**
 * Created by 路漫漫在狂奔 on 16/7/30.
 */

var MMMainLayer = cc.Layer.extend({
    btnStart : null,
    ctor:function () {
        this._super();
        // 加载[Title]
        this.loadTitle();
        // 加载[开始按钮]
        this.loadStartButton();
        // 加载[粒子系统]_开始按钮
        this.loadStartButtonParticle();
        return true;
    },
    loadTitle : function(){
        //标题
        var node = new cc.LabelTTF("MetalMax 2016R", "Arial", 38);
        node.setPosition(GC.w/2,GC.h / 3);
        this.addChild(node);

        //移动标题
        var move = cc.moveBy(10.0, cc.p(0, 150));
        var action = cc.sequence(move, move.reverse()).repeatForever();
        node.runAction(action);

    },
    loadStartButton : function(){

        var label = new cc.LabelTTF("开始游戏", "Arial", 50);

        //创建菜单，并监听
        var node = new cc.MenuItemLabel(
            label,
            function(){
                var scene = new GameWorldScene();
                cc.director.runScene(  scene );
            },
            this
        );
        node.setPosition(GC.w2, GC.h2 / 2-10);

        var menu = new cc.Menu(node);
        this.addChild(menu);
        menu.setPosition(0, 0);

        this.btnStart = node;
    },
    loadStartButtonParticle : function(){
        var node = new cc.ParticleSystem(res.startParticle_plist);
        this.addChild(node);
        node.setPosition(this.btnStart.x - this.btnStart.width / 2, this.btnStart.y - this.btnStart.height / 2);

        var action = this.getFollowAction(50, this.btnStart);
        node.runAction(action);
    },
    // 获取[描边动作]
    getFollowAction : function(stretch, node){
        var width = node.width;
        var height = node.height;

        var bezier1 = [cc.p(-stretch, 0), cc.p(-stretch, height), cc.p(0, height)];
        var bezierBy1 = cc.bezierBy(0.6, bezier1);
        var move1 = new cc.moveBy(0.7, cc.p(width, 0));

        var bezier2 = [cc.p(stretch, 0), cc.p(stretch, -height), cc.p(0, -height)];
        var bezierBy2 = cc.bezierBy(0.6, bezier2);
        var move2 = new cc.moveBy(0.7, cc.p(-width, 0));

        var action = cc.sequence(bezierBy1, move1, bezierBy2, move2).repeatForever();
        return action;
    }
});
