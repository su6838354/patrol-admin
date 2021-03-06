import request from '@/utils/request'

// export function fetchList(query) {
//   return request({
//     url: '/article/list',
//     method: 'get',
//     params: query
//   })
// }
//
// export function fetchArticle(id) {
//   return request({
//     url: '/article/detail',
//     method: 'get',
//     params: { id }
//   })
// }
//
// export function fetchPv(pv) {
//   return request({
//     url: '/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }
//
// export function createArticle(data) {
//   return request({
//     url: '/article/create',
//     method: 'post',
//     data
//   })
// }
//
// export function updateArticle(data) {
//   return request({
//     url: '/article/update',
//     method: 'post',
//     data
//   })
// }
//
export function fetchCboOrder(query) {
  return request({
    url: 'http://139.196.243.147:3002/cbo/list_search',
    // url: 'http://127.0.0.1:3002/cbo/list_search',
    method: 'post',
    data: query
  })
}

let url = 'http://127.0.0.1:7001'
url = 'http://security.weichongming.com'

export function fetchHelper(data) {
  return request({
    url: url + '/patrol/staff/list',
    method: 'post',
    data: data
  })
}
export function fetchAddPeople(data) {
  return request({
    url: 'http://security.weichongming.com/patrol/staff/add',
    method: 'post',
    data: data
  })
}
export function fetchUpdatePeople(data) {
  return request({
    url: 'http://security.weichongming.com/patrol/staff/update',
    method: 'post',
    data: data
  })
}
export function fetchFeedBack(data) {
  return request({
    url: 'http://security.weichongming.com/patrol/info/list',
    method: 'post',
    data: data
  })
}
export function updateFeedBack(data) {
  return request({
    url: 'http://security.weichongming.com/patrol/info/update',
    method: 'post',
    data: data
  })
}

export function getPoints(data) {
  return request({
    // url: 'http://127.0.0.1:7001/patrol/get_points',
    url: 'http://security.weichongming.com/patrol/get_points',
    method: 'post',
    data: data
  })
}

export function getRealPoints(data) {
  return request({
    url: 'http://127.0.0.1:7001/patrol/get_real_points',
    // url: 'http://security.weichongming.com/patrol/get_points',
    method: 'post',
    data: data
  })
}
