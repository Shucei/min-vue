import CompileUtil from './compile/index.js';
import { observe } from './observe/index.js';

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el;
    this.$methods = options.methods;
    this.$computed = options.computed;
    this.$watch = options.watch;
    this.$template = document.querySelector(this.$el);
    this.initState(this.$data) // 初始化数据
    this.compile(this.$template) // 编译模板
  }

  compile (node) {
    const childNodes = node.childNodes;
    childNodes.forEach(child => {
      if (child.nodeType === 1) {
        // 元素节点
        const attributes = child.attributes; // 获取元素节点的属性
        console.log(attributes);
        [...attributes].forEach(attr => {
          const { name, value } = attr;
          if (name.startsWith('v-')) {
            const [, directive] = name.split('-');
            const [directiveName, eventName] = directive.split(':');
            console.log(directiveName, eventName);
            CompileUtil[directiveName](child, value, this, eventName);
          }
          if (name.startsWith('@')) {
            const [, eventName] = name.split('@');
            CompileUtil.on(child, value, this, eventName);
          }
        })

        // #region
        // if (child.hasAttribute('@click')) {
        //   console.log('click', child.getAttribute('@click'));
        //   child.addEventListener('click', this.$methods[child.getAttribute('@click').trim()].bind(this.$data))
        // }
        // #endregion

        // 递归编译子节点
        if (child.childNodes.length > 0) {
          this.compile(child)
        }

        // this.compileElement(child);
      } else if (child.nodeType === 3) {
        // 文本节点
        CompileUtil.text(child, child.textContent, this);
      }
    })
  }

  /**
   * 
   * @param {*} node 
   * @description 编译元素节点
   * @example <div v-text="message"></div>
   */
  // compileElement (node) {
  //   const attributes = node.attributes; // 获取元素节点的属性
  //   [...attributes].forEach(attr => {
  //     const { name, value } = attr;
  //     if (name.startsWith('v-')) {
  //       const [, directive] = name.split('-');
  //       const [directiveName, eventName] = directive.split(':');
  //       // CompileUtil[directiveName](node, value, this, eventName);
  //     }
  //   })
  // }


  initState (data) {
    if (data) {
      data = typeof data === 'function' ? data.call(this) : data //data可能是函数可能是对象
      this._data = data
      // 对数据进行劫持，vue2采用了一个api defineProperty
      observe(data)
      // 将vm._data 用vm来代理，这样就可以直接使用vm.name 不需要 vm._data.name
      for (let key in data) {
        this.proxy(this, '_data', key)
      }
    }
  }

  proxy (vm, target, key) {
    Object.defineProperty(vm, key, {
      get () {
        return vm[target][key]
      },
      set (newValue) {
        vm[target][key] = newValue
      }
    })
  }
}


const vm = new Vue({
  el: "#app",
  data: {
    message: "hello world",
  },
  methods: {
    btn () {
      console.log("btn", "我是点击事件");
    },
  },
});


export default Vue;
