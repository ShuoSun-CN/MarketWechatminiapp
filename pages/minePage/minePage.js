// pages/minePage/minePage.js
var app = getApp();
var isLoginSuccess = false;
// pages/login/login.js
let md5 = require('md5');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    btnstate: "default",
    account: "",
    password: "",
    isLogin: false,
    avatarUrl: "",
    userId: "",
    permission: "",
    type: ""
  },
  accountInput: function (e) {
    var content = e.detail.value;
    if (content != "") {
      this.setData({
        disabled: false,
        btnstate: "primary",
        account: content
      });
    }
  },
  pwdBlur: function (e) {
    var password = e.detail.value;
    if (password != "") {
      this.setData({
        password: password
      });
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.initLoginMsg();
    this.autoLogin();
  },

  autoLogin() {
    let that = this;
    let cookie = wx.getStorageSync("token");
    if (cookie !== '') {
      wx.request({
        url: 'http://localhost:8088/login?src=miniapp_auto',
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "x-requested-with": "XMLHttpRequest",
          'cookie': wx.getStorageSync("token")
        },
        success(res) {
          that.setData({
            isLogin: true,
            avatarUrl: "http://localhost:8088" + res
              .data.avatar,
            userId: res.data.userId,
            permission: res.data.userPermission,
            type: res.data.userType
          })
        }
      })
    }

  },

  logout() {
    wx.setStorageSync("token", "");
    this.setData({
      isLogin: false
    })
  },

  previewHead: function () {
    wx.previewImage({
      current: this.data.userHead,
      urls: [this.data.userHead]
    })
  },

  login() {
    let url = 'http://localhost:8088/login?src=miniapp&id=' + this.data.account + '&password=' + md5(this.data.password);
    let that = this;
    wx.request({
      url: url,
      data: {
        src: "miniapp",
      },
      method: 'POST',
      success(res) {
        console.log(res)
        if (res.data.resCode === "00000") {
          wx.showToast({
            title: '登录成功',
          });
          wx.setStorageSync("token", res.header["Set-Cookie"])
          that.setData({
            isLogin: true,
            avatarUrl: "http://localhost:8088" + res
              .data.avatar,
            userId: res.data.userId,
            permission: res.data.userPermission,
            type: res.data.userType
          })
        } else {
          wx.showToast({
            icon: "error",
            title: '用户名或密码错误',
          });
        }
      }
    })
  },

  loginTap: function () {
    var that = this;
    if (!isLoginSuccess) {
      wx.showLoading({
        title: '正在登录...',
      })
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })
      // 获取用户信息
      wx.getSetting({
        success: res => {
          wx.hideLoading();
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (app.userInfoReadyCallback) {
                  app.userInfoReadyCallback(res)
                }
                that.initLoginMsg();
              },
              fail: res => {
                wx.hideLoading();
                isLoginSuccess = false;
                that.setData({
                  userTitle: '点击登录',
                  userHead: '../../res/images/ic_mine_normal.png'
                })
              }
            })
          }
        }
      })
    }
  },

  initLoginMsg: function () {
    if (app.globalData.userInfo) {
      isLoginSuccess = true;
      this.setData({
        userHead: app.globalData.userInfo.avatarUrl,
        userTitle: '尊贵的，' + app.globalData.userInfo.nickName
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      isLoginSuccess = true;
      app.userInfoReadyCallback = res => {
        this.setData({
          userHead: res.userInfo.avatarUrl,
          userTitle: '尊贵的，' + res.userInfo.nickName
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          isLoginSuccess = true;
          app.globalData.userInfo = res.userInfo
          this.setData({
            userHead: res.userInfo.avatarUrl,
            userTitle: '尊贵的，' + res.userInfo.nickName
          })
        },
        fail() {
          isLoginSuccess = false;
          this.setData({
            userTitle: '点击登录',
            userHead: '../../res/images/ic_mine_normal.png'
          })
        }
      })
    }
  },

  allOrderTap: function () {
    wx.navigateTo({
      url: '../orderList/orderList?type=all',
    })
  },

  todoOrderTap: function () {
    wx.navigateTo({
      url: '../orderList/orderList?type=todo',
    })
  },

  toOrder() {
    console.log("to order")
    wx.navigateTo({
      url: '../specialty_order/specialty_order',
    })
  },

  toHotelOrder() {
    wx.navigateTo({
      url: '../house_order/house_order',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})