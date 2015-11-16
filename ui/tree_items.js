var Backend = require('./backend.js');

var state = {
    config: {}
  },
  listeners = []

module.exports = {
  listen: function(callback) {
    listeners.push(callback)
  },
  triggerListeners: function() {
    listeners.forEach(function(c){ c(state) })
  },
  state: function() {
    return state
  },
  load: function() {
    var that = this;
    delete state.root
    Backend.fetchNode(state.config, "/", function(data){
      state.root = Backend.traverse(state.config, {
        key: "/",
        dir: true,
        nodes: data.nodes
      }, function(node){
        that.triggerListeners()
      })
    })
  },
  deleteNode: function(node) {
    var that = this;
    Backend.deleteNode(state.config, node, function(node){
      that.load()
    })
  },
  addNode: function(parent, name, opts) {
    var that = this;
    Backend.addNode(state.config, parent, name, opts, function(node){
      that.load()
    })
  },
  setConfig: function(config) {
    state.config = config
    this.triggerListeners()
    this.load()
  }
}
