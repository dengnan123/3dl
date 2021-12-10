// import React, { Suspense } from 'react';

// const getComp = props => {
//   return new Promise((reslove, reject) => {
//     const OtherComponent = React.lazy(() => import(`../../libs/${props.libPath}`));
//     // return <OtherComponent {...props}></OtherComponent>;
//     reslove(<OtherComponent {...props}></OtherComponent>);
//   });
// };

// const OtherComponent = React.lazy(() => import(`../../libs/${props.libPath}`));

// function DyComp(Comp) {
//   return (
//     <div>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Comp></Comp>
//       </Suspense>
//     </div>
//   );
// }

// export default DyComp;
