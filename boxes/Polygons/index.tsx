import { useViewport } from 'stimbox';

export default function TestBox(): JSX.Element {
  const { top, left, width, height } = useViewport();
  return (
    <table>
      <tbody>
        <tr>
          <td>top</td>
          <td>{top}</td>
        </tr>
        <tr>
          <td>left</td>
          <td>{left}</td>
        </tr>
        <tr>
          <td>width</td>
          <td>{width}</td>
        </tr>
        <tr>
          <td>height</td>
          <td>{height}</td>
        </tr>
      </tbody>
    </table>
  );
}
