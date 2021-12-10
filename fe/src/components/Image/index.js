import React from 'react'
import PropTypes from 'prop-types'
// import API from 'axios'
// import { getToken } from '../../helpers/storage'

export default class Image extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
  }

  // constructor(props) {
  //   super(props)
  //   this.imageRef = React.createRef()

  //   this.unmounted = false
  // }

  // componentDidMount() {
  //   const { src } = this.props
  //   if (!src || this.unmounted) {
  //     return
  //   }
  //   this._fetchImageData(src)
  // }

  // componentDidUpdate(prev) {
  //   const { src } = this.props
  //   if (this.unmounted) {
  //     return
  //   }
  //   if (prev.src !== src && src) {
  //     this._fetchImageData(src)
  //   }
  // }

  // _fetchImageData = src => {
  //   API({
  //     method: 'get',
  //     url: src,
  //     responseType: 'blob',
  //     headers: {
  //       Authorization: getToken()
  //     }
  //   }).then(res => {
  //     const reader = new window.FileReader()
  //     reader.readAsDataURL(res.data)
  //     reader.onload = () => {
  //       if (this.unmounted) return
  //       this.imageRef.current.setAttribute('src', reader.result)
  //     }
  //   })
  // }

  componentWillUnmount() {
    this.unmounted = true
  }

  render() {
    const { alt, className, style, src } = this.props
    return <img src={src} /*ref={this.imageRef}*/ alt={alt} className={className} style={style} />
  }
}
