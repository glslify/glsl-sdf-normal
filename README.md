# glsl-sdf-normal

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Get the normal vector of a position within a signed distance field.

## Usage

[![NPM](https://nodei.co/npm/glsl-sdf-normal.png)](https://nodei.co/npm/glsl-sdf-normal/)

### `getNormal = require(glsl-sdf-normal, <map>)`

Loads the `getNormal` function into your shader. Note that `map`
is required to be defined when using this module.

#### `vec2 map(vec3 position)`

Your signed distance function, responsible for defining the
solid shapes in your scene. Accepts `position`, and returns
a `vec2` – see [glsl-raytrace](http://github.com/stackgl/glsl-raytrace)
for more guidance :)

``` glsl
vec2 doModel(vec3 p);

#pragma glslify: getNormal = require('glsl-sdf-normal', map = doModel)

vec2 doModel(vec3 position) {
  float radius  = 1.0;
  float dist    = length(position) - radius;
  float objType = 1.0;

  return vec2(dist, objType);
}
```

### `vec3 getNormal(vec3 position)`

Gets the normal vector for the provided `position`.

### `vec3 getNormal(vec3 position, float epsilon)`

Optionally, you may pass in a custom `epsilon` value, which
determines the granularity at which to sample the field.
Defaults to 0.002.

## Contributing

See [stackgl/contributing](https://github.com/stackgl/contributing) for details.

## License

MIT. See [LICENSE.md](http://github.com/stackgl/glsl-sdf-normal/blob/master/LICENSE.md) for details.
