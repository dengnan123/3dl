import { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  Player,
  ControlBar,
  PlayToggle,
  ReplayControl,
  ForwardControl,
  VolumeMenuButton,
  ProgressControl,
  FullscreenToggle,
} from 'video-react';

import styles from './index.less';

function useCompare(value) {
  let defaultValue = {};
  const ref = useRef(defaultValue);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

const VideoModal = props => {
  const { style } = props;

  const finalStyle = useCompare(style);

  const {
    videoSrc = '//img.tukuppt.com/video_show/2269348/00/02/23/5b52ff923e41e.mp4',
    basic = { poster: '', autoPlay: false, loop: false, preload: 'auto', muted: false },
    controlBar = { disabled: false },
    playToggle = { disabled: false },
    replayControl = { disabled: false, seconds: 5 },
    forwardControl = { disabled: false, seconds: 5 },
    volumeMenuButton = { disabled: false, vertical: false },
    progressControl = { disabled: false },
    fullscreenToggle = { disabled: false },
  } = finalStyle;

  const content = useMemo(() => {
    return (
      <Player key={uuid()} {...basic}>
        <source src={videoSrc} />
        <ControlBar {...controlBar}>
          <PlayToggle {...playToggle} />
          <ReplayControl {...replayControl} />
          <ForwardControl {...forwardControl} />
          <VolumeMenuButton {...volumeMenuButton} />
          <ProgressControl {...progressControl} />
          <FullscreenToggle {...fullscreenToggle} />
        </ControlBar>
      </Player>
    );
  }, [
    basic,
    videoSrc,
    controlBar,
    playToggle,
    replayControl,
    forwardControl,
    volumeMenuButton,
    progressControl,
    fullscreenToggle,
  ]);

  return <div className={styles.container}>{content}</div>;
};

VideoModal.propTypes = {
  style: PropTypes.object,
};

export default VideoModal;
