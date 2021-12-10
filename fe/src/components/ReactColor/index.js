import React, { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';

// class Component extends React.Component {
//   state = {
//     background: this.props.value,
//   };

//   handleChangeComplete = color => {
//     this.setState({ background: color.hex });
//   };

//   handleChange(color, event) {
//     // color = {
//     //   hex: '#333',
//     //   rgb: {
//     //     r: 51,
//     //     g: 51,
//     //     b: 51,
//     //     a: 1,
//     //   },
//     //   hsl: {
//     //     h: 0,
//     //     s: 0,
//     //     l: .20,
//     //     a: 1,
//     //   },
//     // }
//   }

//   render() {
// return (
//   <SketchPicker
//     color={this.state.background}
//     onChangeComplete={this.handleChangeComplete}
//     onChange={this.handleChange}
//   />
// );
//   }
// }

export default ({ value, onChange }) => {
  const [color, serColor] = useState('#ffff');
  useEffect(() => {
    serColor(value);
  }, [value]);
  const handleChangeComplete = color => {};

  const handleChange = (color, event) => {
    console.log('qweqeqw', color);
    serColor(color.hex);
    onChange && onChange(color.hex);
  };
  return (
    <SketchPicker color={color} onChangeComplete={handleChangeComplete} onChange={handleChange} />
  );
};
