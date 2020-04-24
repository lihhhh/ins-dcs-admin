import request from '@/utils/request'

export function getInsWatchList(query) {
  return request({
    url: 'http://47.57.124.172:8038/ins/watch/list',
    method: 'get',
    params: query
  })
}

export function getInsWatchStatus(query) {
  return request({
    url: 'http://47.57.124.172:8038/ins/watch/status',
    method: 'get',
    params: query
  })
}