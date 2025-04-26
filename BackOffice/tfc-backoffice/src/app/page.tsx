"use client"; // Garante que o código roda no cliente

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

// Registro dos componentes do gráfico
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Home() {
  const [stats, setStats] = useState({ completed: 0, ongoing: 0, pending: 0 });
  const [ordersData, setOrdersData] = useState<{ date: string; totalOrders: number; completedOrders: number }[]>([]);
  const [isClient, setIsClient] = useState(false); // Para garantir que estamos no lado do cliente
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado do dark mode
  const companyId = 1;

  // Verificando o estado do dark mode no lado do cliente
  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true);

    // Verifica se o dark mode está ativado
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);

    if (savedMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    // Funções para pegar os dados de pedidos e stats
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

    fetchStats();
    fetchOrdersData();

    const interval = setInterval(() => {
      fetchStats();
      fetchOrdersData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Configuração dos dados do gráfico com base no modo escuro
  const data = {
    labels: ordersData.map((d) => d.date), // Datas no eixo X
    datasets: [
      {
        label: "Total de Encomendas",
        data: ordersData.map((d) => d.totalOrders), // Quantidade de pedidos no eixo Y
        borderColor: isDarkMode ? "white" : "blue", // Cor da linha para o modo escuro
        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 255, 0.5)",
      },
      {
        label: "Encomendas Concluídas",
        data: ordersData.map((d) => d.completedOrders), // Pedidos concluídos no eixo Y
        borderColor: isDarkMode ? "lightgreen" : "green", // Linha verde para o modo escuro
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
        title: { display: true, text: "Dias", color: isDarkMode ? "white" : "black" }, // Título do eixo X
        ticks: { color: isDarkMode ? "white" : "black" }, // Cor das marcações do eixo X
        grid: {
          color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.1)", // Cor da linha do grid no eixo X
        },
      },
      y: {
        title: { display: true, text: "Quantidade de Entregas", color: isDarkMode ? "white" : "black" }, // Título do eixo Y
        beginAtZero: true,
        ticks: { stepSize: 1, color: isDarkMode ? "white" : "black" }, // Cor das marcações do eixo Y
        grid: {
          color: isDarkMode ? "white" : "rgba(0, 0, 0, 0.1)", // Cor da linha do grid no eixo Y
        },
      },
    },
  };

  // Não precisa de um toggle adicional, pois o estado já é controlado pelo layout

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Painel de Controle</h1>
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
      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Entregas nos Últimos 14 Dias</h5>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
