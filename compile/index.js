const CompileUtil = {
  text (node, expression, vm) {
    // 处理文本指令（例如 {{ someProperty }}）
    const updateText = () => {
      // 从 {{ }} 表达式中提取属性名
      const propertyName = expression.replace(/\{\{(.+?)\}\}/, '$1');
      // 从视图模型中获取属性的值
      const propertyValue = this.getVMValue(vm, propertyName);
      // 使用解析后的属性值更新节点的文本内容
      node.textContent = propertyValue;
    };

    // 初始更新
    updateText();

    // 创建一个观察者，以便在属性值更改时更新文本内容
    new Watcher(vm, expression, updateText);
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
    node.addEventListener(eventName, propertyValue.bind(vm));
  },

  // 辅助方法：从视图模型中获取属性的值
  getVMValue (vm, propertyName) {
    let value = vm;
    propertyName.split('.').forEach(key => {
      value = value[key];
    });
    return value;
  }
};

// 导出 CompileUtil
export { CompileUtil };