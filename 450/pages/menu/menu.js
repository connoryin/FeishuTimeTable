Page({
  data: {
    name: '',
    courseID: 0
  },
  onLoad: function (options) {
    this.setData({
      name: options.name,
      courseID: options.courseID
    })
  },
  announcement: function () {
    let t = this
    tt.navigateTo({
      url: `../announcement/announcementList/announcementList?courseID=${t.data.courseID}`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  },
  assignment: function () {
    let t = this
    tt.navigateTo({
      url: `../assignment/assignmentList/assignmentList?courseID=${t.data.courseID}`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  },
  attendance: function () {
    let t = this
    tt.navigateTo({
      url: `../Attendance/Attendance`,
      success (res) {
        console.log(`res`);
      },
      fail (res) {
        console.log(`navigateTo failure`);
      }
    })
  }
})
