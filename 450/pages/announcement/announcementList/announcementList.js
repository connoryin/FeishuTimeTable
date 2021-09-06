Page({
  data: {
    announcement: [],
    courseID: 0,
    content: "",
    isStudent: false
  },
  onLoad: function (options) {
    this.data.courseID = options.courseID
    let app = getApp()
    let isStudent =  app.globalData.role === 0
    this.setData({
      isStudent: isStudent
    })
  },
  onShow: function () {
    tt.setNavigationBarTitle({
        title: 'My Courses',
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`setNavigationBarTitle 调用失败`);
        }
    });
    let t = this;
    tt.request({
      url: 'http://47.100.108.13:3620/api/getAnnouncement/',
      data: {
        courseID: t.data.courseID
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`request 调用成功 res`);
        t.setData({
          announcement: res.data,
          courseID: t.data.courseID
        })
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })
  },
  viewAnnouncement: function (e) {
    let t = this
    let index = e.target.id
    tt.navigateTo({
      url: `../announcementDetail/announcementDetail?title=${t.data.announcement[index][0]}&content=${t.data.announcement[index][1]}&author=${t.data.announcement[index][2]}&time=${t.data.announcement[index][3]}`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  },
  createAnnouncement: function (e) {
    let t = this
    tt.navigateTo({
      url: `../create/create?courseID=${t.data.courseID}`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  }
})
