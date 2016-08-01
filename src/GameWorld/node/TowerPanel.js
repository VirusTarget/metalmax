/**
 * Created by lingjianfeng on 15/4/2.
 */


var TowerPanel = cc.Layer.extend({
    listener : null,
    chooseTowerName : "",
    ctor : function(){
        this._super();
        this.loadTouchListener();
        this.loadTower();
        return true;
    },
    loadTouchListener : function(){
        var listener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches  : false,
            onTouchBegan    : this.onTouchBegan,
            onTouchMoved    : this.onTouchMoved,
            onTouchEnded    : this.onTouchEnded
        });
        this.listener = listener;
    },
    loadTower : function(){
        var towerBase = new cc.Sprite("#gp_towerPos.png");
        this.addChild(towerBase);
        towerBase.setPosition(0, 0);

        var arrowTower = new cc.Sprite("#gp_arrowTowerInfo.png");
        this.addChild(arrowTower);
        arrowTower.setName("arrow");
        arrowTower.setAnchorPoint(0.5, 0);
        arrowTower.setPosition(-towerBase.getContentSize().width, towerBase.getContentSize().height / 2);
        cc.eventManager.addListener(this.listener, arrowTower);

        var attackTower = new cc.Sprite("#gp_attackTowerInfo.png");
        this.addChild(attackTower);
        attackTower.setName("attack");
        attackTower.setAnchorPoint(0.5, 0);
        attackTower.setPosition(0, towerBase.getContentSize().height/2);
        cc.eventManager.addListener(this.listener.clone(), attackTower);

        var multiDirTower = new cc.Sprite("#gp_multiDirTowerInfo.png");
        this.addChild(multiDirTower);
        multiDirTower.setName("multiDir");
        multiDirTower.setAnchorPoint(0.5, 0);
        multiDirTower.setPosition(towerBase.getContentSize().width, towerBase.getContentSize().height/2);
        cc.eventManager.addListener(this.listener.clone(), multiDirTower);

    },
    onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var size = target.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);
        if (!(cc.rectContainsPoint(rect, locationInNode))) {
            return false;
        }

        target.parent.chooseTowerName = target.getName();

        return true;
    },
    onTouchMoved: function (touch, event) {
        var target = this.target;
    },
    onTouchEnded: function (touch, event) {
        var target = this.target;
    },
    getChooseTowerName : function(){
        return this.chooseTowerName;
    }
});
