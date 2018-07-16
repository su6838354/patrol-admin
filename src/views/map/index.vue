<template>
  <div>
    <div class="filter-container">
      <!--<el-date-picker-->
        <!--v-model="value5"-->
        <!--type="datetimerange"-->
        <!--:picker-options="pickerOptions2"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--align="right">-->
      <!--</el-date-picker>-->

      <el-tag>前一天轨迹</el-tag>
      <el-select v-model="staff" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="getPoints" type="primary">查询</el-button>
    </div>
    <div id="baiduMap" style="height: 1000px;"></div>
  </div>

</template>

<script>
  import { getPoints } from '../../api/article'
  import moment from 'moment'

export default {
  name: 'exportExcel',
  data() {

    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
    return {
      staff: 'A',
      staffs: {
        A: {
          "vhcid": "12150828",
          "vehicle": "9035",
        },
        B: {
          "vhcid": "12150828",
          "vehicle": "9035",
        }
      },
      options: [
        {
          value: '',
          label: 'A'
        },
        {
          value: 'B',
          label: 'B'
        }
      ],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value5: [start, end]
    }
  },
  created() {
    const recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', 'http://api.map.baidu.com/api?v=2.0&ak=KUF6d1NBvRFgrZ6q3GLOs7oK1N6aR32K')
    document.head.appendChild(recaptchaScript)
  },
  mounted () {
    this.getPoints();
  },
  computed: {
    msgs() {
      return this.users[this.current]
    }
  },
  methods: {
    getPoints() {
      const start = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');// moment(this.value5[0] || (new Date())).format('YYYY-MM-DD HH:mm:ss')
      const end = moment().subtract(1, 'days').format('YYYY-MM-DD 23:59:59'); // moment(this.value5[1] || (new Date())).format('YYYY-MM-DD HH:mm:ss')
      const p = this.staffs[this.staff]
      getPoints({
        ...p,
//        "vhcid": "12150828",
//        "vehicle": "9035",
        "begin_time": start,
        "end_time": end, //"2018-07-15 23:59:59"
      }).then((rep) => {
        this.draw(rep.data.topics)
      })
    },
    draw(pointArr) {
      var map = new BMap.Map("baiduMap");
      var point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
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
      var size = new BMap.Size(26, 26);
      var offset = new BMap.Size(0, -13);
      var imageSize = new BMap.Size(26, 26);
      var icon = new BMap.Icon('http://qyadmin.weichongming.com/logo.png', size, {
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

