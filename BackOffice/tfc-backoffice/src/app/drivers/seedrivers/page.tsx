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
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

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
    if (!companyId) return;

    fetch(`http://localhost:8080/company/${companyId}/drivers`)
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar condutores");
        return response.json();
      })
      .then((data) => {
        setDrivers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
        setLoading(false);
      });
  }, [companyId]);

  const confirmDelete = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowConfirm(true);
  };

  const deleteDriver = async () => {
    if (!companyId || !driverToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/driver/driversFromCompany/${driverToDelete.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Erro ao remover condutor.");
      }

      setDrivers((prev) => prev.filter((d) => d.id !== driverToDelete.id));
      setShowConfirm(false);
      setDriverToDelete(null);
    } catch (err) {
      alert("Erro ao deletar condutor.");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDriverToDelete(null);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "ativo" && driver.isOnline) ||
      (statusFilter === "não ativo" && !driver.isOnline);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg animate-pulse">Carregando condutores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center mb-4">
            <span className="text-blue-500 text-4xl mr-3">👨‍✈️</span>
            <h1 className="text-3xl font-bold">Condutores da Empresa</h1>
          </div>
          <Link
            href="/drivers/add_drivers"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Adicionar Condutor
          </Link>
        </div>

        {/* Filtros */}
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

        {/* Tabela */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 bg-opacity-90">
          <div className="bg-gray-700 text-gray-200 py-4 px-6 grid grid-cols-5 gap-4">
            <div className="font-semibold">Nome</div>
            <div className="font-semibold">Email</div>
            <div className="font-semibold">Status</div>
            <div className="font-semibold">Localização</div>
            <div className="font-semibold">Ações</div>
          </div>

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
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => confirmDelete(driver)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-gray-400">
              Nenhum condutor encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmação */}
      {showConfirm && driverToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm w-full">
            <p className="mb-4 text-lg font-semibold">
              Tem certeza que deseja remover {driverToDelete.name}?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteDriver}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sim
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
