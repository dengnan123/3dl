import { Component } from 'react';
import ReactDOM from 'react-dom';
import * as uuid from 'uuid';

class Modal extends Component {
  constructor(props) {
    super(props);
    const modal = document.createElement('div');
    const id = uuid.v4();
    modal.id = id;
    modal.style.zIndex = 999;
    modal.style.position = 'relative';
    modal.style.height = '100%';
    this.el = modal;
    this.id = id;
    this.bodyContainer = this.props.getContainer ? this.props.getContainer() : document.body;
  }

  componentDidMount() {
    this.bodyContainer.appendChild(this.el);
  }
  componentWillUnmount() {
    const modalRoot = document.getElementById(this.id);
    this.bodyContainer.removeChild(modalRoot);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default Modal;
