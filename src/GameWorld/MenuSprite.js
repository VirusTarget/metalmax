/**
 * Created by 路漫漫在狂奔 on 16/7/30.
 */

// 类型
var menu = {};

// 菜单精灵
var GameMenu = cc.Sprite.extend({
    _base       : null,                 // 背景
    _hand       : null,                 // 手指
    _listener   : null,                 // 监听器
    target      : null,
    callback    : null,                 // 回调函数
    _callbackSch: null,                 // 计时器[回调函数]
    ctor: function(baseTexture, handTexture, type){
        this._super();
        // 加载[监听器]
        this._loadListener();
        // 加载[底盘和摇杆精灵]
        this._loadGameMenu(baseTexture, handTexture);
        // 加载[配置]
        // this._loadConfig(type);
    },
    // 加载[监听器]
    _loadListener : function(){
        var listener = cc.EventListener.create({
            event           : cc.EventListener.TOUCH_ONE_BY_ONE,
            target          : this,
            swallowTouches  : true,
            onTouchBegan    : this.onTouchBegan,
            onTouchMoved    : this.onTouchMoved,
            onTouchEnded    : this.onTouchEnded
        });

        // TODO 内存管理问题的一种解决方案
        this.setUserObject(listener);
        cc.eventManager.addListener(listener, this);
        this._listener = listener;
    },
    // 加载精灵[_base和_knob]
    _loadGameMenu : function(baseTexture, handTexture){

        var label = new cc.LabelTTF("菜单", "Arial", 20);
        //创建菜单，并监听
        var node = new cc.MenuItemLabel(label,this.menucallback,this);
        node.setPosition(GC.w2, GC.h2 / 2);

        var menu = new cc.Menu(node);
        this.addChild(menu);
        menu.setPosition(0, 0);
    },
    // 加载配置[半径radius和类型type]
    _loadConfig : function(type,player){
        this.radius = this._base.getContentSize().width / 2;
        this.setCascadeOpacityEnabled(true);

        if (type !== undefined){
            if (isNaN(type)){
                this.type = type;
                if (this.type == RockerType.HIDE){
                    this.setVisible(false);
                }
            }else{
                this.type = RockerType.OPACITY;
                this.setOpacity(type);
            }
        }
    },
    // 获得角度
    _getAngle : function(pos){
        this.angle = Math.atan2(pos.y, pos.x) * 57.29577951;
        return this.angle;
    },
    // 获得弧度
    _getRadians : function(pos){
        this.radians = cc.PI / 180 * this._getAngle(pos);   // 角度转弧度
        return this.radians;
    },
    // 获取长度
    _getLength : function(pos){
        return Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    },
    onTouchBegan: function (touch, event) {
        var target = this.target;
        var knob = target._knob;
        var locationInNode = knob.convertToNodeSpace(touch.getLocation());
        var size = knob.getContentSize();
        var rect = cc.rect(0, 0, size.width, size.height);

        if (target.type == RockerType.DEFAULT){
            if (!cc.rectContainsPoint(rect, locationInNode)) {
                return false;
            }
        }else{
            if (target.type == RockerType.AUTO){
                target.setVisible(true);
            }
            // target.setPosition(touch.getLocation());
        }

        knob.setColor(cc.color.RED);

        return true;
    },
    onTouchMoved: function (touch, event) {

        // 节点获取
        var target = this.target;
        var knob = target._knob;
        var locationInNode = target.convertToNodeSpace(touch.getLocation());

        // 更新[角度]
        target._getAngle(locationInNode);
        // 更新[弧度]
        target._getRadians(locationInNode);
        // 更新[方向]
        target.onUpdateDirection(locationInNode);

        // 长度获取[当前触摸点相对摇杆中心点]
        var tmpLength = target._getLength(locationInNode);

        // _knob活动区域判断[如果_knob不在摇杆区域内]
        if ( tmpLength > target.radius){
            // TODO 速度更新[速度达到最大值]
            target.speed = 1;
            // _knob超出区域
            var x = Math.cos(target.radians) * target.radius;
            var y = Math.sin(target.radians) * target.radius;
            knob.setPosition(cc.p(x, y));
            // TODO 启动一个计时器，保证callback回调函数触发
            target.loadSchedule();
        }else{
            // TODO 速度更新
            target.speed = tmpLength / target.radius;
            knob.setPosition(locationInNode);
            target.unLoadSchedule();
            // TODO 手动调用, 保证callback被调用
            target.update();
        }

    },
    onTouchEnded: function (touch, event) {
        var target = this.target;
        var _knob = target._knob;
        _knob.setColor(cc.color.WHITE);
        _knob.setPosition(0, 0);
        target.direction = Direction.DEFAULT;

        target.unLoadSchedule();

        if (target.type == RockerType.AUTO){
            target.setVisible(false);
        }

    },
    loadSchedule : function(){
        if (this._callbackSch == null){
            this._callbackSch = this.scheduleUpdate();
        }
    },
    unLoadSchedule : function(){
        this.unscheduleAllCallbacks();
        this._callbackSch = null;
    },
    update : function(dt){
        // 回调函数
        (this.callback && typeof(this.callback) === "function") && this.callback();
    },
    // 角度更新
    onUpdateDirection : function(position){
        if(this.angle > -22.5 && this.angle < 67.5){
            this.direction = Direction.D_RIGHT;
        }
        // else if(this.angle > 22.5 && this.angle < 67.5){
        //     this.direction = Direction.D_RIGHT_UP;
        // }
        else if(this.angle > 67.5 && this.angle < 157.5){
            this.direction = Direction.D_UP;
        }
        // else if(this.angle > 112.5 && this.angle < 157.5){
        //     this.direction = Direction.D_LEFT_UP;
        // }
        else if((this.angle > 157.5 && this.angle < 180)||(this.angle < -157.5 && this.angle > -180)){
            this.direction = Direction.D_LEFT;
        }
        // else if(this.angle < -112.5 && this.angle > -157.5){
        //     this.direction = Direction.D_LEFT_DOWN;
        // }
        else if(this.angle < -67.5 && this.angle > -157.5){
            this.direction = Direction.D_DOWN;
        }
        // else if(this.angle < -22.5 && this.angle > -67.5){
        //     this.direction = Direction.D_RIGHT_DOWN;
        // }
    },
    // 触摸开关
    setTouchEnabled : function(enable){
        if (this._listener){
            if (enable){
                // 若有添加过，引擎会自动过滤。所以，任性的添加吧。
                cc.eventManager.addListener(this._listener, this);
            }else{
                cc.eventManager.removeListener(this._listener);
            }
        }else{
            cc.log("setTouchEnabled 无效！listener 为空...");
        }
    },
    onExit: function(){
        if (this._listener != null){
            cc.eventManager.removeListener(this._listener);
        }
        this._super();
    }

});
