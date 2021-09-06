Page({

  /**
   * 页面的初始数据
   */
  data: {
      totalNum:36,
      signScore:0,
      signed:false,
      day:12,
      hour:10,
      month:3,
      classes1:[
          {classL:"1", MonthR:5, DateR:10, HourT:10, signed:false},
          {classL:"2", MonthR:5, DateR:12, HourT:10, signed:false},
          {classL:"3", MonthR:5, DateR:14, HourT:10, signed:false},
          {classL:"4", MonthR:5, DateR:17, HourT:10, signed:false},
          {classL:"5", MonthR:5, DateR:19, HourT:10, signed:false},
          {classL:"6", MonthR:5, DateR:21, HourT:10, signed:false}
      ],
      classes2:[
        {classL:"7", MonthR:5, DateR:24, HourT:10, signed:false},
        {classL:"8", MonthR:5, DateR:26, HourT:10, signed:false},
        {classL:"9", MonthR:5, DateR:28, HourT:10, signed:false},
        {classL:"10", MonthR:5, DateR:31, HourT:10, signed:false},
        {classL:"11", MonthR:6, DateR:2, HourT:10, signed:false},
        {classL:"12", MonthR:6, DateR:4, HourT:10, signed:false}
      ],
      classes3:[
        {classL:"13", MonthR:6, DateR:7, HourT:10, signed:false},
        {classL:"14", MonthR:6, DateR:9, HourT:10, signed:false},
        {classL:"15", MonthR:6, DateR:11, HourT:10, signed:false},
        {classL:"16", MonthR:6, DateR:14, HourT:10, signed:false},
        {classL:"17", MonthR:6, DateR:16, HourT:10, signed:false},
        {classL:"18", MonthR:6, DateR:18, HourT:10, signed:false}
      ],
      classes4:[
        {classL:"19", MonthR:6, DateR:21, HourT:10, signed:false},
        {classL:"20", MonthR:6, DateR:23, HourT:10, signed:false},
        {classL:"21", MonthR:6, DateR:25, HourT:10, signed:false},
        {classL:"22", MonthR:6, DateR:28, HourT:10, signed:false},
        {classL:"23", MonthR:6, DateR:30, HourT:10, signed:false},
        {classL:"24", MonthR:7, DateR:2, HourT:10, signed:false}
      ],
      classes5:[
        {classL:"25", MonthR:7, DateR:5, HourT:10, signed:false},
        {classL:"26", MonthR:7, DateR:7, HourT:10, signed:false},
        {classL:"27", MonthR:7, DateR:9, HourT:10, signed:false},
        {classL:"28", MonthR:6, DateR:14, HourT:11, signed:false},
        {classL:"29", MonthR:6, DateR:14, HourT:12, signed:false},
        {classL:"30", MonthR:6, DateR:14, HourT:16, signed:false}
      ],
      classes6:[
        {classL:"31", MonthR:7, DeatR:19, HourT:10, signed:false},
        {classL:"32", MonthR:7, DateR:21, HourT:10, signed:false},
        {classL:"33", MonthR:7, DateR:23, HourT:10, signed:false},
        {classL:"34", MonthR:7, DateR:26, HourT:10, signed:false},
        {classL:"35", MonthR:7, DateR:28, HourT:10, signed:false},
        {classL:"36", MonthR:7, DateR:30, HourT:10, signed:false}
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  onFuck(){
    var that=this
    var today=new Date()
    month1=today.getMonth()//0-11
    day1=today.getDate() //1-31
    hour1=today.getHours() //0-23
    var c5=that.data.classes5
    if(c5[5].MonthR==month1 && c5[5].DateR==day1 && c5[5].HourT==hour1){
       c5[5].signed=true
    }
    //c5[5].signed=true
    //this.classes5[4].signed=true
    this.setData({
        signed:true,
        signScore:++this.data.signScore,
        day:day1,
        hour:hour1,
        month:month1,      
        classes5:c5 
    })
  },

  onSign:function(){
      if (!this.data.signed){
          var that=this
          var today=new Date()
          month1=today.getMonth()//0-11
          day1=today.getDate() //1-31
          hour1=today.getHours() //0-23
          var c1=that.data.classes1
          var c2=that.data.classes2
          var c3=that.data.classes3
          var c4=that.data.classes4
          var c5=that.data.classes5
          var c6=that.data.classes6
          var signedLo=false
          for(i=0;i<6;i++){
              if(c1[i].MonthR==month1 && c1[i].DateR==day1 && c1[i].HourT==hour1){
                  c1[i].signed=true
                  signedLo=true
                  that.setData({
                      signed:signedLo,
                      signScore:++that.data.signScore,
                      classes1:c1
                  })
              }
          }
          for(i=0;i<6;i++){
              if(c2[i].MonthR==month1 && c2[i].DateR==day1 && c2[i].HourT==hour1){
                c2[i].signed=true
                signedLo=true
                that.setData({
                    signed:signedLo,
                    signScore:++that.data.signScore,
                    classes2:c2
                })
              }
          }
          for(i=0;i<6;i++){
              if(c3[i].MonthR==month1 && c3[i].DateR==day1 && c3[i].HourT==hour1){
                c3[i].signed=true
                signedLo=true
                that.setData({
                    signed:signedLo,
                    signScore:++that.data.signScore,
                    classes3:c3
                })
              }
          }
          for(i=0;i<6;i++){
              if(c4[i].MonthR==month1 && c4[i].DateR==day1 && c4[i].HourT==hour1){
                c4[i].signed=true
                signedLo=true
                that.setData({
                    signed:signedLo,
                    signScore:++that.data.signScore,
                    classes4:c4
                })
              }
          }
          for(i=0;i<6;i++){
              if(c5[i].MonthR==month1 && c5[i].DateR==day1 && c5[i].HourT==hour1){
                c5[i].signed=true
                signedLo=true
                that.setData({
                    signed:signedLo,
                    signScore:++that.data.signScore,
                    classes5:c5
                })
              }
          }
          for(i=0;i<6;i++){
              if(c6[i].MonthR==month1 && c6[i].DateR==day1 && c6[i].HourT==hour1){
                c6[i].signed=true
                signedLo=true
                that.setData({
                    signed:signedLo,
                    signScore:++that.data.signScore,
                    classes6:c6
                })
              }
          }
        //   that.setData({
        //       signScore:++that.data.signScore,
        //       signed:signedLo,
        //       classes1:c1,
        //       classes2:c2,
        //       classes3:c3,
        //       classes4:c4,
        //       classes5:c5,
        //       classes6:c6,
        //   })
        }
    }
})