var Backend = require('./backend.js');

var state = {},
    listeners = []

module.exports = {
  listen: function(callback) {
    listeners.push(callback)
  },
  state: function() {
    return state
  },
  load: function(callback) {
    var that = this;
    delete state.root
    Backend.fetchNode("/", function(data){
      state.root = Backend.traverse({
        key: "/",
        dir: true,
        nodes: data.nodes
      }, Backend.fetchNode, function(node){
        listeners.forEach(function(c){ c(state) })
      })
    })
  },
  deleteNode: function(node) {
    var that = this;
    Backend.deleteNode(node, function(node){
      that.load()
    })
  }
}
