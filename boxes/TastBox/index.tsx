import { BoxComponent } from 'boxd';

export default class TastBox extends BoxComponent {
  BoxName = 'Whaaa';

  // eslint-disable-next-line class-methods-use-this
  render() {
    return <div>Hello from TastBox</div>;
  }
}
