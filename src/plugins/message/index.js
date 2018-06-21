import message from './message';

const MessagePlugin = {};
MessagePlugin.install = (Vue) => {
    const Extend = Vue.extend(message);
    let instance = new Extend();
    document.body.appendChild(install.$mount().$el);
    Vue.prototype.$message = (content, title, options) => {
        if (typeof title === "object") {
            options = title;
        } else {
            options.title = title;
        }
        options.cotent = content;
        return new Promise((resolve, reject) => {
            options.resolve = resolve;
            options.reject = reject;
            for (let key in options) {
                instance[key] = options[key];
            }
            instance.showMessage();
        })
    }
}

export default MesssagePlugin;