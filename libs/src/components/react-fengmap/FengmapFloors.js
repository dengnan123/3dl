import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FengmapBase from './FengmapBase';
import { isNil } from './helpers/object';

class FengmapFloors extends Component {
  static propTypes = {
    reference: PropTypes.any,
    mapOptions: PropTypes.object,
    events: PropTypes.object,
    value: PropTypes.number,
    onFloorChange: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.mapInstance = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.value === prevProps.value) {
      return;
    }
    if (!this.mapInstance) {
      return;
    }

    this._changeFloor();
  }

  _changeFloor = () => {
    const { onFloorChange, value } = this.props;
    try {
      if (!this.mapInstance || isNil(this.mapInstance.listFloors)) {
        return;
      }
      const { listFloors } = this.mapInstance;
      const index = listFloors.findIndex(f => f === value);
      const groupId = index + 1;
      this.mapInstance.visibleGroupIDs = [groupId];
      this.mapInstance.focusGroupID = groupId;

      if (onFloorChange) {
        onFloorChange({
          floorLevel: value,
          groupId,
        });
      }
    } catch (error) {
      // such error: TypeError: Cannot read property 'scene_data' of undefined, should not be printed
    }
  };

  render() {
    const props = omit(this.props, 'events', 'mapOptions');
    const events = omit(this.props.events || {}, 'loadComplete');
    const mapOptions = this.props.mapOptions;
    return (
      <FengmapBase
        {...props}
        isFengmapBase={false}
        ref={props.reference}
        mapOptions={Object.assign({}, mapOptions, {
          defaultVisibleGroups: [],
          defaultFocusGroup: null,
        })}
        events={{
          ...events,
          loadComplete: (e, map) => {
            this.mapInstance = map;
            if (this.props.events && this.props.events.loadComplete) {
              this.props.events.loadComplete(e, map);
            }
            this._changeFloor();
          },
        }}
      >
        {props.children}
      </FengmapBase>
    );
  }
}

export default React.forwardRef((props, ref) => <FengmapFloors reference={ref} {...props} />);

function omit(obj, ...keys) {
  const newObj = {};
  Object.keys(obj)
    .filter(k => keys.indexOf(k) < 0)
    .map(k => {
      newObj[k] = obj[k];
      return k;
    });
  return newObj;
}
