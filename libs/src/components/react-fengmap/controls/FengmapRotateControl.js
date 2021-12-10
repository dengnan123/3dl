import React from 'react'
import FengmapBaseControl from '../bases/FengmapBaseControl'
import PropTypes from 'prop-types'

import { mergeWithOffset } from '../helpers/map'

import rotateIcon from '../assets/icon-rotate-7.jpg'

const INLINE_STYLE = {
  width: '42px',
  height: '42px',
  zIndex: '10',
  cursor: 'pointer',
  backgroundColor: '#fff',
  boxShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 3px',
  borderRadius: '2px'
}

const INNER_STYLE = {
  width: '20px',
  height: '20px',
  position: 'absolute',
  top: '50%',
  marginTop: '-10px',
  left: '50%',
  marginLeft: '-10px'
}

class FengmapRotateControl extends FengmapBaseControl {
  static propTypes = {
    ctrlOptions: PropTypes.shape({
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
      })
    }).isRequired,
    angle(props, propName, componentName) {
      if (props[propName] === undefined) {
        return true
      }
      if (Object.prototype.toString.call(props[propName]) !== '[object Number]') {
        throw new Error(`Invalid prop ${propName} supplied to ${componentName}. Must be number > 0 && < 360`)
      }
      if (props[propName] <= 0 || props[propName] >= 360) {
        throw new Error(`Invalid prop ${propName} supplied to ${componentName}. Must be number > 0 && < 360`)
      }
    },
    style: PropTypes.object
  }

  static defaultProps = {
    angle: 10
  }

  constructor(props) {
    super(props)

    this.state = {
      RotateStyle: {},
      POSITIONS: [],
      loaded: false
    }

    this.rotateControl = React.createRef()
  }

  _getFinalStyle = (props, POSITIONS) => {
    const { ctrlOptions } = props
    if (!ctrlOptions) {
      return mergeWithOffset(
        {
          position: POSITIONS[0]
        },
        POSITIONS,
        INLINE_STYLE
      )
    }

    // no position specified, with LEFT_BOTTOM by default
    if (POSITIONS.indexOf(ctrlOptions.position) < 0) {
      return mergeWithOffset(
        {
          ...ctrlOptions,
          position: POSITIONS[0]
        },
        POSITIONS,
        INLINE_STYLE
      )
    }

    return mergeWithOffset(ctrlOptions, POSITIONS, INLINE_STYLE)
  }

  load = (map, fengmapSDK, parent) => {
    const POSITIONS = [
      fengmapSDK.controlPositon.LEFT_BOTTOM,
      fengmapSDK.controlPositon.LEFT_TOP,
      fengmapSDK.controlPositon.RIGHT_BOTTOM,
      fengmapSDK.controlPositon.RIGHT_TOP
    ]

    this.setState(
      {
        RotateStyle: this._getFinalStyle(this.props, POSITIONS),
        POSITIONS,
        loaded: true
      },
      () => {
        const elem = this.rotateControl.current
        if (!elem) {
          return
        }
        elem.addEventListener(
          'click',
          () => {
            map.rotateAngle = this._getNextRotateAngle(map.rotateAngle)
          },
          false
        )
      }
    )
  }

  _getNextRotateAngle = rotateAngle => {
    const { angle } = this.props
    let next = rotateAngle + angle
    if (next <= 360) {
      return next
    }
    return next - 360
  }

  getResetPosition = () => {
    let x = 0
    let y = 0
    const { ctrlOptions } = this.props
    const { position } = ctrlOptions
    if (ctrlOptions.hasOwnProperty('offset')) {
      x = ctrlOptions.offset.x
      y = ctrlOptions.offset.y
    }

    const { imgURL } = ctrlOptions

    switch (position) {
      case 1:
        return { left: `${10 + x}px`, top: `${50 + y}px`, backgroundImage: `url(${imgURL})` }
      case 3:
        return { right: `${10 + x}px`, top: `${50 + y}px`, backgroundImage: `url(${imgURL})` }
      case 2:
        return { left: `${10 + x}px`, bottom: `${50 + y}px`, backgroundImage: `url(${imgURL})` }
      case 4:
        return { right: `${10 + x}px`, bottom: `${50 + y}px`, backgroundImage: `url(${imgURL})` }
      default:
        return { right: `${10 + x}px`, bottom: `${50 + y}px`, backgroundImage: "url('/assets/reset.png')" }
    }
  }

  render() {
    const { loaded, RotateStyle } = this.state
    const { visible, style } = this.props
    if (!loaded) {
      return null
    }

    const newStyle = Object.assign({}, RotateStyle, style, this.getResetPosition())
    return (
      <div
        className="fm-control-rotate-btn"
        style={{ ...newStyle, display: visible ? 'block' : 'none' }}
        ref={this.rotateControl}
      >
        <img src={rotateIcon} style={INNER_STYLE} alt="" />
      </div>
    )
  }
}

export default FengmapRotateControl
