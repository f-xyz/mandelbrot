#define PI 3.14159265

uniform vec2 size;
uniform vec3 pos;
uniform vec3 config;

void main() {

    float ratio = size.x / size.y;
    vec2 p = gl_FragCoord.xy / size;
    vec2 center = vec2(3.5*p.x - 2.5, 2.0*p.y - 1.0);

    center /= exp(pos.z);
    center += vec2(pos.x/*/ratio*/, pos.y);

    vec2 point = center;
    float distToCenter = length(p);

    gl_FragColor = vec4(0.0);

    for (float i = 0.0; i >= 0.0; i += 1.0) {
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
