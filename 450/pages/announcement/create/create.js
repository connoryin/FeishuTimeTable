Page({
    data: {
        content: "",
        courseID: 0,
        webhook: ""
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
    submit: function (e) {
        let t = this;
        let app = getApp()
        console.log(`webhook: ${t.data.webhook}`);

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
                    "content": "Announcement"
                },
                "template":"indigo"
              },
              "i18n_elements": {
                "zh_cn": [
                  {
                    "tag": "div",
                    "text": {
                      "tag": "lark_md",
                      "content": "**" + e.detail.value.title + "**"
                    }
                  },
                  {
                    "tag": "div",
                    "text": {
                      "tag": "lark_md",
                      "content": t.data.content
                    },
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

        // update database
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
      },
      onTextInput: function (e) {
        this.setData({
          content: e.detail.value
        })
      }
})