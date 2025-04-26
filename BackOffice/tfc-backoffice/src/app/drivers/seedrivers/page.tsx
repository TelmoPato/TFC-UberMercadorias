"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Driver {
  id: number;
  name: string;
  email: string;
  isOnline: boolean;
  isBusy: boolean;
  location: string;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const companyId = 1;

  useEffect(() => {
    // Buscar condutores
    fetch(`http://localhost:8080/company/${companyId}/drivers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar condutores: " + response.status);
        }
        return response.json();
      })
      .then((data: Driver[]) => {
        console.log("Condutores carregados:", data);
        setDrivers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar condutores:", error);
        setLoading(false);
      });
  }, []);

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "ativo" && driver.isOnline) ||
      (statusFilter === "não ativo" && !driver.isOnline);
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Carregando...</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com ícone centralizado e título */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-500 text-4xl mr-3">👨‍✈️</span>
            <h1 className="text-3xl font-bold">
              Condutores da Empresa
            </h1>
          </div>
          
          {/* Botão de adicionar condutor abaixo do título */}
          <Link
            href="/drivers/add_drivers"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Adicionar Condutor
          </Link>
        </div>

        {/* Área de filtros */}
        <div className="mb-6 flex gap-4 justify-center">
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md shadow-sm bg-gray-700 text-white border-gray-600 placeholder-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded-md shadow-sm bg-gray-700 text-white border-gray-600"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="não ativo">Não Ativos</option>
          </select>
        </div>

        {/* Tabela de condutores com fundo escuro */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 bg-opacity-90">
          {/* Cabeçalho da tabela */}
          <div className="bg-gray-700 text-gray-200 py-4 px-6 grid grid-cols-5 gap-4">
            <div className="font-semibold">Nome</div>
            <div className="font-semibold">Email</div>
            <div className="font-semibold">Status</div>
            <div className="font-semibold">Localização</div>
            <div className="font-semibold">Ações</div>
          </div>

          {/* Conteúdo da tabela */}
          {filteredDrivers.length > 0 ? (
            filteredDrivers.map((driver) => (
              <div 
                key={driver.id} 
                className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-gray-700 text-gray-300"
              >
                <div>{driver.name}</div>
                <div>{driver.email}</div>
                <div>
                  {driver.isOnline ? (
                    <span className="text-green-400 font-semibold">Ativo</span>
                  ) : (
                    <span className="text-red-400 font-semibold">Não Ativo</span>
                  )}
                </div>
                <div>{driver.location || "Desconhecido"}</div>
                <div className="flex space-x-3">
                  <button className="text-blue-400 hover:text-blue-300">Editar</button>
                  <button className="text-red-400 hover:text-red-300">Excluir</button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              Nenhum condutor encontrado. Adicione um novo condutor para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}