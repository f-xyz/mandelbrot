#define PI 3.14159265

uniform float time;
uniform vec2 size;
uniform vec3 pos; // pan / zoom
uniform vec3 config; // iterations limit etc.

float abssin(float x) {
    return abs(sin(x));
}

void main() {

    float ratio = size.x / size.y;
    vec2 p = gl_FragCoord.xy / size; // [0; 1]
    vec2 center = vec2(3.5*p.x - 2.5, 2.0*p.y - 1.0); // [-2.5; 1] [-1, 1]

//    ratio = 1.;
//    center.x *= ratio;
//    center.y /= ratio;

    center += vec2(0.75, 0);
    center /= exp(pos.z /*+ 30.*abssin(time/1000.)*/);
    center += vec2(pos.x, pos.y);

    vec2 point = center;

    gl_FragColor = vec4(0.);

    for (float i = 0.; i >= 0.; i += 1.) {
        // iterations limit
        if (i > config.x) break;
        // x = x^2 - y^2 + x0
        // y = 2xy + y0
        point = vec2(point.x*point.x - point.y*point.y, 2.0*point.x*point.y) + center;
        // x^2 + y^2 > 4
        float z = dot(point, point);
        if (z > 4.0) {
            float light = i + 1. - log(log(abs(z)) / log(2.));
            light /= 100.0; // max iterations
            gl_FragColor = vec4(light, light, 2.*light, 1.);
            break;
        }
    }

    if (distance(vec2(.5, .5), gl_FragCoord.xy / size) < 0.0025) {
        gl_FragColor = vec4(1, 0, 1, 1);
    }

}
