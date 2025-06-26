"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  category: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<number | null>(null); // <-- estado

  useEffect(() => {
  const storedId = localStorage.getItem("companyId");
  if (storedId) {
    setCompanyId(parseInt(storedId));
  } else {
    alert("ID da empresa não encontrado. Faça login novamente.");
    window.location.href = "/login";
  }
}, []);
  

  useEffect(() => {
  if (!companyId) return; // aguarda o ID ser carregado

  setLoading(true); // mostra carregando até terminar a requisição

  fetch(`http://localhost:8080/company/${companyId}/vehicles`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar veículos: " + response.status);
      }
      return response.json();
    })
    .then((data: Vehicle[]) => {
      setVehicles(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Erro ao buscar veículos:", error);
      setLoading(false);
    });
}, [companyId]); // <-- depende de companyId!


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
            <span className="text-red-500 text-4xl mr-3">🚗</span>
            <h1 className="text-3xl font-bold">
              Veículos da Empresa
            </h1>
          </div>
          
          {/* Botão de adicionar veículo abaixo do título */}
          <Link
            href="/vehicles/add_vehicles"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Adicionar Veículo
          </Link>
        </div>

        {/* Tabela de veículos com fundo escuro */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 bg-opacity-90">
          {/* Cabeçalho da tabela */}
          <div className="bg-gray-700 text-gray-200 py-4 px-6 grid grid-cols-6 gap-4">
            <div className="font-semibold">Marca</div>
            <div className="font-semibold">Modelo</div>
            <div className="font-semibold">Ano</div>
            <div className="font-semibold">Matricula</div>
            <div className="font-semibold">Categoria</div>
            <div className="font-semibold">Ações</div>
          </div>

          {/* Conteúdo da tabela */}
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-700 text-gray-300"
              >
                <div>{vehicle.brand}</div>
                <div>{vehicle.model}</div>
                <div>{vehicle.year}</div>
                <div>{vehicle.plate}</div>
                <div>{vehicle.category}</div>
                <div className="flex space-x-3">
                  <button className="text-blue-400 hover:text-blue-300">Editar</button>
                  <button className="text-red-400 hover:text-red-300">Excluir</button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              Nenhum veículo encontrado. Adicione um novo veículo para começar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}