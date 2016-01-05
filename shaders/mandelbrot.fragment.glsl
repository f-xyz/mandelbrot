#define PI 3.14159265

uniform float time;
uniform vec2 size;
uniform vec3 pos; // pan / zoom
uniform vec3 config; // x: iterations limit, y: show center

void main() {

    float ratio = size.x / size.y;
    vec2 p = gl_FragCoord.xy / size; // [0; 1]
    vec2 center = vec2(3.5*p.x - 2.5, 2.0*p.y - 1.0); // [-2.5; 1] [-1, 1]

    // omg
    center.x *= ratio / 2.;
    center += vec2(.375 * ratio, 0.); // .375 = -(-2.5 + 1) / 2 / 2
    center /= exp(pos.z);
    center += vec2(pos.x, pos.y);

    vec2 pixel = center;

    gl_FragColor = vec4(1.);

    for (float i = 0.; i >= 0.; i += 1.) {
        // iterations limit
        if (i > config.x) break;
        // x = x^2 - y^2 + x0
        // y = 2xy + y0
        pixel = vec2(pixel.x*pixel.x - pixel.y*pixel.y, 2.0*pixel.x*pixel.y) + center;
        // x^2 + y^2 > 4
        float z = dot(pixel, pixel);
        if (z > 4.0) {
            float light = i + 1. - log(log(abs(z)) / log(2.));
            light /= 100.;
            light = clamp(light, 0., 6.);
//            gl_FragColor = vec4(pos.z*light, light, 2.*light, 1.);
            gl_FragColor = vec4(sin(pos.z*light), light, 2.*light, 1.);
//            gl_FragColor = vec4(sin(light), light, cos(light), 1.);
            break;
        }
    }

    if (config.y > 0. && distance(vec2(.5, .5), p) < 0.0025) {
        gl_FragColor = vec4(0, 1, 0, 1);
    }

}
