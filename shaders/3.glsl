#define PI 3.14159265
#define abssin(x) abs(sin(x))

uniform float n;
uniform float zoom;
uniform vec2 size;
uniform vec2 mouse;

void main() {

    float ratio = size.x / size.y; 
    vec2 p = gl_FragCoord.xy / size;
    vec2 c = vec2(
        3.5*p.x - 2.5 + 0.0*mouse.x*ratio, 
        2.0*p.y - 1.0 - 0.0*mouse.y
    );
    
    //c -= zoom.xy;
    //c *= zoom;
    
    // float cosT = cos(PI*mouse.x);
    // float sinT = sin(PI*mouse.x);
    // c = c * mat2(cosT, -sinT, 
    //              sinT, cosT);
    
    //c += zoom.xy;
    
    vec2 z = c;
    
    gl_FragColor = vec4(0.0);

    for (float i = 0.0; i > -1.0; i += 1.0) {
        if (i > n) break;
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if (dot(z,z) > 4.0) {
            float q = length(p)/sqrt(2.0);
            float f = i/n*length(p);
            gl_FragColor = vec4(
                f,
                f, 
                f * (0.2+2.0+log(i)),
                1.0);
            break;
        }
    }
}
