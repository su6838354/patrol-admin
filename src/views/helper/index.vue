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
      <el-table-column label="处理" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加人员" :visible.sync="dialogFormVisible">
      <el-form class="form_body" :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model="form.role" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="守护部位" :label-width="formLabelWidth">
          <el-input v-model="form.watch" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管辖区域" :label-width="formLabelWidth">
          <el-input v-model="form.area" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管辖时间" :label-width="formLabelWidth">
          <el-input v-model="form.period" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="擅长" :label-width="formLabelWidth">
          <el-input v-model="form.good" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="form.activity"></el-input>
        </el-form-item>
        <el-form-item label="路线规划">
          <el-input type="textarea" v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="案件处理">
          <el-input type="textarea" v-model="form.caseDetail"></el-input>
        </el-form-item>
        <el-form-item label="警官详情">
          <el-input type="textarea" v-model="form.detail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
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
  import { fetchHelper, fetchAddPeople } from '../../api/article'
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
        ],
        dialogFormVisible: false,
        form: {
          name: '',
          role: '',
          sex: 0,
          age: '',
          watch: '',
          area: '',
          period: '',
          good: '',
          activity: '',
          caseDetail: '',
          path: '',
          detail: ''
        },
        formLabelWidth: '10%'
      }
    },
    created() {
      this.role = this.$route.query.type
      this.fetchData()
    },
    computed: {
      getList() {
        return this.list.((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
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
      addRole() {
        const data = {
          name: this.name,
          role: this.role,
          sex: this.sex,
          age: this.age,
          watch: this.watch,
          area: this.area,
          period: this.period,
          good: this.good,
          activity: this.activity,
          case: this.caseDetail,
          path: this.path,
          detail: this.detail
        }
        console.log(data)
        fetchAddPeople(data).then(response => {
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

<style lang="scss">
  .app-container {
   .radio-label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 30px;
   }
    .form_body {
      width: 70%;
      position:relative;
      margin:0 auto;
      .el-form-item__content {
        width:60%;
      }
    }
  }

</style>

