var render = require('./imagePagation.art');

function ImagePagation() {
    this.options = {},
    this.list = [],
    this.inited = !0,
    this.startIndex = 0,
    this.endIndex = 0,
    this.showImages = {
        startIndex: 0,
        endIndex: 0
    };
    var self = this;
    this.slideThrottle = throttle((id) => {
        self.slide(e)
    }, 450),
    this.turnPageThrottle = throttle((direction, num) =>{
        self.turnPage(e, n)
    }, 450)
}

ImagePagation.prototype.init = function(options) {
    options.activeIndex = parseInt(options.activeIndex, 10),
    this.currentPage = Math.ceil((options.activeIndex + 1) / options.pageSize),
    this.startIndex = (this.currentPage - 1) * options.pageSize,
    this.endIndex = this.currentPage * options.pageSize,
    this.options = Object.assign({}, options),
    this.render(),
    this.bindPageEvent()
}

ImagePagation.prototype.render = function() {
    var direction = this.getDirection(this.options.activeIndex, 3);
    $(this.options.mount).html(render()),
    this.getList(this.currentPage, this.options.pageSize, 1),
    0 !== direction && this.startIndex > 0 && this.getList(this.currentPage + direction, this.options.pageSize, direction),
    this.initViewArea(),
    this.renderList(direction, 7),
    this.bindItemEvent()
}

ImagePagation.prototype.initViewArea = function() {
    var startIndex = this.options.activeIndex - 3,
        endIndex = this.options.activeIndex + 3;
    if (this.options.activeIndex - 3 < 0) {
        startIndex = 0;
        endIndex = this.total > 6 ? 6 : this.total;
    } else if (this.options.activeIndex + 3 >= this.total) {
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


ImagePagation.prototype.getList = function(page, pageSize, direction) {
    var self = this;
    $.ajax({
        url: '',
        type: "get",
        dataType: "json",
        async: !1,
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

ImagePagation.prototype.setActive = function(id) {
    var $item = $(".panel .image-item"),
        $activeItem = $(".panel div[data-resourceId=" + id + "]");
    $item.removeClass("active"),
    $activeItem.addClass("active")
}

ImagePagation.prototype.deleteByNum = function(direction, num) {
    var $item = $(".panel .image-item"),
        i = direction > 0 ? $item.length - num : 0,
        total = direction > 0 ? $item.length : num;
    for (i; i < total; i++) {
        $item[i].remove()
    }
}

ImagePagation.prototype.setImagesIndex = function(num) {
    this.showImages.endIndex += num;
    this.showImages.startIndex += num;
}

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

ImagePagation.prototype.turnPage = function(direction, num) {
    var realNum = this.getRealNum(direction, num);
    this.getMoreData(direction, direction * num),
    this.renderList(direction, Math.abs(realNum)),
    this.translate(direction, Math.abs(realNum)),
    this.setImagesIndex(realNum)
}

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