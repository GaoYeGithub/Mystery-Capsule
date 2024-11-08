import { Canvas } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import { OrbitControls, Loader, softShadows } from '@react-three/drei';
import Lights from './Three/lights';
import Floor from './Three/floor';
import Model from './Three/chest';
import ChestModal from './components/ChestModal';

softShadows();

const ThreeScene = ({ boxData }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [-5, 4, 4], fov: 40 }}
      >
        <Lights />
        <Suspense fallback={null}>
          <Model open={open} setOpen={setOpen} />
          <Floor />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
      <Loader />
      <ChestModal 
        open={open} 
        setOpen={setOpen} 
        boxData={boxData}
      />
    </>
  );
};

export default ThreeScene;