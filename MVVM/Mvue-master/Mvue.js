
const compileUtil = {
    getVal(expr,vm){
        /* 
        ruduce为数组方法,从左到右处理数组的每个成员,
        写上第二个参数后,一开始data的值为vm.$data,currentVal的值为数组中的第一个值
        */
       console.log(expr);
        return expr.split('.').reduce((data,currentVal)=>{
            // console.log(data[currentVal]);
            return data[currentVal];
        },vm.$data);
    },
    setVal(expr,vm,inputVal){
        return expr.split('.').reduce((data,currentVal)=>{
            data[currentVal] = inputVal;
        },vm.$data);
    },
    getContentVal(expr,vm){
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(args[1],vm);
        })
    },
    text(node,expr,vm){ //expr : data中的属性名
        let value;
        if(expr.indexOf('{{') !== -1){
            value = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
                console.log(expr)
                new Watcher(vm,args[1],(newVal)=>{
                    this.updater.textUpdater(node,this.getContentVal(expr,vm));
                });
                return this.getVal(args[1],vm);
            })
        }else{
            value = this.getVal(expr,vm);   //获取属性值
        }
        this.updater.textUpdater(node,value);
    },
    html(node,expr,vm){
        // console.log(expr.split('.'));
        const value = this.getVal(expr,vm);
        new Watcher(vm,expr,(newVal)=>{
            this.updater.htmlUpdater(node,newVal);
        });
        this.updater.htmlUpdater(node,value);
    },
    model(node,expr,vm){
        const value = this.getVal(expr,vm);
        // 绑定更新函数 数据 => 视图
        new Watcher(vm,expr,(newVal)=>{
            this.updater.modelUpdater(node,newVal);
        });

        // 视图 => 数据 => 视图
        node.addEventListener('input',(e)=>{

            // 设置值
            this.setVal(expr,vm,e.target.value);
        });
        this.updater.modelUpdater(node,value);
    },
    bind(node,expr,vm,attrName){

    },
    on(node,expr,vm,eventName){
        let fn = vm.$options.methods && vm.$options.methods[expr];
        node.addEventListener(eventName,fn.bind(vm),false);
    },
    // 更新函数
    updater:{
        textUpdater(node,value){
            node.textContent = value;
        },
        htmlUpdater(node,value){
            node.innerHTML = value;
        },
        modelUpdater(node,value){
            node.value = value;
        },
    }
}
class Compile{
    constructor(el,vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        // 1.获取文档碎片对象,放入内存中会减少页面的回流和重绘
        const fragment = this.nodeFragment(this.el);
        // console.log(fragment);

        //2.编译模板
        this.compile(fragment);

        //3.追加子元素到根元素
        this.el.appendChild(fragment);
    }

    /* 编译模板 */
    compile(fragment){
        // 1.获取子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                // 是元素节点
                // 编译元素节点
                // console.log('元素节点',child);
                this.compileELement(child);
            }else{
                // 文本节点
                // 编译文本节点
                // console.log('文本节点',child);
                this.compileText(child);
            }

            if(child.childNodes && child.childNodes.length){
                this.compile(child);
            }
        });
    }
    /* 编译元素节点 */
    compileELement(node){
        // 获取元素节点的属性
        const attributes = node.attributes;
        [...attributes].forEach(attr =>{
            const {name,value} = attr;
            if(this.isDirective(name)){ //是一个指令 v-text v-model
                const [,dirctive] = name.split('-');//分割指令名,例如text html model
                const [dirName,eventName] = dirctive.split(':'); //分割事件名
                // console.log(dirName,eventName,value);
                // 把数据编译到视图中
                compileUtil[dirName](node,value,this.vm,eventName);

                // 删除有指令的标签上的属性
                node.removeAttribute('v-'+dirctive);
            }else if(this.isEventName(name)){ //处理@event指令
                let [,eventName] = name.split('@');
                compileUtil['on'](node,value,this.vm,eventName);
            }
        });
    }

    /* 编译文本节点 */
    compileText(node){
        const content = node.textContent;
        // 使用正则表达式匹配双大括号
        if(/\{\{(.+?)\}\}/.test(content)){
            console.log(content);
            compileUtil['text'](node,content,this.vm);
        }
    }
    /* 将el添加到文档碎片中 */
    nodeFragment(el){
        // 创建文档碎片(DocumentFragment节点对象)
        const f = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            //appendChild 如果文档树中已经存在了firstChild，它将从文档树中删除，然后重新插入它的新位置。
            f.appendChild(firstChild);
        }
        return f;
    }

    isEventName(attrName){
        return attrName.startsWith('@');
    }

    /* 判断是否是HTML元素 */
    isElementNode(node){
        return node.nodeType === 1;    
    }

    /* 判断是否是原生属性 */
    isDirective(attrName){
        return attrName.startsWith('v-');
    }
}


class Mvue{
    constructor(options){
        this.$el = options.el;
        this.$data = options.data;
        this.$options = options;
        if (this.$el) {
            // 1.实现一个数据观察者
            new Observer(this.$data);
            // 2.实现一个指令解析器
            new Compile(this.$el,this);
            this.proxyData(this.$data);
        }
    }
    // 设置代理, 使用this代理this.$data
    proxyData(data){
        for(const key in data){
            Object.defineProperty(this,key,{
                get(){
                    return data[key];
                },
                set(newVal){
                    data[key] = newVal;
                }
            });
        }
    }
}