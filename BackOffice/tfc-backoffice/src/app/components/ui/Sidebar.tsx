"use client";

import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "./sheet"; // Agora tem o SheetTitle
import { Menu } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger className="p-4">
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-white p-4 shadow-md">
        {/* Título acessível, mas invisível visualmente */}
        <SheetTitle>Sidebar</SheetTitle>

        <nav className="space-y-4">
          <Link href="/dashboard" className="block p-2 hover:bg-gray-200 rounded">
            🏠 Dashboard
          </Link>
          <Link href="/clients" className="block p-2 hover:bg-gray-200 rounded">
            👥 Clientes
          </Link>
          <Link href="/company" className="block p-2 hover:bg-gray-200 rounded">
            🏢 Empresa
          </Link>
          <Link href="/view-clients" className="block p-2 hover:bg-gray-200 rounded">
            🔍 Ver Clientes
          </Link>
          <Link href="/drivers/seedrivers" className="block p-2 hover:bg-gray-200 rounded">
            🚚 Motoristas
          </Link>
          <Link href="/services" className="block p-2 hover:bg-gray-200 rounded">
            🛠 Serviços
          </Link>
          <Link href="/statistics" className="block p-2 hover:bg-gray-200 rounded">
            📊 Estatísticas
          </Link>
          <Link href="/vehicles/seevehicles" className="block p-2 hover:bg-gray-200 rounded">
            🚲 Veiculos
          </Link>
          <Link href="/" className="block p-2 hover:bg-gray-200 rounded">
            ❌ Logout
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
