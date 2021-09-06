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
    },
    onLoad: function () {
      tt.setNavigationBarTitle({
          title: 'Course Selection',
          success (res) {
              console.log(`${res}`);
          },
          fail (res) {
              console.log(`setNavigationBarTitle 调用失败`);
          }
      });
    },
    bindTermChange: function (e) {
      this.setData({
        termIndex: e.detail.value
      })
    },
    bindMajorChange: function (e) {
      this.setData({
        majorIndex: e.detail.value
      })
    },
    bindLevelChange: function (e) {
      this.setData({
        levelIndex: e.detail.value
      })
    },
    bindCategoryChange: function (e) {
      this.setData({
        categoryIndex: e.detail.value
      })
    },
    bindCreditChange: function (e) {
      this.setData({
        creditIndex: e.detail.value
      })
    },
    bindCancel: function (e) {
    },
    search: function (e) {
      tt.navigateTo({
          url: `../searchResult/searchResult?name=${e.detail.value.name}&prof=${e.detail.value.prof}&term=${this.data.termArray[this.data.termIndex]}&major=${this.data.majorArray[this.data.majorIndex]}&level=${this.data.levelArray[this.data.levelIndex]}&category=${this.data.categoryArray[this.data.categoryIndex]}&credit=${this.data.creditArray[this.data.creditIndex]}`,
          success (res) {
              console.log(`${res}`);
          },
          fail (res) {
              console.log(`navigateTo 调用失败`);
          }
      });
    },
    selected: function (e) {
      tt.navigateTo({
        url: '../selectedCourse/selectedCourse/?sku=${sku}',
        success (res) {
          console.log(`res`);
        },
        fail (res) {
          console.log(`navigateTo failure`);
        }
      })
    }
  })
  