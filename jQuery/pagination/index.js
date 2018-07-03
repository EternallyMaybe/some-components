var render = require('./pagination.art');
function Pagination() {
    this.options = {}
}

Pagination.prototype.init = function(options) {
    var _default = {
        mount: "#Pagination",
        current: 0,
        totalPage: 0
    };
    this.options = Object.assign({}, _default, options);
};

Pagination.prototype.update = function(options) {
    this.options = Object.assign(this.options, options),
    this.render(this.options.current, this.options.totalPage)
};

Pagination.prototype.render = function(currentPage, totalPage) {
    var html = render({
        currentPage: currentPage,
        totalPage: totalPage
    });
    $(this.options.mount).html(html),
    this.bindEvent()
};

Pagination.prototype.pageChange = function(page) {
    this.options.current = page,
    this.render(this.options.current, this.options.totalPage),
    this.options.callback(this.options.current)
};

Pagination.prototype.bindEvent = function() {
    var self = this,
        $pre = $(".page-prev"),
        $next = $(".page-next"),
        $item = $(".page-item").not(".disabled");
    $pre.off("click").on({
        click: function() {
            self.options.current > 1 && self.pageChange(self.options.current - 1)
        }
    });
    $next.off("click").on({
        click: function() {
            self.options.current < self.options.totalPage && self.pageChange(self.options.current + 1)
        }
    });
    $item.off("click").on({
        click: function() {
            var currentPage = parseInt($(this).text(), 10);
            self.pageChange(currentPage)
        }
    });
}