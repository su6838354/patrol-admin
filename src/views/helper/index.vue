<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>
    <div class="filter-container">
      <el-date-picker  @keyup.enter.native="fetchData" style="width: 200px;" class="filter-item" v-model="query.order_date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" :placeholder="'日期'"></el-date-picker>

      <el-select clearable style="width: 200px" class="filter-item" v-model="query.order_path" :placeholder="'线路'">
        <el-option v-for="item in getPath" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable style="width: 200px" class="filter-item" v-model="query.order_station" :placeholder="'站点'">
        <el-option v-for="item in getStation" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-select clearable style="width: 200px" class="filter-item" v-model="query.order_class" :placeholder="'班次'">
        <el-option v-for="item in getClass" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">{{$t('table.search')}}</el-button>
    </div>

    <el-table :data="getList" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='Id' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>

      <el-table-column label="日期" width="120" align="center">
        <template slot-scope="scope">
          <!--<el-tag>{{scope.row.order_date}}</el-tag>-->
          <i class="el-icon-time"></i>
          <span>{{scope.row.order_date | parseTime('{y}-{m}-{d}')}}</span>
        </template>
      </el-table-column>


      <el-table-column label="角色" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_path}}
        </template>
      </el-table-column>


      <el-table-column label="姓名" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_station}}
        </template>
      </el-table-column>


      <el-table-column label="性别" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_class}}
        </template>
      </el-table-column>

      <el-table-column label="年龄" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_owner}}
        </template>
      </el-table-column>


      <el-table-column label="管辖区域" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.order_mobile}}
        </template>
      </el-table-column>
      <el-table-column label="擅长" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.order_mobile}}
        </template>
      </el-table-column>
      <el-table-column label="案件处理" align="center">
        <template slot-scope="scope">
          {{scope.row.order_mobile}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
  import { fetchHelper } from '@/api/article'
  import { parseTime } from '@/utils'

  export default {
    name: 'exportExcel',
    data() {
      return {
        role: this.$route.query.type,
        currentPage: 1,
        pageSize: 10,
        list: [],
        listLoading: true,
        downloadLoading: false,
        filename: 'data',
        autoWidth: true,
        query: {
          order_date: '',
          order_path: '',
          order_station: '',
          order_class: '',
          limit: 100000
        },
        orderData: [
          {
            name: '旅游1线',
            stations: [
              {
                name: '南门水陆换乘中心',
                classes: [
                  {
                    time: '9:00'
                  },
                  {
                    time: '13:20'
                  }
                ]
              },
              {
                name: '前卫村',
                classes: [
                  {
                    time: '11:00'
                  },
                  {
                    time: '15:40'
                  }
                ]
              }
            ]
          },
          {
            name: '旅游2线',
            stations: [
              {
                name: '南门水陆换乘中心',
                classes: [
                  {
                    id: 'path_2,point_nanmen,9:00', // 代码按规则自动生成
                    time: '9:00'
                  },
                  {
                    time: '13:20'
                  }
                ]
              },
              {
                name: '明珠湖公园',
                classes: [
                  {
                    time: '11:00'
                  },
                  {
                    time: '15:40'
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    created() {
      this.role = this.$route.query.type
      this.fetchData()
    },
    computed: {
      getList() {
        return this.list.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },
      getPath() {
        return this.orderData.map(item => item.name)
      },
      getStation() {
        const selectPath = this.orderData.filter(path => path.name === this.query.order_path)
        if (selectPath && selectPath.length > 0) {
          return selectPath[0].stations.map(station => {
            return station.name
          })
        }
        return []
      },
      getClass() {
        const selectPath = this.orderData.filter(path => path.name === this.query.order_path)
        if (selectPath && selectPath.length > 0) {
          const stations = selectPath[0].stations
          // console.log(selectPath, '1112')
          // console.log(stations, '111')
          const selectStations = stations.filter(station => station.name === this.query.order_station)
          if (selectStations && selectStations.length > 0) {
            const classes = selectStations[0].classes
            return classes.map(cls => {
              return cls.time
            })
          }
        }
        return []
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
      },
      fetchData() {
        this.listLoading = true
        const data = {
          type: this.role,
          limit: 10,
          offset: 0
        }
        fetchHelper(data).then(response => {
          console.log(response)
          this.list = response.data.data
          this.listLoading = false
        })
      },
      handleDownload() {
        console.log(this.filename)
        if (!this.filename) {
          this.$message.error('文件名不能为空!')
          return
        }
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Id', '日期', '角色', '姓名', '性别', '年龄', '管辖区域', '擅长', '案件处理']
          const filterVal = ['id', 'order_date', 'order_path', 'order_station', 'order_class', 'order_owner', 'order_mobile', 'create_time', 'status']
          const list = this.list
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'create_time') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      }
    }
  }
</script>

<style>
  .radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
  }
</style>

