import { useEffect, useState } from 'react';
import { useViewport } from 'stimbox';
import * as PIXI from 'pixi.js';
import { Viewport } from 'stimbox/Components/ViewportContextProvider';

const NUM_BALLS = 200;
const DRAG = 0.01;
const MAX_VEL = 1000;
const TIMESCALE = 1500;
const FORCE_CONSTANT = 2;
const WALL_CHARGE = 32 ** 2 * Math.PI;

export default function TestBox(): JSX.Element {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [[setBBox], setBBoxCb] = useState([(_viewport: Viewport) => {}]);
  const bbox = useViewport();
  useEffect(() => {
    setBBox(bbox);
  }, [bbox, setBBox]);
  useEffect(() => {
    if (containerRef == null) return undefined;
    const container = containerRef;
    const [rd, gn, bl] = [0x99, 0x66, 0xff].map((v) => v / 0xff);
    let mounted = true;
    let onScreen = false;
    let clientXOffset = 0;
    let clientYOffset = 0;
    let width = NaN;
    let height = NaN;
    let wallCharge = WALL_CHARGE;
    const balls: {
      x: number;
      y: number;
      r: number;
      m: number;
      vx: number;
      vy: number;
      gfx: PIXI.Graphics;
    }[] = [];

    const pixi = new PIXI.Application({
      width: container.clientWidth,
      height: container.clientHeight,
      resizeTo: container,
      backgroundAlpha: 0,
    });
    const blurFilter = new PIXI.filters.BlurFilter(10);
    const blobFilter = new PIXI.filters.ColorMatrixFilter();
    /* eslint-disable prettier/prettier */
    blobFilter.matrix = [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 30, -10
    ];
    /* eslint-enable prettier/prettier */
    const colorFilter = new PIXI.filters.ColorMatrixFilter();
    /* eslint-disable prettier/prettier */
    colorFilter.matrix = [
      rd, 0,  0,  0, 0,
      0,  gn, 0,  0, 0,
      0,  0,  bl, 0, 0,
      0,  0,  0,  1, 0
    ];
    /* eslint-enable prettier/prettier */
    pixi.stage.filters = [blurFilter, blobFilter, colorFilter];
    container.appendChild(pixi.view);

    const cursorBall = {
      r: 128,
      m: 128 ** 2 * Math.PI,
      x: -64,
      y: -64,
    };

    let lastT: number | null = null;
    function animationFrame(t: number): void {
      if (!mounted) {
        lastT = null;
        return;
      }
      if (lastT == null) {
        lastT = t;
        requestAnimationFrame(animationFrame);
        return;
      }
      const deltaT = (t - lastT) / TIMESCALE;
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
          const scale = 1 / Math.max(diffY, diffX);
          const force =
            (ball.m * ball2.m * FORCE_CONSTANT) /
            Math.abs(diffX ** 2 + diffY ** 2);
          const xSign = Math.sign(ball2.x - ball.x) || 1;
          const ySign = Math.sign(ball2.y - ball.y) || 1;
          const dvX = xSign * (force * diffX * scale) * deltaT;
          const dvY = ySign * (force * diffY * scale) * deltaT;
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
          const scale = 1 / Math.max(diffY, diffX);
          const force =
            (ball.m * ball2.m * FORCE_CONSTANT) /
            Math.abs(diffX ** 2 + diffY ** 2);
          const xSign = Math.sign(ball2.x - ball.x) || 1;
          const ySign = Math.sign(ball2.y - ball.y) || 1;
          ball.vx -= xSign * (force * diffX * scale) * deltaT;
          ball.vy -= ySign * (force * diffY * scale) * deltaT;
        }
        const { y } = ball;
        const invY = height - y;
        const { x } = ball;
        const invX = width - x;
        const forceX1 =
          (ball.m * wallCharge * FORCE_CONSTANT) / Math.abs(x ** 2);
        const forceX2 =
          (ball.m * wallCharge * FORCE_CONSTANT) / Math.abs(invX ** 2);
        const forceY1 =
          (ball.m * wallCharge * FORCE_CONSTANT) / Math.abs(y ** 2);
        const forceY2 =
          (ball.m * wallCharge * FORCE_CONSTANT) / Math.abs(invY ** 2);
        ball.vx += (forceX1 - forceX2) * deltaT;
        ball.vy += (forceY1 - forceY2) * deltaT;
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
        ball.x += ball.vx * deltaT;
        ball.y += ball.vy * deltaT;
        ball.gfx.x = ball.x;
        ball.vx *= Math.max(1 - DRAG * deltaT, 0);
        ball.gfx.y = ball.y;
        ball.vy *= Math.max(1 - DRAG * deltaT, 0);
        /* eslint-enable no-param-reassign */
      });
      requestAnimationFrame(animationFrame);
    }
    requestAnimationFrame(animationFrame);
    function spawnBalls(w: number, h: number) {
      for (let i = 0; i < NUM_BALLS; i++) {
        const r = 12;
        const x = Math.floor(Math.random() * w - r * 2) + r;
        const y = Math.floor(Math.random() * h - r * 2) + r;
        const gfx = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, r);
        gfx.endFill();
        gfx.x = x;
        gfx.y = y;
        pixi.stage.addChild(gfx);
        balls.push({
          x,
          y,
          r,
          m: r ** 2 * Math.PI,
          vx: Math.random() < 0.5 ? -10 : 10,
          vy: Math.random() < 0.5 ? -10 : 10,
          gfx,
        });
      }
    }
    function clearBalls() {
      balls.forEach(({ gfx }) => {
        pixi.stage.removeChild(gfx);
        gfx.removeAllListeners();
      });
      balls.length = 0;
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
      if (!mounted) return;
      if (
        pixi.renderer.height !== newHeight ||
        pixi.renderer.width !== newWidth
      ) {
        pixi.resize();
      }
      if (Number.isNaN(newWidth) || Number.isNaN(newHeight)) {
        clearBalls();
      } else if (Number.isNaN(width) || Number.isNaN(height)) {
        spawnBalls(newWidth, newHeight);
      }
      clientXOffset = left;
      clientYOffset = top;
      width = newWidth;
      height = newHeight;
      const area = Math.sqrt(width * height);
      balls.forEach((b) => (b.r ** 2 * Math.PI * area) / 1200);
      cursorBall.m = (cursorBall.r ** 2 * Math.PI * area) / 1200;
      wallCharge = (WALL_CHARGE * area) / 1200;
    }
    setBBoxCb([setDimensions]);
    function updateCursorBall(ev: MouseEvent) {
      onScreen = true;
      cursorBall.x = ev.offsetX;
      cursorBall.y = ev.offsetY;
    }
    let touch: number | null = null;
    function touchMove(ev: TouchEvent) {
      const moveTouch = [...ev.changedTouches].find(
        (t) => t.identifier === touch,
      );
      if (moveTouch == null) return;
      cursorBall.x = moveTouch.clientX - clientXOffset;
      cursorBall.y = moveTouch.clientY - clientYOffset;
    }
    function mouseOut() {
      onScreen = false;
    }
    function touchEnd(ev: TouchEvent) {
      if ([...ev.changedTouches].some((t) => t.identifier === touch)) {
        pixi.view.removeEventListener('touchend', touchEnd);
        pixi.view.removeEventListener('touchmove', touchMove);
        pixi.view.addEventListener('mousemove', updateCursorBall, {
          passive: true,
        });
        pixi.view.addEventListener('mouseout', mouseOut, { passive: true });
        onScreen = false;
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        pixi.view.addEventListener('touchstart', touchStart, {
          passive: false,
        });
      }
    }
    function touchStart(ev: TouchEvent) {
      if (!ev.cancelable) return;
      touch = ev.changedTouches.item(0)?.identifier ?? null;
      if (touch == null) return;
      ev.preventDefault();
      onScreen = true;
      pixi.view.removeEventListener('touchstart', touchStart);
      pixi.view.removeEventListener('mousemove', updateCursorBall);
      pixi.view.removeEventListener('mouseout', mouseOut);
      pixi.view.addEventListener('touchend', touchEnd, { passive: true });
      pixi.view.addEventListener('touchmove', touchMove, { passive: true });
    }
    pixi.view.addEventListener('mousemove', updateCursorBall, {
      passive: true,
    });
    pixi.view.addEventListener('touchstart', touchStart, {
      passive: false,
    });
    pixi.view.addEventListener('mouseout', mouseOut, { passive: true });
    return () => {
      pixi.view.removeEventListener('mousemove', updateCursorBall);
      pixi.view.removeEventListener('touchstart', touchStart);
      pixi.view.removeEventListener('mouseout', mouseOut);
      mounted = false;
      container.removeChild(pixi.view);
      pixi.destroy();
      setBBoxCb([() => {}]);
    };
  }, [containerRef]);
  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
      }}
      ref={setContainerRef}
    />
  );
}
