Page({
  data: {
    assignment: [],
    courseID: 0,
    showAdd: false,
    content: "",
    progress: 0,
    isStudent: false
  },
  onLoad: function (options) {
    this.data.courseID = options.courseID
    let app = getApp()
    let isStudent = app.globalData.role === 0
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
    let app = getApp()
    tt.request({
      url: 'http://47.100.108.13:3620/api/getAssignment/',
      data: {
        courseID: t.data.courseID,
        studentID: app.globalData.studentId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`request 调用成功 res`);
        console.log(res.data)
        t.setData({
          assignment: res.data,
          courseID: t.data.courseID
        })
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })
  },
  submit: function (e) {
    let t = this;
    let app = getApp()
    tt.request({
      url: 'http://47.100.108.13:3620/api/addAnnouncement/',
      data: {
        title: e.detail.value.title,
        content: t.data.content,
        courseID: t.data.courseID,
        author: app.globalData.studentId
      },
      success(res) {
        console.log(`request 调用成功 res`);
        t.setData({
          showAdd: false
        })
      },
      fail(res) {
        console.log(`request 调用失败`);
      }
    })

    tt.request({
      url: 'https://open.feishu.cn/open-apis/bot/v2/hook/4e744592-2d05-4a85-938e-33efac163746',
      data: {
        "msg_type": "post",
        "content": {
            "post": {
                "zh_cn": {
                    "title": e.detail.value.title,
                    "content": [
                        [
                            {
                                "tag": "text",
                                "text": t.data.content
                            }
                        ]
                    ]
                }
            }
        }
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(`消息发送到群成功`);
      },
      fail(res) {
        console.log(`消息发送到群失败`);
      }
    })
  },

  cancel: function (e) {
    this.setData({
      content: "",
      showAdd: false
    })
  },

  onTextInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  add: function () {
    this.setData({
      showAdd: true
    })
  },

  ontap: function (e) {
    let t = this;
    let id = e.target.id;
    if (this.data.isStudent) {
      tt.navigateTo({
        url: `../assignmentDetail/assignmentDetail?assignmentID=${t.data.assignment[id][0]}`,
        success (res) {
          console.log(`res`);
        },
        fail (res) {
          console.log(`navigateTo failure`);
        }
      })
    } else {
      tt.navigateTo({
        url: `../grade/grade?assignmentID=${t.data.assignment[id][0]}`,
        success (res) {
          console.log(`res`);
        },
        fail (res) {
          console.log(`navigateTo failure`);
        }
      })
    }

  },
  createAssignment: function (e) {
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
