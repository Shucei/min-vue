const CompileUtil = {
  // ...

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

  // ...

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