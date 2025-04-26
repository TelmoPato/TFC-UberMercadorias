"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Client = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
};

export default function ViewClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = 1; // Defina aqui o ID da empresa para buscar os clientes

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/company/${companyId}/clients`);
        setClients(response.data);
      } catch (err) {
        setError("Erro ao buscar clientes"); // Corrigido erro de TypeScript
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes da Empresa</h1>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && clients.length === 0 && <p>Nenhum cliente encontrado.</p>}

      {!loading && !error && clients.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nome</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client: Client) => (
              <tr key={client.id} className="border">
                <td className="border p-2">{client.name}</td>
                <td className="border p-2">{client.email}</td>
                <td className="border p-2">{client.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
