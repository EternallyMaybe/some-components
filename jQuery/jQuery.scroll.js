/**
 * 滚动加载
 * 支持子元素scroll父元素容器不跟随滚动
 */
(function($) {
    $.fn.scroll = function(callback) {
        return $(this).each(function(index, item) {
            var eventType = "mousewheel";
            if(document.mozHidden) {
                eventType = "DOMMouseScroll";
            }
            $(item).on(eventType, function(e) {
                var _this = item,
                    scrollTop = _this.scrollTop,
                    scrollHeight = _this.scrollHeight,
                    clientHeight = _this.clientHeight,
                    delta = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail || 0);
                if (scrollHeight - clientHeight - 100 < scrollTop) {
                    callback && callback()
                }
                if (delta > 0 && scrollTop <= 0 || delta < 0 && scrollHeight - clientHeight == scrollTop) {
                    t.preventDefault();
                } 
            })
        })
    }
})(jQuery)