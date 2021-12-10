import { ajax } from './ajax'
import PropTypes from 'prop-types'
import React from 'react'
import download from 'downloadjs'

class RfReceiver extends React.Component {
  static propTypes = {
    children: PropTypes.any,
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    headers: PropTypes.object,
    fileName: PropTypes.string,
    fileMIMEType: PropTypes.string,
    onProgress: PropTypes.func
  }

  static defaultProps = {
    headers: {},
    fileMIMEType: 'application/octet-stream'
  }

  _fireOriginalClick = e => {
    const { children } = this.props
    const childCallback = children.props.onClick
    if (childCallback) {
      childCallback(e)
    }
  }

  _onClick = e => {
    const { url, fileMIMEType, fileName, headers, onProgress } = this.props
    if (e && e.preventDefault) {
      e.preventDefault()
    }
    this._fireOriginalClick(e)

    ajax({
      url: isString(url) ? url : url(),
      method: 'GET',
      responseType: 'blob',
      headers: headers || {},
      onProgress: event => {
        onProgress(event)
      }
    })
      .then(response => {
        download(response, getFileName(fileName, url), fileMIMEType)
      })
      .catch(err => {
        onProgress({
          complete: 0,
          loaded: 0,
          total: 0,
          downloadSuccess: false
        })
      })
  }

  render() {
    const { children } = this.props
    const child = React.Children.only(children)
    const newChild = React.cloneElement(child, {
      onClick: this._onClick
    })
    return newChild
  }
}

export default RfReceiver

function getFileName(fileName, url) {
  if (fileName) {
    return fileName
  }
  if (!url) {
    return ''
  }
  const splitWithSlash = url.split('/')
  const lastPiece = splitWithSlash.pop()
  if (!lastPiece) {
    return ''
  }
  return lastPiece.split('?')[0] || 'downloaded'
}

function isString(url) {
  return Object.prototype.toString.call(url) === '[object String]'
}
