<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">Filename: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} excel</el-button>
    <div class="filter-container">
      <!--<el-select clearable style="width: 200px" class="filter-item" v-model="query.order_path" :placeholder="'线路'">-->
        <!--<el-option v-for="item in getPath" :key="item" :label="item" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <el-input
        placeholder="请输入姓名"
        v-model="params.name"
        class="search-input"
        clearable>
      </el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getName()">{{$t('table.search')}}</el-button>
      <el-button class="filter-item add-button" type="primary" @click="updateRole('add',{})">添加</el-button>
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
      <el-table-column label="性别" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.sex === 1 ? '男' : '女'}}
        </template>
      </el-table-column>

      <el-table-column label="年龄" width="115" align="center">
        <template slot-scope="scope">
          {{scope.row.age}}
        </template>
      </el-table-column>

      <el-table-column  label="管辖区域"  v-if="this.role !== 'guard'" align="center">
        <template slot-scope="scope">
          {{scope.row.area}}
        </template>
      </el-table-column>

      <el-table-column label="擅长" v-if="this.role !== 'guard'" align="center">
        <template slot-scope="scope">
          {{scope.row.good}}
        </template>
      </el-table-column>


      <el-table-column  v-if ="this.role === 'mediation'" label="案件处理" align="center">
        <template slot-scope="scope">
          {{scope.row.case}}
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 'offline'" type="info">下线</el-tag>
          <el-tag v-if="scope.row.status === 'online'" type="success">上线</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="处理" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="updateRole('update',scope.row)">修改</el-button>
        </template>
      </el-table-column>

      <el-table-column label="上下线切换" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 'offline'" type="success" @click="updateRole('online',scope.row)">上线</el-button>
          <el-button v-if="scope.row.status === 'online'" type="info" @click="updateRole('offline',scope.row)">下线</el-button>
        </template>
      </el-table-column>

      <el-table-column label="删除" align="center">
        <template slot-scope="scope">
          <el-button type="error" @click="updateRole('delete',scope.row)">删除</el-button>
        </template>
      </el-table-column>


  <div v-if="this.role === 'guard'">
    <el-table-column label="守护部位" align="center">
      <template slot-scope="scope">
        {{scope.row.watch}}
      </template>
    </el-table-column>
      <el-table-column  label="管辖时间" width="315" align="center">
        <template slot-scope="scope">
          {{scope.row.period}}
        </template>
      </el-table-column>

      <el-table-column label="路线规划" align="center">
        <template slot-scope="scope">
          {{scope.row.path}}
        </template>
      </el-table-column>

  </div>
      <div v-if="this.role === 'police'" >
      <el-table-column label="线上接单数" align="center">
        <template slot-scope="scope">
          {{scope.row.info_count}}
        </template>
      </el-table-column>
      <el-table-column label="警官简介" align="center">
        <template slot-scope="scope">
          {{scope.row.detail}}
        </template>
      </el-table-column>

      </div>



    </el-table>

    <el-dialog title="添加人员" :visible.sync="dialogFormVisible">
      <el-form class="form_body" :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-radio-group v-model="form.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="form.age" auto-complete="off" type="number" :min="10" :max="120"></el-input>
        </el-form-item>
        <el-form-item label="管辖区域" v-if="this.role !== 'guard'" :label-width="formLabelWidth">
          <el-input v-model="form.area" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item  v-if="this.role === 'guard'" label="守护部位" :label-width="formLabelWidth">
          <el-input v-model="form.watch" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item v-if="this.role === 'guard'" label="管辖时间" :label-width="formLabelWidth">
          <el-input v-model="form.period" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item  v-if="this.role === 'guard'" label="路线规划" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="擅长" v-if="this.role !== 'guard'" :label-width="formLabelWidth">
          <el-input type="textarea"  v-model="form.good" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="案件处理" v-if ="this.role === 'mediation'" :label-width="formLabelWidth" >
          <el-input type="textarea" v-model="form.caseDetail"></el-input>
        </el-form-item>
        <el-form-item label="警官简介" v-if ="this.role === 'police'" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.detail" ></el-input>
        </el-form-item>

        <el-form-item label="头像" :label-width="formLabelWidth">
          <div>
            <input type="file" id="add-file" @change="fileClick" />
            <img v-if="imageUrl" width="200" height="200" v-bind:key="imageUrl" :src="imageUrl"/>
            <span>上传文件（需小于10M）</span>
          </div>
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
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import { fetchHelper, fetchAddPeople, fetchUpdatePeople } from '../../api/article'
  import { parseTime } from '@/utils'
  import upyun from 'upyun'

  function upload(file, cb) {
    const path = '/sample-upload-' + file.name
    // client side only need bucket name
    const bucket = new upyun.Bucket('sy-image-upyun')
    function getHeaderSign(bucket, method) {
      const params = 'bucket=' + bucket.bucketName + '&method=' + method + '&path=' + path
      return fetch('http://security.weichongming.com/patrol/image/sign/head?' + params)
        .then(function(response) {
          if (response.status !== 200) {
            console.error('gen header sign faild!')
            return
          }
          return response.json()
        })
    }
    const client = new upyun.Client(bucket, getHeaderSign)
    client.putFile(path, file).then(function(result) {
      const res = `http://ypy.weichongming.com${path}`
      cb({ code: result ? 0 : -1, data: res })
    })
  }

  export default {
    name: 'exportExcel',
    data() {
      return {
        imageUrl: '',
        id: '',
        role: '',
        currentPage: 1,
        pageSize: 10,
        list: [],
        listLoading: true,
        downloadLoading: false,
        filename: 'data',
        autoWidth: true,
        searchName: '',
        allPeople: [],
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
        dialogFormVisible: false,
        params: {
          name: ''
        },
        total: 0
      }
    },
    created() {
      this.role = this.$route.name
      this.fetchData()
    },
    methods: {
      getName() {
        this.fetchData()
      },
      fileClick(e) {
        const file = e.target.files[0]
        this.$message.info('图片上传中...')
        upload(file, ({ code, data }) => {
          if (code === 0) {
            this.imageUrl = data
            this.$message.success('图片上传成功')
          } else {
            this.$message.error('图片上传失败')
          }
        })
      },
      updateRole(param, row) {
        if (param === 'offline' || param === 'online' || param === 'delete') {
          const data = {}
          if (param === 'delete') {
            data.status = row.status
            data.isDelete = 1
          } else {
            data.status = param
          }
          data.name = row.name
          data.sex = row.sex.toString()
          data.age = row.age
          data.watch = row.watch
          data.area = row.area
          data.period = row.period
          data.good = row.good
          data.avatar = row.avatar
          data.caseDetail = row.caseDetail
          data.path = row.path
          data.detail = row.detail
          data.id = row.id

          fetchUpdatePeople(data).then(response => {
            if (response.data.code === 0) {
              this.listLoading = false
              this.dialogFormVisible = false
              this.$message.success('操作成功!')
              this.fetchData()
            } else {
              this.$message.error('操作失败!')
            }
          })
          return
        }

        if (param === 'update') {
          this.form.status = row.status
          this.form.name = row.name
          this.form.sex = row.sex.toString()
          this.form.age = row.age
          this.form.watch = row.watch
          this.form.area = row.area
          this.form.period = row.period
          this.form.good = row.good
          this.form.avatar = row.avatar
          this.imageUrl = row.avatar
          this.form.caseDetail = row.caseDetail
          this.form.path = row.path
          this.form.detail = row.detail
          this.id = row.id
        }
        if (param === 'add') {
          this.form.status = 'online'
          this.form.name = ''
          this.form.sex = ''
          this.form.age = ''
          this.form.watch = ''
          this.form.area = ''
          this.form.period = ''
          this.form.good = ''
          this.form.avatar = ''
          this.imageUrl = ''
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
          avatar: this.imageUrl,
          case: this.form.caseDetail,
          path: this.form.path,
          detail: this.form.detail,
          status: this.form.status
        }
        fetchUpdatePeople(data).then(response => {
          if (response.data.code === 0) {
            this.listLoading = false
            this.dialogFormVisible = false
            this.$message.success('更新成功!')
            this.fetchData()
          } else {
            this.$message.error('更新失败!')
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
        this.fetchData()
      },
      fetchData() {
        this.listLoading = true
        const data = {
          type: this.role,
          limit: this.pageSize,
          offset: (this.currentPage - 1) * 10,
          isDelete: 0
        }
        for (const item in this.params) {
          if (this.params[item]) {
            data[item] = this.params[item]
          }
        }
        fetchHelper(data).then(response => {
          if (response.data.code === 0) {
            this.list = response.data.data
            this.allPeople = response.data.data
            this.listLoading = false
            this.total = response.data.total
          }
        })
      },
      addRole() {
        const data = {
          id: '',
          type: this.role,
          name: this.form.name,
          sex: parseInt(this.form.sex),
          age: this.form.age,
          watch: this.form.watch,
          area: this.form.area,
          period: this.form.period,
          good: this.form.good,
          avatar: this.imageUrl,
          case: this.form.caseDetail,
          path: this.form.path,
          detail: this.form.detail,
          status: this.form.status
        }
        fetchAddPeople(data).then(({ data: response }) => {
          if (response.code === 0) {
            data.id = response.data.insertId - 1
            this.list.unshift(data)
            this.listLoading = false
            this.dialogFormVisible = false
            this.$message.success('添加成功!')
          } else {
            this.$message.error('添加失败!')
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
        if (this.role === 'mediation') {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['Id', '姓名', '性别', '年龄', '管辖区域', '擅长', '案件处理']
            const filterVal = ['id', 'name', 'sex', 'age', 'area', 'good', 'case']
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
            const tHeader = ['Id', '姓名', '警官简介', '线上接单数']
            const filterVal = ['id', 'name', 'detail', 'info_count']
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

