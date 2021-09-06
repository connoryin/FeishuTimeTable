Page({
  data: {
    assignmentID: 0,
    title: '',
    content: '',
    ddl: '',
    grade: 0,
    fullscore: 0,
    submitted: false,
    progress: 0
  },
  onLoad: function (options) {
    let app = getApp()
    let t = this
    tt.request({
      url: 'http://47.100.108.13:3620/api/getOneAssignment/',
      data: {
        assignmentID: options.assignmentID,
        studentID: app.globalData.studentId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`request 调用成功 res`);
        let submitted = false;
        console.log(res.data)
        if (res.data[6]) {
          submitted = true;
        }
        t.setData({
          assignmentID: res.data[0],
          title: res.data[4],
          content: res.data[5],
          ddl: res.data[1],
          grade: res.data[2],
          fullscore: res.data[3],
          submitted: submitted,
        })
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })

  },

  submitAssignment: function (e) {
    let t = this
    let app = getApp()
    console.log(e)
    tt.request({
      url: 'http://47.100.108.13:3620/api/submitAssignment/',
      data: {
        assignmentID: t.data.assignmentID,
        studentID: app.globalData.studentId,
        url: e.detail.value.url
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`request 调用成功 res`);
        t.setData({
          submitted: true
        })

        tt.showToast({
            title: 'Succeeded!',
            duration: 1000,
            success (res) {
                console.log(`${res}`);
            },
            fail (res) {
                console.log(`showToast 调用失败`);
            }
        });
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })    
  },

  viewAssignment: function () {
    let t = this
    tt.openSchema({
      schema: this.data.content,
      external: true,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`reLaunch failure`);
      }
    })
  }
})
