<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <!--<label class="radio-label">Cell Auto Width: </label>-->
    <!--<el-radio-group v-model="autoWidth">-->
      <!--<el-radio :label="true" border>True</el-radio>-->
      <!--<el-radio :label="false" border>False</el-radio>-->
    <!--</el-radio-group>-->
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>


    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'日期'" v-model="query.order_date">
      </el-input>

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'线路'" v-model="query.order_path">
      </el-input>


      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'站点'" v-model="query.order_station">
      </el-input>


      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'班次'" v-model="query.order_class">
      </el-input>


      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'日期'" v-model="query.order_date">-->
      <!--</el-input>-->

      <!--<el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" :placeholder="$t('table.importance')">-->
        <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" :placeholder="$t('table.type')">-->
        <!--<el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">-->
        <!--<el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="fetchData">{{$t('table.search')}}</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>-->
      <!--<el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>-->
      <!--<el-checkbox class="filter-item" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showReviewer">{{$t('table.reviewer')}}</el-checkbox>-->
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
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


      <el-table-column label="线路">
        <template slot-scope="scope">
          {{scope.row.order_path}}
        </template>
      </el-table-column>


      <el-table-column label="站点" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_station}}
        </template>
      </el-table-column>


      <el-table-column label="班次" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_class}}
        </template>
      </el-table-column>

      <el-table-column label="预订人" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.order_owner}}
        </template>
      </el-table-column>


      <el-table-column label="手机号" width="215" align="center">
        <template slot-scope="scope">
          {{scope.row.order_mobile}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="下单日期" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" width="115" >
        <template slot-scope="scope">
          <el-tag>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchCboOrder } from '@/api/article'
import { parseTime } from '@/utils'

export default {
  name: 'exportExcel',
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: 'data',
      autoWidth: true,
      query: {
        order_date: '',
        order_path: '',
        order_station: '',
        order_class: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      fetchCboOrder(this.query).then(response => {
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
        const tHeader = ['Id', '日期', '线路', '站点', '班次', '预订人', '手机号', '下单日期', '订单状态']
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
        if (j === 'timestamp') {
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

