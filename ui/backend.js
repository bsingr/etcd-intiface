var axios = require("axios");

function addNode(parent, name, opts, callback) {
  var key = name;
  if (!opts) {
    opts = {}
  }
  if (parent) {
    key = parent.key + '/' + name;
  }
  axios.post("http://localhost:3000/etcd", {
    url: "http://localhost:4001",
    method: "set",
    params: [key, opts.val, {dir: opts.dir === true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function fetchNode(key, callback) {
  axios.post("http://localhost:3000/etcd", {
    url: "http://localhost:4001",
    method: "get",
    params: [key, {recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function deleteNode(node, callback) {
  axios.post("http://localhost:3000/etcd", {
    url: "http://localhost:4001",
    method: "del",
    params: [node.key, {dir: node.dir === true, recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function traverse(data, fetchNode, callback) {
  var node = {key: data.key}
  if (data.dir) {
    node.dir = true
    node.nodes = []
    if (data.nodes) {
      for (var i = 0; i < data.nodes.length; i++) {
        fetchNode(data.nodes[i].key, function(data) {
          node.nodes.push(traverse(data, fetchNode, callback))
          callback(node)
        })
      }
    }
  } else {
    node.value = data.value
  }
  callback(node)
  return node
}
module.exports.addNode = addNode
module.exports.fetchNode = fetchNode
module.exports.traverse = traverse
module.exports.deleteNode = deleteNode
