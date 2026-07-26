import { Library } from "lucide-react";

export function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Library size={28} />
        <h1 className="text-xl ml-2">SmartLibrary</h1>
      </div>
      <nav>
        <a href="#" className="mr-4">Home</a>
        <a href="#" className="mr-4">About</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  );
}
