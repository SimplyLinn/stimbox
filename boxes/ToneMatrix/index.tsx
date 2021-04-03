import React, { useEffect, useState } from 'react';
import { ToneMatrix } from '@simplylinn/tonematrix';

export default function ToneMatrixBox(): JSX.Element {
  const [toneMatrix, setToneMatrix] = useState<ToneMatrix>();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    if (containerRef == null) return undefined;
    const instance = new ToneMatrix(containerRef);
    setToneMatrix(instance);
    return () => {
      instance.dispose();
    };
  }, [containerRef]);
  useEffect(() => {
    toneMatrix?.setMuted(muted);
  }, [toneMatrix, muted]);
  return (
    <div>
      <style>{`
          .container, .container canvas {
            height: 500px;
          }
        `}</style>
      <div className="container" ref={setContainerRef} />
      <button type="button" onClick={() => toneMatrix?.clear()}>
        clear
      </button>
      <button
        type="button"
        onClick={() => {
          setMuted((old) => !old);
        }}
      >
        mute
      </button>
    </div>
  );
}
