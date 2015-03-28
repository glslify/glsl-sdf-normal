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

  float sphere = length(p - vec3(0, 0.75, 0)) - 1.0;

  return vec2(smin(ground, sphere, 0.5), 0.0);
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

    col = nor * 0.5 + 0.5;
  }

  gl_FragColor = vec4( col, 1.0 );
}
