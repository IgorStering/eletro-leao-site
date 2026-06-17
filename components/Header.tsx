import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Eletro Leão"
              width={120}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-orange-600 transition font-semibold">
              Catálogo
            </Link>
            <a href="tel:+5571981945017" className="hover:text-orange-600 transition font-semibold">
              Contato
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
