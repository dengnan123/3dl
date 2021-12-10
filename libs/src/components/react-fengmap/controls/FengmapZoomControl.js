import FengmapBaseControl from '../bases/FengmapBaseControl'
import PropTypes from 'prop-types'

class FengmapZoomControl extends FengmapBaseControl {
  static propTypes = {
    ctrlOptions: PropTypes.shape({
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      }),
      imgURL: PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate(nextProps) {
    const zoomBtn = document.getElementsByClassName('fm-control-zoom')[0]
    if (this.props.visible !== nextProps.visible) {
      if (this.props.visible) {
        zoomBtn.style.display = 'block'
      } else {
        zoomBtn.style.display = 'none'
      }
    }
  }

  load = (map, fengmapSDK, parent) => {
    const { ctrlOptions } = this.props
    new fengmapSDK.zoomControl(map, ctrlOptions)
  }

  render() {
    return null
  }
}

export default FengmapZoomControl
