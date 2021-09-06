Page({
    data: {
      courses: [],
      semester: "Summer2021",
      sku: ""
    },
    onLoad: function (options) {
      this.data.sku = options.sku
    },
    onShow: function () {
      let t = this;
      let app = getApp()
      let sku = this.data.sku;
      console.log(sku)
      this.verifyRegistrations()
      .then(()=>{
          tt.request({
          url: 'http://47.100.108.13:3620/selectedCourse',
          data: {
            studentID: app.globalData.studentId,
            semester: sku,
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
      })

    },
    showCourse: function (e) {
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
  