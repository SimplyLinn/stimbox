import React, { Component } from 'react';
import { ToneMatrix } from '@simplylinn/tonematrix';

export default class ToneMatrixBox extends Component {
  BoxName = 'Whaaa';
  toneMatrix: ToneMatrix | null = null;
  containerRef = React.createRef<HTMLDivElement>();
  state = {
    muted: false,
  };

  componentDidMount(): void {
    if (!this.toneMatrix) {
      const containerEl = this.containerRef.current;
      if (containerEl) {
        this.toneMatrix = new ToneMatrix(containerEl);
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
        <button type="button" onClick={() => this.toneMatrix?.clear()}>
          clear
        </button>
        <button
          type="button"
          onClick={() => {
            this.setState({ muted: !this.state.muted });
            this.toneMatrix?.setMuted(!this.state.muted);
          }}
        >
          mute
        </button>
      </div>
    );
  }
}
