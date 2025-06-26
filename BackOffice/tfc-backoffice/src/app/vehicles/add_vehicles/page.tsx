"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // <-- importar useEffect

export default function AddVehicle() {
  const router = useRouter();

  const [vehicle, setVehicle] = useState({
    category: "",
    year: "",
    plate: "",
    brand: "",
    model: "",
  });

  const [message, setMessage] = useState("");
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
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

     if (!companyId) {
    setMessage("⚠️ ID da empresa não encontrado.");
    return;
  }


    if (!vehicle.category || !vehicle.year || !vehicle.plate || !vehicle.brand || !vehicle.model) {
      setMessage("⚠️ Todos os campos são obrigatórios!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/company/${companyId}/add-vehicle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: vehicle.category,
          year: parseInt(vehicle.year),
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
        }),
      });

      if (response.ok) {
        setMessage("✅ Veículo adicionado com sucesso!");
        setVehicle({ category: "", year: "", plate: "", brand: "", model: "" });
         setTimeout(() => {
           router.push("/vehicles/seevehicles");
         }, 1500); // redireciona após 1.5s
      } else {
        setMessage("❌ Erro ao adicionar veículo.");
      }
    } catch (error) {
      setMessage("⚠️ Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho com ícone centralizado e título */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center mb-4">
            <span className="text-red-500 text-4xl mr-3">🚗</span>
            <h1 className="text-3xl font-bold">
              Adicionar Veículo
            </h1>
          </div>
        </div>

        {/* Mensagem de alerta */}
        {message && (
          <div className="mb-6 p-4 rounded-lg text-center text-white bg-opacity-90" 
               style={{ backgroundColor: message.includes("✅") ? "#10B981" : "#EF4444" }}>
            {message}
          </div>
        )}

        {/* Formulário com fundo escuro */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 bg-opacity-90 p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Categoria</label>
              <select
                name="category"
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                value={vehicle.category}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                <option value="SMALL">SMALL</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LARGE">LARGE</option>
                <option value="MOTORIZED">MOTORIZED</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Ano</label>
                <input
                  type="number"
                  name="year"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  value={vehicle.year}
                  onChange={handleChange}
                  placeholder="Ex: 2023"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Matrícula</label>
                <input
                  type="text"
                  name="plate"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  value={vehicle.plate}
                  onChange={handleChange}
                  placeholder="Ex: ABC-1234"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-300 mb-2">Marca</label>
                <input
                  type="text"
                  name="brand"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  value={vehicle.brand}
                  onChange={handleChange}
                  placeholder="Ex: Toyota"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Modelo</label>
                <input
                  type="text"
                  name="model"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                  value={vehicle.model}
                  onChange={handleChange}
                  placeholder="Ex: Corolla"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Adicionar Veículo
            </button>
          </form>
        </div>

        {/* Botão para voltar */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/vehicles/seevehicles")}
            className="text-blue-400 hover:text-blue-300"
          >
            ← Voltar para a lista de veículos
          </button>
        </div>
      </div>
    </div>
  );
}