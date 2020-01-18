//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    weekday:['周日','周一','周二','周三','周四','周五','周六'],
    showday:['今天','明天','']
  },
  //当页面加载完成
  onLoad: function () {
    var that = this;
    var date=new Date();
    date.setDate(date.getDate()+2);
    this.setData({
      'showday[2]':this.data.weekday[date.getDay()]
    });
    console.log(this.data.showday);
    //获得经纬度
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var lat = res.latitude;//纬度
        var lng = res.longitude;//经度
        console.log(lat + "---" + lng);
        that.getCity(lat, lng);//调用自己写的函数获得城市
      },
    })
  },

  //获得城市
  getCity: function (lat, lng) {
    var that = this;
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var param = {
      ak: 'OKyfoA8Tlup234GFBnGTng21IYD6pKuZ',//百度地图API的AK
      location: lat + "," + lng,//纬经度
      output: 'json'//返回的数据格式
    };

    //发送请求获取数据
    wx.request({
      url: url,
      data: param,
      success: function (res) {
        console.log(res);
        var city = res.data.result.addressComponent.district;
        var street = res.data.result.addressComponent.street;
        //设置data数据
        that.setData({
          city: city,
          street: street
        });

        //调用自定义的函数获取天气信息
        city = city.substring(0, city.length - 1);//截掉最后一个字
        that.getWeather(city);
      }
    })
  },

  //获取天气信息函数
  getWeather: function (city) {
    var that=this;
    var url = "https://free-api.heweather.com/v5/weather";
    var param = {
      key: "4a5dd00e91624d218f61836a08090f6a",
      city: city
    };

    //发送请求
    wx.request({
      url: url,
      data: param,
      success: function (res) {
        console.log(res);
        /*//风向
        var dir = res.data.HeWeather5["0"].now.wind.dir;
        //风速
        var spd = res.data.HeWeather5["0"].now.wind.spd;
        //相对湿度
        var hum = res.data.HeWeather5["0"].now.hum;
        //体感温度
        var fl = res.data.HeWeather5["0"].now.fl;
        //设置data数据*/
        that.setData({
          now:res.data.HeWeather5["0"].now,
          forecast:res.data.HeWeather5["0"].daily_forecast
        });
      }
    })
  }

})

