"use client"; // Garante que o código roda no cliente
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./components/ui/Sidebar";
import "./globals.css"; // CSS global

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Verifica o estado do tema no localStorage na inicialização
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

  // Alterna o modo escuro e claro
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", String(newMode));
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  return (
    <html lang="en">
      <head></head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="h-screen flex relative">
          <Sidebar />
          <main className="flex-1 p-4 bg-transparent min-h-screen">
            {children}
          </main>
          {/* Botão de alternância de tema */}
          <button
            onClick={toggleDarkMode}
            className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600 transition"
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </body>
    </html>
  );
}