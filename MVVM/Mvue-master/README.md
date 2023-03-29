## MVVM响应式原理
`vue`是采用数据劫持配合发布者-订阅模式的方式,通过`Object.defineProperty()`来劫持各个属性的`setter`和`getter`,在数据变动时,发布消息给依赖收集器,去通知观察者,做出对应的回调函数,去更新视图.
`MVVM`作为绑定的入口,整合`Observer`,`Compile`和`Watcher`三者,通过`Observer`来监听`model`数据变化,通过`Compile`来解析编译模板指令,最终利用`Watcher`搭起`Observer`,`Compile`之间的通信桥梁,达到数据变化=>视图更新;视图交互变化=>数据`model`变更的双向绑定效果。