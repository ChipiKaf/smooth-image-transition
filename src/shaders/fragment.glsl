varying vec2 vUv;
uniform sampler2D uPictureTexture;
uniform sampler2D uPictureTexture2;
uniform float mixValue;
uniform float uTime; // Add uTime uniform for animation (optional)

void main()
{
    // Define softness for the transition
    float softness = 0.1;

    // Determine the sign of the softness based on mixValue
    float signValue = mixValue > 0.99 ? -1.0 * softness : softness;

    // Calculate the local mix factor with softness
    float localMix = smoothstep(
        (mixValue - softness),
        (mixValue + softness),
        vUv.x
    );

    // Clamp the mix to prevent blending at edges
    localMix = clamp(localMix, 0.0, 1.0);

    // Calculate distortion amount based on localMix
    float distortionStrength = (1.0 - localMix) * 0.05; // Adjust 0.05 for desired strength

    // Create a distortion offset
    vec2 distortion = vec2(distortionStrength, distortionStrength); // Shift along x-axis

    // Optionally add randomness or noise for variation
    float noise = fract(sin(dot(vUv * uTime, vec2(12.9898,78.233))) * 43758.5453);
    distortion.x += (noise - 0.5) * 0.02; // Random variation

    // Sample both textures with and without distortion
    vec4 color1 = texture2D(uPictureTexture, vUv);
    vec4 color2 = texture2D(uPictureTexture2, vUv - distortion);

    // Blend the colors based on localMix
    gl_FragColor = mix(color1, color2, localMix);

    // Tone mapping and color corrections
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
