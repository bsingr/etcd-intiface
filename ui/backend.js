var axios = require("axios");

function fetchNode(key, callback) {
  axios.post("http://localhost:3000/etcd", {
    url: "http://localhost:4001",
    method: "get",
    params: [key, {recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function traverse(data, fetchNode, callback) {
  var node = {key: data.key}
  if (data.dir) {
    node.dir = true
    if (data.nodes) {
      node.nodes = []
      for (var i = 0; i < data.nodes.length; i++) {
        fetchNode(data.nodes[i].key, function(data) {
          node.nodes.push(traverse(data, fetchNode, callback))
        })
      }
    } else {
      node.nodes = []
    }
  } else {
    node.value = data.value
  }
  callback(node)
  return node
}
module.exports.fetchNode = fetchNode
module.exports.traverse = traverse
