<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <!--<label class="radio-label" style="padding-left:0;">Filename: </label>-->
    <!--<el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>-->
    <!--<el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>-->
    <div class="filter-container">
      <el-select clearable style="width: 200px" v-model="feedStatus" :placeholder="'处理状态'">
        <el-option v-for="(item, index) in statusArray" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="search_time"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="getStatus()">{{$t('table.search')}}</el-button>
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
      <el-table-column  label="手机号" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.mobile}}
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
          <img v-if="scope.row.image_url" width= '90' height='auto' @click="openImg(scope.row.image_url)" :src="scope.row.image_url + '!/fw/400'"/>
          <span v-else>无图片</span>
          <el-dialog
            :visible.sync="bigImg"
            width="30%"
            :show-close=false
          >
            <div  style="width:100%;height:0;">
              <img id="bigImgBox" style="width:100%;height:auto;" :src="bigImgUrl"/>
            </div>
          </el-dialog>

        </template>
      </el-table-column>

      <el-table-column v-if="this.type === 'yuyue'" label="预约民警"  align="center">
        <template slot-scope="scope" v-if="scope.row.police">
          <el-popover
            width="210"
            title="预计民警简介"
            trigger="hover">
            <div>
              <div>ID：{{scope.row.police.id}}</div>
              <div>姓名：{{scope.row.police.name}}</div>
              <div><img width="200" height="200" :src="scope.row.police.avatar"/></div>
            </div>
            <el-button slot="reference"><a>{{scope.row.police && scope.row.police.name}}</a></el-button>
          </el-popover>

        </template>
      </el-table-column>

      <el-table-column  label="时间"   align="center">
        <template slot-scope="scope">
          {{scope.row.create_time}}
        </template>
      </el-table-column>

      <el-table-column label="状态"  align="center">
        <template slot-scope="scope">

          <el-tag v-if="scope.row.status === '' || scope.row.status === 'new'" type="danger">{{statusShow(scope.row.status)}}</el-tag>
          <el-tag v-if="scope.row.status === 'accept'" type="success">{{statusShow(scope.row.status)}}</el-tag>
          <el-tag v-if="scope.row.status === 'refuse'" type="error">{{statusShow(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作"  align="center">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status === 'new' || scope.row.status === '' " @click="updateFeed(scope.row, 'accept')">接单</el-button>
          <el-button type="warning" v-if="scope.row.status === 'new' || scope.row.status === ''" @click="updateFeed(scope.row, 'refuse')">拒绝</el-button>
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
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import { fetchFeedBack, updateFeedBack } from '../../api/article'
  import { parseTime } from '@/utils'
  import moment from 'moment';

  export default {
    name: 'exportExcel',
    data() {
      return {
        search_time: [moment().subtract(1, 'years'), moment()],
        bigImg: false,
        bigImgUrl: '',
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
        statusArray: ['待处理', '已接单', '已拒绝'],
        feedStatus: '',
        total: 0
      }
    },
    created() {
      this.type = this.$route.name
      this.fetchData()
    },
    methods: {
      openImg(data) {
        this.bigImg = true
        this.bigImgUrl = data
      },
      getStatus() {
        this.fetchData()
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
        return '待处理'
      },
      statusShow1(status) {
        if (status === '待处理') {
          return 'new'
        }
        if (status === '已接单') {
          return 'accept'
        }
        if (status === '已拒绝') {
          return 'refuse'
        }
        return ''
      },
      fetchData() {
        this.listLoading = true
        const data = {
          start_time: moment(this.search_time[0]).valueOf()/1000,
          end_time: moment(this.search_time[1]).valueOf()/1000,
          type: this.type,
          limit: this.pageSize,
          offset: (this.currentPage - 1) * 10
        }
        if (this.feedStatus) {
          data['status'] = this.statusShow1(this.feedStatus)
        }
        fetchFeedBack(data).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data.map(item => {
              return {
                ...item,
                create_time: moment(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
              }
            })
            this.allPeople = response.data.data
            this.listLoading = false
            this.total = response.data.total
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
    .el-dialog__body, .el-dialog__header {
      padding:0;
      margin:0;
    }
  }

</style>

