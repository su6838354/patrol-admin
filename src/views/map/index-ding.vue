<template>
  <div>
    <div class="filter-container">
      <!--<el-date-picker-->
        <!--v-model="value1"-->
        <!--type="date"-->
        <!--placeholder="选择日期">-->
      <!--</el-date-picker>-->

      <!--&lt;!&ndash;<el-tag>前一天轨迹</el-tag>&ndash;&gt;-->
      <!--<el-select v-model="xunluoId" placeholder="请选择">-->
        <!--<el-option-->
          <!--v-for="item in xunluoList"-->
          <!--:key="item.id"-->
          <!--:label="item.name"-->
          <!--:value="item.id">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-button @click="getPoints" type="primary">查询</el-button>-->
    </div>
    <div id="baiduMap" style="height: 1000px;"></div>
  </div>

</template>

<script>
  import { getPoints, getRealPoints } from '../../api/article'
  import moment from 'moment'
  import { fetchHelper } from '../../api/article'
  import request from 'request'

  export default {
    name: 'exportExcel',
    data() {

      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
      return {
        value1: start,
        vehicles: [],
        xunluoList: [],
        xunluoId: '',
        staff: '12150828',
        staffs: {
          '12150828': {
            "vhcid": "12150828",
            "vehicle": "9035",
          },
          '12150835': {
            "vhcid": "12150835",
            "vehicle": "2153",
          }
        },
        options: [
          {
            value: '12150828',
            label: '12150828'
          },
          {
            value: '12150835',
            label: '12150835'
          }
        ],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit('pick', [start, end]);
            }
          },
//        {
//          text: '最近一个月',
//          onClick(picker) {
//            const end = new Date();
//            const start = new Date();
//            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
//            picker.$emit('pick', [start, end]);
//          }
//        }, {
//          text: '最近三个月',
//          onClick(picker) {
//            const end = new Date();
//            const start = new Date();
//            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
//            picker.$emit('pick', [start, end]);
//          }
//        }
          ]
        },
        value5: [start, end]
      }
    },
    created() {
      const recaptchaScript = document.createElement('script')
      recaptchaScript.setAttribute('src', 'http://api.map.baidu.com/api?v=2.0&ak=KUF6d1NBvRFgrZ6q3GLOs7oK1N6aR32K')
      document.head.appendChild(recaptchaScript)
      const data = {
        type: 'xunluo',
        limit: 100,
        offset: 0,
        isDelete: 0
      }
      fetchHelper(data).then(response => {
        if (response.data.code === 0) {
          this.xunluoList = response.data.data
          this.getRealTimePoints();
//          this.getRealPoints();
        }
      });
    },
    mounted () {
      this.getPoints()
      this.draw([])
    },
    computed: {
      msgs() {
        return this.users[this.current]
      }
    },
    methods: {
      getRealTimePoints() {
        request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
          version: 1,
          method: 'loadVehicles',
          uid: '2437166',
          uKey: 'ba56097d0986fb6739d9254482498493'
        }}, (err, rep) => {
          this.vehicles = JSON.parse(rep.body).groups[0].vehicles;
        });
        setInterval(() => {
          this._getRealTimePoints()
        }, 500 * 10);
      },

      getRealPoints() {
        getRealPoints().then(rep => {
          console.log(rep);
        })
      },

      _getRealTimePoints(vKey) {
        this.xunluoList.map((item, index) => {
          const v = this.vehicles.filter(item2 => item2.name == item.area)[0]
          if (v) {
            request.post('http://121.40.98.157:89/gpsonline/GPSAPI', {form: {
              version: 1,
              method: 'loadLocation',
              vid: item.watch, //'12150835',
              vKey: v.vKey,//'4660f3bd748c4a365d47411143f2343e'
            }}, (err, rep) => {
              const body = JSON.parse(rep.body);
              if (body.success) {
//                const lngDiff = 0.010988
//                const latDiff = 0.003575
                const lngDiff = 0.011298
                const latDiff = 0.003895
                const point = {
                  lat: body.locs[0].lat + latDiff,
                  lng: body.locs[0].lng + lngDiff
                }
                // 配置图片
                const size = new BMap.Size(30, 30);
                const offset = new BMap.Size(0, -15);
                const imageSize = new BMap.Size(30, 30);
                const icon = new BMap.Icon('http://ypy.weichongming.com/sample-upload-1531761060838.jpg', size, {
                  imageSize: imageSize
                });
                const Bp = new BMap.Point(point.lng, point.lat)
                const marker = new BMap.Marker(Bp, {
                  icon: icon,
                  offset: offset
                }); // 创建标注
                const label = new BMap.Label("我是"+item.name,{offset:new BMap.Size(10, -10)});
                const _index = index;
                marker.setLabel(label);
                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
                this.map.addOverlay(marker);

                setTimeout(() => {
                  marker.setTop(true)
                }, _index * 500);

                const infoWindow = new BMap.InfoWindow(`${item.name}:${body.locs[0].info}`);
                marker.addEventListener("click", function(){
                  this.openInfoWindow(infoWindow);
                });

                if (!this.first) {
                  this.first = true
                  this.map.centerAndZoom(Bp, 15);
                }
              }
            });
          }

        })

      },
      getPoints() {
        // moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');//
        // moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59'); //
        if (!this.xunluoId) {
          return
        }
        const start = moment(this.value1 || (new Date())).format('YYYY-MM-DD 00:00:00')
        const end =  moment(this.value1 || (new Date())).format('YYYY-MM-DD 23:59:59')
        const p = this.xunluoList.filter(item => item.id == this.xunluoId)[0]
        getPoints({
          "vhcid": p.watch,
          "vehicle": p.area,
          "begin_time": start,
          "end_time": end, //"2018-07-15 23:59:59"
        }).then((rep) => {
          this.draw(rep.data.topics)
        })
      },
      draw(pointArr) {
        var map = new BMap.Map("baiduMap");
        this.map = map;
        var point = new BMap.Point(121.51837, 31.146772)
        map.centerAndZoom(point, 10);
        map.enableScrollWheelZoom(); // 开启鼠标滚轮缩放
        map.addControl(new BMap.ScaleControl()); // 添加比例尺控件

        const lngDiff = 0.010988
        const latDiff = 0.003575
        pointArr = pointArr.map(item => {
          return {
            lat: latDiff + item.lat,
            lng: lngDiff + item.lng
          }
        })

//      var pointArr = [
//        {"lat":latDiff+31.146997451782227,"lng":lngDiff+121.51802062988281},
//        {"lat":latDiff+31.146934509277344,"lng":lngDiff+121.51838684082031},
//        {"lat":latDiff+31.146934509277344,"lng":lngDiff+121.51838684082031},
//        {"lat":latDiff+31.146930694580078,"lng":lngDiff+121.5184555053711},
//        {"lat":latDiff+31.146732330322266,"lng":lngDiff+121.51885986328125},
//        {"lat":latDiff+31.14692497253418,"lng":lngDiff+121.51954650878906},
//        {"lat":latDiff+31.146995544433594,"lng":lngDiff+121.51984405517578},
//        {"lat":latDiff+31.146968841552734,"lng":lngDiff+121.51988983154297},
//        {"lat":latDiff+31.146114349365234,"lng":lngDiff+121.5206069946289},
//        {"lat":latDiff+31.145870208740234,"lng":lngDiff+121.52069091796875},
//        {"lat":latDiff+31.14567756652832,"lng":lngDiff+121.52093505859375},
//        {"lat":latDiff+31.145465850830078,"lng":lngDiff+121.52104187011719},{"lat":latDiff+31.144882202148438,"lng":lngDiff+121.52043151855469},{"lat":latDiff+31.14481544494629,"lng":lngDiff+121.52009582519531},{"lat":latDiff+31.144760131835938,"lng":lngDiff+121.51985168457031},{"lat":latDiff+31.145002365112305,"lng":lngDiff+121.51907348632812},{"lat":latDiff+31.14520263671875,"lng":lngDiff+121.51892852783203},{"lat":latDiff+31.145736694335938,"lng":lngDiff+121.51868438720703},{"lat":latDiff+31.14602279663086,"lng":lngDiff+121.5188980102539},{"lat":latDiff+31.14630699157715,"lng":lngDiff+121.51895141601562},{"lat":latDiff+31.146610260009766,"lng":lngDiff+121.51885223388672},{"lat":latDiff+31.14689826965332,"lng":lngDiff+121.51860809326172},{"lat":latDiff+31.146984100341797,"lng":lngDiff+121.51832580566406},{"lat":latDiff+31.14677619934082,"lng":lngDiff+121.51838684082031}]
        // 生成坐标点
        var trackPoint = [];
        for (var i = 0, j = pointArr.length; i < j; i++) {
          trackPoint.push(new BMap.Point(pointArr[i].lng, pointArr[i].lat));
        }

        map.centerAndZoom(trackPoint[0], 15);

        // 画线
        var polyline = new BMap.Polyline(trackPoint, {
          strokeColor: "#1869AD",
          strokeWeight: 3,
          strokeOpacity: 1
        });
        map.addOverlay(polyline);

        // 配置图片
        var size = new BMap.Size(13, 13);
        var offset = new BMap.Size(0, -7);
        var imageSize = new BMap.Size(13, 13);
        var icon = new BMap.Icon('http://ypy.weichongming.com/sample-upload-1531761060838.jpg', size, {
          imageSize: imageSize
        });

        // 画图标
        for (var i = 0, j = trackPoint.length; i < j; i++) {
          var marker = new BMap.Marker(trackPoint[i], {
            icon: icon,
            offset: offset
          }); // 创建标注
          map.addOverlay(marker);


        }

        //根据经纬极值计算绽放级别。 (从网上复制)
        function getZoom(maxLng, minLng, maxLat, minLat) {
          var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]; // 级别18到3。
          var pointA = new BMap.Point(maxLng, maxLat); // 创建点坐标A
          var pointB = new BMap.Point(minLng, minLat); // 创建点坐标B
          var distance = map.getDistance(pointA, pointB).toFixed(1); //获取两点距离,保留小数点后两位
          for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
            if (zoom[i] - distance > 0) {
              return 18 - i + 3; //之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
            }
          }
        }

        //  (从网上复制)
        function setZoom(points) {
          if (points.length > 0) {
            var maxLng = points[0].lng;
            var minLng = points[0].lng;
            var maxLat = points[0].lat;
            var minLat = points[0].lat;
            var res;
            for (var i = points.length - 1; i >= 0; i--) {
              res = points[i];
              if (res.lng > maxLng) maxLng = res.lng;
              if (res.lng < minLng) minLng = res.lng;
              if (res.lat > maxLat) maxLat = res.lat;
              if (res.lat < minLat) minLat = res.lat;
            }
            var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
            var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
            var zoom = getZoom(maxLng, minLng, maxLat, minLat);
            map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
          } else {
            //没有坐标，显示全中国
            map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5);
          }
        }

        setZoom(pointArr)
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

