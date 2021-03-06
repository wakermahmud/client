/* @flow */

import * as Constants from '../constants/unlock-folders'
import * as CommonConstants from '../constants/common'
import HiddenString from '../util/hidden-string'

import {toDeviceType} from '../constants/types/more'
import type {UnlockFolderActions, Device} from '../constants/unlock-folders'

export type State = {
  phase: 'dead' | 'promptOtherDevice' | 'paperKeyInput' | 'success',
  devices: ?Array<Device>,
  waiting: boolean,
  paperkeyError: ?HiddenString
}

const initialState: State = {
  phase: 'dead',
  waiting: false,
  devices: null,
  paperkeyError: null
}

export default function (state: State = initialState, action: UnlockFolderActions): State {
  // TODO: Fill out the rest of this reducer
  switch (action.type) {
    case CommonConstants.resetStore:
    case Constants.close:
      return {...initialState}
    case Constants.loadDevices:
      if (action.error) {
        return state
      } else {
        const devices = action.payload.devices.map(({name, type, deviceID}) => ({
          type: toDeviceType(type),
          name, deviceID
        }))
        return {
          ...state,
          devices
        }
      }

    case Constants.waiting:
      if (action.error) {
        return state
      }

      return {
        ...state,
        waiting: action.payload
      }

    case Constants.onBackFromPaperKey:
      return {
        ...state,
        phase: 'promptOtherDevice'
      }

    case Constants.toPaperKeyInput:
      return {
        ...state,
        phase: 'paperKeyInput'
      }
    case Constants.checkPaperKey:
      if (action.error) {
        return {
          ...state,
          paperkeyError: action.payload.error
        }
      } else {
        return {
          ...state,
          phase: 'success'
        }
      }
    case Constants.finish:
      return {
        ...state,
        phase: 'dead'
      }
    default:
      return state
  }
}

// Mock states -- Use these when creating components.

export const mocks: {[key: string]: State} = {
  promptOtherSingleDevice: {
    phase: 'promptOtherDevice',
    waiting: false,
    devices: [{type: 'desktop', name: 'Cray', deviceID: 'bada55'}],
    paperkeyError: null
  },
  promptOtherMultiDevice: {
    phase: 'promptOtherDevice',
    waiting: false,
    devices: [
      {type: 'desktop', name: 'Cray', deviceID: 'c0ffee'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef'},
      {type: 'mobile', name: 'Newton', deviceID: 'dead'}
    ],
    paperkeyError: null
  },
  promptOtherLotsaDevice: {
    phase: 'promptOtherDevice',
    waiting: false,
    devices: [
      {type: 'desktop', name: 'Cray', deviceID: 'c0ffee'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef1'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef2'},
      {type: 'mobile', name: 'Newton', deviceID: 'dead'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef3'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef4'},
      {type: 'mobile', name: 'Newton', deviceID: 'dead2'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef8'},
      {type: 'mobile', name: 'Newton', deviceID: 'dead4'},
      {type: 'desktop', name: 'Watson', deviceID: 'beef9'},
      {type: 'mobile', name: 'Newton', deviceID: 'deade'},
      {type: 'desktop', name: 'Watson', deviceID: 'beeff'},
      {type: 'mobile', name: 'Newton', deviceID: 'deada'},
      {type: 'desktop', name: 'Watson', deviceID: 'beefc'},
      {type: 'mobile', name: 'Newton', deviceID: 'dead1'}
    ],
    paperkey: null,
    paperkeyError: null
  },
  paperKeyInput: {
    phase: 'paperKeyInput',
    waiting: false,
    devices: [],
    paperkeyError: null
  },
  paperKeyInputWithError: {
    phase: 'paperKeyInput',
    waiting: false,
    devices: [],
    paperkeyError: new HiddenString('Invalid paper key')
  },
  paperKeyInputWithErrorWaiting: {
    phase: 'paperKeyInput',
    waiting: true,
    devices: [],
    paperkeyError: new HiddenString('Invalid paper key')
  },
  success: {
    phase: 'success',
    waiting: false,
    devices: [],
    paperkeyError: null
  }
}
