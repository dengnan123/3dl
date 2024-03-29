import PropTypes from 'prop-types';
import FengmapBaseControl from '../bases/FengmapBaseControl';
import isEqual from 'fast-deep-equal';

const EVENTS = ['complete', 'crossGroup', 'walking'];

class FengmapNavigation extends FengmapBaseControl {
  static propTypes = {
    naviOptions: PropTypes.shape({
      speed: PropTypes.number,
      followPosition: PropTypes.bool,
      followAngle: PropTypes.bool,
      changeTiltAngle: PropTypes.bool,
      scaleLevel: PropTypes.number,
      offsetHeight: PropTypes.number,
      lineStyle: PropTypes.object,
    }),
    start: PropTypes.shape({
      options: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        groupID: PropTypes.number,
        url: PropTypes.string,
        size: PropTypes.number,
        callback: PropTypes.func,
      }),
      noMarker: PropTypes.bool,
    }),
    end: PropTypes.shape({
      options: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        groupID: PropTypes.number,
        url: PropTypes.string,
        size: PropTypes.number,
        callback: PropTypes.func,
      }),
      noMarker: PropTypes.bool,
    }),
    events: PropTypes.object,
    onDrawComplete: PropTypes.func,
  };

  load = (map, fengmapSDK, parent) => {
    const { naviOptions } = this.props;

    this._createNavigation(map, fengmapSDK, naviOptions);
  };

  _createNavigation = (map, fengmapSDK, naviOptions) => {
    this.map = map;
    this.fengmapSDK = fengmapSDK;
    this.navigation = new fengmapSDK.FMNavigation({
      ...(naviOptions || {}),
      map: map,
    });
    const { events } = this.props;
    EVENTS.map(e => {
      this.navigation.on(e, event => {
        if (events && events[e]) {
          events[e](event, this.navigation);
        }
      });
      return e;
    });

    this._setRoute({}, this.props);
  };

  _setRoute = (prev, props) => {
    const { start, end, onDrawComplete } = props;
    if (!this.navigation) {
      return;
    }
    if (isEqual(start, prev.start) && isEqual(end, prev.end)) {
      return;
    }

    this.navigation.clearAll();

    if (start && start.options) {
      this.navigation.setStartPoint(start.options, start.noMarker);
    }
    if (end && end.options) {
      this.navigation.setEndPoint(end.options, end.noMarker);
    }

    if (start && end) {
      this.navigation.drawNaviLine();
      onDrawComplete && onDrawComplete(this.navigation);
    }
  };

  componentDidUpdate(prev) {
    this._setRoute(prev || {}, this.props);
  }

  _destroy = () => {
    if (this.navigation) {
      this.navigation.clearAll();
    }
  };

  componentWillUnmount() {
    this._destroy();
  }

  render() {
    return null;
  }
}

export default FengmapNavigation;
