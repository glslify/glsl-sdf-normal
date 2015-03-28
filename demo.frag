precision mediump float;

uniform vec2  iResolution;
uniform float iGlobalTime;

vec2 doModel(vec3 p);

#pragma glslify: getNormal = require('./', map = doModel)
#pragma glslify: raytrace  = require('glsl-raytrace', map = doModel, steps = 50)
#pragma glslify: noise     = require('glsl-noise/simplex/3d')
#pragma glslify: square    = require('glsl-square-frame')
#pragma glslify: smin      = require('glsl-smooth-min')
#pragma glslify: camera    = require('glsl-camera-ray')
#pragma glslify: fog       = require('glsl-fog')

vec2 doModel(vec3 p) {
  float ground = p.y
    - noise(vec3(p.xz * 1.113, iGlobalTime * 2.0)) * 0.05
    - noise(vec3(p.xz * 0.267, iGlobalTime * 0.5)) * 0.75;

  return vec2(ground, 0.0);
}

vec3 doMaterial(vec3 pos, vec3 nor) {
  return vec3(0.4, 0.768, 1.0).rbg * 0.5;
}

vec3 doLighting(vec3 pos, vec3 nor, vec3 rd, float dis, vec3 mal) {
  vec3 lin = vec3(0.0);

  vec3  lig = normalize(vec3(1.0,0.7,0.9));
  float dif = max(dot(nor,lig),0.0);

  lin += dif*vec3(2);
  lin += vec3(0.05);

  return mal*lin;
}

void main() {
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution);
  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, 2.0);

  vec3 col = vec3(0.95, 0.95, 1.215);
  vec2 t   = raytrace(rayOrigin, rayDirection);

  if (t.x > -0.5) {
    vec3 pos = rayOrigin + t.x * rayDirection;
    vec3 nor = getNormal(pos, 0.1);
    vec3 mal = doMaterial(pos, nor);
    vec3 lit = doLighting(pos, nor, rayDirection, t.x, mal);

    col = mix(lit, col, fog(t.x, 0.15));
  }

  col = pow(clamp(col,0.0,1.0), vec3(0.4545));

  gl_FragColor = vec4( col, 1.0 );
}
