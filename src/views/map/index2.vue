<template>
  <div id="allmap">

  </div>
</template>

<script>
//import request from '@/utils/request'
import request from 'request';


export default {
  name: 'exportExcel',
  data() {
    return {
      loginInfo: {},
      vData: {
        '12150828': []
      },
      vicel: {
        '12150828': '4660f3bd748c4a365d47411143f2343e',
      },
      points: []
    }
  },
  mounted() {

//    this.drawPoints()
//    this.drawPath()
    this.drawGps()
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
    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
      version: 1,
      method: 'loadVehicles',
      uid: '2435577',
      uKey: '41a21112614ad3f3f748a5e43c272d5f'
    }}, (err, rep) => {
      console.log('vehicles', rep.body)
    });
//
    /***
     * 获取设置定位
     */
    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
      version: 1,
      method: 'loadLocation',
      vid: '12150835',
      vKey: '4660f3bd748c4a365d47411143f2343e'
    }}, (err, rep) => {
      if (rep.body.success) {
        this.vData['4660f3bd748c4a365d47411143f2343e'] = rep.body.locs
      }
      console.log(rep.body)
    });


    /***
     * 获取轨迹
     */

    let st = 1531639280000;
           //1531705202000; // 1531720851514;


    const run = () => {
      setTimeout(() => {
        if (st < Date.now()) {
          this.requestData('4660f3bd748c4a365d47411143f2343e', st)
          run();
          st = st + 10 * 1000 * 1000
        }
      }, 500)
    }
    run()

    const draw = () => {
      window.setTimeout(() => {
        this.drawGps()
      }, 10000)
    }
    draw()

    const translateCallback = (data) => {
      console.log('00000', data)
      if(data.status === 0) {
        this.points = data.points;
//        var marker = new BMap.Marker(data.points[0]);
//        bm.addOverlay(marker);
//        var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
//        marker.setLabel(label); //添加百度label
//        bm.setCenter(data.points[0]);
        this.drawGps()
      }
    }

    window.setInterval(() => {
      var convertor = new BMap.Convertor();
      var pointArr = [];
      this.vData['12150828'].map(item => {
        var ggPoint = new BMap.Point(item.x, item.y);
        pointArr.push(ggPoint);
      })

      convertor.translate(pointArr, 1, 5, translateCallback)
    }, 1000);

    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
      version: 1,
      method: 'loadHistory',
      vid: '12150835',
      vKey: 'e465f6a8525954fd1b260f2d99eeeb83',
      bTime: 1531704202000,
      eTime: 1531705202000
    }}, (err, rep) => {
      if (rep.body.success) {
//        this.vData['4660f3bd748c4a365d47411143f2343e'] = rep.body.locs
      }
      console.log('history-12150835', rep.body)
    });

    request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
      version: 1,
      method: 'loadHistory',
      vid: '12150828',
      vKey: '4660f3bd748c4a365d47411143f2343e',
      bTime: 1531704202000,
      eTime: 1531705202000
    }}, (err, rep) => {
      if (rep.body.success) {
//        this.vData['4660f3bd748c4a365d47411143f2343e'] = rep.body.locs
      }
      console.log('history-12150828', rep.body)
    });

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
    requestData(vkey, t) {
      request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
        version: 1,
        method: 'loadHistory',
        vid: '12150828',
        vKey: vkey,
        bTime: t - 4000 * 1000,
        eTime: t,
      }}, (err, rep) => {
        const body = JSON.parse(rep.body)
        if (body.history[0]) {
          const item = body.history[0];
          const data = {"x": item.lat,"y":item.lng}
          this.vData['12150828'].push(data)
        }
        console.log('history-12150828', rep.body)
      });
    },

    drawGps () {
      const map = new BMap.Map("allmap");
      map.enableScrollWheelZoom();

      /**采集到的GPS点**/
//      var PointArr = this.vData['12150828'].map(item => {
//        return {"x": item.lat,"y":item.lng}
//      })
      var PointArr = this.points;
      if (PointArr.length < 2) {
        return
      }
//        [
//        {"x":106.6621950000,"y":26.6271700000},
//        {"x":106.6622350000,"y":26.6271700000},
//        {"x":106.7329920000,"y":26.6110190000},
//        {"x":106.7739370000,"y":26.6371410000},
//        {"x":106.7786660000,"y":26.6372330000}
//        ];
      var p = Math.ceil(PointArr.length / 2);
      PointArr[p].x = PointArr[p].lat
      PointArr[p].y = PointArr[p].lng
      map.centerAndZoom(new BMap.Point(PointArr[p].x, PointArr[p].y), 13);
      var driving;
      for(var i in PointArr){
        if(i == 0 ){
          addMarker(new BMap.Point(PointArr[i].x, PointArr[i].y),"起点");
          continue;
        }
        driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: false},
          onMarkersSet:function(routes) {
            map.removeOverlay(routes[0].marker); //删除API自带起点
            map.removeOverlay(routes[1].marker); //删除API自带终点
          }});
        driving.search(new BMap.Point(PointArr[i-1].x, PointArr[i-1].y),
          new BMap.Point(PointArr[i].x, PointArr[i].y));
        if(i == PointArr.length -1){
          addMarker(new BMap.Point(PointArr[i].x, PointArr[i].y),"终点");
        }
      }
      /**
       * 标记
       * @param {Object} point
       */
      function addMarker(point,name){
        var marker = new BMap.Marker(point);
        var label = new BMap.Label(name, {
          offset : new BMap.Size(20, -10)
        });
        marker.setLabel(label);
        map.addOverlay(marker);
      }
    },

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

