"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function AddDriverPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    phoneNumber: "",
    taxPayerNumber: "",
    street: "",
    city: "",
    postalCode: "",
    salary: "",
    vehicleId: "",
    location: "",
  });

  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [popup, setPopup] = useState<{ type: "success" | "error"; message: string } | null>(null);
  

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
  if (!companyId) return; // só roda se companyId estiver presente

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/company/${companyId}/vehicles`);
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    }
  };

  fetchVehicles();
}, [companyId]); // 👈 importante: adiciona dependência


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/company/${companyId}/add-driver`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        birthdate: formData.birthdate,
        phoneNumber: formData.phoneNumber,
        taxPayerNumber: parseInt(formData.taxPayerNumber),
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        salary: parseFloat(formData.salary),
        vehicle: { id: parseInt(formData.vehicleId) },
        location: formData.location,
      });

      if (response.status === 200) {
        setPopup({ type: "success", message: "Motorista cadastrado com sucesso!" });
        setFormData({
          name: "",
          email: "",
          password: "",
          birthdate: "",
          phoneNumber: "",
          taxPayerNumber: "",
          street: "",
          city: "",
          postalCode: "",
          salary: "",
          vehicleId: "",
          location: "",
        });
        
      }

      setTimeout(() => {
        router.push("/drivers/seedrivers");
      }, 1500); // espera 1.5s para mostrar o popup antes de redirecionar

    } catch (error) {
      setPopup({ type: "error", message: "Erro ao cadastrar motorista. Tente novamente!" });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho com ícone centralizado e título */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center mb-4">
            <span className="text-blue-500 text-4xl mr-3">👨‍✈️</span>
            <h1 className="text-3xl font-bold">
              Adicionar Condutor
            </h1>
          </div>
        </div>
        
        {/* Formulário com estilo escuro */}
        <div className="rounded-lg overflow-hidden shadow-lg bg-gray-800 bg-opacity-90 p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">Informações Pessoais</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Nome" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <div>
                  <label className="block text-gray-300 mb-1">Data de Nascimento</label>
                  <input 
                    type="date" 
                    name="birthdate" 
                    value={formData.birthdate} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600" 
                  />
                </div>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  placeholder="Telefone" 
                  value={formData.phoneNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="number" 
                  name="taxPayerNumber" 
                  placeholder="NIF" 
                  value={formData.taxPayerNumber} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
              </div>
            </div>
            
            {/* Endereço e Informações Profissionais */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl font-semibold mb-4 text-gray-200">Endereço e Trabalho</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  name="street" 
                  placeholder="Rua" 
                  value={formData.street} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  name="city" 
                  placeholder="Cidade" 
                  value={formData.city} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="text" 
                  name="postalCode" 
                  placeholder="Código Postal" 
                  value={formData.postalCode} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <input 
                  type="number" 
                  name="salary" 
                  placeholder="Salário" 
                  value={formData.salary} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
                <div>
                  <label className="block text-gray-300 mb-1">Veículo Designado</label>
                  <select 
                    name="vehicleId" 
                    value={formData.vehicleId} 
                    onChange={handleChange} 
                    required 
                    className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600"
                  >
                    <option value="">Selecione um veículo</option>
                    {vehicles.map((vehicle: any) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} ({vehicle.plate})
                      </option>
                    ))}
                  </select>
                </div>
                <input 
                  type="text" 
                  name="location" 
                  placeholder="Localização" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 placeholder-gray-400" 
                />
              </div>
            </div>
            
            {/* Botão de envio - ocupando toda a largura */}
            <div className="col-span-2 mt-4">
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition duration-200 transform hover:scale-105"
              >
                Registrar Condutor
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup de notificação animado */}
      {popup && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`fixed top-5 right-5 p-4 rounded-xl shadow-lg text-white ${
            popup.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {popup.type === "success" ? "✓" : "✗"}
            </span>
            {popup.message}
            <button className="ml-4 text-white font-bold" onClick={() => setPopup(null)}>×</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}