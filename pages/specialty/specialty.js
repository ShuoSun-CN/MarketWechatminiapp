// pages/searchHotel/searchHotel.js
var mHotelList = [];
function HotelBean() {
     var image;
     var name;
     var score;
     var service;
     var address;
     var distance;
     var price;
     var test;
}

Page({
     /**
      * 页面的初始数据
      */
     data: {
          location: '',
          hotelArray: [],
          loadenable: true,
          shownavindex: 1,
          priceL2H: true,
          searchName:''
     },

     onLoad: function (options) {
       this.getHouseList();
     },
     getHouseList:function(){
       let that =this;

       wx.request({
         url: 'http://localhost:8088/houseMarket',
         data:{"good_type":"specialty","action":"query_all"},
         method:"POST",
         header:{"content-type":"application/x-www-form-urlencoded","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
         success:function(res){
           console.log(res)
          that.handleGetHouseRecordResult(res);
        },
        fail:function(res){

        }
       })
     },
     handleGetHouseRecordResult:function(res){
      
      console.log(JSON.stringify(res.data.good_list));
   this.setData({
        hotelArray: res.data.good_list
   });
    },
    searchEvent:function(){
      let that=this;
      wx.request({
        url: 'http://localhost:8088/houseMarket',
        data:{"good_type":"specialty","action":"query_by_name","search_name":this.data.searchName},
        method:"POST",
        header:{"content-type":"application/x-www-form-urlencoded;charset=utf-8","x-requested-with":"XMLHttpRequest",'cookie':wx.getStorageSync("token")},
        success:function(res){
          console.log(res)
         that.handleGetHouseRecordResult(res);
       },
       fail:function(res){

       }
      })
    },
    titleInput:function(e){
      console.log(e.detail);
      this.setData({
        searchName:e.detail.value,
      })
      console.log(this.data.searchName);
    },

})