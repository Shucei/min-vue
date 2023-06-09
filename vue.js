// import CompileUtil from './compile/index.js';

class Vue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    this.$el = options.el;
    this.$methods = options.methods;
    this.$computed = options.computed;
    this.$watch = options.watch;
    this.$template = document.querySelector(this.$el);
    this.compile(this.$template)
    console.log('DOM', this.$template);
  }

  compile (node) {
    const childNodes = node.childNodes;
    childNodes.forEach(child => {
      if (child.nodeType === 1) {
        // 元素节点
        console.log('元素节点', child);
        this.compile(child)
        // this.compileElement(child);
      } else if (child.nodeType === 3) {
        // 文本节点
        console.log('文本节点', child);
        this.compileText(child);
      }
    })
  }

  compileElement (node) {
    const attributes = node.attributes;
    [...attributes].forEach(attr => {
      const { name, value } = attr;
      if (name.startsWith('v-')) {
        const [, directive] = name.split('-');
        const [directiveName, eventName] = directive.split(':');
        // CompileUtil[directiveName](node, value, this, eventName);
      }
    })
  }

  compileText (node) {
    const content = node.textContent; // 获取文本节点的内容
    const reg = /\{\{(.+?)\}\}/g;
    if (reg.test(content)) {
      node.textContent = content.replace(reg, (matched, placeholder) => {
        console.log('matched', matched);  //matched {{ message }}
        console.log('placeholder', placeholder); //placeholder  message
        return this.$data[placeholder.trim()];
      })
    }

    // if (/\{\{(.+?)\}\}/.test(content)) {
    //   CompileUtil['text'](node, content, this);// {{a}} {{b}}
    // }

  }
}