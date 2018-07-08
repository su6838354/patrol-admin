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
      <el-button class="filter-item add-button" type="primary" @click="updateRole('add',{})">添加</el-button>
    </div>

    <el-table :data="getList" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>

      <el-table-column align="center" label='Id' width="95">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.sex}}
        </template>
      </el-table-column>

      <el-table-column label="年龄" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.age}}
        </template>
      </el-table-column>

      <el-table-column label="擅长" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.good}}
        </template>
      </el-table-column>
      <el-table-column label="管辖区域" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.area}}
        </template>
      </el-table-column>

      <el-table-column label="管辖时间" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.area}}
        </template>
      </el-table-column>
      <el-table-column label="路线规划" align="center">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>
      <el-table-column label="守护部位" align="center">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>

      <el-table-column label="案件处理" align="center">
        <template slot-scope="scope">
          {{scope.row.case}}
        </template>
      </el-table-column>

      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          {{scope.row.detail}}
        </template>
      </el-table-column>

      <el-table-column label="处理" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="updateRole('update',scope.row)">修改</el-button>
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
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.age" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="管辖区域" :label-width="formLabelWidth">
          <el-input v-model="form.area" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="擅长" :label-width="formLabelWidth">
          <el-input v-model="form.good" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="守护部位" :label-width="formLabelWidth">
          <el-input v-model="form.watch" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="管辖时间" :label-width="formLabelWidth">
          <el-input v-model="form.period" auto-complete="off"></el-input>
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
        <el-button type="primary" @click="sumbitBtn">确 定</el-button>
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
  import { fetchHelper, fetchAddPeople, fetchUpdatePeople } from '../../api/article'
  import { parseTime } from '@/utils'

  export default {
    name: 'exportExcel',
    data() {
      return {
        id: '',
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
        form: {
          name: '',
          role: '',
          sex: '0',
          age: '',
          watch: '',
          area: '',
          period: '',
          good: '',
          avatar: '',
          caseDetail: '',
          path: '',
          detail: ''
        },
        formLabelWidth: '10%',
        dialogFormVisible: false
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
      updateRole(param, row) {
        if (param === 'update') {
          this.form.name = row.name
          this.form.sex = row.sex
          this.form.age = row.age
          this.form.watch = row.watch
          this.form.area = row.area
          this.form.period = row.period
          this.form.good = row.good
          this.form.avatar = row.avatar
          this.form.caseDetail = row.caseDetail
          this.form.path = row.path
          this.form.detail = row.detail
          this.id = row.id
        }
        if (param === 'add') {
          this.form.name = ''
          this.form.sex = ''
          this.form.age = ''
          this.form.watch = ''
          this.form.area = ''
          this.form.period = ''
          this.form.good = ''
          this.form.avatar = ''
          this.form.caseDetail = ''
          this.form.path = ''
          this.form.detail = ''
          this.id = ''
        }
        this.dialogFormVisible = true
      },
      // 人员更新
      updateFetch() {
        const data = {
          id: this.id,
          type: this.role,
          name: this.form.name,
          sex: this.form.sex,
          age: this.form.age,
          watch: this.form.watch,
          area: this.form.area,
          period: this.form.period,
          good: this.form.good,
          avatar: '',
          case: this.form.caseDetail,
          path: this.form.path,
          detail: this.form.detail
        }
        fetchUpdatePeople(data).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data
            this.listLoading = false
            this.dialogFormVisible = false
          }
        })
      },
      // 提交
      sumbitBtn() {
        if (this.id === '') {
          this.addRole()
        } else {
          this.updateFetch()
        }
      },
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
          limit: this.pageSize,
          offset: this.currentPage
        }
        fetchHelper(data).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data
            this.listLoading = false
          }
        })
      },
      addRole() {
        const data = {
          id: '',
          type: this.role,
          name: this.form.name,
          sex: this.form.sex,
          age: this.form.age,
          watch: this.form.watch,
          area: this.form.area,
          period: this.form.period,
          good: this.form.good,
          avatar: '',
          case: this.form.caseDetail,
          path: this.form.path,
          detail: this.form.detail
        }
        fetchAddPeople(data).then(response => {
          this.list = response.data.data
          this.listLoading = false
          this.dialogFormVisible = false
        })
      },
      handleDownload() {
        console.log(this.filename)
        if (!this.filename) {
          this.$message.error('文件名不能为空!')
          return
        }
        this.downloadLoading = true
        if (this.role === 'help') {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '姓名', '性别', '年龄', '管辖区域', '擅长'];
            const filterVal = ['id', 'name', 'sex', 'age', 'area', 'good'];
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
        }
        if (this.role === 'mediation') {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '姓名', '性别', '年龄', '管辖区域', '擅长', '案件处理'];
            const filterVal = ['id', 'name', 'sex', 'age', 'area', 'good', 'case'];
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
        }
        if (this.role === 'guard') {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '姓名', '守护部位', '性别', '年龄', '管辖时间', '路线规划']
            const filterVal = ['id', 'name', 'watch', 'sex', 'age', 'period', 'path']
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
        }
        if (this.role === 'police') {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '姓名', '详情']
            const filterVal = ['id', 'name', 'detail']
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
        }

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
    .add-button {
      float:right;
      margin-right:10%;
    }
    .form_body {
      width: 70%;
      position:relative;
      margin:0 auto;
      .el-form-item__content {
        width:60%;
      }
      .el-textarea__inner {
        margin-left:16%;
      }
    }
  }

</style>

