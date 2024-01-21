// pages/todolist/add/todo_add.js

const dateTimePicker = require('../../../utils/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    uploadimgs: [], //上传图片列表
    editable: false, //是否可编辑
    uploadAttachmentId: [],
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    let obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    let obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    let lastArray = obj1.dateTimeArray.pop();
    let lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 自定义
  // time picker
  changeDate(e) {
    this.setData({
      date: e.detail.value
    });
  },
  changeTime(e) {
    this.setData({
      time: e.detail.value
    });
  },
  changeDateTime(e) {
    this.setData({
      dateTime: e.detail.value
    });
  },
  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime;
    var dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },


  submitAdd() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    console.log(this.data.title);
    wx.request({
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest",
        'cookie':wx.getStorageSync("token")
      },
      url: 'http://localhost:8088/todo',
      data: {
        action: "add_todo_record",
        content: this.data.title,
        deadline: `${this.data.dateTimeArray1[0][this.data.dateTime1[0]]}-${this.data.dateTimeArray1[1][this.data.dateTime1[1]]}-${this.data.dateTimeArray1[2][this.data.dateTime1[2]]} ${this.data.dateTimeArray1[3][this.data.dateTime1[3]]}:${this.data.dateTimeArray1[4][this.data.dateTime1[4]]}:00`
      },
      success: (res) => {
        wx.navigateBack({
          success() {
            prevPage.onLoad();
          }
        });
      },
      fail: (err) => {
        console.log("!!!error:", err);
        wx.showToast({
          title: '修改失败',
          duration: 2000
        })
      }
    })
  },

  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        });
        // 直接上传
        wx.uploadFile({
          filePath: res.tempFilePaths[0],
          name: 'img',
          url: 'http://localhost:8080/todo?action=upload_record',
          data: {
            action: "upload_record"
          },
          header: {
            "content-type": "application/x-www-form-urlencoded",
            "x-requested-with": "XMLHttpRequest"
          },
          success(res) {
            console.log(res)
            let data = res.data;
            _this.data.uploadAttachmentId.push(data.attachment_id);
          },
          fail(res) {
            wx.showToast({
              title: '上传失败',
            });
          }
        })
      }
    })
  },
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    const imgs = this.data.uploadimgs
    // Array.prototype.remove = function(i){
    //   const l = this.length;
    //   if(l==1){
    //     return []
    //   }else if(i>1){
    //     return [].concat(this.splice(0,i),this.splice(i+1,l-1))
    //   }
    // }
    this.setData({
      uploadimgs: imgs.remove(e.currentTarget.dataset.index)
    })
  }
})