var axios = require("axios");

var proxyUrl = "http://localhost:3000/etcd"

function addNode(config, parent, name, opts, callback) {
  var key = name;
  if (!opts) {
    opts = {}
  }
  if (parent) {
    key = parent.key + '/' + name;
  }
  axios.post(proxyUrl, {
    url: config.url,
    method: "set",
    params: [key, opts.val, {dir: opts.dir === true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function fetchNode(config, key, callback) {
  console.log(config.url)
  axios.post(proxyUrl, {
    url: config.url,
    method: "get",
    params: [key, {recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function deleteNode(config, node, callback) {
  axios.post(proxyUrl, {
    url: config.url,
    method: "del",
    params: [node.key, {dir: node.dir === true, recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}

function traverse(config, data, callback) {
  var node = {key: data.key}
  if (data.dir) {
    node.dir = true
    node.nodes = []
    if (data.nodes) {
      for (var i = 0; i < data.nodes.length; i++) {
        fetchNode(config, data.nodes[i].key, function(data) {
          node.nodes.push(traverse(config, data, callback))
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
