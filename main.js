/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "noCache"       : false,
    // "noCache" set whether your resources will be loaded with a timestamp suffix in the url.
    // In this way, your resources will be force updated even if the browser holds a cache of it.
    // It's very useful for mobile browser debuging.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading"))
        document.body.removeChild(document.getElementById("cocosLoading"));

    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);

    cc.view.adjustViewPort(true);

    cc.view.setDesignResolutionSize(640, 480, cc.ResolutionPolicy.FIXED_HEIGHT);

    cc.view.resizeWithBrowserSize(true);

    cc.director.setContentScaleFactor(864.0 / 864.0);
    // 1. cc.ResolutionPolicy.EXACT_FIT
    //  屏幕宽 与 设计宽比 作为X方向的缩放因子，屏幕高 与 设计高比 作为Y方向的缩放因子。
    //  保证了设计区域完全铺满屏幕，但是可能会出现图像拉伸。

    // 2. cc.ResolutionPolicy.NO_BORDER
    // 屏幕宽、高分别和设计分辨率宽、高计算缩放因子，取较(大)者作为宽、高的缩放因子。
    // 保证了设计区域总能一个方向上铺满屏幕，而另一个方向一般会超出屏幕区域。
    // 官网【以前】推荐使用的方式。
    // 比较【蛋疼】的是要结合 VisibleOrigin和VisibleSize 这两个鬼东西来使用。

    // 3. cc.ResolutionPolicy.SHOW_ALL
    // 全屏铺满， 但是，会产生黑边。

    // 4. cc.ResolutionPolicy.FIXED_HEIGHT
    // 高度固定，根据屏幕分辨率修正设计分辨率的宽度。

    // 5. cc.ResolutionPolicy.FIXED_WIDTH
    // 宽度固定，根据屏幕分辨率修正设计分辨率的高度。

    // 6. cc.ResolutionPolicy.UNKNOWN

    // Resources Width : 简写为RW --> 资源宽度
    // Resources Height: 简写为RH --> 资源高度
    // Design Width  : 简写为DW   --> 设计宽度
    // Design Height : 简写为DH   --> 设计高度

    // 【大总结】：
    // 现在行业内常用的2种常见屏幕适配方案：
    // 1. cc.ResolutionPolicy.SHOW_ALL
    // 例举：宝宝巴士所有产品、节奏大师

    // 2. cc.ResolutionPolicy.FIXED_WIDTH 和 cc.ResolutionPolicy.FIXED_WIDTH
    // 举例: 三国之刃，刀塔传奇

    // 【我如何选】
    // 1. 土豪，任性的话， 那你就选SHOW_ALL的方式
    // 2. 其他【一般】情况
    //    2.1 横屏 ： 固定高度， 宽度修正【注意了，这里不是拉伸，而是修正】
    //          通用公式：
    //            第一步 ：cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.FIXED_HEIGHT);
    //            第二步 ：cc.director.setContentScaleFactor(864 / 640)
    //    2.2 竖屏 ： 固定宽度， 高度修正
    //            第一步 ：cc.view.setDesignResolutionSize(640, 960, cc.ResolutionPolicy.FIXED_WIDTH);
    //            第二步 ：cc.director.setContentScaleFactor(资源高度/设计高度)

    // 实用小贴士
    // 关闭浏览器全屏调试 ： CCEGLView.js -> _autoFullScreen : false,

    //全局配置实现
    GC.winSize = cc.director.getWinSize();
    GC.w = GC.winSize.width;
    GC.h = GC.winSize.height;
    GC.w2 = GC.w / 2;
    GC.h2 = GC.h / 2;

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new StartMenuScene());
        // cc.director.runScene(new GameWorldScene());
        // cc.director.runScene(new ChooseLevelScene());
        //cc.director.runScene(new LevelInfoScene());
        //cc.director.runScene(new GameOverScene());

        //new LevelLoader(1);
        //cc.log("=====================");
        //cc.log(GameManager.getInstance());
        //cc.log("=====================");
        //cc.director.runScene(new GamePlayScene());

    }, this);

};
cc.game.run();

