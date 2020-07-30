import Link from 'next/link';
import ThemeSwitcher from '../ThemeSwitcher';

const Header = (): JSX.Element => (
  <div className="header-container">
    <Link href="/">
      <a>
        <h1>stimbox</h1>
      </a>
    </Link>
    <ThemeSwitcher />
  </div>
);

export default Header;
