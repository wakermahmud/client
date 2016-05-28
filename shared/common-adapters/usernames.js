// @flow
import React, {Component} from 'react'
import {Box, Text} from './'
import {globalStyles, globalColors} from '../styles/style-guide'

import type {Props} from './usernames'

export default class Usernames extends Component<void, Props, void> {
  render () {
    const {type, users, style, inline} = this.props
    const containerStyle = inline ? {display: 'inline'} : {...globalStyles.flexBoxRow, flexWrap: 'wrap'}

    return (
      <Box style={containerStyle}>
        {users.map((u, i) => {
          const userStyle = {...style}

          if (u.broken) {
            userStyle.color = globalColors.red
          }

          if (inline) {
            userStyle.display = 'inline-block'
          }

          if (u.you) {
            Object.assign(userStyle, globalStyles.italic)
          }

          return (
            <Text
              key={u.username}
              type={type}
              style={userStyle}>{u.username}
              {
                (i !== users.length - 1) && // Injecting the commas here so we never wrap and have newlines starting with a ,
                  <Text type={type} style={{...style, marginRight: 1}}>,</Text>}
            </Text>
          )
        })}
      </Box>
    )
  }
}