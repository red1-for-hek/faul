import { useEffect, useRef } from "react";

const vsSource = `
  attribute vec4 aVertexPosition;
  void main() { gl_Position = aVertexPosition; }
`;

// Aether flow — soft flowing energy fields in deep-blue / cyan.
const fsSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;

  // 2D hash + value noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.08;

    // domain-warped fbm for the aether flow
    vec2 q = vec2(fbm(uv * 1.3 + vec2(0.0, t)),
                  fbm(uv * 1.3 + vec2(5.2, -t)));
    vec2 r = vec2(fbm(uv * 1.8 + 3.0 * q + vec2(1.7, 9.2) + t),
                  fbm(uv * 1.8 + 3.0 * q + vec2(8.3, 2.8) - t));
    float f = fbm(uv * 2.2 + 2.4 * r);

    // Deep-blue / cyan palette
    vec3 deep    = vec3(0.010, 0.020, 0.070);
    vec3 midnight= vec3(0.030, 0.080, 0.220);
    vec3 azure   = vec3(0.090, 0.360, 0.780);
    vec3 cyan    = vec3(0.380, 0.820, 1.000);

    vec3 col = mix(deep, midnight, smoothstep(0.0, 0.55, f));
    col = mix(col, azure, smoothstep(0.45, 0.85, f));
    col = mix(col, cyan,  smoothstep(0.75, 1.05, f + 0.15 * r.x));

    // subtle streaks
    float streak = smoothstep(0.55, 0.95, fbm(uv * 3.5 + r * 2.0 + t * 2.0));
    col += cyan * streak * 0.18;

    // vignette
    float v = smoothstep(1.15, 0.2, length(uv));
    col *= 0.35 + 0.75 * v;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aVertex = gl.getAttribLocation(program, "aVertexPosition");
    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const start = Date.now();
    let raf = 0;
    const render = () => {
      const t = (Date.now() - start) / 1000;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(aVertex, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aVertex);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={
        "fixed inset-0 -z-10 h-full w-full " + (className ?? "")
      }
      aria-hidden="true"
    />
  );
}
