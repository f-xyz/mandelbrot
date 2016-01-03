#define PI 3.14159265

uniform vec2 size;
uniform vec3 pos; // pan / zoom
uniform vec3 config; // iterations limit etc.

void main() {

    float ratio = size.x / size.y;
    vec2 p = gl_FragCoord.xy / size; // [0; 1]
    vec2 center = vec2(3.5*p.x - 2.5, 2.0*p.y - 1.0);

//    gl_FragColor = vec4(p.x, p.y, ratio, 1.);
//    return;

    center /= exp(pos.z);
    center += vec2(pos.x/ratio, pos.y);

//    center = 1111;
//    gl_FragColor = vec4(p.x, p.y, 0, 1.);
//    return;

    vec2 point = center;
    float distToCenter = length(p);

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
//            float light = i / config.x * distToCenter;
            float light = i + 1. - log(log(abs(z)) / log(2.));
            light /= 100.0; // max iterations
//            light *= 10.;
            float b = 1.;
            gl_FragColor = vec4(
                1.*b*light,
                1.*b*light,
                2.*b*light,
                1.
            );
            break;
        }
    }
}
