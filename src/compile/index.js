const CompileUtil = {
  /**
 * 
 * @param {*} node 
 * @description 编译文本节点
 * @example <div>{{ message }}</div>
 */
  text (node, expression, vm) {
    // 处理文本指令（例如 {{ someProperty }}）
    let value = ''
    const updateText = () => {
      // 从 {{ }} 表达式中提取属性名
      const reg = /\{\{ * (.+?) *\}\}/g;
      if (reg.test(expression)) {
        value = expression.replace(reg, (matched, placeholder) => {
          // 从视图模型中获取属性的值
          const propertyValue = this.getVMValue(vm, placeholder);
          // 使用解析后的属性值更新节点的文本内容
          node.textContent = propertyValue;
          return propertyValue;
        })
      }
    };

    // 初始更新
    updateText();

    // 创建一个观察者，以便在属性值更改时更新文本内容
    new Watcher(vm, value, updateText);
  },
  model (node, expression, vm) {
    // 处理模型指令（例如 v-model="someProperty"）
    // 从视图模型中获取属性的值
    const propertyValue = this.getVMValue(vm, expression);

    // 使用解析后的属性值更新节点的文本内容
    node.value = propertyValue;
  },

  bind (node, expression, vm, eventName) {
    // 处理绑定指令（例如 v-bind:href="someProperty"）
    // 从视图模型中获取属性的值
    const propertyValue = this.getVMValue(vm, expression);
    // 使用解析后的属性值更新节点的文本内容
    node.setAttribute(eventName, propertyValue);
  },

  on (node, expression, vm, eventName) {
    // 处理事件指令（例如 v-on:click="someProperty"）
    // 从视图模型中获取属性的值
    const propertyValue = this.getVMValue(vm, expression);
    // 使用解析后的属性值更新节点的文本内容
    node.addEventListener(eventName, vm.$methods[expression].bind(vm.$data))

  },

  // 辅助方法：从视图模型中获取属性的值
  getVMValue (vm, propertyName) {
    let value = vm;
    propertyName.split('.').forEach(key => {
      value = vm[key];
    });
    return value;
  }
};

class Watcher {
  constructor(vm, expression, callback) {
    this.vm = vm;
    this.expression = expression;
    this.callback = callback;
    this.oldValue = this.get();
  }

  get () {
    Dep.target = this;
    const value = CompileUtil.getVMValue(this.vm, this.expression);
    Dep.target = null;
    return value;
  }

  update () {
    const newValue = CompileUtil.getVMValue(this.vm, this.expression);
    if (newValue !== this.oldValue) {
      this.callback(newValue);
    }
  }
}


class Dep {
  constructor() {
    this.subs = [];
  }

  addSub (sub) {
    this.subs.push(sub);
  }

  notify () {
    this.subs.forEach(sub => sub.update());
  }
}





// 导出 CompileUtil
export default CompileUtil;