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
    vec2 center = vec2 (
        3.5*p.x - 2.5,
        2.0*p.y - 1.0
    );

    center /= exp(zoom.x) / E;
    center += vec2(pos.x*ratio, pos.y);

     //float cosT = cos(PI*mouse.x);
     //float sinT = sin(PI*mouse.x);
     //c = c * mat2(cosT, -sinT,
     //             sinT, cosT);

    //c += zoom.xy;

    vec2 point = center;

    //
    float distToCenter = length(p);

    gl_FragColor = vec4(0.0);

    for (float i = 0.0; i > -1.0; i += 1.0) {
        // iterations limit
        if (i > args.x) break;
        // x = x^2 - y^2 + x0
        // y = 2xy + y0
        point = vec2(point.x*point.x - point.y*point.y, 2.0*point.x*point.y) + center;
        // x^2 + y^2 > 4
        if (dot(point,point) > 4.0) {

            float f = i / args.x * distToCenter;
            gl_FragColor = vec4(
                f,
                f,
                f * (0.2+2.0+log(i)),
                1.0);
            break;
        }
    }
}
