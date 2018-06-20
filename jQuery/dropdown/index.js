var render = require('./dropdown.art');
function dropdown() {
    this.options = {}
}

dropdown.prototype.init = function(options) {
    var _default = {
        mount: "#dropdown",
        sourceData: [],
        dropTitle: ""
    };
    this.options = Object.assign({}, _default, options),
    this.render(),
    this.bindEvent()
};

dropdown.prototype.render = function() {
    var html = render({
        dropTitle: this.options.dropTitle,
        sourceData: this.options.sourceData
    });
    $(this.options.mount).append(html)
};

dropdown.prototype.bindEvent = function() {
    var self = this
        $header = $(".dropdown-header"),
        $menu = $(".dropdown-menu"),
        $icon = $(".dropdown-header i"),
        $item = $(".dropdown-menu .dropdown-item");
    $header.on({
        mouseover: function() {
            $menu.height(26 * self.options.sourceData.length + 18),
            $icon.addClass("icon-drop-hover")
        },
        mouseout: function() {
            $menue.height(0),
            $icon.removeClass("icon-drop-hover")
        },
        click: function() {
            self.options.callback()
        }
    });
    $menu.on({
        mouseover: function() {
            $menu.height(26 * self.options.sourceData.length + 18)
        },
        mouseout: function() {
            $menu.height(0)
        }
    });
    $item.on({
        click: function(n) {
            var index = $(".dropdown-item").index(this),
                data = self.options.sourceData[index];
              self.options.callback(data)
        }
    })
}