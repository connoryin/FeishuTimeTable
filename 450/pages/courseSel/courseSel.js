Page({
  data: {
    termArray: ['Summer2021', 'Spring2021', 'Winter2020'],
    termIndex: 0,
    majorArray: ['', 'ECE', 'ME', 'MSE'],
    majorIndex: 0,
    levelArray: ['', '100', '200', '300', '400', '500'],
    levelIndex: 0,
    categoryArray: ['', 'Engineering Foundation', 'Program Subject', 'Flexible Tech. Elect', 'Core Elective', 'Intellectual Breadth', 'Upper Level Tech. Elective'],
    categoryIndex: 0,
    creditArray: ['', '1', '2', '3', '4'],
    creditIndex: 0,
    courses: [],
    message: 'Please input expected standards above to see matching courses!',
    name: '',
    prof: '',
  },
  onLoad: function (e) {
    tt.setNavigationBarTitle({
        title: 'Course Selection',
        success (res) {
            console.log(`${res}`);
        },
        fail (res) {
            console.log(`setNavigationBarTitle 调用失败`);
        }
    });
    this.startpage();
    console.log("onload --- message=")
    console.log(this.data.message)
  },
  bindTermChange: function (e) {
    this.setData({
      termIndex: e.detail.value
    });
    this.search(e);
  },
  bindMajorChange: function (e) {
    this.setData({
      majorIndex: e.detail.value
    })
    this.search(e)
  },
  bindLevelChange: function (e) {
    this.setData({
      levelIndex: e.detail.value
    });
    this.search(e);
  },
  bindCategoryChange: function (e) {
    this.setData({
      categoryIndex: e.detail.value
    });
    this.search(e);
  },
  bindCreditChange: function (e) {
    this.setData({
      creditIndex: e.detail.value
    });
    this.search(e);
  },
  bindCancel: function (e) {
  },
  nameinput: function (e) {
    let value = e.detail.value
    this.setData({
      name: value
    })
    this.search(e)
  },
  profinput: function (e) {
    let value = e.detail.value
    this.setData({
      prof: value
    })
    this.search(e)
  },

  startpage: function (e) {
    let t = this;
    console.log("search-------------")
    
    t.helperstartpage(e)
    .then(() => {
      t.setData({
        message: 'Please input expected standards above to see matching courses!'
      })
      console.log("message=")
      console.log(t.data.message)
    });
    

    t.setData({
      message: 'loading'
    })

  },

  helperstartpage: function (e) {
    let t = this;
    return new Promise((resolve, reject) => {
      tt.request({
        url: 'http://47.100.108.13:3620/api/search',
        data: {
            name: this.data.name,
            prof: this.data.prof,
            term: this.data.termArray[this.data.termIndex],
            major: this.data.majorArray[this.data.majorIndex],
            level: this.data.levelArray[this.data.levelIndex],
            category: this.data.categoryArray[this.data.categoryIndex],
            credit: this.data.creditArray[this.data.creditIndex]
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
            resolve(true)
        },
        fail (res) {
            console.log(`request 调用失败`);
            reject(false)
        }
      });
    })
  },

  helperSearch: function (e) {
    let t = this;
    return new Promise((resolve, reject) => {
    tt.request({
      url: 'http://47.100.108.13:3620/api/search',
      data: {
          name: this.data.name,
          prof: this.data.prof,
          term: this.data.termArray[this.data.termIndex],
          major: this.data.majorArray[this.data.majorIndex],
          level: this.data.levelArray[this.data.levelIndex],
          category: this.data.categoryArray[this.data.categoryIndex],
          credit: this.data.creditArray[this.data.creditIndex]
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
          resolve(true)
      },
      fail (res) {
          console.log(`request 调用失败`);
          reject(false)
      }
    });
  })
  },
  
  search: function (e) {
    let t = this;
    console.log("search-------------")
    
    t.helperSearch(e)
    .then(() => {
      t.setData({
        message: ''
      })
      console.log("message=")
      console.log(t.data.message)
    });
    

    t.setData({
      message: 'loading'
    })

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
  },
  selected: function (e) {
    let t = this;
    const sku = t.data.termArray[t.data.termIndex]
    console.log(sku)
    tt.navigateTo({
      url: `../selectedCourse/selectedCourse?sku=${sku}`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  }
})
