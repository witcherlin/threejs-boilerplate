uniform vec3 uStart;
uniform vec3 uColor;
uniform float uDistance;
uniform float uOpacity;
uniform float uAlpha;
uniform int uState;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vView;

void main() {
    vec2 uv = vUv;
    vec3 position = normalize(vPosition) * 1.0;
    vec3 normal = normalize(vNormal);
    vec3 vector = normalize((viewMatrix * vec4(cameraPosition, 0.0)).xyz);
    vec3 view = vView;

   vec3 color = uColor;
   vec3 start = uStart;

   float dist = distance(start, vPosition) / uDistance;

   if (uState == 1) {
       if (uv.x >= uAlpha) {
           discard;
       }
   } else if (uState == 2) {
       dist = (1.15 - uAlpha) * dist;

       if (uv.x <= uAlpha) {
           discard;
       }
   }

   gl_FragColor = vec4(color, dist * uOpacity);
}
