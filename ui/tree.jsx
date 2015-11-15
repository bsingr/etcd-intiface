var React = require("react"),
    treeItems = require('./tree_items.js');

class AddNodeForm extends React.Component {
  constructor(props) {
    super(props)
    this.initialName = ""
    this.initialDir = false
    this.state = { name: this.initialName, dir: this.initialDir }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeDir = this.handleChangeDir.bind(this)
  }
  handleSubmit(ev) {
    treeItems.addNode(this.props.parent, this.state.name, {dir: this.state.dir})
    this.setState({ name: this.initialName, dir: this.initialDir })
    ev.preventDefault()
  }
  handleChangeName(event) {
    this.setState({name: event.target.value})
  }
  handleChangeDir(event) {
    this.setState({dir: event.target.checked})
  }
  render() {
    return <form onSubmit={this.handleSubmit}>
      <input value={this.state.name} onChange={this.handleChangeName} />
      <input type="checkbox" value={this.state.dir} onChange={this.handleChangeDir} />
      <button type="submit">+</button>
    </form>
  }
}

class Node extends React.Component {
  constructor() {
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleDelete() {
    treeItems.deleteNode(this.props.node)
  }
  render() {
    var list,
        addNodeForm
    if (this.props.node.dir) {
      list = <List nodes={this.props.node.nodes}></List>
      addNodeForm = <AddNodeForm parent={this.props.node}></AddNodeForm>
    }
    return <li>
      {this.props.node.key}
      <button onClick={this.handleDelete}>x</button>
      {list}
      {addNodeForm}
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
      return <div>
        <AddNodeForm></AddNodeForm>
      </div>
    }
  }
}

module.exports = Tree
