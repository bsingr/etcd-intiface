'use babel'

import koa from 'koa'
import route from 'koa-route'
import etcdjs from 'etcdjs'

let routes = {
  get: function *() {
    let that = this
    let store = etcdjs('127.0.0.1:4001')
    yield function(callback) {
      store.get('hello', function(err, result) {
        that.body = result
        callback()
      })
    }
  },
  set: function *() {
    let that = this
    let store = etcdjs('127.0.0.1:4001')
    // console.log(this.body)
    yield function(callback) {
      store.set('hello', 'world', function(err, result) {
        that.body = result
        callback()
      })
    }
  }
}

export default function () {
  let app = koa()

  app.use(route.get('/get', routes.get))
  app.use(route.get('/set', routes.set))

  return app
}
