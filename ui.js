function fetch(key, callback) {
  axios.post("http://localhost:3000/etcd", {
    url: "http://localhost:4001",
    method: "get",
    params: [key, {recursive: true}]
  }).then(function(res){
    callback(res.data.node)
  })
}
function collect(data, fetch) {
  var node = {key: data.key}
  if (data.dir) {
    node.dir = true
    node.nodes = []
    if (data.nodes) {
      for (var i = 0; i < data.nodes.length; i++) {
        fetch(data.nodes[i].key, function(data) {
          node.nodes.push(collect(data, fetch))
        })
      }
    }
  } else {
    node.value = data.value
  }
  return node
}
function draw(node) {
  var html = ["<li>", node.key]
  if (node.dir) {
    var sub = ["<ul>"]
    for (var i = 0; i < node.nodes.length; i++) {
      sub = sub.concat(draw(node.nodes[i]))
    }
    sub.push("</ul>")
    html = html.concat(sub)
  }
  html.push("</li>")
  return html

}
// axios.post("http://localhost:3000/etcd", {
//   url: "http://localhost:4001",
//   method: "set",
//   params: ["/foo/bar/baz", null, {dir: true}]
// }).then(function(res){
//   console.log(res.data)
// })
fetch("/", function(data){
  var node = {key: "/", dir: true, nodes: data.nodes}
  window.root = collect(node, fetch)
  setTimeout(function(){
    var html = draw(window.root)
    document.getElementById("tree").innerHTML = html.join("")
  }, 200)
})
