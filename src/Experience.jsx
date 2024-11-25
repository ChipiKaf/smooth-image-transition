import React from 'react'
import gsap from 'gsap'
import { useThree, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment2.glsl';
import * as THREE from 'three'

export default function Experience()
{
    const { camera, gl, viewport } = useThree()
    const texture = useLoader(THREE.TextureLoader, './1.jpg')
    const texture2 = useLoader(THREE.TextureLoader, './2.jpg')
    const displacementTexture = useLoader(THREE.TextureLoader, './displacement/1.png');
    const currentDirection = useRef(1.2);
    const imageAspect = useMemo(() => 1.0, [])
    /**
     * @type { React.MutableRefObject<THREE.Mesh> }
     */
    const meshRef = useRef()

    const uniforms = useRef({
        uPictureTexture: new THREE.Uniform(null),
        uPictureTexture2: new THREE.Uniform(null),
        uDisplacementTexture: new THREE.Uniform(null),
        uMixValue: new THREE.Uniform(0), // Controls moving to new image 
        uMixValue2: new THREE.Uniform(0), // Controls distortion
        uIntensity1: new THREE.Uniform(0.05),
        uIntensity2: new THREE.Uniform(0.05),
        uAngle1: new THREE.Uniform(Math.PI / 4),
        uAngle2: new THREE.Uniform(-Math.PI / 4 * 3),
        uRes: new THREE.Uniform(new THREE.Vector4(1, 1, 1, 1)),
    })

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace
        uniforms.current.uPictureTexture.value = texture

        texture2.colorSpace = THREE.SRGBColorSpace
        uniforms.current.uPictureTexture2.value = texture2

        displacementTexture.magFilter = displacementTexture.minFilter = THREE.LinearFilter;
        uniforms.current.uDisplacementTexture.value = displacementTexture
    }, [texture, texture2, displacementTexture])

    useEffect(() => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
    }, [gl])

    useFrame(({ clock }) => {
        uniforms.current.uTime = clock.getElapsedTime();
    })

    useEffect(() => {
        let a1, a2;
        if ( viewport.height / viewport.width < imageAspect ) {
            a1 = 1;
            a2 = viewport.height / viewport.width / imageAspect;
        } else {
            a1 = (viewport.width / viewport.height) * imageAspect;
            a2 = 1;
        }
        uniforms.current.uRes.value.set(viewport.width, viewport.height, a1, a2)
        /**
         * 
         * @param { WheelEvent } event
         */
        const handleWheel = (event) => {
            const direction = event.deltaY > 0 ? 1.2 : 1.1
            if ( currentDirection.current === direction ) return
            currentDirection.current = direction;
            const ease = "expo.out"
            if (meshRef.current) {
                const timeline = gsap.timeline()
                if (direction === 1.1) {
                    timeline.to(uniforms.current.uMixValue, {
                        duration: 1.6,
                        value: 1,
                        ease,
                    }, 0.1)

                    timeline.to(uniforms.current.uMixValue2, {
                        duration: 2.6,
                        value: 1,
                        ease,
                    }, 0.1)
                } else {
                    timeline.to(uniforms.current.uMixValue, {
                        duration: 1.6,
                        value: 0,
                        ease,
                    }, 0.1)
                    timeline.to(uniforms.current.uMixValue2, {
                        duration: 2.6,
                        value: 0,
                        ease,
                    }, 0.1)
                } 
            }
        }
        window.addEventListener('wheel', handleWheel)

        return () => window.removeEventListener('wheel', handleWheel)
    }, [])



    return <>
        <mesh 
        ref={meshRef}
        position={[0, 0, 0]}
        >
            <planeGeometry args={[camera.right - camera.left, camera.top - camera.bottom]} />
            <shaderMaterial 
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms.current} />
        </mesh>

    </>
}