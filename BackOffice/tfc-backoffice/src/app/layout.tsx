"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "./components/ui/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const hideSidebarRoutes = ["/", "/registo"];
  const showSidebar = !hideSidebarRoutes.includes(pathname);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

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
          {showSidebar && <Sidebar />}
          <main className="flex-1 p-4 bg-transparent min-h-screen">
            {children}
          </main>
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
