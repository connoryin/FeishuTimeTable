Page({
  data: {
    // course info
    tempBool: false,
    selected: false,
    studentID: 11,
    courseID: 1,
    semester: "Summer2021",
    courseName: 'VG100: Intro to Engineering',
    section: '01',
    credit: '4',
    prerequisite: 'None',
    time:'',
    location: '',
    capacity: '',
    currentNum: 30,
    courseIntro: '',
    syllabus: '',
    // professor info
    professor: '',
    email: '',
    office: '',
    website: '',
    profile: '',
    // for counting
    startSelTime: new Date("2021-06-17T20:00:00Z"),
    endSelTime: new Date("2021-08-05T23:59:59Z"),
    currentTime: new Date(),
    inSelectTime: 1,
    pingData: [{
      "id": "1",
      "icon": "../../images/image2.jpg",
      "number": "20",
      "pingTime": "2021-6-17 21:00:00",
      "time": new Date("2021-08-05T23:59:59Z") - new Date(),
      "showList": "false",
    },
    ],
    event_id: "",
    attendee_id: "",
    chat_id: "",
    median: ["B+", "B+", "A-"],
    rate: ["86%", "42%", "60%"],
  },

  onItemClicksyllabus: function (e) {
    tt.openSchema({
        schema: this.data.syllabus,
        external: true,
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`open fail`);
        }
    });
  },

  onItemClickprofile: function (e) {
      tt.openSchema({
          schema: this.data.profile,
          external: true,
          success (res) {
              console.log(`${res}`);
          },
          fail (res) {
              console.log(`open fail`);
          }
      });
  },


  helperAdd: function(e) {
    let t = this;
    return new Promise((resolve, reject) => {
      tt.showModal({
        title: 'Selection confirmation',
        content: 'Please confirm your selection for ' + t.data.courseName,
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        success (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            console.log("cancel")
            reject(false)
          } else if (res.confirm) {
              //点击确定
              console.log("confirm") 
              resolve(true)
          }
        },
        fail (res) {
            console.log(`showModal调用失败`);
        }
      })
  } )},

  helperDrop: function(e) {
    let t = this;
    return new Promise((resolve, reject) => {
      tt.showModal({
        title: 'Drop confirmation',
        content: 'Please confirm that you drop ' + t.data.courseName,
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        success (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
            console.log("cancel")
            reject(false)
          } else if (res.confirm) {
              //点击确定
              console.log("confirm") 
              resolve(true)
          }
        },
        fail (res) {
            console.log(`showModal调用失败`);
        }
      })
  } )},

  addCourse: function (e) {
    let t = this;
    let cf = false;
    let app = getApp();
    console.log("event id: " + t.data.event_id)
    t.helperAdd()
    .then(() => {
      console.log('.then ---------')
      t.setData({
        currentNum: this.data.currentNum + 1,
        selected: true,
      });    

      //add the user to the group
      tt.request({
        url: `https://open.feishu.cn/open-apis/im/v1/chats/${t.data.chat_id}/members`,
        method: 'POST',
        data: {
            "id_list": [
              app.globalData.openid
            ]
        },
        header: {
          "Authorization": 'Bearer '+ app.globalData.app_access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        success(res) {
          console.log(`拉入群成功`);
          console.log(res)
        },
        fail(res) {
          console.log(`拉入群失败`);
          console.log(res)
        }
      })

      //send notification
      tt.request({
        url: 'https://open.feishu.cn/open-apis/message/v4/send/',
        method: 'POST',
        data: {
          open_id: app.globalData.openid,
          "msg_type": "interactive",
          "update_multi":false,
          "card": {
            "header": {
              "title": {
                  "tag": "plain_text",
                  "content": "Course enrollment notification"
              },
              "template":"green"
            },
            "i18n_elements": {
              "zh_cn": [
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": `**Welcome to ${t.data.courseName}**`
                  }
                },
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": "**Professor:**"
                  },
                  "fields": [
                    {
                      "is_short": false,
                      "text": {
                        "tag": "lark_md",
                        "content": t.data.professor
                      }
                    },
                    {
                      "is_short": false,
                      "text": {
                        "tag": "lark_md",
                        "content": ""
                      }
                    },
                    {
                      "is_short": false,
                      "text": {
                        "tag": "lark_md",
                        "content": `**Time: **\n${t.data.time}`
                      }
                    },
                    {
                      "is_short": false,
                      "text": {
                        "tag": "lark_md",
                        "content": ""
                      }
                    },
                    {
                      "is_short": false,
                      "text": {
                        "tag": "lark_md",
                        "content": `**Location: **\n${t.data.location}`
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
          console.log(`request 调用成功 res`);
        },
        fail(res) {
          console.log(`request 调用失败`);
        }
      })

      //add the user to the event
      tt.request({
        url: `https://open.feishu.cn/open-apis/calendar/v4/calendars/feishu.cn_i9xdbj3t8tfhICB0sM66ff@group.calendar.feishu.cn/events/${t.data.event_id}/attendees?user_id_type=open_id`,
        method: 'POST',
        data: {
            "attendees": [
                {
                    "type": "user",
                    "is_optional": false,
                    "user_id": app.globalData.openid
                }
            ],
            "need_notification": true
        },
        header: {
          "Authorization": 'Bearer '+ app.globalData.app_access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        success(res) {
          console.log(`加入日程成功`);
          console.log(res)
          let attendee_id = ""
          for (let i=0;i<res.data.data.attendees.length;i++){
            if (res.data.data.attendees[i].user_id === app.globalData.openid) {
              attendee_id = res.data.data.attendees[i].attendee_id
              break
            }
          }
          console.log("found attendee_id " + attendee_id)
          t.setData({
            attendee_id: attendee_id
          })

          //update the database
          tt.request({
            url: 'http://47.100.108.13:3620/addCourse/',
            data: {
              courseID: t.data.courseID,
              studentID: app.globalData.studentId,
              semester: t.data.semester,
              attendee_id: attendee_id
            },
            success(res) {
              console.log(`request 调用成功 啦`);
              t.setData({
                showAdd: false,
              })
            },
            fail(res) {
              console.log(`request 调用失败`);
            }
          })
        },
        fail(res) {
          console.log(`加入日程失败`);
          console.log(res)
        }
      })

    })
  },

  dropCourse: function (e) {
    let t = this;
    let app = getApp()
    console.log("attendee ID: " + t.data.attendee_id)
    t.helperDrop()
    .then(() => {
      console.log('.then ---------')
      t.setData({
        currentNum: this.data.currentNum - 1,
        selected: false,
      });    

      //send notification
      tt.request({
        url: 'https://open.feishu.cn/open-apis/message/v4/send/',
        method: 'POST',
        data: {
          open_id: app.globalData.openid,
          "msg_type": "interactive",
          "update_multi":false,
          "card": {
            "header": {
              "title": {
                  "tag": "plain_text",
                  "content": "Course dropping notification"
              },
              "template":"orange"
            },
            "i18n_elements": {
              "zh_cn": [
                {
                  "tag": "div",
                  "text": {
                    "tag": "lark_md",
                    "content": `**Successfully dropped ${t.data.courseName}**`
                  }
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
          console.log(`request 调用成功 res`);
        },
        fail(res) {
          console.log(`request 调用失败`);
        }
      })
      

      //move user from the group
      tt.request({
        url: `https://open.feishu.cn/open-apis/im/v1/chats/${t.data.chat_id}/members`,
        method: 'DELETE',
        data: {
            "id_list": [
              app.globalData.openid
            ]
        },
        header: {
          "Authorization": 'Bearer '+ app.globalData.user_access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        success(res) {
          console.log(`移出群成功`);
          console.log(res)
        },
        fail(res) {
          console.log(`移出群失败`);
          console.log(res)
        }
      })

      //remvoe the user from the event
      tt.request({
        url: `https://open.feishu.cn/open-apis/calendar/v4/calendars/feishu.cn_i9xdbj3t8tfhICB0sM66ff@group.calendar.feishu.cn/events/${t.data.event_id}/attendees/batch_delete`,
        method: 'POST',
        data: {
          "attendee_ids": [
            t.data.attendee_id
          ],
          "need_notification": true
        },
        header: {
          "Authorization": 'Bearer '+ app.globalData.app_access_token,
          "Content-Type": "application/json; charset=utf-8"
        },
        success(res) {
          console.log(`退出日程成功`);
          console.log(res)
        },
        fail(res) {
          console.log(`退出日程失败`);
          console.log(res)
        }
      })

      //update the database
      tt.request({
        url: 'http://47.100.108.13:3620/dropCourse/',
        data: {
          courseID: t.data.courseID,
          studentID: app.globalData.studentId,
          semester: t.data.semester,
        },
        success(res) {
          console.log(`request 调用成功 啦`);
          t.setData({
            showAdd: false
          })
        },
        fail(res) {
          console.log(`request 调用失败`);
        }
      })
    })
  
    
  },

  isEmpty(obj) {
    for(var key in obj) {
       if(obj.hasOwnProperty(key))
           return false;
       }
    return true;
  },

  isSelected: function (e) {
    let t = this;
    let app = getApp();
    tt.request({
      url: 'http://47.100.108.13:3620/isSelected/',
      data: {
        courseID: t.data.courseID,
        studentID: app.globalData.studentId,
        semester: t.data.semester,
      },
      success(res) {
        console.log(`检测选课成功啦`);
        console.log(res)
        t.setData({
          selected: (res.data.length > 0),
          attendee_id: res.data[0][4]
        })
      },
      fail(res) {
        console.log(`检测选课失败啦`);
      }
    })
  },

  onLoad: function (options) {
    console.log('Loading')
    let t = this;
    t.verifyRegistrations()       
    .then(()=>{
      console.log('进入then')
      let sku = options.sku || '';
      console.log(sku)
      let task = tt.request({
        url: 'http://47.100.108.13:3620/course/'+sku+'/',
        method: 'GET',
        success (res) {
            console.log(`courseinf onload 调用成功 ${res}`);
            console.log(res.data[0]);
            t.setData({
              courseName: res.data[0][0],
              time: res.data[0][1],
              currentNum: res.data[0][2],
              capacity: res.data[0][3],
              credit: res.data[0][4],
              courseIntro: res.data[0][5],
              syllabus: res.data[0][6],
              professor: res.data[0][7],
              email: res.data[0][8],
              office: res.data[0][9],
              website: res.data[0][10],
              profile: res.data[0][11],
              event_id: res.data[0][12],
              chat_id: res.data[0][13],
              location: res.data[0][14],
              courseID: sku
            },()=>{
              console.log(t.data.endSelTime - new Date());
              console.log(t.data.courseID)
              t.setData({
                listData: t.data.pingData
              })
              t.setCountDown();
              t.isSelected();
            })
          },
      fail (res) {
          console.log(`courseinf onload 调用失败`);
        }
      })
    })
    
  },


  /**
 * 60s倒计时
 */
  setTimeCount:function(){
    let time=this.data.time
    time--;
    if (time <= 0) {
      time = 0;
    }
    this.setData({
      time:time
    })
    setTimeout(this.setTimeCount,1000);
    },
  /**
  * 倒计时
  */
  setCountDown: function () {
    let time = 1000;
    let { listData } = this.data;
    let list = listData.map((v, i) => {
    if (v.time <= 0) {
      v.time = 0;
    }
    let formatTime = this.getFormat(v.time);
    v.time -= time;
    v.countDown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
    return v;
    })
    this.setData({
      listData: list
    });
    setTimeout(this.setCountDown, time);
    },
  /**
  * 格式化时间
  */
  getFormat: function (msec) {
    let ss = parseInt(msec / 1000);
    let ms = parseInt(msec % 1000);
    let mm = 0;
    let hh = 0;
    if (ss > 60) {
    mm = parseInt(ss / 60);
    ss = parseInt(ss % 60);
    if (mm > 60) {
    hh = parseInt(mm / 60);
    mm = parseInt(mm % 60);
    }
    }
    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return { ss, mm, hh };
    },

  verifyRegistrations: function () {
    return new Promise((resolve, reject) => {
      let app = getApp()
      if (app.globalData.studentId != -1) resolve(true)
      let token = "";
      let code = "";
      tt.request({
        url: 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal/',
        data: {
            "app_id":"cli_a046f0bc4e79900e",
            "app_secret":"mQEXuJjjpUDV4vnVgLF2Sb3Pyex6hMTy"
        },
        method: 'POST',
        header: {
            'content-type': 'application/json; charset=utf-8'
        },
        success (res) {
            console.log(`获取app_access_token成功 ${res.data.app_access_token}`);
            token = res.data.app_access_token;
            app.globalData.app_access_token = token

            tt.login({
                success (res) {
                    console.log(`login 调用成功`);
                    console.log(res);
                    code = res.code;

                    tt.request({
                        url: 'https://open.feishu.cn/open-apis/mina/v2/tokenLoginValidate',
                        data: {
                            "code": code
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        success (res) {
                            console.log(`openid 获取成功`);
                            console.log(res.data)
                            app.globalData.openid = res.data.data.open_id;
                            app.globalData.user_access_token = res.data.data.access_token;

                            tt.request({
                                url: 'http://47.100.108.13:3620/api/id/',
                                data: {
                                    "ID": app.globalData.openid
                                },
                                method: 'GET',
                                success (res) {
                                    console.log(res)
                                    let result = res.data
                                    if (result) {
                                        app.globalData.studentId = result[0];
                                        app.globalData.name = result[1];
                                        app.globalData.role = result[2];
                                        console.log('已经注册过啦')
                                        resolve(true)
                                    } else {
                                      console.log('还没注册')
                                      tt.navigateTo({
                                        url: '../register/register',
                                        success (res) {
                                          console.log(`res`);
                                          resolve(true)
                                        },
                                        fail (res) {
                                          console.log(`navigateTo failure`);
                                        }
                                      })
                                    }
                                    

                                },
                                fail (res) {
                                    console.log(`uid 获取失败`);
                                }
                            });
                        },
                        fail (res) {
                            console.log(`uid 获取失败`);
                        }
                    });
                },
                fail (res) {
                    console.log(`login 调用失败`);
                }
            });

        },
        fail (res) {
            console.log(`获取app_access_token失败`);
        }
    });
  })
  },

})




