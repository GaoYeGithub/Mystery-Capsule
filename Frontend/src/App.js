import React, { Suspense, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { Loader, OrbitControls, softShadows } from "@react-three/drei";
import { useSpring } from "react-spring";
import Lights from "./components/Three/lights";
import Floor from "./components/Three/floor";
import "./assets/styles/App.scss";
import Model from "./components/Three/chest";
import ChestModal from "./components/chestModal";

softShadows();

const ZoomWithOrbital = () => {
  const { gl, camera } = useThree();
  useSpring({
    from: {
      z: 30,
    },
    x: -5,
    y: 4,
    z: 4,
    onFrame: ({ x, y, z }) => {
      camera.position.x = x;
      camera.position.y = y;
      camera.position.z = z;
    },
  });
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      target={[0, 0, 0]}
      args={[camera, gl.domElement]}
    />
  );
};

const App = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Canvas
        colorManagement
        shadowMap
        camera={{ position: [-5, 4, 4], fov: 40 }}>
        <Lights />
        <Suspense fallback={null}>
          <Model open={open} setOpen={setOpen} />
          <Floor />
          <ZoomWithOrbital />
        </Suspense>
      </Canvas>
      <Loader />
      <ChestModal open={open} setOpen={setOpen} />
    </>
  );
};

export default App;
