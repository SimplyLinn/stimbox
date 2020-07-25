import { BoxComponent } from 'boxd';

export default class TestBox extends BoxComponent {
  BoxName = 'Whaaa';

  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div>Hello from TestBox</div>;
  }
}
