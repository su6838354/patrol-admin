<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>
    <div class="filter-container">
      <el-select clearable style="width: 200px" class="filter-item" v-model="feedStatus" :placeholder="'处理状态'">
        <el-option v-for="(item, index) in statusArray" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getStatus()">{{$t('table.search')}}</el-button>
    </div>

    <el-table :data="this.list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
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
      <el-table-column v-if="this.type!== 'people'" label="性别" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.sex === 1 ? '男' : '女'}}
        </template>
      </el-table-column>

      <el-table-column  label="内容"   align="center">
        <template slot-scope="scope">
          {{scope.row.content}}
        </template>
      </el-table-column>

      <el-table-column label="图片"  align="center">
        <template slot-scope="scope">
          <img width= '90' height='60' :src="scope.row.image_url"/>
        </template>
      </el-table-column>
      <el-table-column label="状态"  align="center">
        <template slot-scope="scope">
          {{statusShow(scope.row.status)}}
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status === 'new' || scope.row.status === '' " @click="updateFeed(scope.row, 'accept')">接单</el-button>
          <el-button type="warning" v-if="scope.row.status !== 'refuse'" @click="updateFeed(scope.row, 'refuse')">拒绝</el-button>
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
  import { fetchFeedBack, updateFeedBack } from '../../api/article'
  import { parseTime } from '@/utils'

  export default {
    name: 'exportExcel',
    data() {
      return {
        id: '',
        type: '',
        currentPage: 1,
        pageSize: 10,
        list: [],
        listLoading: true,
        downloadLoading: false,
        filename: 'data',
        autoWidth: true,
        searchName: '',
        allPeople: [],
        statusArray: ['未处理', '已接单', '已拒绝'],
        feedStatus: ''
      }
    },
    created() {
      this.type = this.$route.name
      this.fetchData()
    },
    methods: {
      getStatus() {
        this.list = this.allPeople
        var searchList = []
        this.list.forEach((e) => {
          var statusText = this.statusShow(e.status)
          if (statusText === this.feedStatus) {
            searchList.push(e)
          }
        })
        this.list = searchList
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.fetchData()
      },
      statusShow(status) {
        if (status === 'new') {
          return '待处理'
        }
        if (status === 'accept') {
          return '已接单'
        }
        if (status === 'refuse') {
          return '已拒绝'
        }
        return ''
      },
      fetchData() {
        this.listLoading = true
        const data = {
          type: this.type,
          limit: this.pageSize,
          offset: (this.currentPage - 1) * 10
        }
        fetchFeedBack(data).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data
            this.allPeople = response.data.data
            this.listLoading = false
          }
        })
      },
      updateFeed(row, handle) {
        const data = {
          id: row.id,
          type: this.type,
          name: row.name,
          sex: row.sex || '',
          mobile: row.mobile,
          content: row.content,
          status: handle,
          police_id: row.police_id,
          image_url: row.image_url
        }
        updateFeedBack(data).then(({ data: response }) => {
          if (response.code === 0) {
            data.id = response.data.insertId - 1
            this.list.unshift(data)
            this.listLoading = false
            this.$message.success('处理成功!')
            this.fetchData()
          } else {
            this.$message.error('处理失败!')
          }
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
            const tHeader = ['Id', '姓名', '性别', '年龄', '管辖区域', '擅长']
            const filterVal = ['id', 'name', 'sex', 'age', 'area', 'good']
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
    .search-input {
      width:260px;
      float:left;
      margin-right:20px;
    }
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
    }
  }

</style>

