export function updateTag(tagName, keyName, keyValue, attrName, attrValue){
  const node = document.head.querySelector(`${tagName}[${keyName}="${keyValue}"]`);
  if(node && node.getAttribute(attrName) === attrValue) return;
  if(node){
    node.parentNode.removeChild(node);
  }
  // 创建节点及添加其属性
  if(typeof attrValue === 'string'){
    const nextNode = document.createElement(tagName);
    nextNode.setAttribute(keyName, keyValue);
    nextNode.setAttribute(attrName, attrValue);
    document.head.appendChild(nextNode);
  }
}

export function updateMeta(name, content) {
  updateTag('meta', 'name', name, 'content', content);
}

export function updateCustomMeta(property, content){
  updateTag('meta', 'property', property, 'content', content);
}

export function updateLink(rel, href){
  updateTag('link', 'rel', rel, 'href', href);
}
