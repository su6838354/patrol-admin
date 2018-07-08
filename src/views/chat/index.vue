<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <el-container>
      <el-aside width="300px">
        <div  v-for="item in userList">
          <el-button @click="select(item)" type="text" >{{item}}</el-button>
        </div>
      </el-aside>
      <el-main >
        <el-tag v-if="current">{{ current }}</el-tag>

        <div class="chat-1">
          <div class="container-1">
            <div v-for="item in msgs" :class="['msg', item.from]"><div>{{ item.msg }}</div></div>
          </div>

          <div class='input-1'>
            <input  v-model="msg" placeholder="请输入" />
            <el-button type="primary" @click="sendMsg" round>发送</el-button>
            </div>
          </div>
      </el-main>
    </el-container>



  </div>
</template>

<script>
import { fetchCboOrder } from '@/api/article'
import { parseTime } from '@/utils'
import io from 'socket.io-client';


export default {
  name: 'exportExcel',
  data() {
    return {
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
      users: {
      },
      msg: '',
      current: ''
    }
  },
  created() {
    const manager = io.Manager('http://139.196.243.147:3333',
      {
        reconnectionAttempts: 100,
        reconnectionDelay: 4000,
        autoConnect: true
      });

    this.socket = manager.socket('/');
    this.socket.emit('admin connect');
    this.socket.on('send message from user to admin', (data) => {
      const username = data.username;
      if (!this.users[username]) {
        this.users[username] = []
      }
      this.users[username].push({ from: 'me', msg: data.msg })
      this.users = { ...this.users }
    })
  },
  updated: function () {
    window.document.querySelector('.container-1').scrollTop = window.document.querySelector('.container-1').scrollHeight
  },
  computed: {
    msgs() {
      return this.users[this.current]
    },
    userList() {
      return Object.keys(this.users);
    },
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
    select(item) {
      this.current = item;
    },
    sendMsg() {
      if (!this.current) {
        this.$message('请选择聊天对象')
      }
      const msg = this.msg;
      // if there is a non-empty message and a socket connection
      this.socket.emit('send message from admin', {
        username: this.current,
        msg: msg
      });
      this.users[this.current].push({ from: 'admin', msg: this.msg })
      this.msg = ''
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
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

.container-1 {
  padding-right: 80px;
  padding-bottom: 20px;
  /* height: 600px; */
  position: absolute;
  /*position: fixed;*/
  overflow: scroll;
  width: 700px;
  bottom: 100px;
  top: 160px;
}

.chat-1 {
  height: 100%;

}

.input-1 {
  background-color: #f5f5f5;
  /*width: 100%;*/
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
  position: fixed;
  /*position: absolute;*/
  bottom: 30px;
}

.input-1 input {
  padding: 2px;
  display: block;
  height: 50px;
  font-size: 24px;
  padding-right: 12px;
  width: 600px;
  margin: 10px;
  border-radius: 20px;
}
.chat-1 .send {
    position: absolute;
    width: 20px;
    height: 20px;
    /*background: url("./chat-send.jpg");*/
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    right: 6px;
}


.chat-1 .msg {
  /*min-height: 30px;*/
  /*line-height: 20px;*/
  font-size: 14px;
  color: #fefefe;
  margin: 5px 0;
  overflow:hidden
}
.chat-1 .msg div {
  border-radius: 15px;
  padding: 0 15px;
  /*width: 100%;*/
  line-height: 30px;
  display: inline-flex;
  /* justify-content: center; */
  align-items: center;
  word-break: break-all;

}

.chat-1 .msg.me div {
  background-color: #b0b0b0;
}

.chat-1 .msg.admin div {
  background-color: #565656;
  float: right;
}

</style>

