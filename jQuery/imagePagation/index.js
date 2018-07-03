var render = require('./imagePagation.art');

/*
 * @des 仿百度图片查看图片时的图片列表分页 
 * @params options 配置参数
 * @params list 获取到的图片列表
 * @params inited 是否已经初始化
 * @params startIndex 获取到的图片列表的开始下标
 * @params endIndex 获取到的图片列表的结束下标
 * @params showImages 展示图片的起止下标
 * @params slideThrottle 点击图片时的滚动函数
 * @params turnPageThrottle 列表翻页时的函数
 */
function ImagePagation() {
    this.options = {},
    this.list = [],
    this.inited = true,
    this.startIndex = 0,
    this.endIndex = 0,
    this.showImages = {
        startIndex: 0,
        endIndex: 0
    };
    var self = this;
    this.slideThrottle = throttle((id) => {
        self.slide(id)
    }, 450);
    this.turnPageThrottle = throttle((direction, num) =>{
        self.turnPage(direction, num)
    }, 450);
}
// 初始数据
ImagePagation.prototype.init = function(options) {
    var _default = {
        mount: "#imagePagation",
        activeIndex: 0,
        pageSize: 20
    }

    options.activeIndex = parseInt(options.activeIndex, 10);
    // 选中图片所对应的页码
    this.currentPage = Math.ceil((options.activeIndex + 1) / options.pageSize);
    this.startIndex = (this.currentPage - 1) * options.pageSize;
    this.endIndex = this.currentPage * options.pageSize;
    this.options = Object.assign({}, _default, options);
    this.render();
    this.bindPageEvent();
}
// 初始渲染
ImagePagation.prototype.render = function() {
    var direction = this.getDirection(this.options.activeIndex, 3);
    $(this.options.mount).html(render());
    this.getList(this.currentPage, this.options.pageSize, 1);
    0 !== direction && this.startIndex > 0 && this.getList(this.currentPage + direction, this.options.pageSize, direction);
    this.initViewArea();
    this.renderList(direction, 7);
    this.bindItemEvent();
}
// 初始展示图片的下标
ImagePagation.prototype.initViewArea = function() {
    var startIndex = this.options.activeIndex - 3,
        endIndex = this.options.activeIndex + 3;
    if (startIndex < 0) {
        startIndex = 0;
        endIndex = this.total > 6 ? 6 : this.total;
    } else if (endIndex >= this.total) {
        startIndex = this.total > 6 ? this.total - 7 : 0;
        endIndex = this.total - 1;
    }
    this.showImages = {
        startIndex: startIndex,
        endIndex: endIndex
    }
}

ImagePagation.prototype.getDirection = function(activeIndex, num) {
    return activeIndex - num < this.startIndex ? -1 : activeIndex + num > this.endIndex ? 1 : 0
}

// 获取数据
ImagePagation.prototype.getList = function(page, pageSize, direction) {
    var self = this;
    $.ajax({
        url: '',
        type: "get",
        dataType: "json",
        async: false,
        success: function(res) {
            var data = res.Message.data,
                total = res.Message.total;
            self.total = total;
            self.totalPage = Math.ceil(s / i.options.pageSize);
            if (direction > 0) {
                self.list = self.list.concat(data);
                self.endIndex = page * pageSize < total ? page * pageSize - 1 : total - 1;
            } else {
                self.list = data.concat(self.list);
                self.endIndex = (page - 1) * pageSize;
            }
        }
    })
}
// 数据渲染
ImagePagation.prototype.renderList = function(direction, num) {
    var $panel = $(".image-pagation .panel"),
        indexArr = this.getStartIndex(direction, num),
        data = this.list.slice(indexArr[0], indexArr[0] + num),
        html = '';
    for (var i = 0, total = data.length; i < total; i++) {
        html += '<div class="image-item" data-resourceId="' + data[c].id + '" data-index="' + (indexArr[1] + i) + '"><img src="' + data.cover + '"/></div>'
    }
    direction > 0 ? $panel.append(i) : $panel.prepend(i),
    this.setActive(this.options.activeId)
}
/*
 * @des 获取开始下标
 * @return  index：对应已获取数据的下标  realIndex：对应所有数据的下标
 */
ImagePagation.prototype.getStartIndex = function(direction, num) {
    var index = direction > 0 ? this.showImages.endIndex + 1 : this.showImages.startIndex - num,
        realIndex = 0;
    if (this.inited) {
        index = this.showImages.startIndex,
        this.inited = !this.inited
    } 
    realIndex = index;
    if (this.list.length < this.showImages.startIndex) {
        index -= this.startIndex;
    }
    return [index, realIndex]
}
// 图片移动
ImagePagation.prototype.translate = function(direction, num) {
    var self = this
        $panel = $(".image-pagation .panel")
        left = parseInt($panel.css("left"), 10) - 73 * num;
    if (direction < 0) {
        i.css({left: left + "px"});
        left = 0;
    } 
    $panel.animate({
        left: left + "px"
    }, 500, function() {
        self.deleteByNum(-direction, num),
        $panel.css({left: "0"}),
        self.bindItemEvent()
    })
}
// 设置激活样式
ImagePagation.prototype.setActive = function(id) {
    var $item = $(".panel .image-item"),
        $activeItem = $(".panel div[data-resourceId=" + id + "]");
    $item.removeClass("active"),
    $activeItem.addClass("active")
}
// 删除指定数量的元素
ImagePagation.prototype.deleteByNum = function(direction, num) {
    var $item = $(".panel .image-item"),
        i = direction > 0 ? $item.length - num : 0,
        total = direction > 0 ? $item.length : num;
    for (i; i < total; i++) {
        $item[i].remove()
    }
}
// 设置展示图片的起始下标
ImagePagation.prototype.setImagesIndex = function(num) {
    this.showImages.endIndex += num;
    this.showImages.startIndex += num;
}
// 获取真实数量
ImagePagation.prototype.getRealNum = function(direction, num) {
    var realNum = direction * num;
    if (direction > 0 && this.showImages.endIndex + direction * num > this.endIndex) {
        realNum = this.endIndex - this.showImages.endIndex
    } 
    if (direction < 0 && this.showImages.startIndex + direction * num < this.startIndex) {
        realNum = this.startIndex - this.showImages.startIndex
    }
    realNum
}
// 绑定翻页事件
ImagePagation.prototype.bindPageEvent = function() {
    var self = this,
        $pre = $(".image-pagation .pagation-pre"),
        $next = $(".image-pagation .pagation-next");
    $pre.on("click", function() {
        0 !== e.showImages.startIndex && this.turnPageThrottle(-1, 7)
    }),
    $next.on("click", function() {
        self.showImages.endIndex !== self.endIndex && this.turnPageThrottle(1, 7)
    })
}
// 图片点击事件
ImagePagation.prototype.bindItemEvent = function() {
    var self = this;
    $(".panel .image-item").off("click").on({
        click: function() {
            var id = $(this).attr("data-resourceId");
            self.slideThrottle(id),
            self.options.callback && self.options.callback(id)
        }
    })
}
// 翻页
ImagePagation.prototype.turnPage = function(direction, num) {
    var realNum = this.getRealNum(direction, num);
    this.getMoreData(direction, direction * num),
    this.renderList(direction, Math.abs(realNum)),
    this.translate(direction, Math.abs(realNum)),
    this.setImagesIndex(realNum)
}
// 图片移动
ImagePagation.prototype.slide = function(id) {
    var $item = $(".panel .image-item"),
        $activeItem = $(".panel .image-item[data-resourceId=" + id + "]"),
        avtiveIndex = parseInt($activeItem.attr("data-index"), 10),
        index = $item.index($activeItem),
        realNum = index - 3,
        direction = realNum > 0 ? 1 : -1;

    if (3 === index || index === -1) {
        this.setActive(id);
        return;
    }
    this.getMoreData(direction, realNum);

    if (avtiveIndex < 3 || avtiveIndex + 3 > this.endIndex) {
        realNum = 0;
    }   
    if (avtiveIndex < 3 && this.showImages.startIndex !== this.startIndex && avtiveIndex >= this.showImages.startIndex) {
        realNum = this.startIndex - this.showImages.startIndex;
    }
    if (avtiveIndex + 3 > this.endIndex && this.showImages.endIndex >= avtiveIndex && this.showImages.endIndex !== this.endIndex) {
        realNum = this.endIndex - this.showImages.endIndex
    }
    this.renderList(direction, Math.abs(realNum)),
    this.translate(direction, Math.abs(realNum)),
    this.setImagesIndex(a),
    this.options.activeId = id,
    this.setActive(id)
}

ImagePagation.prototype.getMoreData = function(direction, realNum) {
    if(direction > 0 && this.currentPage < this.totalPage && this.showImages.endIndex + realNum >= this.endIndex) {
        this.currentPage++;
        this.getList(this.currentPage, this.options.pageSize, 1);
    }
    if (direction < 0 && this.currentPage > 1 && this.showImages.startIndex + realNum < this.startIndex) {
        this.currentPage--;
        this.getList(this.currentPage, this.options.pageSize, -1);
    } 
}