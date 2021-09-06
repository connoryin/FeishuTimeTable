Page({
  data: {
    date: '0000-00-00',
    time: '00:00',
    courseID: 0,
    webhook: ''
  },
  onLoad: function (options) {
    let t = this
    tt.request({
        url: 'http://47.100.108.13:3620/api/getWebhook/',
        data: {
            courseID: options.courseID
        },
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            t.setData({
                courseID: options.courseID,
                webhook: res.data[0]
            })
        },
        fail(res) {
            console.log(`request 调用失败`);
        }
    })
  },

  bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          date: e.detail.value
      })
  },
  bindTimeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
          time: e.detail.value
      })
  },

  submit: function (e) {
      let t = this
      let app = getApp()
      //send notification
      tt.request({
        url: 'https://open.feishu.cn/open-apis/message/v4/send/',
        method: 'POST',
        data: {
          chat_id: t.data.webhook,
          "msg_type": "interactive",
          "update_multi":false,
          "card": {
            "header": {
              "title": {
                  "tag": "plain_text",
                  "content": "Assignment notification"
              },
              "template":"blue"
            },
            "i18n_elements": {
              "zh_cn": [
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": `**${e.detail.value.title}**`
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": `[Click to view assignment](${e.detail.value.url})`
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "**Set a reminder**"
                  }
                },
                {
                  "tag": "action",
                  "actions": [
                    {
                      "tag": "picker_datetime",
                      "placeholder": {
                        "tag": "plain_text",
                        "content": "请选择日期和时间"
                      },
                      "initial_datetime": `${t.data.date} ${t.data.time}`,
                      "value": {
                        "title": e.detail.value.title,
                        "url": e.detail.value.url,
                        "token": app.globalData.app_access_token
                      }
                    }
                  ]
                }
              ]
            }
          }
        },
        header: {
          "Authorization": 'Bearer '+ app.globalData.app_access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        success(res) {
          console.log(`发送消息卡片成功`);
          console.log(res)
        },
        fail(res) {
          console.log(`发送消息卡片失败失败`);
          console.log(res)
        }
      })

      tt.request({
        url: 'http://47.100.108.13:3620/api/createAssignment',
        data: {
            title: e.detail.value.title,
            url: e.detail.value.url,
            fullscore: e.detail.value.fullscore,
            date: t.data.date,
            time: t.data.time,
            courseID: t.data.courseID
        },
        header: {
            'content-type': 'application/json'
        },
        success(res) {
            console.log(`request 调用成功 res`);
            tt.showToast({
                title: 'Succeeded'
            })
            tt.navigateBack({
                delta: 1
            })
        },
        fail(res) {
            console.log(`request 调用失败`);
        }
    })
      
  },
  cancel: function (e) {
      tt.navigateBack({
          delta: 1
      })
  }
})
