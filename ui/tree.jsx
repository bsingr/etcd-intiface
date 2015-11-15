var React = require("react"),
    treeItems = require('./tree_items.js');

class Node extends React.Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(ev) {
    treeItems.deleteNode(this.props.node)
  }
  render() {
    var list
    if (this.props.node.dir) {
      list = <List nodes={this.props.node.nodes}></List>
    }
    return <li>
      {this.props.node.key}
      <button onClick={this.handleClick}>x</button>
      {list}
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
