import React, { useMemo } from 'react';
import { Property } from 'csstype';

interface InnerProps {
  polygons: readonly (readonly (readonly (readonly [number, number])[])[])[];
  points?: readonly {
    readonly color: Property.Fill;
    readonly positions: readonly (readonly [number, number])[];
    readonly scale?: number;
  }[];
  width?: number;
  height?: number;
  padding?: number;
  reverseHoles?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  xScale?: number;
  yScale?: number;
  fill: Property.Fill;
  glowEdgeThickness?: number;
  glowBlur?: number;
  minOpacity?: number;
  pointSize?: number;
  pointBlur?: number;
}

export type Props = InnerProps &
  Omit<
    React.SVGProps<SVGSVGElement>,
    keyof InnerProps | 'width' | 'height' | 'viewBox' | 'fill' | 'xmlns'
  >;

export default function SvgPolygon({
  polygons,
  points = [],
  width = 100,
  height = 100,
  padding = 0,
  reverseHoles = false,
  flipX = false,
  flipY = false,
  yScale = 1,
  xScale = 1,
  glowEdgeThickness = 2,
  glowBlur = 2,
  fill,
  fillOpacity,
  fillRule,
  stroke,
  strokeDasharray,
  strokeDashoffset,
  strokeOpacity,
  strokeLinecap,
  strokeLinejoin,
  strokeMiterlimit,
  strokeWidth = 1,
  minOpacity = 0.05,
  pointSize = 1,
  pointBlur = 2,
  ...rest
}: Props): JSX.Element {
  const [pathStrings, bbox, scale, centerPadX, centerPadY] = useMemo(() => {
    const innerBbox = (() => {
      const partialBbox = {
        top: Infinity,
        left: Infinity,
        bottom: -Infinity,
        right: -Infinity,
      };
      polygons.forEach(([polygon]) => {
        polygon.forEach(([x, y]) => {
          if (y * yScale < partialBbox.top) partialBbox.top = y * yScale;
          if (y * yScale > partialBbox.bottom) partialBbox.bottom = y * yScale;
          if (x * xScale < partialBbox.left) partialBbox.left = x * xScale;
          if (x * xScale > partialBbox.right) partialBbox.right = x * xScale;
        });
      });
      return {
        ...partialBbox,
        width: partialBbox.right - partialBbox.left,
        height: partialBbox.bottom - partialBbox.top,
      };
    })();
    const innerScale = Math.min(
      (width - padding * 2) / innerBbox.width,
      (height - padding * 2) / innerBbox.height,
    );
    const innerCenterPadX =
      (width - (padding * 2 + innerBbox.width * innerScale)) / 2;
    const innerCenterPadY =
      (height - (padding * 2 + innerBbox.height * innerScale)) / 2;
    const strings = polygons.map(([outer, ...holes]) => {
      const parts: string[] = [
        `M${outer
          .map(([x, y]) => {
            return `${
              (flipX
                ? innerBbox.right - x * xScale
                : x * xScale - innerBbox.left) *
                innerScale +
              padding +
              innerCenterPadX
            },${
              (flipY
                ? innerBbox.bottom - y * yScale
                : y * yScale - innerBbox.top) *
                innerScale +
              padding +
              innerCenterPadY
            }`;
          })
          .join(' L')} Z`,
      ];
      for (let i = 0; i < holes.length; i++) {
        const hole = holes[i];
        const reverseHole = new Array(hole.length);
        for (let ii = hole.length - 1; ii >= 0; ii--) {
          const x = hole[ii][0];
          const y = hole[ii][1];
          reverseHole[reverseHoles ? hole.length - ii - 1 : ii] = `${
            (flipX
              ? innerBbox.right - x * xScale
              : x * xScale - innerBbox.left) *
              innerScale +
            padding +
            innerCenterPadX
          },${
            (flipY
              ? innerBbox.bottom - y * yScale
              : y * yScale - innerBbox.top) *
              innerScale +
            padding +
            innerCenterPadY
          }`;
        }
        parts.push(`M${reverseHole.join(' L')} Z`);
      }
      return parts.join(' ');
    });
    return [strings, innerBbox, innerScale, innerCenterPadX, innerCenterPadY];
  }, [
    flipX,
    flipY,
    height,
    padding,
    polygons,
    reverseHoles,
    width,
    xScale,
    yScale,
  ]);
  return (
    <svg
      {...rest}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="point-glow" x="-100%" y="-100%" width="400%" height="400%">
          <feGaussianBlur
            stdDeviation={(pointSize * pointBlur) / 2}
            in="SourceGraphic"
            result="blur1"
          />
          <feGaussianBlur
            stdDeviation={(pointSize * pointBlur) / 1.5}
            in="SourceGraphic"
            result="blur2"
          />
          <feGaussianBlur
            stdDeviation={pointSize * pointBlur}
            in="SourceGraphic"
            result="blur3"
          />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur3" />
          </feMerge>
        </filter>
        <filter id="map-glow">
          <feComponentTransfer in="SourceAlpha" result="muted-alpha">
            <feFuncA type="linear" slope={minOpacity} />
          </feComponentTransfer>
          <feConvolveMatrix
            in="SourceAlpha"
            kernelMatrix="
            1 1 1
            1 -8 1
            1 1 1"
          />
          <feGaussianBlur stdDeviation={glowEdgeThickness} />
          <feColorMatrix
            type="matrix"
            values={`0 0 0 0 0 
                    0 0 0 0 0 
                    0 0 0 0 0
                    0 0 0 ${glowEdgeThickness * 100} 0`}
          />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
          <feGaussianBlur stdDeviation={glowBlur} result="gradient-alpha" />
          <feComponentTransfer in="gradient-alpha" result="magic-alpha">
            <feFuncA type="linear" slope={1 - minOpacity} />
          </feComponentTransfer>
          <feComposite
            in="magic-alpha"
            in2="SourceAlpha"
            operator="in"
            result="composite-alpha"
          />
          <feComposite
            in="composite-alpha"
            in2="muted-alpha"
            operator="lighter"
            result="final-alpha"
          />
          <feComposite
            in2="final-alpha"
            in="SourceGraphic"
            operator="in"
            result="composite-alpha"
          />
        </filter>
        <g id="geom-path">
          {pathStrings.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </defs>
      <use
        xlinkHref="#geom-path"
        style={{
          filter: 'url(#map-glow)',
        }}
        fill={fill}
        fillOpacity={fillOpacity}
        fillRule={fillRule}
      />
      {stroke != null && strokeWidth !== 0 && strokeWidth !== '0' && (
        <use
          xlinkHref="#geom-path"
          stroke={stroke}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeOpacity={strokeOpacity}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          strokeMiterlimit={strokeMiterlimit}
          strokeWidth={strokeWidth}
        />
      )}
      {points.map(({ color, positions }) => (
        <g
          key={`${color},${positions.join()}`}
          style={{ fill: color, filter: 'url(#point-glow)' }}
        >
          {positions.map(([x, y]) => {
            const realX =
              (flipX ? bbox.right - x * xScale : x * xScale - bbox.left) *
                scale +
              padding +
              centerPadX;
            const realY =
              (flipY ? bbox.bottom - y * yScale : y * yScale - bbox.top) *
                scale +
              padding +
              centerPadY;
            return (
              <circle key={`${x},${y}`} cx={realX} cy={realY} r={pointSize} />
            );
          })}
        </g>
      ))}
    </svg>
  );
}
