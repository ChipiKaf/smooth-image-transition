import React from 'react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useThree, extend, useFrame, useLoader } from '@react-three/fiber'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import * as THREE from 'three'

extend({ OrbitControls })

export default function Experience()
{
    const { camera, gl, size, viewport } = useThree()
    const texture = useLoader(THREE.TextureLoader, './1.jpg')
    const texture2 = useLoader(THREE.TextureLoader, './2.jpg')
    const currentDirection = useRef(1.2);
    /**
     * @type { React.MutableRefObject<THREE.Mesh> }
     */
    const meshRef = useRef()

    const uniforms = useRef({
        delta: new THREE.Uniform(0.016),
        velocity: new THREE.Uniform(null),
        ink: new THREE.Uniform(null),
        uPictureTexture: new THREE.Uniform(null),
        uPictureTexture2: new THREE.Uniform(null),
        mixValue: new THREE.Uniform(0),
        uTime: new THREE.Uniform(1),
    })

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace
        uniforms.current.uPictureTexture.value = texture

        texture2.colorSpace = THREE.SRGBColorSpace
        uniforms.current.uPictureTexture2.value = texture2
    }, [texture, texture2])

    useEffect(() => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
    }, [gl])

    useFrame(({ clock }) => {
        uniforms.current.uTime = clock.getElapsedTime();
    })

    useEffect(() => {
        /**
         * 
         * @param { WheelEvent } event
         */
        const handleWheel = (event) => {
            const direction = event.deltaY > 0 ? 1.2 : 1.1
            console.log(event.deltaY)
            if ( currentDirection.current === direction ) return
            currentDirection.current = direction;
            const duration = 1.0;
            const scaleOut = 1.2;
            const scaleIn = 1.1;
            if (meshRef.current) {
                const timeline = gsap.timeline()
                timeline.to(meshRef.current.scale, {
                    x: scaleOut,
                    y: scaleOut,
                    duration,
                    ease: 'power2.out'
                })
                if (direction === 1.1) {
                    timeline.to(uniforms.current.mixValue, {
                        duration,
                        value: 1,
                        ease: CustomEase.create("custom", "M0,0 C0,0 0.2,-0.007 0.245,0.007 0.285,0.02 0.359,0.05 0.396,0.068 0.432,0.086 0.502,0.127 0.536,0.151 0.569,0.175 0.631,0.227 0.661,0.256 0.693,0.288 0.753,0.359 0.781,0.396 0.808,0.433 0.857,0.51 0.881,0.551 0.906,0.597 0.954,0.693 0.976,0.742 0.999,0.795 1,1 1,1 "),
                        // ease: CustomEase.create("custom", "M0,0 C0,0 0.028,0.215 0.045,0.276 0.051,0.299 0.061,0.326 0.07,0.34 0.076,0.351 0.07,0.356 0.1,0.375 0.25,0.472 0.71,0.543 0.875,0.612 0.907,0.626 0.906,0.626 0.915,0.634 0.925,0.644 0.939,0.67 0.945,0.683 0.952,0.699 0.96,0.729 0.965,0.751 0.977,0.807 1,1 1,1 "),
                        // ease: CustomEase.create("custom", "M0,0 C0,0 0.14,0.033 0.185,0.048 0.224,0.061 0.298,0.091 0.335,0.109 0.371,0.127 0.441,0.168 0.475,0.192 0.508,0.216 0.57,0.268 0.6,0.297 0.632,0.329 0.692,0.4 0.72,0.437 0.747,0.474 0.796,0.551 0.82,0.592 0.845,0.638 0.893,0.734 0.915,0.783 0.938,0.836 1,1 1,1 "),
                    }, 0.1)
                } else {
                    timeline.to(uniforms.current.mixValue, {
                        duration,
                        value: 0,
                        ease: CustomEase.create("custom", "M0,0 C0,0 0.2,-0.007 0.245,0.007 0.285,0.02 0.359,0.05 0.396,0.068 0.432,0.086 0.502,0.127 0.536,0.151 0.569,0.175 0.631,0.227 0.661,0.256 0.693,0.288 0.753,0.359 0.781,0.396 0.808,0.433 0.857,0.51 0.881,0.551 0.906,0.597 0.954,0.693 0.976,0.742 0.999,0.795 1,1 1,1 ")
                        // ease: CustomEase.create("custom", "M0,0 C0,0 0.028,0.215 0.045,0.276 0.051,0.299 0.061,0.326 0.07,0.34 0.076,0.351 0.07,0.356 0.1,0.375 0.25,0.472 0.71,0.543 0.875,0.612 0.907,0.626 0.906,0.626 0.915,0.634 0.925,0.644 0.939,0.67 0.945,0.683 0.952,0.699 0.96,0.729 0.965,0.751 0.977,0.807 1,1 1,1 ")
                        // ease: CustomEase.create("custom", "M0,0 C0,0 0.14,0.033 0.185,0.048 0.224,0.061 0.298,0.091 0.335,0.109 0.371,0.127 0.441,0.168 0.475,0.192 0.508,0.216 0.57,0.268 0.6,0.297 0.632,0.329 0.692,0.4 0.72,0.437 0.747,0.474 0.796,0.551 0.82,0.592 0.845,0.638 0.893,0.734 0.915,0.783 0.938,0.836 1,1 1,1 "),
                    }, 0.1)
                } 
                timeline.to(meshRef.current.scale, {
                    x: scaleIn,
                    y: scaleIn,
                    duration,
                    ease: 'power2.out'
                })
            }
        }
        window.addEventListener('wheel', handleWheel)

        return () => window.removeEventListener('wheel', handleWheel)
    }, [])



    return <>
        <mesh 
        ref={meshRef}
        scale={[1.1, 1.1, 1]}
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