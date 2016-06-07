import React, { PropTypes } from 'react'
import update from 'react-addons-update'
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'
import classnames from 'classnames'
import Icon from '../Icon'

const TreeNode = React.createClass({

  getInitialState() {
    return this.props.data
  },

  componentWillReceiveProps(nextProps) {
    'data' in nextProps && this.setState(nextProps.data)
  },

  shouldComponentUpdate,

  handleToggle() {
    this.set('open', !this.state.open)
    this.props.onChange()
  },

  set(key, value) {
    this.setState({[key]: value})
    this.updateParentValue(key, value)
  },

  updateParentValue(key, value) {
    const { parentData, index } = this.props
    parentData[index] = update(parentData[index], {
      [key]: {$set: value}
    })
  },

  render() {
    const { data, beforeNodeRender, onChange } = this.props
    const isOpen = this.state.open

    const hasChildren = data.children && data.children.length
    let icon
    let Children
    if (hasChildren) {
      icon = 'folder' + (isOpen ? '-open' : '')
      Children = (
        <ul>
        {data.children.map((item, i) => {
          return <TreeNode key={i} parent={this} parentData={data.children} index={i} data={item} onChange={onChange} beforeNodeRender={beforeNodeRender} />
        })}
        </ul>
      )
    } else {
      icon = 'file'
    }

    return (
      <li className={classnames({open: isOpen})}>
        <Icon style={{visibility: hasChildren ? 'visible' : 'hidden'}} type={isOpen ? 'minus-square' : 'plus-square'} onClick={this.handleToggle} className="toggle"/>
        {beforeNodeRender ? beforeNodeRender(this) : null}
        <Icon type={icon} className="toggle-icon" />
        <div className="node-content">{data.name}</div>
        {Children}
      </li>
    )
  }
})

TreeNode.propTypes = {
  onChange: PropTypes.func.isRequired,
  parent: PropTypes.instanceOf(TreeNode),
  parentData: PropTypes.array,
  index: PropTypes.number,
  data: PropTypes.object,
  beforeNode: PropTypes.func
}

export default TreeNode