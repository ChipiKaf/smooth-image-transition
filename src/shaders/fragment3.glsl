uniform sampler2D uPictureTexture;
uniform sampler2D uPictureTexture2;
uniform sampler2D uDisplacementTexture;

uniform float uIntensity1;
uniform float uIntensity2;

uniform float uAngle1;
uniform float uAngle2;

uniform float uMixValue;
uniform float uMixValue2;

mat2 getRotationMatrix(float angle) {
    float c = cos(angle);
    float s = sin(angle);

    return mat2(c, -s, s, c );
}

varying vec2 vUv;
void main()
{
    vec4 disp = texture2D(uDisplacementTexture, vUv);
    vec2 dispVec = vec2(disp.r, disp.g);

    vec2 distortedPosition1 = vUv + getRotationMatrix(uAngle1) * dispVec * uIntensity1 * (1.0 - uMixValue2);
    vec2 distortedPosition2 = vUv + getRotationMatrix(uAngle2) * dispVec * uIntensity2 * uMixValue2;

    vec4 _uPictureTexture = texture2D(uPictureTexture, distortedPosition1);
    vec4 _uPictureTexture2 = texture2D(uPictureTexture2, distortedPosition2);

    
    float localMix = smoothstep(uMixValue - 0.1, uMixValue + 0.1, vUv.x - ((2.0 * uMixValue - 1.0) / 10.0));
    vec4 mixture = mix(_uPictureTexture, _uPictureTexture2, localMix);
    
    gl_FragColor = mixture;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}