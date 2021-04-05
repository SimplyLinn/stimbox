import { useEffect, useState } from 'react';
import { useViewport } from 'stimbox';
import { Viewport } from 'stimbox/Components/ViewportContextProvider';

const NUM_BALLS = 200;
const DRAG = 0.7;
const MAX_VEL = 1000;
const TIMESCALE = 0.3;
const FORCE_CONSTANT = 1;
const WALL_CHARGE = 32 ** 2 * Math.PI;

const SVG_NS = 'http://www.w3.org/2000/svg';

export default function TestBox(): JSX.Element {
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [gRef, setGRef] = useState<SVGGElement | null>(null);
  const [[setBBox], setBBoxCb] = useState([(_bbox: Viewport) => {}]);
  useEffect(() => {
    if (svgRef == null || gRef == null) return undefined;
    // const svgEl = svgRef;
    const gEl = gRef;
    const cursorBall = {
      // el: document.createElementNS(SVG_NS, 'circle'),
      r: 32,
      m: 64 ** 2 * Math.PI,
      x: -64,
      y: -64,
    };
    // cursorBall.el.setAttributeNS(null, 'fill', 'blue');
    // cursorBall.el.setAttributeNS(null, 'r', `${cursorBall.r}`);
    // cursorBall.el.setAttributeNS(null, 'cx', `${cursorBall.x}`);
    // cursorBall.el.setAttributeNS(null, 'cy', `${cursorBall.y}`);
    // svgEl.appendChild(cursorBall.el);
    let width = NaN;
    let height = NaN;
    let clientXOffset = 0;
    let clientYOffset = 0;
    let animating = false;
    let onScreen = false;
    const balls: {
      x: number;
      y: number;
      r: number;
      m: number;
      vx: number;
      vy: number;
      el: SVGCircleElement;
    }[] = [];
    let lastT: number | null = null;
    function animationFrame(t: number): void {
      if (!animating) {
        lastT = null;
        return;
      }
      if (lastT == null) {
        lastT = t;
        requestAnimationFrame(animationFrame);
        return;
      }
      // cursorBall.el.setAttributeNS(null, 'cx', `${cursorBall.x}`);
      // cursorBall.el.setAttributeNS(null, 'cy', `${cursorBall.y}`);
      const deltaT = t - lastT;
      lastT = t;

      balls.forEach((ball, i) => {
        /* eslint-disable no-param-reassign */
        for (let ii = i + 1; ii < balls.length; ii++) {
          const ball2 = balls[ii];
          const diffY = Math.max(
            Math.abs(ball2.y - ball.y),
            Math.min(ball.r, ball2.r),
          );
          const diffX = Math.max(
            Math.abs(ball2.x - ball.x),
            Math.min(ball.r, ball2.r),
          );
          const scale = TIMESCALE / Math.max(diffY, diffX);
          const force =
            (ball.m * ball2.m * FORCE_CONSTANT) /
            Math.abs(diffX ** 2 + diffY ** 2);
          const xSign = Math.sign(ball2.x - ball.x) || 1;
          const ySign = Math.sign(ball2.y - ball.y) || 1;
          const dvX = (xSign * (force * diffX * scale)) / deltaT;
          const dvY = (ySign * (force * diffY * scale)) / deltaT;
          ball.vx -= dvX;
          ball.vy -= dvY;
          ball2.vx += dvX;
          ball2.vy += dvY;
        }
        if (onScreen) {
          const ball2 = cursorBall;
          const diffY = Math.max(
            Math.abs(ball2.y - ball.y),
            Math.min(ball.r, ball2.r),
          );
          const diffX = Math.max(
            Math.abs(ball2.x - ball.x),
            Math.min(ball.r, ball2.r),
          );
          const scale = TIMESCALE / Math.max(diffY, diffX);
          const force =
            (ball.m * ball2.m * FORCE_CONSTANT) /
            Math.abs(diffX ** 2 + diffY ** 2);
          const xSign = Math.sign(ball2.x - ball.x) || 1;
          const ySign = Math.sign(ball2.y - ball.y) || 1;
          ball.vx -= (xSign * (force * diffX * scale)) / deltaT;
          ball.vy -= (ySign * (force * diffY * scale)) / deltaT;
        }
        const { y } = ball;
        const invY = height - y;
        const { x } = ball;
        const invX = width - x;
        const forceX1 =
          (ball.m * WALL_CHARGE * TIMESCALE * FORCE_CONSTANT) /
          Math.abs(x ** 2);
        const forceX2 =
          (ball.m * WALL_CHARGE * TIMESCALE * FORCE_CONSTANT) /
          Math.abs(invX ** 2);
        const forceY1 =
          (ball.m * WALL_CHARGE * TIMESCALE * FORCE_CONSTANT) /
          Math.abs(y ** 2);
        const forceY2 =
          (ball.m * WALL_CHARGE * TIMESCALE * FORCE_CONSTANT) /
          Math.abs(invY ** 2);
        ball.vx += (forceX1 - forceX2) / deltaT;
        ball.vy += (forceY1 - forceY2) / deltaT;
        if (ball.x >= width - ball.r) {
          ball.x = width - ball.r;
          ball.vx = ball.vx > 0 ? -ball.vx : ball.vx;
        }
        if (ball.x <= 0 + ball.r) {
          ball.x = ball.r;
          ball.vx = -Math.abs(ball.vx);
          ball.vx = ball.vx < 0 ? -ball.vx : ball.vx;
        }
        if (ball.y >= height - ball.r) {
          ball.y = height - ball.r;
          ball.vy = ball.vy > 0 ? -ball.vy : ball.vy;
        }
        if (ball.y <= 0 + ball.r) {
          ball.y = ball.r;
          ball.vy = -Math.abs(ball.vy);
          ball.vy = ball.vy < 0 ? -ball.vy : ball.vy;
        }
        ball.vx = Math.max(Math.min(ball.vx, MAX_VEL), -MAX_VEL);
        ball.vy = Math.max(Math.min(ball.vy, MAX_VEL), -MAX_VEL);
        ball.x += (ball.vx * TIMESCALE) / deltaT;
        ball.y += (ball.vy * TIMESCALE) / deltaT;
        ball.el.setAttributeNS(null, 'cx', `${ball.x}`);
        ball.vx *= Math.max(
          1 - (DRAG * ball.vx ** 2 * TIMESCALE) / (deltaT * MAX_VEL ** 2),
          0,
        );
        ball.el.setAttributeNS(null, 'cy', `${ball.y}`);
        ball.vy *= Math.max(
          1 - (DRAG * ball.vy ** 2 * TIMESCALE) / (deltaT * MAX_VEL ** 2),
          0,
        );
        /* eslint-enable no-param-reassign */
      });
      requestAnimationFrame(animationFrame);
    }
    function spawnBalls(w: number, h: number) {
      animating = true;
      for (let i = 0; i < NUM_BALLS; i++) {
        const r = 12;
        const x = Math.floor(Math.random() * w - r * 2) + r;
        const y = Math.floor(Math.random() * h - r * 2) + r;
        const el = document.createElementNS(SVG_NS, 'circle');
        el.setAttributeNS(null, 'fill', 'red');
        el.setAttributeNS(null, 'r', r.toFixed(0));
        el.setAttributeNS(null, 'cx', x.toFixed(0));
        el.setAttributeNS(null, 'cy', y.toFixed(0));
        gEl.appendChild(el);
        balls.push({
          x,
          y,
          r,
          m: r ** 2 * Math.PI,
          vx: Math.random() < 0.5 ? -10 : 10,
          vy: Math.random() < 0.5 ? -10 : 10,
          el,
        });
      }
      requestAnimationFrame(animationFrame);
    }
    function clearBalls() {
      balls.forEach(({ el }) => el.remove());
      balls.length = 0;
      animating = false;
    }
    function setDimensions({
      width: newWidth,
      height: newHeight,
      top,
      left,
    }: {
      width: number;
      height: number;
      top: number;
      left: number;
    }) {
      if (Number.isNaN(newWidth) || Number.isNaN(newHeight)) {
        clearBalls();
      } else if (Number.isNaN(width) || Number.isNaN(height)) {
        spawnBalls(newWidth, newHeight);
      }
      clientXOffset = left;
      clientYOffset = top;
      width = newWidth;
      height = newHeight;
    }
    setBBoxCb([setDimensions]);
    function updateCursorBall(ev: MouseEvent) {
      onScreen = true;
      cursorBall.x = ev.clientX - clientXOffset;
      cursorBall.y = ev.clientY - clientYOffset;
    }
    function onOffScreen() {
      onScreen = false;
    }
    window.addEventListener('mousemove', updateCursorBall, { passive: true });
    document.addEventListener('mouseout', onOffScreen, { passive: true });
    return () => {
      window.removeEventListener('mousemove', updateCursorBall);
      document.removeEventListener('mouseout', onOffScreen);
      animating = false;
      clearBalls();
      // cursorBall.el.remove();
      setBBoxCb([() => {}]);
    };
  }, [svgRef, gRef]);
  const bbox = useViewport();
  useEffect(() => {
    setBBox(bbox);
  }, [bbox, setBBox]);
  return (
    <svg
      width={bbox.width}
      height={bbox.height}
      viewBox={`0 0 ${bbox.width} ${bbox.height}`}
      fill="none"
      xmlns={SVG_NS}
      ref={setSvgRef}
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur stdDeviation="10" />
          <feColorMatrix
            values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 30 -7"
          />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation="1" />
        </filter>
      </defs>
      <g ref={setGRef} filter="url(#goo)" />
    </svg>
  );
}
