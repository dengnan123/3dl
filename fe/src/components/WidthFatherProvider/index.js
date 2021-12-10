import React from 'react';
import ReactDOM from 'react-dom';
import { SizeMe } from 'react-sizeme';
export default function WidthProvider(ComposedComponent) {
  return class WidthProvider extends React.Component {
    static defaultProps = {
      measureBeforeMount: false,
    };
    state = {
      width: 1280,
    };

    mounted = false;
    componentDidMount() {
      this.mounted = true;
      window.addEventListener('resize', this.onWindowResize);
      this.onWindowResize();
    }

    componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
      if (!this.mounted) return;
      // eslint-disable-next-line react/no-find-dom-node
      const node = ReactDOM.findDOMNode(this);
      if (node instanceof HTMLElement) this.setState({ width: node.offsetWidth });
    };

    render() {
      const { measureBeforeMount, ...rest } = this.props;
      if (measureBeforeMount && !this.mounted) {
        return <div className={this.props.className} style={this.props.style} />;
      }
      return (
        <SizeMe>
          {({ size }) => {
            return <ComposedComponent {...rest} {...this.state} width={size.width} />;
          }}
        </SizeMe>
      );
    }
  };
}
