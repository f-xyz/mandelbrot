
#define PI 3.14159265
#define E  2.71828182
#define abssin(x) abs(sin(x))

uniform vec3 args;
uniform vec2 zoom;
uniform vec2 size;
uniform vec2 mouse;
uniform vec2 pos;

void main() {

    float ratio = size.x / size.y;
    vec2 p = gl_FragCoord.xy / size;
    vec2 c = vec2(
        3.5*p.x - 2.5,
        2.0*p.y - 1.0
    );

    // zoom & pan
    c /= exp(zoom.x) / E;
    c += vec2(pos.x*ratio, pos.y);

    vec2 z = c;

    //
    float dist = length(p - 0.5);

    gl_FragColor = vec4(0.0);

    for (float i = 0.0; i > -1.0; i += 1.0) {

        // iterations limit
        if (i > args.x) break;

        // x = x^2 + x0
        // y = 2xy + y0
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;

        // x^2 + y^2 > 4
        if (dot(z,z) > 4.0) {

            // coloring
            float f = (i/args.x - log(dist / log(2.0)));
            
            gl_FragColor = vec4(
                f,
                f,
                f,
                1.0
            );

            break;
        }
    }
}
