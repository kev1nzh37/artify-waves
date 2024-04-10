#version 300 es

precision mediump float;

uniform vec2      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)
uniform float     iTimeDelta;            // render time (in seconds)
uniform float     iFrameRate;            // shader frame rate
uniform int       iFrame;                // shader playback frame
uniform float     iChannelTime[4];       // channel playback time (in seconds)
uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
uniform sampler2D iChannel0;          // input channel. XX = 2D/Cube
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform vec4      iDate;                 // (year, month, day, time in seconds)
uniform float     iSampleRate;           // sound sample rate (i.e., 44100)


out vec4 FragColor;

#define STEP1(x) ((x) - sin(x))
#define STEP(x, offset, amp) (STEP1(STEP1(offset + x * amp)) * .15)
#define is (iTime * 2.)
#define t1p1 (STEP(is, 0., 3.))
#define t1p2 (STEP(is, 3., 3.))
#define t1p3 (STEP(is, 2., 4.))
#define t1p4 (STEP(is, 1., 3.))
#define t1p5 (STEP(is, 1., 3.))
#define t2p1 (STEP(is, 4., 2.))
#define t2p2 (STEP(is, 3., 4.))
#define t2p3 (STEP(is, 1., 4.))
#define t2p4 (STEP(is, 4., 4.))
#define t2p5 (STEP(is, 3., 4.))

#define moveFWD (iTime*.4)
#define icolor (sin(iTime * .1))
#define imoveFWD (moveFWD)
#define apo1 icolor
#define subnaut (iTime * .1)

#define PI              3.141592654
#define TAU             (2.0*PI)
#define RESOLUTION      iResolution
#define ROT(a)          mat2(cos(a), sin(a), -sin(a), cos(a))
#define PSIN(x)         (0.5+0.5*sin(x))
#define LESS(a,b,c)     mix(a,b,step(0.,c))
#define SABS(x,k)       LESS((.5/(k))*(x)*(x)+(k)*.5,abs(x),abs(x)-(k))
#define L2(x)           dot(x, x)


// CHANGED: blueish corection
const vec3 std_gamma        = vec3(1.2, 1.2, 1.4);

float hash(float co) {
  return fract(sin(co*12.9898) * 13758.5453);
}

vec2 toPolar(vec2 p) {
  return vec2(length(p), atan(p.y, p.x));
}

vec2 toRect(vec2 p) {
  return vec2(p.x*cos(p.y), p.x*sin(p.y));
}

float modMirror1(inout float p, float size) {
  float halfsize = size*0.5;
  float c = floor((p + halfsize)/size);
  p = mod(p + halfsize,size) - halfsize;
  p *= mod(c, 2.0)*2.0 - 1.0;
  return c;
}

float smoothKaleidoscope(inout vec2 p, float sm, float rep) {
  vec2 hp = p;

  vec2 hpp = toPolar(hp);
  float rn = modMirror1(hpp.y, TAU/rep);

  float sa = PI/rep - SABS(PI/rep - abs(hpp.y), sm);
  hpp.y = sign(hpp.y)*(sa);

  hp = toRect(hpp);

  p = hp;

  return rn;
}

vec4 alphaBlend(vec4 back, vec4 front) {
  float w = front.w + back.w*(1.0-front.w)*0.1;
  vec3 xyz = (front.xyz*front.w + back.xyz*back.w*(1.0-front.z))/w;
  return w > 0.0 ? vec4(xyz, w) : vec4(0.0);
}

vec3 alphaBlend(vec3 back, vec4 front) {
  return mix(back, front.xyz, front.w);
}

float tanh_approx(float x) {
 return tanh(x);
 
}

float pmin(float a, float b, float k) {
  float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0);

  return mix(b, a, h) - k*h*(1.0-h);
}

vec3 hsv2rgb(vec3 c) {
  const vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// CHANGED: added apo1 param
float apollian(vec4 p, float s) {
  float scale = 1.0;

  for(int i=0; i<7; ++i) {
    p = -1.0 + 2.0*fract(0.5*p+0.5);

    float r2 = dot(p,p);
    float k  = s/r2;
    scale   *= k;

    if (i == 0) {
      k += 1. + .5 ;
    }
    p       *= k;
  }

  return abs(p.x)/scale;
}

vec2 mod2_1(inout vec2 p) {
  vec2 c = floor(p + 0.5);
  p = fract(p + 0.5) - 0.5;
  return c;
}

float hex(vec2 p, float r) {
  const vec3 k = vec3(-sqrt(3.0)/2.0,1.0/2.0,sqrt(3.0)/3.0);
  p = p.yx;
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

float circle(vec2 p, float r) {
  return length(p) - r;
}

// -----------------------------------------------------------------------------
// PATH
// -----------------------------------------------------------------------------

// The path function
vec3 offset(float z) {
  float a = z * 0.2* .05;
  vec2 p = vec2(2,1.);
  return vec3(p, z);
}

// The derivate of the path function
//  Used to generate where we are looking
vec3 doffset(float z) {
  float eps = 0.01;
  return 0.5*(offset(z + eps) - offset(z - eps))/eps;
}

// The second derivate of the path function
//  Used to generate tilt
vec3 ddoffset(float z) {
  float eps = 0.1;
  return 0.00125*(doffset(z + eps) - doffset(z - eps))/eps;
}

// -----------------------------------------------------------------------------
// PLANE MARCHER
// -----------------------------------------------------------------------------

// CHANGED: added per plane variations
float weird(vec2 p, float h, float plane_number) {
  float z = 4.0;

  int plane_int = int(plane_number) % 2;
  float plane_tm = 0.;
  float plane_sq = 0.;
  float plane_sq2 = 0.;
 

  float tm = h*10.0 + plane_tm * .1;

  float r = 0.5;
  vec4 off = vec4(r*PSIN(tm*sqrt(3.0) + plane_sq * .3),
                  r*PSIN(tm*sqrt(2.5) + plane_sq * .3),
                  r*PSIN(tm*sqrt(1.0)), 0.0) * sin(subnaut);
  vec4 pp = vec4(p.x, p.y, 0.0, 0.0)+off;

 
 
  float d = apollian(pp, 0.8+h);
  return d*z;
}

float circles(vec2 p) {
  vec2 pp = toPolar(p);
  const float ss = 0.25;

  p = toRect(pp);
  float d = circle(p, 1.0);
  return d;
}

float onionize(float d) {
  d = abs(d) - 0.02;
  d = abs(d) - 0.005;
  d = abs(d) - 0.0025;
  return d;
}

vec2 df(vec2 p, float h, float plane_number) {
  vec2 wp = p;
  float rep = 10.0;
  float ss = 0.05*6.0/rep;
  float n = smoothKaleidoscope(wp, ss, rep);

  float d0 = weird(wp, h, plane_number);
  d0 = onionize(d0);
  float d1 = hex(p, 0.25)-0.1;
  float d2 = circles(p);
  const float lw = 0.01;
  d2 = abs(d2)-lw;
  float d  = pmin(pmin(d0, d2, 0.1), abs(d1)-lw, 0.05);
  return vec2(d, d1+lw);
}

// Plane generating function returns rgba
//  pp is point on plane
//  off is path at plane z
//  aa is estimated pixel size at the plane
//  n is plane number
// CHANGED: added per plane rotations
vec4 plane(vec3 ro, vec3 rd, vec3 pp, vec3 off, float aa, float n) {
  float h = hash(n);
  float s = 0.25*mix(0.5, 0.25, 0.);
  float dd= length(pp-ro);

  const vec3 nor  = vec3(0.0, 0.0, 1.0);
  const vec3 loff = vec3(0.25*0.5, 0.125*0.5, -0.125);
  vec3 lp1  = ro + loff;
  vec3 lp2  = ro + loff*vec3(-1.0, 1.0, 1.0);


  vec3 ref  = reflect(rd, nor);


  vec3  col1= vec3(0.75, 0.5, 1.0);
  vec3  col2= vec3(1.0, 0.5, 0.75);

  vec3 hn;
  vec2 p = (pp-off*vec3(1.0, 1.0, 0.0)).xy;

  float prot;
  int roti = int(round(n)) % 3;
 

 

  vec2 d2 = df(p/s, h, n)*s*1.5;

  float ha = smoothstep(-aa, aa, d2.y);
  float d = d2.x;
  vec4 col = vec4(0.0);

  float l   = length(10.0*p);
  float ddf = 1.0/((1.0+2.0*dd));
  float hue = (0.75*l)+0.3+2.*icolor;
  float sat = 0.75*tanh_approx(2.0*l)*ddf;
  float vue = sqrt(ddf);
  vec3 hsv  = vec3(hue + icolor * 2., sat, vue);
  vec3 bcol = hsv2rgb(hsv);
  col.xyz   = mix(col.xyz, bcol, smoothstep(-aa, aa, -d));
  float glow = (exp(-(10.0+100.0*tanh_approx(l))*10.0*max(d, 0.0)*ddf));
  col.xyz   += 0.5*sqrt(bcol.zxy)*glow;
  col.w     = ha*mix(0.75, 1.0, ha*glow);


  return col;
}

vec3 skyColor(vec3 ro, vec3 rd) {
  float ld = max(dot(rd, vec3(0.0, 0.0, 1.0)), 0.0);
  return 1.25*vec3(.0, 0.1, 0.2)*vec3(tanh_approx(3.0*pow(ld, 100.0)));
}

vec3 color(vec3 ww, vec3 uu, vec3 vv, vec3 ro, vec2 p) {
  float lp = length(p);
  vec2 np = p + 1.0/RESOLUTION.xy;
  float rdd = (2.0+0.6);  // Playing around with rdd can give interesting distortions
  vec3 rd = normalize(p.x*uu + p.y*vv + rdd*ww);
  vec3 nrd = normalize(np.x*uu + np.y*vv + rdd*ww);

  const float planeDist = 1.0-0.75;
  const int furthest = 8;
  const int fadeFrom = max(furthest-3, 0);
  const float fadeDist = planeDist*float(furthest - fadeFrom);
  float nz = floor(ro.z / planeDist);

  vec3 skyCol = skyColor(ro, rd);

  // Steps from nearest to furthest plane and accumulates the color

  vec4 acol = vec4(0.0);
  const float cutOff = 0.95;
  bool cutOut = false;

  for (int i = 1; i <= furthest; ++i) {
    float pz = planeDist*nz + planeDist*float(i);

    float pd = (pz - ro.z)/rd.z;

    if (pd > 0.0 && acol.w < cutOff) {
      vec3 pp = ro + rd*pd;
      vec3 npp = ro + nrd*pd;

      float aa = 3.0*length(pp - npp);

      vec3 off = offset(pp.x);

      vec4 pcol = plane(ro, rd, pp, off, aa, nz+float(i));

      float nz = pp.z-ro.z;
      float fadeIn = exp(-2.5*max((nz - planeDist*float(fadeFrom))/fadeDist, 0.0));
      float fadeOut = smoothstep(0.0, planeDist*0.1, nz);
      pcol.xyz = mix(skyCol, pcol.xyz, (fadeIn));
      

      pcol = clamp(pcol, 0.0, 1.0);

      acol = alphaBlend(pcol, acol);
    } else {
      cutOut = true;
      break;
    }

  }

  vec3 col = alphaBlend(skyCol, acol);
// To debug cutouts due to transparency
//  col += cutOut ? vec3(1.0, -1.0, 0.0) : vec3(0.0);
  return col;
}

// Classic post processing
vec3 postProcess(vec3 col, vec2 q) {
  col = clamp(col, 0.0, 1.0);
  col = pow(col, 1.0/std_gamma);
  col = col*0.6+0.4*col*col*(3.0-2.0*col);
  col = mix(col, vec3(dot(col, vec3(0.33))), -0.4);
  col *=0.5+0.5*pow(19.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.7);
  return col;
}

vec3 effect(vec2 p, vec2 q) {
  float tm  = imoveFWD*0.005;
  vec3 ro   = offset(tm);
  vec3 dro  = doffset(tm);
  vec3 ddro = ddoffset(tm);

  vec3 ww = normalize(dro);
  vec3 uu = normalize(cross(normalize(vec3(cos(iTime*0.1),sin(iTime*0.1),iTime)), ww));
  vec3 vv = normalize(cross(ww, uu));

  vec3 col = color(ww, uu, vv, ro, p);
  col = postProcess(col, q);
  return col;
}

void main() {
  vec2 RESOLUTION = iResolution.xy;
  vec2 q = gl_FragCoord.xy/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  p.x *= RESOLUTION.x/RESOLUTION.y;

  vec3 col = effect(p, q);
  FragColor = vec4(col, 1.0);
}