import React from "react";

export const Box = (props) => {
  return (
    <mesh {...props} recieveShadow={true} castShadow>
      <boxBufferGeometry />
      <meshPhysicalMaterial  color={"white"} />
    </mesh>
  );
}

export const LightBulb = (props) => {
  return (
    <mesh {...props} >
      <pointLight castShadow />
      <sphereBufferGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={"yellow"}  />
    </mesh>
  );
}

// export const Floor = (props) => {
//   return (
//     <mesh {...props} recieveShadow>
//       <boxBufferGeometry args={[20,1,10]} />
//       <meshPhysicalMaterial color='white' />
//     </mesh>
//   );
// }

// export { Box, Floor, LightBulb };
// export default Box;