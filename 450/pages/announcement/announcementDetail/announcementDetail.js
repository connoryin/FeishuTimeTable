Page({
    data: {
        title: '',
        content: '',
        time: '',
        author: '',
    },
    onLoad: function (options) {
        this.setData({
            title: options.title,
            content: options.content,
            time: options.time,
            author: options.author
        })
    },

})