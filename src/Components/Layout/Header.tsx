import Link from 'next/link';

const Header = () => (
  <div className="header-container">
    <Link href="/">
      <a>
        <h1>stimbox</h1>
      </a>
    </Link>
  </div>
);

export default Header;
