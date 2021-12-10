/**
 * 素材内置边框的modal组件
*/
import React, { Component } from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import BorderBox from '../../assets/border/border-2-1.png';
import { borderBackgroundImage } from '../../helpers/materialconfig';

class BorderImageSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      borderImageUrl: BorderBox
    };
  }

  changeBackgroundImage = item => {
    const { updateStyle, style } = this.props;
    this.setState({ showModal: false, borderImageUrl: item });
    let data = { borderImageSource: `url(${item})` };
    updateStyle({ ...style, ...data });
  };

  render() {
    const { borderImageUrl } = this.state
    
    return (
      <div>
        <div
          onClick={() => {
            this.setState({ showModal: true });
          }}
          className={styles.imgBox}
          style={{ background: `url(${borderImageUrl}) center center no-repeat` }}
        ></div>
        <Modal
          width={1200}
          title="请选择图片更换"
          visible={this.state.showModal}
          footer={null}
          onCancel={() => {
            this.setState({ showModal: false });
          }}
        >
          <div className="clearfix">
            {borderBackgroundImage.map(item => {
              return (
                <div
                  className={styles.BackImgbox}
                  onClick={() => {
                    this.changeBackgroundImage(item);
                  }}
                >
                  <div
                    className={styles.divImgBox}
                    style={{ background: `url(${item}) center center / contain no-repeat` }}
                  ></div>
                </div>
              );
            })}
          </div>
        </Modal>
      </div>
    );
  }
}

BorderImageSource.propTypes = {};

export default BorderImageSource;
