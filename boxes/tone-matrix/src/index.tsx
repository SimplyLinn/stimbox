import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ToneMatrix } from '@simplylinn/tonematrix';
import { useThemeColor } from 'stimbox';

function fallbackCopyTextToClipboard(text: string): Promise<void> {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';
  textArea.style.pointerEvents = 'none';
  textArea.style.visibility = 'invisible';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful) return Promise.resolve();
    return Promise.reject(new Error('Copy exec was unsuccessful'));
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}
function copyTextToClipboard(text: string) {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  return navigator.clipboard.writeText(text);
}

export default function ToneMatrixBox(): JSX.Element {
  const bgColor = useThemeColor('back1');
  const txtColor = useThemeColor('text1');
  const [toneMatrix, setToneMatrix] = useState<ToneMatrix | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [instrument, setInstrument] = useState(0);
  const [copyFeedbackText, setCopyFeedbackText] = useState<string | null>(null);
  const toggleInstrument = useCallback(() => {
    setInstrument((old) => Number(!old));
  }, []);
  const toneMatrixRef = useRef(toneMatrix);
  useEffect(() => {
    toneMatrixRef.current = toneMatrix;
  }, [toneMatrix]);
  const [loadedFromHash, setLoadedFromHash] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const shouldShowOverlay = loadedFromHash && !hasStarted;
  useEffect(() => {
    if (toneMatrix == null) return undefined;
    const { hash } = window.location;
    if (hash.length > 1) {
      const listener = () => {
        const href = window.location.href.split('#', 1)[0];
        window.history.replaceState(window.history.state, document.title, href);
      };
      toneMatrix.once('tiledown', listener);
      setLoadedFromHash(
        toneMatrix.fromBase64(
          decodeURIComponent(hash.substring(1)),
          toneMatrix.grid.instrumentCount,
        ),
      );
      return () => {
        toneMatrix.off('tiledown', listener);
      };
    }
    return undefined;
  }, [toneMatrix]);
  useEffect(() => {
    if (containerRef == null) return undefined;
    const instance = new ToneMatrix({
      noteLength: 1 / 16,
      canvasWrapperEl: containerRef,
      autoPlay: true,
    });
    instance.once('start', () => setHasStarted(true));
    setToneMatrix(instance);
    return () => {
      setToneMatrix(null);
      instance.dispose();
    };
  }, [containerRef]);
  useEffect(() => {
    toneMatrix?.setMuted(muted);
  }, [muted, toneMatrix]);
  const clear = useCallback(() => {
    toneMatrixRef.current?.clear();
  }, []);
  useEffect(() => {
    toneMatrixRef.current?.grid.setCurrentInstrument(instrument);
  }, [instrument]);
  const copyLink = useMemo(() => {
    let timeout: number | undefined;
    return function cl() {
      setCopyFeedbackText(null);
      if (timeout) clearTimeout(timeout);
      timeout = undefined;
      const tm = toneMatrixRef.current;
      if (tm == null) {
        setCopyFeedbackText('Tonematrix failed to load');
        timeout = window.setTimeout(() => {
          setCopyFeedbackText(null);
        }, 2000);
        return;
      }
      const b64 = tm.toBase64(tm.grid.instrumentCount);
      if (b64 != null) {
        const b64enc = encodeURIComponent(b64);
        const href = window.location.href.split('#', 1)[0];
        copyTextToClipboard(`${href}#${b64enc}`)
          .then(
            () => 'Copied',
            (err) => err.message as string,
          )
          .then((txt) => {
            setCopyFeedbackText(txt);
            timeout = window.setTimeout(() => {
              setCopyFeedbackText(null);
            }, 2000);
          }, console.error);
      }
    };
  }, []);

  return (
    <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
      <style>{`.ToneMatrix-wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.ToneMatrix-wrapper > * {
  width: 500px;
  max-width: 100%;
}
.ToneMatrix-container {
  width: unset;
  position: relative;
  align-self: center;
  overflow-x: auto;
  line-height: 0;
}
.ToneMatrix-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
.ToneMatrix-inner {
  display: inline-block;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 5px;
}
.ToneMatrix-copyContainer {
  display: inline-block;
  position: relative;
}
.ToneMatrix-copyContainer_toast {
  position: absolute;
  padding: 5px;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.ToneMatrix-container canvas {
  height: 500px;
}`}</style>
      <div className="ToneMatrix-wrapper">
        <div className="ToneMatrix-container">
          <div className="ToneMatrix-inner" ref={setContainerRef} />
          {shouldShowOverlay && (
            <div className="ToneMatrix-overlay">
              Click/tap anywhere to play.
            </div>
          )}
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
          <div className="ToneMatrix-copyContainer">
            {copyFeedbackText != null && (
              <span
                className="ToneMatrix-copyContainer_toast"
                style={{ backgroundColor: bgColor, color: txtColor }}
              >
                {copyFeedbackText}
              </span>
            )}
            <button type="button" onClick={copyLink}>
              Copy link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
