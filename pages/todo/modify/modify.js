// pages/todolist/modify/todo_modify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    title: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      id: options.id,
      title: options.title
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
  submitModify() {
    wx.showModal({
      title: '修改',
      content: '是否确定修改？',
      complete: (res) => {
        if (res.cancel) {
          console.log("取消修改")
        }
        if (res.confirm) {
          wx.request({
            header: {
              "content-type": "application/x-www-form-urlencoded",
              "x-requested-with": "XMLHttpRequest",
              'cookie':wx.getStorageSync("token")
            },
            url: 'http://localhost:8088/todo',
            data: {
              action: "modify_todo_record",
              todoId: this.data.id,
              content: this.data.title
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
          });
        }
      }
    })
  }
})