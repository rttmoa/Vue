class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        this.oldVal = this.getOldVal()
    }
    getOldVal(){
        Dep.target = this;
        // console.log(Dep);
        /* 
            getVal会触发对象属性的get方法,从而往Dep中添加观察者（Watcher）
        */
        let oldVal = compileUtil.getVal(this.expr,this.vm);
		// 添加完需要注销,方式重复挂载
        Dep.target = null;
        // console.log(Dep);
        return oldVal;
    }
    update(){
        const newVal = compileUtil.getVal(this.expr,this.vm);
        if (newVal !== this.oldVal) {
            this.cb(newVal);
        }
    }
}

// 依赖收集器
class Dep{
    constructor(){
        this.subs = [];
    }
    // 收集观察者
    addSub(watcher){
        this.subs.push(watcher);
    }

    // 通知观察者去更新视图
    notify(){
        console.log('观察者',this.subs);
        this.subs.forEach(w=>w.update());
    }
}

// 观察者类
class Observer{
    constructor(data){
        this.observer(data);
    }
    observer(data){
        if(data && typeof data === 'object'){
            Object.keys(data).forEach(key=>{
                this.defineReactive(data,key,data[key]);
            });
        }
    }
    defineReactive(data,key,value){
        // 递归遍历
        this.observer(value);
        let dep = new Dep();
        Object.defineProperty(data,key,{
            enumerable:true,
            configurable:false,
            get(){
                // 订阅数据变化时,往Dep中添加观察者
                Dep.target && dep.addSub(Dep.target);
                return value;
            },
            set:(newVal)=>{
                this.observer(newVal);
                if(newVal !== value){
                    value = newVal;
                }
                // 告诉Dep通知变化
                dep.notify();
            }
        });
    }
}