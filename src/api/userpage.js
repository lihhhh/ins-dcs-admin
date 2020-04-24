import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/admin/userpage/recommend',
    method: 'get',
    params
  })
}
export function delImage(data) {
  return request({
    url: '/admin/client/del_image',
    method: 'post',
    data
  })
}