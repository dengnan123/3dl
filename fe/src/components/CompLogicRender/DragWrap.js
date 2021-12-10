// import { useMemo } from 'react';

const DragWrap = Comp => {
  console.log(Comp, '====comp');
  return function newComp(props) {
    const { v } = props;
    const { openSlideUp } = v?.basicStyle || {};
    console.log(openSlideUp, '=====slideVVV--openSlideUp');
    return <Comp {...props}></Comp>;
    // if (!openSlideUp) {
    //   return <Comp {...props}></Comp>;
    // }
    // return (
    //   <div id="Chay">
    //     <Comp {...props}></Comp>
    //   </div>
    // );
  };
};

export default DragWrap;
