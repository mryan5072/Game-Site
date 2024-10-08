// components/Navbar.tsx
import Link from 'next/link';
import "../../app/globals.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Game Tracker</div>
      <div className="navbar-links">
        <Link href="/" className="navbar-link">home</Link>
        <Link href="/about" className="navbar-link">about</Link>
        <Link href="/mylist" className="navbar-link">my list</Link>
        <Link href="/login" className="navbar-link">log in</Link>
      </div>
    </nav>
  );
};

export default Navbar;
