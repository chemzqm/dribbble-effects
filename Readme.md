# Dribbble-effects

[dribbble](https://dribbble.com/) 上动画效果的实现。目前只有一个:


原效果图：

<img width="400px" height="300px" src="https://d13yacurqjgara.cloudfront.net/users/107759/screenshots/2372734/ink2.gif" alt="Ink2">

原链接： [Epic-Black-Friday-Deals](https://dribbble.com/shots/2372734-Epic-Black-Friday-Deals)

Deom 链接： https://chemzqm.github.io/dribbble-effects/friday.html

![链接](https://cloud.githubusercontent.com/assets/251450/11446265/4a7bb3fe-956f-11e5-8de5-918b6bca4628.png)

使用 iphone safari 保存到桌面再打开体验更佳。

项目只在最新版 Chrome 和 Safari 上进行了测试，其它浏览器估计不会去支持，不过欢迎反馈意见。实现上只使用了基础的 canvas，css transform 和 css transition, 所以浏览器支持应该问题不大。

已知问题：

* ios9 safari 不支持状态栏透明，所以现在只能是白色, 详情访问[此链接](https://forums.developer.apple.com/thread/9819)

* 不支持横屏(确切说这个效果不知道如何支持)，但是现在大部分浏览器并不支持[锁屏的 API](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation), 所以就将就下吧，毕竟只是为了实现效果
