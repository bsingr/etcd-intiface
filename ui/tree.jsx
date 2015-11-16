var React = require("react"),
    treeItems = require('./tree_items.js'),
    MaterialTextField = require('material-ui/lib/text-field'),
    MaterialDialog = require('material-ui/lib/dialog'),
    MaterialIconButton = require('material-ui/lib/icon-button'),
    MaterialFlatButton = require('material-ui/lib/flat-button'),
    MaterialRaisedButton = require('material-ui/lib/raised-button'),
    MaterialList = require('material-ui/lib/lists/list'),
    MaterialListItem = require('material-ui/lib/lists/list-item'),
    MaterialListDivider = require('material-ui/lib/lists/list-divider'),
    MaterialAddIcon = require('material-ui/lib/svg-icons/content/add'),
    MaterialRemoveIcon = require('material-ui/lib/svg-icons/content/remove');

class AddValueNodeDialog extends React.Component {
  constructor(props) {
    super(props)
    this.initialName = ""
    this.initialVal = ""
    this.state = { name: this.initialName, val: this.initialVal }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeVal = this.handleChangeVal.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleSubmit(ev) {
    treeItems.addNode(this.props.parent, this.state.name, {val: this.state.val})
    this.setState({ name: this.initialName, val: this.initialVal })
    this.props.handleClose()
    ev.preventDefault()
  }
  handleChangeName(event) {
    this.setState({name: event.target.value})
  }
  handleChangeVal(event) {
    this.setState({val: event.target.value})
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
      title="Add Value"
      actions={standardActions}
      actionFocus="submit"
      open={this.props.open}
      onRequestClose={this.handleClose}>
      <MaterialTextField
        value={this.state.name}
        onChange={this.handleChangeName}
        hintText="Name" />
      <MaterialTextField
        value={this.state.val}
        onChange={this.handleChangeVal}
        hintText="Value" />
    </MaterialDialog>
  }
}

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
      props.initiallyOpen = true
    }
    if (node.value) {
      props.secondaryText = node.value
      props.secondaryTextLines = 2
    }
    return <MaterialListItem {...props}></MaterialListItem>
  })
}

class List extends React.Component {
  render() {
    return <MaterialList>{renderList(this.props)}</MaterialList>
  }
}

class Configuration extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: props.url }
    this.handleChangeUrl = this.handleChangeUrl.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChangeUrl(event) {
    this.setState({url: event.target.value})
  }
  handleSubmit() {
    treeItems.setConfig({url: this.state.url})
  }
  render() {
    return <div>
      <MaterialTextField
        value={this.state.url}
        onChange={this.handleChangeUrl}
        hintText="URL" />
      <MaterialRaisedButton onClick={this.handleSubmit} label="Change" primary={true}></MaterialRaisedButton>
    </div>
  }
}

class Tree extends React.Component {
  constructor(props) {
    super(props)
    this.state = { openAddDirNodeDialog: false, openAddValueNodeDialog: false }
    this.handleCloseAddDirNode = this.handleCloseAddDirNode.bind(this)
    this.handleAddDirNode = this.handleAddDirNode.bind(this)
    this.handleCloseAddValueNode = this.handleCloseAddValueNode.bind(this)
    this.handleAddValueNode = this.handleAddValueNode.bind(this)
  }
  handleAddDirNode() {
    this.setState({ openAddDirNodeDialog: true })
  }
  handleCloseAddDirNode() {
    this.setState({ openAddDirNodeDialog: false })
  }
  handleAddValueNode() {
    this.setState({ openAddValueNodeDialog: true })
  }
  handleCloseAddValueNode() {
    this.setState({ openAddValueNodeDialog: false })
  }
  render() {
    var list
    if (this.props.root) {
      list = <MaterialList>{renderList(this.props.root)}</MaterialList>
    }
    return <div>
      <MaterialList>
        <MaterialListItem><Configuration {...this.props.config}/></MaterialListItem>
      </MaterialList>
      {list}
      <MaterialList>
        <MaterialListItem>
          <MaterialRaisedButton onClick={this.handleAddDirNode} label="Add Directory" primary={true}></MaterialRaisedButton>
          <MaterialRaisedButton onClick={this.handleAddValueNode} label="Add Value"></MaterialRaisedButton>
        </MaterialListItem>
      </MaterialList>
      <AddDirNodeDialog open={this.state.openAddDirNodeDialog} handleClose={this.handleCloseAddDirNode}></AddDirNodeDialog>
      <AddValueNodeDialog open={this.state.openAddValueNodeDialog} handleClose={this.handleCloseAddValueNode}></AddValueNodeDialog>
    </div>
  }
}

module.exports = Tree
