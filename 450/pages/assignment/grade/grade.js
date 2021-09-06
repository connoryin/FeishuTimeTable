Page({
  data: {
    submission: [],
    assignmentID: 0
  },
  onLoad: function (options) {
    let t = this
    this.setData({
        assignmentID: options.assignmentID
    })
    tt.request({
        url: 'http://47.100.108.13:3620/api/showSubmission/',
        data: {
            assignmentID: options.assignmentID
        },
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            console.log(res.data);
            t.setData({
                submission: res.data
            })
        },
        fail(res) {
            console.log(`request 调用失败`);
        }
    })
  },

  viewAssignment: function(e) {
      tt.openSchema({
          schema: e.target.id,
          external: true,
          success (res) {
              console.log(`res`);
          },
          fail (res) {
              console.log(`reLaunch failure`);
          }
      })
  },

  onconfirm: function(e) {
      console.log(e)
      let t = this
      let app = getApp()
      tt.request({
          url: 'http://47.100.108.13:3620/api/grade/',
          data: {
              assignmentID: t.data.assignmentID,
              studentID: e.target.id,
              score: e.detail.value
          },
          header: {
              'content-type': 'application/json'
          },
          success(res) {
              console.log(`request 调用成功 res`);
              tt.showToast({
                  title: 'Succeeded!',
              })
          },
          fail(res) {
              console.log(`request 调用失败`);
          }
      })
  }

})
