Page({
  data: {
    role: 0
  },
  onLoad: function () {

  },

  confirm: function (e) {
    let app = getApp()
    let t = this
    tt.request({
      url: 'http://47.100.108.13:3620/api/register/',
      data: {
          ID: e.detail.value.ID,
          name: e.detail.value.name,
          openid: app.globalData.openid,
          role: t.data.role
      },
      method: 'GET',
      success (res) {
          console.log(`request 调用成功 ${res}`);
          app.globalData.name = e.detail.value.name
          app.globalData.studentId = e.detail.value.ID
          app.globalData.role = t.data.role
            tt.navigateBack({
                delta: 1
            })
      },
      fail (res) {
          console.log(`request 调用失败`);
      }
  });
  },

  radioChange: function(e) {
    this.setData({
        role: e.detail.value
    })
  }
})
