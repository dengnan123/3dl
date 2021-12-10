import FengmapBaseControl from '../bases/FengmapBaseControl';
import PropTypes from 'prop-types';
import { VersionDetect } from '../helpers/object';

// const imgUrl = '../src/assets/map/';
class Fengmap3DControl extends FengmapBaseControl {
  static propTypes = {
    ctrlOptions: PropTypes.shape({
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
      imgURL: PropTypes.string,
      visible: PropTypes.bool,
    }).isRequired,
    style: PropTypes.object,
    containerId: PropTypes.string,
  };

  static defaultProps = {
    visible: true,
  };

  componentDidMount() {
    const { visible, style, containerId } = this.props;
    let btn3D = null;
    if (!!containerId) {
      const nodeId = document.getElementById(containerId);
      btn3D = nodeId.getElementsByClassName('fm-control-tool-3d')[0];
    } else {
      btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];
    }
    // const btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];
    if (!btn3D) return;

    btn3D.style.width = `${style.width}px`;
    btn3D.style.height = `${style.height}px`;
    btn3D.style.borderRadius = `${style.borderRadius}px`;
    btn3D.style.backgroundSize = 'cover';
    if (!style.btnShadow) {
      btn3D.style.boxShadow = 'none';
    }

    if (!style.btnBackgroundColorBool) {
      btn3D.style.backgroundColor = `transparent`;
    } else if (style.btnBackgroundColorBool) {
      btn3D.style.backgroundColor = style.backgroundColor;
    }

    if (!visible) {
      btn3D.style.display = 'none';
    } else {
      btn3D.style.display = 'block';
    }

    this.setPosition();
  }

  componentDidUpdate(nextProps) {
    const { visible, style, containerId } = this.props;

    let btn3D = null;
    if (!!containerId) {
      const nodeId = document.getElementById(containerId);
      btn3D = nodeId.getElementsByClassName('fm-control-tool-3d')[0];
    } else {
      btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];
    }
    // const btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];

    if (!btn3D) return;

    btn3D.style.width = `${style.width}px`;
    btn3D.style.height = `${style.height}px`;
    btn3D.style.borderRadius = `${style.borderRadius}px`;
    btn3D.style.backgroundSize = 'cover';
    if (!style.btnShadow) {
      btn3D.style.boxShadow = 'none';
    } else {
      btn3D.style.boxShadow = style.boxShadow;
    }

    if (!style.btnBackgroundColorBool) {
      btn3D.style.backgroundColor = `transparent`;
    } else if (style.btnBackgroundColorBool) {
      btn3D.style.backgroundColor = style.backgroundColor;
    }

    if (this.props.visible !== nextProps.visible) {
      if (!visible) {
        btn3D.style.display = 'none';
      } else {
        btn3D.style.display = 'block';
      }
    }

    // if (
    //   JSON.stringify(this.props.ctrlOptions) !== JSON.stringify(nextProps.ctrlOptions) ||
    //   JSON.stringify(style) !== JSON.stringify(nextProps.style)
    // ) {
    this.setPosition();
    // }
  }

  setPosition = () => {
    const {
      ctrlOptions: { position, offset },
      containerId,
    } = this.props;
    const x = offset ? offset.x : 0;
    const y = offset ? offset.y : 50;

    let btn3D = null;
    if (!!containerId) {
      const nodeId = document.getElementById(containerId);
      btn3D = nodeId.getElementsByClassName('fm-control-tool-3d')[0];
    } else {
      btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];
    }

    // const btn3D = document.getElementsByClassName('fm-control-tool-3d')[0];

    if (!btn3D) return;

    if (position === 1) {
      btn3D.style.top = `${y}px`;
      btn3D.style.bottom = 'unset';
      btn3D.style.left = `${x}px`;
      btn3D.style.right = 'unset';
    } else if (position === 2) {
      btn3D.style.top = 'unset';
      btn3D.style.bottom = `${y}px`;
      btn3D.style.left = `${x}px`;
      btn3D.style.right = 'unset';
    } else if (position === 3) {
      btn3D.style.top = `${y}px`;
      btn3D.style.bottom = 'unset';
      btn3D.style.left = 'unset';
      btn3D.style.right = `${x}px`;
    } else if (position === 4) {
      btn3D.style.top = 'unset';
      btn3D.style.bottom = `${y}px`;
      btn3D.style.left = 'unset';
      btn3D.style.right = `${x}px`;
    }
  };

  load = (map, fengmapSDK, parent) => {
    this.setState({ map, fengmapSDK, parent });
    const { ctrlOptions } = this.props;
    let version = fengmapSDK && fengmapSDK.VERSION;
    const tag = VersionDetect(version);
    if (tag) {
      new fengmapSDK.FMToolControl(map, ctrlOptions);
    } else {
      new fengmapSDK.toolControl(map, ctrlOptions);
    }
  };

  render() {
    return null;
  }
}

export default Fengmap3DControl;
