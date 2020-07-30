import React, { Component } from 'react';
import ToneMatrix from './ToneMatrix';

export default class ToneMatrixBox extends Component {
  BoxName = 'Whaaa';

  toneMatrix: ToneMatrix | null = null;

  containerRef = React.createRef<HTMLDivElement>();

  clearRef = React.createRef<HTMLButtonElement>();

  muteRef = React.createRef<HTMLButtonElement>();

  componentDidMount(): void {
    if (!this.toneMatrix) {
      const containerEl = this.containerRef.current;
      const clearEl = this.clearRef.current;
      const muteEl = this.muteRef.current;
      if (containerEl && muteEl && clearEl) {
        this.toneMatrix = new ToneMatrix(containerEl, clearEl, muteEl);
      }
    }
  }

  componentWillUnmount(): void {
    if (this.toneMatrix) {
      console.log('disposing');
      this.toneMatrix.dispose();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  render(): JSX.Element {
    return (
      <div>
        Hello from TestBox
        <style>{`
          .container, .container canvas {
            height: 500px;
          }
        `}</style>
        <div className="container" ref={this.containerRef} />
        <button type="button" ref={this.clearRef}>
          clear
        </button>
        <button type="button" ref={this.muteRef}>
          mute
        </button>
      </div>
    );
  }
}
