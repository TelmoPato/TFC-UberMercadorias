"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Para redirecionamento correto no Next.js 13+

export default function CreateClientPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [taxPayerNumber, setTaxPayerNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [companyId, setCompanyId] = useState("");
  const router = useRouter();

  const handleCreateClient = async () => {
    if (!companyId) {
      alert("Por favor, insira o ID da empresa!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/company/1/add-client`,
        {
          name,
          email,
          password,
          birthdate,
          phoneNumber,
          taxPayerNumber: parseInt(taxPayerNumber), // Garante que seja número
          street,
          city,
          postalCode,
        }
      );

      console.log("Cliente criado:", response.data);
      router.push("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      alert("Erro ao criar cliente. Verifique os dados.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Criar Cliente</h1>
      <div className="space-y-4">
        <div>
          <label className="block">ID da Empresa</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Nome</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Senha</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Data de Nascimento</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Telefone</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block">NIF</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={taxPayerNumber}
            onChange={(e) => setTaxPayerNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Rua</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Cidade</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Código Postal</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>
        <button
          onClick={handleCreateClient}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Criar Cliente
        </button>
      </div>
    </div>
  );
}
