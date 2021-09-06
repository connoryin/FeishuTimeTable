Page({
  data: {
    courses: []
  },
  onLoad: function (options) {
    tt.setNavigationBarTitle({
        title: 'Course Selection',
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`setNavigationBarTitle 调用失败`);
        }
    });
    let t = this;
    tt.request({
        url: 'http://47.100.108.13:3620/api/search',
        data: {
            name: options.name,
            prof: options.prof,
            term: options.term,
            major: options.major,
            level: options.level,
            category: options.category,
            credit: options.credit
        },
        header: {
            'content-type': 'application/json'
        },
        success (res) {
            t.setData({
              courses: res.data
            },()=>{
              console.log(res.data);
            })

        },
        fail (res) {
            console.log(`request 调用失败`);
        }
    });
  },
  showCourse: function (e) {
    console.log("here-----------")
    console.log(e.currentTarget.dataset.courseid)
    const sku = e.currentTarget.dataset.courseid;
    tt.navigateTo({
        url: `../courseInf/courseInf?sku=${sku}`,
        success (res) {
            console.log(`跳转成功`);
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`跳转失败`);
        }
    });
  }
})
