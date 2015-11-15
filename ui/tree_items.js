var Backend = require('./backend.js');

var state = {}

module.exports = {
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
        callback(state)
      })
    })
  }
}
