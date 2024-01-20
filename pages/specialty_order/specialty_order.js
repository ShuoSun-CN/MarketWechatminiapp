var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["全部", "待付款", "待发货","待收货","待评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    listsAll:[0,1],
    listItem: [
      { id: '1', title: 'Apple/苹果iPhone 11 ProMAX官', img: '../../assets/imgs/listImg2.png', num: '3', price: '34.99', attr: '属性1;属性2' },
      { id: '2', title: 'Apple/苹果iPhone 11 ProMAX官', img: '../../assets/imgs/listImg2.png', num: '3', price: '34.99', attr: '属性1;属性2' }
    ]
  },
  onLoad: function (option) {
    console.log(option);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    // 根据前页面传过来的参数显示tab内容
    console.log(wx.getStorageSync('token'));
    var token=wx.getStorageSync('token').split(',').slice(-1)[0];
    var user_name=token.split('=').slice(-1)[0];
    wx.request({
      url: 'http://localhost:8088/homestay_servlet_specialty_order_servlet_action?action=get_specialty_order_record',
      data:{"order_id":"","specialty_name":"",'username':user_name},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
        console.log(res)
       that.setData({
         listsAll:res.data.aaData
       })
     },
     fail:function(res){

     }
    })
  },
  tabClick: function (e) {
    console.log(e);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
  ,
  toHomePage() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  toDetail() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail'
    })
  },
  paySpecialtyOrder: function (e) {
    let that=this;
    var index = e.currentTarget.dataset.index;
    var room = this.data.listsAll[index];
    console.log(room);

    wx.request({
      url: 'http://localhost:8088/specialtyMarketOrder',
      data:{"good_list":"["+JSON.stringify(room)+"]","action":"pay_order","good_type":"specialty"},
      method:"POST",
      header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
      success:function(res){
        if(res.data.code==0)
        {
          wx.showToast({
            title: '支付成功!',
            icon:'none',
            duration:2000,
            success:function(res){
              setTimeout(function(){
                console.log("success");
                that.onLoad();
              },2000)
            }
          })
        }
        else{
          wx.showToast({
            title: '支付失败!余额不足!',
            icon:'none',
            duration:2000,
            success:function(res){
              setTimeout(function(){
              that.onLoad();
              },2000)
  
            }
          })
        }
      }
    });

    // if(room.res_num<1)
    // {

    // }
    // else{
    // wx.navigateTo({
    //      url: '../bookHotel/bookHotel?price=' + room.room_price + '&house_id='+this.data.good_id+'&hotelName=' + this.data.good_name + '&roomName=' + room.room_name +'&room_id='+room.room_id+ '&startDate=' + startDate + '&endDate=' + endDate+'&dayCount='+this.data.dayCount,
    // })
    // }

},
});