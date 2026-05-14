export default function Navbar({ title, rightContent }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {rightContent}
      </div>
    </nav>
  );
}
