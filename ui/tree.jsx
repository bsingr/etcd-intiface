var React = require("react");

class Node extends React.Component {
  render() {
    var list
    if (this.props.node.dir) {
      list = <List nodes={this.props.node.nodes}></List>
    }
    return <li>
      {this.props.node.key}{list}
    </li>
  }
}

class List extends React.Component {
  render() {
    return <ul>{this.props.nodes.sort(function(a,b){
      return a.key > b.key ? 1 : -1
    }).map(function(node){
      return <Node node={node} key={node.key}></Node>
    })}</ul>
  }
}

class Tree extends React.Component {
  render() {
    if (this.props.root) {
      return <List nodes={this.props.root.nodes}></List>
    } else {
      return <div></div>
    }
  }
}

module.exports = Tree
