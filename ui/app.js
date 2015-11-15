var React = require('react'),
    ReactDOM = require('react-dom'),
      Bacon     = require('baconjs'),
      Tree      = require('./tree.jsx'),
      treeItems = require('./tree_items.js');

treeItems.load(function(state){
  ReactDOM.render(<Tree {...state} />,
                  document.getElementById('ui'));
});
