import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

const frustumSize = 5
const aspect = window.innerWidth / window.innerHeight

root.render(
    <Canvas
    orthographic
        camera={ {
            zoom: 1, // Adjust the zoom level
            left: -frustumSize * aspect / 2,
            right: frustumSize * aspect / 2,
            top: frustumSize / 2,
            bottom: -frustumSize / 2,
            near: 0.1,
            far: 100,
            position: [0, 0, 4]
        } }

        gl={{ antialias: true }}
    >
        <Experience />
    </Canvas>
)