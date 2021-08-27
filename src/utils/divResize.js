function _handleResize(e) {
  var ele = e.target || e.srcElement;
  var trigger = ele.__resizeTrigger__;
  if (trigger) {
    var handlers = trigger.__z_resizeListeners;
    if (handlers) {
      var size = handlers.length;
      for (var i = 0; i < size; i++) {
        var h = handlers[i];
        var handler = h.handler;
        var context = h.context;
        handler.apply(context, [e]);
      }
    }
  }
}
function _removeHandler(ele, handler, context) {
  var handlers = ele.__z_resizeListeners;
  if (handlers) {
    var size = handlers.length;
    for (var i = 0; i < size; i++) {
      var h = handlers[i];
      if (h.handler === handler && h.context === context) {
        handlers.splice(i, 1);
        return;
      }
    }
  }
}
function _createResizeTrigger(ele) {
  var obj = document.createElement("object");
  obj.setAttribute("style",
    "display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;");
  obj.onload = _handleObjectLoad;
  obj.type = "text/html";
  ele.appendChild(obj);
  obj.data = "about:blank";
  return obj;
}
function _handleObjectLoad(evt) {
  this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
  this.contentDocument.defaultView.addEventListener("resize", _handleResize);
}

export function onResize(ele, handler, context) {
  var handlers = ele.__z_resizeListeners;
  if (!handlers) {
    handlers = [];
    ele.__z_resizeListeners = handlers;
    if (document.attachEvent) { //ie9-10
      ele.__resizeTrigger__ = ele;
      ele.attachEvent("onresize", _handleResize);
    } else {
      if (getComputedStyle(ele, null).position === "static") {
        ele.style.position = "relative";
      }
      var obj = _createResizeTrigger(ele);
      ele.__resizeTrigger__ = obj;
      obj.__resizeElement__ = ele;
    }
  }
  handlers.push({
    handler: handler,
    context: context
  });
}
export function offResize(ele, handler, context) {
  var handlers = ele.__z_resizeListeners;
  if (handlers) {
    _removeHandler(ele, handler, context);
    if (handlers.length === 0) {
      if (document.attachEvent) { //ie9-10
        ele.detachEvent("onresize", _handleResize);
      } else {
        var trigger = ele.__resizeTrigger__;
        if (trigger && trigger.contentDocument) {
          trigger.contentDocument.defaultView.removeEventListener("resize", _handleResize);
          ele.removeChild(trigger);
          delete ele.__resizeTrigger__;
        }
      }
      delete ele.__z_resizeListeners;
    }
  }
}
