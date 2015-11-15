var React = require("react"),
    treeItems = require('./tree_items.js'),
    MaterialTextField = require('material-ui/lib/text-field'),
    MaterialDialog = require('material-ui/lib/dialog'),
    MaterialIconButton = require('material-ui/lib/icon-button'),
    MaterialFlatButton = require('material-ui/lib/flat-button'),
    MaterialList = require('material-ui/lib/lists/list'),
    MaterialListItem = require('material-ui/lib/lists/list-item'),
    MaterialAddIcon = require('material-ui/lib/svg-icons/content/add'),
    MaterialRemoveIcon = require('material-ui/lib/svg-icons/content/remove');

class AddDirNodeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.initialName = ""
    this.state = { name: this.initialName }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleSubmit(ev) {
    treeItems.addNode(this.props.parent, this.state.name, {dir: true})
    this.setState({ name: this.initialName, dir: true })
    this.props.handleClose()
    ev.preventDefault()
  }
  handleChangeName(event) {
    this.setState({name: event.target.value})
  }
  handleClose() {
    this.props.handleClose()
  }
  render() {
    var standardActions = [
      <MaterialFlatButton
        label="Cancel"
        key="cancel"
        secondary={true}
        onClick={this.handleClose} />,
      <MaterialFlatButton
        key="add"
        label="Add"
        primary={true}
        ref="submit"
        onClick={this.handleSubmit} />
    ]
    return <MaterialDialog
      title="Add Directory"
      actions={standardActions}
      actionFocus="submit"
      open={this.props.open}
      onRequestClose={this.handleClose}>
      <MaterialTextField
        value={this.state.name}
        onChange={this.handleChangeName}
        hintText="Name" />
    </MaterialDialog>
  }
}

function renderList(parentNode) {
  return parentNode.nodes.sort(function(a,b){
    return a.key > b.key ? 1 : -1
  }).map(function(node){
    var handleDelete = function(){
      treeItems.deleteNode(node)
    }
    var props = {
      primaryText: node.key,
      key: node.key,
      rightIconButton: <MaterialIconButton onClick={handleDelete}>
        <MaterialRemoveIcon />
      </MaterialIconButton>
    }
    if (node.dir) {
      props.nestedItems = renderList(node)
    }
    return <MaterialListItem {...props}></MaterialListItem>
  })
}

class List extends React.Component {
  render() {
    return <MaterialList>{renderList(this.props)}</MaterialList>
  }
}

class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openAddDirNodeDialog: false }
    this.handleCloseAddDirNode = this.handleCloseAddDirNode.bind(this)
    this.handleAddDirNode = this.handleAddDirNode.bind(this)
  }
  handleAddDirNode() {
    this.setState({ openAddDirNodeDialog: true })
  }
  handleCloseAddDirNode() {
    this.setState({ openAddDirNodeDialog: false })
  }
  render() {
    var list
    if (this.props.root) {
      list = <MaterialList>{renderList(this.props.root)}</MaterialList>
    }
    return <div>
      {list}
      <MaterialIconButton onClick={this.handleAddDirNode}>
        <MaterialAddIcon />
      </MaterialIconButton>
      <AddDirNodeDialog open={this.state.openAddDirNodeDialog} handleClose={this.handleCloseAddDirNode}></AddDirNodeDialog>
    </div>
  }
}

module.exports = Tree
