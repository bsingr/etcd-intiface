'use babel'

import koa from 'koa'
import koaRouterLib from 'koa-router'
import koaBodyLib from 'koa-body'
import etcdjs from 'etcdjs'

let koaRouter = koaRouterLib()
let koaBody = koaBodyLib()

koaRouter.post('/etcd', koaBody, function *(next) {
  let that = this
  let etcdCall = that.request.body
  let store = etcdjs(etcdCall.url)
  yield function(callback) {
    let method = store[etcdCall.method]
    if (!method) {
      that.status = 404
      that.body = {}
      callback()
      return
    }
    let params = etcdCall.params || []
    params.push(function(err, result) {
      if (err) {
        that.status = 500
        that.body = err
      } else {
        that.body = result
      }
      callback()
    })
    method.apply(store, params)
  }
})

export default function () {
  let app = koa()
  app.use(koaRouter.routes())
  return app
}
