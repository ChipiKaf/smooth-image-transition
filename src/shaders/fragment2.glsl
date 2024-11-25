varying vec2 vUv;

uniform float uMixValue;
uniform float uMixValue2;
uniform sampler2D uDisplacementTexture;

uniform sampler2D uPictureTexture;
uniform sampler2D uPictureTexture2;
uniform float uAngle1;
uniform float uAngle2;
uniform float uIntensity1;
uniform float uIntensity2;


mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec4 disp = texture2D(uDisplacementTexture, vUv);
  vec2 dispVec = vec2(disp.r, disp.g);

  vec2 distortedPosition1 = vUv + getRotM(uAngle1) * dispVec * uIntensity1 * uMixValue2;
  vec2 distortedPosition2 = vUv + getRotM(uAngle2) * dispVec * uIntensity2 * (1.0 - uMixValue2);

  vec4 _uPictureTexture = texture2D(uPictureTexture, distortedPosition1);
  vec4 _uPictureTexture2 = texture2D(uPictureTexture2, distortedPosition2);
  gl_FragColor = mix(_uPictureTexture, _uPictureTexture2, uMixValue);
}