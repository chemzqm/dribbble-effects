# Dribbble-effects

[dribbble](https://dribbble.com/) 上动画效果的 Javascript 实现。

项目只在最新版 Chrome 和 Safari 上进行了测试，其它浏览器估计不会去支持，不过欢迎反馈意见。

推荐使用 iphone safari 保存到桌面再打开。

## 第二个 Pull to Refresh in Marvel 5.0

原效果图：

<img width="400px" height="300px" src="https://d13yacurqjgara.cloudfront.net/users/8256/screenshots/2369618/pulltorefresh.gif" alt="Ink2">

原链接： [Pull to Refresh in Marvel 5.0](https://dribbble.com/shots/2369618-Pull-to-Refresh-in-Marvel-5-0)

Deom 链接： https://chemzqm.github.io/dribbble-effects/refresh.html

![qr-code](https://cloud.githubusercontent.com/assets/251450/11611081/85ec8cd2-9bf6-11e5-81cd-1517adb557c4.png)

主要使用了[chemzqm/iscroll](https://github.com/chemzqm/iscroll) 和[chemzqm/swipe-it](https://github.com/chemzqm/swipe-it)两个组件。

* 仅限移动设备体验
* 右上的图标是 unicode， 部分旧浏览器不支持带颜色
* 删除图标背景是 svg，部分浏览器不支持 svg 做为图片背景
* 下拉刷新的效果是 canvas 加 requestAnimationFrame 实现的，因为控制最灵活
* 删除图标动画是 css animation，因为实现简单


## 第一个 Epic-Black-Friday-Deals

原效果图：

<img width="400px" height="300px" src="https://d13yacurqjgara.cloudfront.net/users/107759/screenshots/2372734/ink2.gif" alt="Ink2">

原链接： [Epic-Black-Friday-Deals](https://dribbble.com/shots/2372734-Epic-Black-Friday-Deals)

Deom 链接： https://chemzqm.github.io/dribbble-effects/friday.html

![qr-code](https://cloud.githubusercontent.com/assets/251450/11446265/4a7bb3fe-956f-11e5-8de5-918b6bca4628.png)


已知问题：

* ios9 safari 不支持状态栏透明，所以现在只能是白色, 详情访问[此链接](https://forums.developer.apple.com/thread/9819)

* 不支持横屏(确切说这个效果不知道如何支持)，但是现在大部分浏览器并不支持[锁屏的 API](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation), 所以就将就下吧，毕竟只是为了实现效果

## 本地运行

    npm install
    gulp
    open http://localhost:3000/example/friday.html
