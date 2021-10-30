import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ToneMatrix } from '@simplylinn/tonematrix';

export default function ToneMatrixBox(): JSX.Element {
  const toneMatrix = useRef<ToneMatrix | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [instrument, setInstrument] = useState(0);
  const toggleInstrument = useCallback(() => {
    setInstrument((old) => Number(!old));
  }, []);
  useEffect(() => {
    if (containerRef == null) return undefined;
    const instance = new ToneMatrix({
      noteLength: 1 / 16,
      canvasWrapperEl: containerRef,
    });
    toneMatrix.current = instance;
    return () => {
      instance.dispose();
    };
  }, [containerRef]);
  useEffect(() => {
    toneMatrix.current?.setMuted(muted);
  }, [muted]);
  const clear = useCallback(() => {
    toneMatrix.current?.clear();
  }, []);
  useEffect(() => {
    toneMatrix.current?.grid.setCurrentInstrument(instrument);
  }, [instrument]);

  useEffect(() => {
    setTimeout(() => {
      // toneMatrix.current?.setWidth(10);
    }, 5000);
    setTimeout(() => {
      // toneMatrix.current?.setWidth(16);
    }, 10000);
  }, []);

  return (
    <>
      <style>{`.ToneMatrix_wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.ToneMatrix_wrapper > * {
  width: 500px;
  max-width: 100vw;
}
.ToneMatrix_container {
  align-self: center;
  overflow-x: auto;
  line-height: 0;
}
.ToneMatrix_inner {
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.ToneMatrix_container canvas {
  height: 500px;
}`}</style>
      <div className="ToneMatrix_wrapper">
        <div className="ToneMatrix_container">
          <div className="ToneMatrix_inner" ref={setContainerRef} />
        </div>
        <div>
          <button type="button" onClick={clear}>
            clear
          </button>
          <button
            type="button"
            onClick={() => {
              setMuted((old) => !old);
            }}
          >
            {muted ? 'unmute' : 'mute'}
          </button>
          <button type="button" onClick={toggleInstrument}>
            Instrument {instrument}
          </button>
        </div>
      </div>
    </>
  );
}
