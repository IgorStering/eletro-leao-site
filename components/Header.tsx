import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              ⚡
            </div>
            <span className="text-xl font-bold text-white">
              Eletro <span className="text-orange-600">Leão</span>
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="hover:text-orange-600 transition font-semibold">
              Catálogo
            </Link>
            <a href="tel:+5531999999999" className="hover:text-orange-600 transition font-semibold">
              Contato
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
