"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [stats, setStats] = useState({ completed: 0, ongoing: 0, pending: 0 });
  const [ordersData, setOrdersData] = useState<{ date: string; totalOrders: number; completedOrders: number }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null); // <- Novo estado

  useEffect(() => {
    const storedId = localStorage.getItem("companyId");
    if (storedId) {
      const id = parseInt(storedId);
      setCompanyId(id);
    }
  }, []);

  useEffect(() => {
    if (!companyId) return;

    setIsClient(true);

    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);

    if (savedMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/company/${companyId}/order-stats`);
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    const fetchOrdersData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/company/${companyId}/orders-last-14-days`);
        setOrdersData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de pedidos:", error);
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/company/${companyId}/logo`, {
          responseType: "blob",
        });
        const imageUrl = URL.createObjectURL(response.data);
        setLogoUrl(imageUrl);
      } catch (error) {
        console.error("Erro ao buscar o logo da empresa:", error);
      }
    };

    fetchStats();
    fetchOrdersData();
    fetchLogo();

    const interval = setInterval(() => {
      fetchStats();
      fetchOrdersData();
    }, 5000);

    return () => clearInterval(interval);
  }, [companyId]);

  const data = {
    labels: ordersData.map((d) => d.date),
    datasets: [
      {
        label: "Total de Encomendas",
        data: ordersData.map((d) => d.totalOrders),
        borderColor: isDarkMode ? "white" : "blue",
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 255, 0.5)",
      },
      {
        label: "Encomendas Concluídas",
        data: ordersData.map((d) => d.completedOrders),
        borderColor: isDarkMode ? "lightgreen" : "green",
        backgroundColor: isDarkMode ? "rgba(144, 238, 144, 0.2)" : "rgba(0, 128, 0, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Pedidos nos Últimos 14 Dias" },
    },
    scales: {
      x: {
        title: { display: true, text: "Dias", color: isDarkMode ? "white" : "black" },
        ticks: { color: isDarkMode ? "white" : "black" },
        grid: { color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.1)" },
      },
      y: {
        title: { display: true, text: "Quantidade de Entregas", color: isDarkMode ? "white" : "black" },
        beginAtZero: true,
        ticks: { stepSize: 1, color: isDarkMode ? "white" : "black" },
        grid: { color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

 return (
  <div className="container py-4">
    {/* Cabeçalho com logo e título centralizado */}
    <div className="row align-items-center mb-4">
      {/* Logo à esquerda */}
      <div className="col-4 d-flex justify-content-start">
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo da Empresa"
            style={{ height: "100px", objectFit: "contain" }}
          />
        )}
      </div>

      {/* Título centralizado */}
      <div className="col-4 text-center">
        <h1 className="mb-0">Painel de Controle</h1>
      </div>

      {/* Espaço à direita (reservado para futuro uso) */}
      <div className="col-4"></div>
    </div>

    {/* Cards de estatísticas */}
    <div className="row">
      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body text-center">
            <h5 className="card-title">Entregas Concluídas</h5>
            <h2>{stats.completed}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-warning mb-3">
          <div className="card-body text-center">
            <h5 className="card-title">Em Andamento</h5>
            <h2>{stats.ongoing}</h2>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card text-white bg-danger mb-3">
          <div className="card-body text-center">
            <h5 className="card-title">Pendentes</h5>
            <h2>{stats.pending}</h2>
          </div>
        </div>
      </div>
    </div>

    {/* Gráfico de pedidos */}
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Entregas nos Últimos 14 Dias</h5>
        <Line data={data} options={options} />
      </div>
    </div>
  </div>
);

}
