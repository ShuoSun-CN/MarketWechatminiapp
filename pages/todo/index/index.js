// pages/todolist/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showsearch: false, //显示搜索按钮
    searchtext: '', //搜索文字
    filterdata: {}, //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    sortindex: 0, //一级分类索引
    sortid: null, //一级分类id
    subsortindex: 0, //二级分类索引
    subsortid: null, //二级分类id
    cityindex: 0, //一级城市索引
    cityid: null, //一级城市id
    subcityindex: 0, //二级城市索引
    subcityid: null, //二级城市id
    servicelist: [], //服务集市列表
    scrolltop: null, //滚动位置
    page: 0, //分页

    // Todo List
    todoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTodoRecord();
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
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchServiceData();
  },
  onPullDownRefresh: function () { //下拉刷新
    this.setData({
      page: 0,
      servicelist: []
    })
    this.getTodoRecord();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  // todo list
  getTodoRecord() {
    wx.showLoading({
      title: '加载中'
    });
    wx.request({
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest",
        'cookie':wx.getStorageSync("token")
      },
      url: 'http://localhost:8088/todo',
      data: {
        action: "get_todo_record"
      },
      success: (res) => {
        console.log(res);
        this.setData({
          todoList: res.data.data
        });
        wx.hideLoading();
      },
      fail: (err) => {
        console.log("!!!error:", err);
        wx.hideLoading();
        wx.showToast({
          title: 'error!',
          duration: 1000
        });
      }
    })
  },

  onRemoveRecord(e) {
    console.log(e.currentTarget.dataset)
    const recordId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除',
      content: '确实删除吗？',
      complete: (res) => {
        if (res.cancel) {
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
              action: "delete_todo_record",
              todoId: recordId
            },
            success: (res) => {
              console.log(res);
              this.onLoad();
            },
            fail: (err) => {
              console.log("!!!error:", err);
            }
          });    
        }
      }
    })
  },

  onModifyRecord(e) {
    const recordId = e.currentTarget.dataset.id;
    const recordTitle = e.currentTarget.dataset.title;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: `../modify/modify?id=${recordId}&title=${recordTitle}`,
    })
  },

  onAddRecord() {
    wx.navigateTo({
      url: '../add/add',
    })
  }
})