import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ items }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 fixed lg:static top-0 left-0 w-64 h-screen bg-gray-900 text-white p-6 overflow-y-auto z-40`}
      >
        <nav className="space-y-2 pt-12 lg:pt-0">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {item.icon && <item.icon size={20} />}
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
}
