/**
 * Created by 路漫漫在狂奔 on 16/7/30.
 */

var GameWorldLayer = cc.Layer.extend({
    btn                 : null,
    menu                : 0,
    mapWidth            : 0,
    mapHeight           : 0,
    mapIndex            : 0,
    mapObject           : 0,
    startPoint          : 0,
    mapBg               : 0,
    rocker              : null,     // 摇杆
    player              : null,
    playerDir           : 0,        // [当前方向]
    playerSpeed         : 3.0,      // [速度]
    tank                : null,
    tankStatus          : null,
    tanktPoint          : 0,


    ctor:function () {
        this._super();
        //载入大地图
        this.loadBackground();
        //载入玩家
        this.loadMainLayer();
        // 加载摇杆
        this.loadRocker();

        return true;
    },
    loadBackground : function(){
        //载入tlie map
        this.map = new cc.TMXTiledMap(res.MainMap_tmx);
        this.mapBg = this.map.getLayer("bg");
        this.addChild(this.map,-1);
        //获取map size
        this.mapWidth = this.map.getContentSize().width;
        this.mapHeight = this.map.getContentSize().height;

        //获取map中的object
        this.mapObject = this.map.getObjectGroup('Object');
        this.startPoint = this.mapObject.getObject('startPoint');

    },
    setViewPointCenter : function(position) {

        // if (isInit) {
        //     //计算视角
        //     var x = Math.max(position.x, GC.w2);
        //     var y = Math.max(position.y, GC.h2);
        //     x = Math.min(x, (this.mapWidth * this.map.getTileSize().width) - GC.w2);
        //     y = Math.min(y, (this.mapHeight  * this.map.getTileSize().height) - GC.h2);

        //     //修正视角
        //     var viewPoint = cc.p(GC.w2-x, GC.h2-y);

        //     this.setPosition(viewPoint);

        // }else{
        //     var camera = this.getPosition();
        //     var isOut = Math.abs(position.x - (-camera.x));
        //     cc.log('isOut :'+isOut);

        //     if (position.x > GC.w2 && (position.x < (this.mapWidth - GC.w2)) ) {//视窗移动范围判定
        //         if (isOut < 200) {//视窗是否移动判定
        //             this.setPositionX(camera.x + this.cameraSpeed);
        //             this.rocker.setPositionX(camera.x + this.cameraSpeed);
        //         }
        //         if (isOut > 600) {
        //             this.setPositionX(camera.x - this.cameraSpeed);
        //             this.rocker.setPositionX(camera.x - this.cameraSpeed);
        //         }
        //     }
        // }


    },
    // 加载摇杆 按钮
    loadRocker : function(){
        this.rocker = new Rocker(res.JoystickBG, res.Joystick, 128);
        this.rocker.callback = this.onCallback.bind(this);
        this.addChild(this.rocker,2);
        this.rocker.setPosition(this.player.x-280,this.player.y-100);

        var labelA = new cc.LabelTTF("A", "Arial", 40);
        var labelB = new cc.LabelTTF("C", "Arial", 40);
        //创建菜单，并监听
        var nodeA = new cc.MenuItemLabel(labelA,this.onBtnCallback,this);
        var nodeB = new cc.MenuItemLabel(labelB,this.onBtnBCallback,this);
        // node.setPosition(this.player.x+200,this.player.y-100);
        this.btn = new cc.Menu(nodeA,nodeB);
        //添加的子节点水平间距
        this.btn.alignItemsHorizontallyWithPadding(50);
        this.addChild(this.btn,4);
        this.btn.setPosition(this.player.x+350,this.player.y-120);
        nodeB.setColor(cc.color.RED);
        nodeA.setColor(cc.color.BLUE);


    },
    // 回调函数[摇杆中触发]
    onCallback : function(sender){
        var dir = this.rocker.direction;
        if (dir != this.playerDir){
            this.playerDir = dir;
            this.playerChangeDir(this.playerDir);
        }else{
            this.onRun();
        }
    },
    // 回调函数[按钮触发]
    onBtnCallback : function(sender){
        // if (!this.menu) {
        //     this.menu =  new cc.Sprite(res.UI_Main_png);
        //     this.addChild(this.menu);
        // }
        // this.rocker.pause();
        // this.menu.setPosition(this.player.x,this.player.y-120);
        // this.menu.setVisible(true);

        //乘降系统 test
        this.player.setTexture('#NO7_1_1.png');
        cc.log('set NO7');
        this.tankStatus = 1;
        this.tank.setVisible(false);


        // var dir = this.rocker.direction;
        // if (dir != this.playerDir){
        //     this.playerDir = dir;
        //     this.playerChangeDir(this.playerDir);
        // }else{
        //     this.onRun();
        // }
    },
    // 回调函数[按钮触发]
    onBtnBCallback : function(sender){
            // this.menu.setVisible(false);
            this.player.setTexture('#lang_1_1.png');
            this.tankStatus = 0;
            this.tank.setPosition(this.player.x,this.player.y);
            this.tank.setVisible(true);
            // this.rocker.resume();
        // var dir = this.rocker.direction;
        // if (dir != this.playerDir){
        //     this.playerDir = dir;
        //     this.playerChangeDir(this.playerDir);
        // }else{
        //     this.onRun();
        // }
    },
    // 改变方向[切换帧动画]
    playerChangeDir : function(dir){
        this.player.stopAllActions();
        if (dir > 0){
            this.player.runAction(this.getAnimate(dir).repeatForever());
        }
    },
    // 获取动画
    getAnimate : function(dir){
        // 动作数组
        var animFrames = [];
        for (var i = 1; i < 5; i++) {
            if (this.tankStatus==1) {
                var str = "NO7_"+ i +'_' +dir + ".png";
            }else{
                var str = "lang_"+ i +'_' +dir + ".png";
            }

            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        var animation = new cc.Animation(animFrames, 0.1);
        return cc.animate(animation);
    },
    // 跑动[玩家]
    onRun : function(){
        // 获取摇杆方向
        var dir = this.rocker.direction;
        // 获取摇杆速度 (取值范围[0-1])
        var rockerSpeed = this.rocker.speed;
        // 获取摇杆弧度
        var radians = this.rocker.radians;

        switch (dir){
            case Direction.D_UP:
                this.player.y += rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_RIGHT:
                this.player.x += rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_DOWN:
                this.player.y -= rockerSpeed * this.playerSpeed;
                break;
            case Direction.D_LEFT:
                this.player.x -= rockerSpeed * this.playerSpeed;
                break;
            default :
                break;
        }
        //跟随玩家位置
        this.rocker.setPosition(this.player.x-280,this.player.y-100);
        this.btn.setPosition(this.player.x+350,this.player.y-120);
    },
    loadMainLayer : function(){

        cc.spriteFrameCache.addSpriteFrames(res.zhujiao_plist);
        cc.spriteFrameCache.addSpriteFrames(res.no7_plist);

        this.tankPoint = this.mapObject.getObject('NO7');
        this.tank = new cc.Sprite('#NO7_1_1.png');
        this.addChild(this.tank,1);
        this.tank.setScale(2);
        this.tank.setPosition(this.tankPoint);

        this.player = new cc.Sprite('#lang_1_1.png');
        this.addChild(this.player,1);
        this.player.name = '红狼';
        this.player.setPosition(this.startPoint);
        this.player.setScale(2);



        //视角跟随
        this.runAction(cc.follow(this.player, cc.rect(0, 0,this.mapWidth,this.mapHeight)));
        ;
        this.player.runAction(this.getAnimate(1));
        // 动作数组
        // var animFrames = [];
        // for (var i = 1; i < 5; i++) {
        //     var str = "红狼1" + i + ".png";
        //     var frame = cc.spriteFrameCache.getSpriteFrame(str);
        //     animFrames.push(frame);
        // }
        // //动画
        // var animation = new cc.Animation(animFrames, 0.1);
        // //动作
        // var animate = cc.animate(animation).repeatForever();


    }
});

var GameWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.loadResource();
        this.loadLayer();
    },
    onExit : function(){
        this.unLoadResource();
        this._super();
    },
    loadResource : function(){
    },
    unLoadResource : function(){
    },
    loadLayer : function(){
        var layer = new GameWorldLayer();
        this.addChild(layer);
    }
});
