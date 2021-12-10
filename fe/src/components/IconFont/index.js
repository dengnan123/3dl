import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import classnames from 'classnames'
import './index.less'

const IconFont = ({
  type,
  colorful = false,
  tooltip = false,
  tooltipTitle,
  className,
  style,
  onClick,
  tooltipPlacement,
  overlayClassName,
  renderSvg: RenderSVG
}) => {
  if (colorful && tooltip) {
    // TODO:将img重构为svg图标
    return (
      <Tooltip placement={tooltipPlacement} title={tooltipTitle} overlayClassName={overlayClassName}>
        <RenderSVG
          className={classnames('colorful-icon', className)}
          style={style}
          aria-hidden="true"
          onClick={onClick}
        />
      </Tooltip>
    )
  }

  if (colorful) {
    return (
      <RenderSVG
        className={classnames('colorful-icon', className)}
        style={style}
        aria-hidden="true"
        onClick={onClick}
      />
    )
  }

  return (
    <i className={classnames('antdadmin', [`icon-${type}`], className)} style={style} onClick={onClick} />
  )
}

IconFont.propTypes = {
  type: PropTypes.string,
  colorful: PropTypes.bool,
  tooltip: PropTypes.bool,
  tooltipTitle: PropTypes.any,
  className: PropTypes.string,
  onClick: PropTypes.func,
  style: PropTypes.object,
  tooltipPlacement: PropTypes.string,
  overlayClassName: PropTypes.string,
  renderSvg: PropTypes.func
}

export default IconFont
