<template>
  <div class="map-parent">
    <iframe src="http://dj.vvv1vvv.com/mapmanagement/-1/-1" width="100%" id="map" onload="console.log('----', this.contentWindow.getElementById('name'))" ></iframe>
  </div>
  <!--<div id="allmap">-->
    <!---->
  <!--</div>-->
</template>

<script>
//import request from '@/utils/request'
import request from 'request';


export default {
  name: 'exportExcel',
  data() {
    return {
      loginInfo: {}
    }
  },
  mounted() {
    document.getElementById('map').addEventListener('onload', () => {

    })
//    this.drawPoints()
//    this.drawPath()
  },
  created() {
//    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
//      version: 1,
//      method: 'loginSystem',
//      name: '上海杰闳',
//      pwd: '123456'
//    }}, (err, rep) => {
//      console.log(rep.body)
//    });
//
//    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
//      version: 1,
//      method: 'loadVehicles',
//      uid: '2435577',
//      uKey: '41a21112614ad3f3f748a5e43c272d5f'
//    }}, (err, rep) => {
//      console.log(rep.body)
//    });
//
//    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
//      version: 1,
//      method: 'loadLocation',
//      vid: '12150835',
//      vKey: '4660f3bd748c4a365d47411143f2343e'
//    }}, (err, rep) => {
//      console.log(rep.body)
//    });

  },
  updated: function() {
    window.document.querySelector('.container-1').scrollTop = window.document.querySelector('.container-1').scrollHeight
  },
  computed: {
    msgs() {
      return this.users[this.current]
    }
  },
  methods: {

    drawPoints() {
      // 百度地图API功能
      const map = new BMap.Map("allmap");
      map.centerAndZoom(new BMap.Point(116.417854,39.921988), 15);

      var data_info = [[116.417854,39.921988,"地址：北京市东城区王府井大街88号乐天银泰百货八层"],
        [116.406605,39.921585,"地址：北京市东城区东华门大街"],
        [116.412222,39.912345,"地址：北京市东城区正义路甲5号"]
      ];
      var opts = {
        width : 250,     // 信息窗口宽度
        height: 80,     // 信息窗口高度
        title : "信息窗口" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
      };
      for(var i=0;i<data_info.length;i++){
        var marker = new BMap.Marker(new BMap.Point(data_info[i][0],data_info[i][1]));  // 创建标注
        var content = data_info[i][2];
        map.addOverlay(marker);               // 将标注添加到地图中
        addClickHandler(content,marker);
      }
      function addClickHandler(content,marker){
        marker.addEventListener("click",function(e){
          openInfo(content,e)}
        );
      }
      function openInfo(content,e){
        var p = e.target;
        var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
        var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
        map.openInfoWindow(infoWindow,point); //开启信息窗口
      }
    },
    drawPath() {
      // 百度地图API功能
      var map = new BMap.Map("allmap");
      map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
      var bounds = null;
      var linesPoints = null;
      var spoi1 = new BMap.Point(116.380967,39.913285);    // 起点1
      var spoi2 = new BMap.Point(116.380967,39.953285);    // 起点2
      var epoi  = new BMap.Point(116.424374,39.914668);    // 终点
      var myIcon = new BMap.Icon("http://lbsyun.baidu.com/jsdemo/img/Mario.png", new BMap.Size(32, 70), {imageOffset: new BMap.Size(0, 0)});
      function initLine(){
        bounds = new Array();
        linesPoints = new Array();
        map.clearOverlays();                                                    // 清空覆盖物
        var driving3 = new BMap.DrivingRoute(map,{onSearchComplete:drawLine});  // 驾车实例,并设置回调
        driving3.search(spoi1, epoi);                                       // 搜索一条线路
        var driving4 = new BMap.DrivingRoute(map,{onSearchComplete:drawLine});  // 驾车实例,并设置回调
        driving4.search(spoi2, epoi);                                       // 搜索一条线路
      }
      function run(){
        for(var m = 0;m < linesPoints.length; m++){
          var pts = linesPoints[m];
          var len = pts.length;
          var carMk = new BMap.Marker(pts[0],{icon:myIcon});
          map.addOverlay(carMk);
          resetMkPoint(1,len,pts,carMk)
        }

        function resetMkPoint(i,len,pts,carMk){
          carMk.setPosition(pts[i]);
          if(i < len){
            setTimeout(function(){
              i++;
              resetMkPoint(i,len,pts,carMk);
            },100);
          }
        }

      }
      function drawLine(results){
        var opacity = 0.45;
        var planObj = results.getPlan(0);
        var b = new Array();
        var addMarkerFun = function(point,imgType,index,title){
          var url;
          var width;
          var height
          var myIcon;
          // imgType:1的场合，为起点和终点的图；2的场合为车的图形
          if(imgType == 1){
            url = "http://lbsyun.baidu.com/jsdemo/img/dest_markers.png";
            width = 42;
            height = 34;
            myIcon = new BMap.Icon(url,new BMap.Size(width, height),{offset: new BMap.Size(14, 32),imageOffset: new BMap.Size(0, 0 - index * height)});
          }else{
            url = "http://lbsyun.baidu.com/jsdemo/img/trans_icons.png";
            width = 22;
            height = 25;
            var d = 25;
            var cha = 0;
            var jia = 0
            if(index == 2){
              d = 21;
              cha = 5;
              jia = 1;
            }
            myIcon = new BMap.Icon(url,new BMap.Size(width, d),{offset: new BMap.Size(10, (11 + jia)),imageOffset: new BMap.Size(0, 0 - index * height - cha)});
          }

          var marker = new BMap.Marker(point, {icon: myIcon});
          if(title != null && title != ""){
            marker.setTitle(title);
          }
          // 起点和终点放在最上面
          if(imgType == 1){
            marker.setTop(true);
          }
          map.addOverlay(marker);
        }
        var addPoints = function(points){
          for(var i = 0; i < points.length; i++){
            bounds.push(points[i]);
            b.push(points[i]);
          }
        }
        // 绘制驾车步行线路
        for (var i = 0; i < planObj.getNumRoutes(); i ++){
          var route = planObj.getRoute(i);
          if (route.getDistance(false) <= 0){continue;}
          addPoints(route.getPath());
          // 驾车线路
          if(route.getRouteType() == BMAP_ROUTE_TYPE_DRIVING){
            map.addOverlay(new BMap.Polyline(route.getPath(), {strokeColor: "#0030ff",strokeOpacity:opacity,strokeWeight:6,enableMassClear:true}));
          }else{
            // 步行线路有可能为0
            map.addOverlay(new BMap.Polyline(route.getPath(), {strokeColor: "#30a208",strokeOpacity:0.75,strokeWeight:4,enableMassClear:true}));
          }
        }
        map.setViewport(bounds);
        // 终点
        addMarkerFun(results.getEnd().point,1,1);
        // 开始点
        addMarkerFun(results.getStart().point,1,0);
        linesPoints[linesPoints.length] = b;
      }
      initLine();
      setTimeout(function(){
        run();
      },1500);
    }
  }
}
</script>

<style>
  #allmap{
    width:100%;
    height: 700px;
  }
  .map-parent {
    width: 100%;
    height: 1000px;
    overflow: auto;
  }
  #map {
    min-height: 1000px;
  }
  p {
    margin-left:5px; font-size:14px;
  }
</style>

