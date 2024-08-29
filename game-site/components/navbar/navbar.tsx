// components/Navbar.tsx
import Link from 'next/link';
import "../../app/globals.css";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-2xl font-bold">Game Tracker</div>
      <div className="flex space-x-4">
        <Link href="/about">about</Link>
        <Link href="/mylist">my list</Link>
        <Link href="/login">log in</Link>
      </div>
    </nav>
  );
};

export default Navbar;
