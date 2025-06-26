"use client";
import { useEffect, useState } from "react";

interface Company {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  postalCode: string;
}

export default function CompanyPage() {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [company, setCompany] = useState<Company | null>(null);


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
  if (!companyId) return; // 👈 evita rodar com null

  fetch(`http://localhost:8080/company/${companyId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao buscar empresa: " + res.status);
      return res.json();
    })
    .then((data: Company) => {
      setCompany(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar empresa", error);
    });
}, [companyId]); // 👈 depende de companyId


  if (!company) return <p>Carregando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes da Empresa</h1>
      <div className="border p-4 rounded-lg shadow-md bg-white">
        <p><strong>Nome:</strong> {company.name}</p>
        <p><strong>Email:</strong> {company.email}</p>
        <p><strong>Telefone:</strong> {company.phoneNumber}</p>
        <p>
          <strong>Endereço:</strong>{" "}
          {company.street}, {company.city}, {company.postalCode}
        </p>
      </div>
    </div>
  );
}
