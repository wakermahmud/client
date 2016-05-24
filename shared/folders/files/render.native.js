// @flow
import React, {Component} from 'react'
import {Box, Text, BackButton, Avatar, Icon} from '../../common-adapters'
import File from './file/render'
import {globalStyles, globalColors} from '../../styles/style-guide'
import {intersperseFn} from '../../util/arrays'
import type {Props, FileSection} from './render'

export default class Render extends Component<void, Props, void> {
  _renderSection (section: FileSection) {
    return (
      <Box key={section.name} style={{...globalStyles.flexBoxColumn, backgroundColor: backgroundColorThemed[this.props.theme]}}>
        <Box style={{...globalStyles.flexBoxRow, alignItems: 'center', height: 32}}>
          <Box key={section.name} style={{...globalStyles.flexBoxRow, marginLeft: 8}}>
            {section.modifiedMarker && <Icon type='thunderbolt' style={{height: 12, alignSelf: 'center', marginRight: 6, ...styleSectionTextThemed[this.props.theme]}} />}
            <Text type='BodySmallSemibold' style={{...styleSectionTextThemed[this.props.theme]}}>{section.name}</Text>
          </Box>
        </Box>
        {intersperseFn(i => <Box key={i} style={{height: 0.5, backgroundColor: globalColors.black_10}} />,
                       section.files.map(f => <File key={f.name} {...f} />))}
      </Box>
    )
  }

  render () {
    const isPrivate = this.props.theme === 'private'
    const menuColor = styleMenuColorThemed(this.props.theme, this.props.visiblePopupMenu)
    const backButtonColor = backButtonColorThemed[this.props.theme]
    const tlfTextStyle = styleTLFTextThemed[this.props.theme]

    return (
      <Box style={{...globalStyles.flexBoxColumn, position: 'relative', backgroundColor: backgroundColorThemed[this.props.theme]}}>
        <Box style={{...globalStyles.flexBoxRow, justifyContent: 'space-between', ...styleHeaderThemed[this.props.theme], height: 48}}>
          <BackButton iconOnly onClick={this.props.onBack} style={{marginLeft: 16}} iconStyle={{color: backButtonColor}} textStyle={{color: backButtonColor}} />
          <Icon
            underlayColor={'transparent'}
            style={{...styleMenu, color: menuColor, marginRight: 16}}
            type='fa-custom-icon-hamburger'
            onClick={this.props.onTogglePopupMenu} />
        </Box>
        <Box style={{...globalStyles.flexBoxColumn, ...styleTLFHeader, ...styleTLFHeaderThemed[this.props.theme]}}>
          <Box style={{...globalStyles.flexBoxRow, height: 0, justifyContent: 'center', position: 'relative', bottom: 16}}>
            {this.props.users.map(u => <Box key={u} style={{height: 32, width: 28}}><Avatar username={u} size={32} /></Box>)}
          </Box>
          <Box style={{...globalStyles.flexBoxRow, alignItems: 'flex-end', justifyContent: 'center', marginTop: 20, marginBottom: 20}}>
            <Text type='BodySmallSemibold' style={tlfTextStyle}>{isPrivate ? 'private/' : 'public/'}</Text>
            {intersperseFn(i => (<Text key={i} style={tlfTextStyle} type='BodySemibold'>,</Text>), this.props.users.map(u => (
              <Text key={u} type='BodySemibold' style={{...tlfTextStyle, ...(this.props.selfUsername === u ? globalStyles.italic : {})}}>{u}</Text>
            )))}
          </Box>
        </Box>
        <Box style={{...globalStyles.flexBoxColumn}}>
          {this.props.recentFilesSection.map(s => this._renderSection(s))}
        </Box>

      </Box>

    )
  }
}

const styleHeaderThemed = {
  'private': {
    backgroundColor: globalColors.darkBlue3,
    backgroundRepeat: 'repeat'
  },

  'public': {
    backgroundColor: globalColors.yellowGreen
  }
}

const styleTLFHeader = {
  height: 64
}

const styleTLFHeaderThemed = {
  'private': {
    backgroundColor: globalColors.darkBlue
  },

  'public': {
    backgroundColor: globalColors.white
  }
}

const styleTLFTextThemed = {
  'private': {
    color: globalColors.white
  },

  'public': {
    color: globalColors.yellowGreen
  }
}

const styleSectionTextThemed = {
  'public': {
    color: globalColors.black_60
  },
  'private': {
    color: globalColors.blue3_40
  }
}

const backgroundColorThemed = {
  'public': globalColors.lightGrey,
  'private': globalColors.darkBlue3
}

const styleMenu = {
  ...globalStyles.clickable,
  alignSelf: 'center',
  fontSize: 12
}

const backButtonColorThemed = {
  'private': globalColors.white,
  'public': globalColors.white
}

function styleMenuColorThemed (theme, showingMenu): string {
  return theme === 'public'
    ? (showingMenu ? globalColors.black_40 : globalColors.white)
    : (showingMenu ? globalColors.blue3 : globalColors.white)
}
