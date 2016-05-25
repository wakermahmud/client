// @flow
import React, {Component} from 'react'
import Box from './box'
import {globalStyles} from '../styles/style-guide'
import type {Props} from './list-item'

// TODO Add swipe for action
export default class ListItem extends Component<void, Props, void> {
  render () {
    const clickable = this.props.clickable === undefined ? true : !!this.props.clickable
    return (
      <Box style={{...globalStyles.flexBoxRow, ...containerStyle(clickable), ...this.props.containerStyle}}>
        <Box style={{height: ({'Large': 64, 'Small': 48})[this.props.type], width: 0}} />
        <Box style={{...globalStyles.flexBoxColumn, ...iconContainerThemed[this.props.type], alignItems: 'center', justifyContent: 'center'}}>
          {this.props.icon}
        </Box>
        <Box style={{...globalStyles.flexBoxColumn, ...bodyContainerStyle(this.props.swipeToAction)}}>
          {this.props.body}
        </Box>
        {!this.props.swipeToAction && (<Box style={{...globalStyles.flexBoxColumn, ...actionStyle(!!this.props.extraRightMarginAction), justifyContent: 'center'}}>
          {this.props.action}
        </Box>)}
      </Box>
    )
  }
}

function containerStyle (clickable) {
  return {
    ...(clickable ? globalStyles.clickable : {})
  }
}

const iconContainerThemed = {
  'Small': {
    width: 48
  },
  'Large': {
    width: 64
  }
}

function actionStyle (extraMargin) {
  return extraMargin ? {marginRight: 32} : {marginRight: 16}
}

function bodyContainerStyle (swipeToAction) {
  return {
    flex: 2,
    marginLeft: 8,
    marginBottom: 8,
    marginTop: 8,
    marginRight: swipeToAction ? 0 : 16,
    justifyContent: 'center'
  }
}