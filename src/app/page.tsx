'use client'
import { useState } from "react";
// Basic Next.js (App Router) page with Tailwind and green palette
// File: app/page.tsx

import ServiciosAdicionales from "./Components/ServiciosAdicionales";
import { generarPDF } from "./Functions/generarPDF";
type Servicio = {
  titulo?: string;
  precio?: string;
  nota?: string;
};

export default function Home() {
  const [persona, setPersona] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState("");

  const [notasGenerales, setNotasGenerales] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");

  // Servicios A-E
  const [serviciosBase, setServiciosBase] = useState(
    ["A", "B", "C", "D", "E"].map((letra) => ({
      titulo: `Servicio ${letra}`,
      nota: "",
      precio: "",
    }))
  );

  // Callback recibido desde ServiciosAdicionales
  const [serviciosExtra, setServiciosExtra] = useState<Servicio[]>([]);


  async function getImageBase64() {
  const res = await fetch("/backgroundReport.jpeg");
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result!.toString().split(",")[1]; // ← solo la parte útil
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
}


  const actualizarServicioBase = (index: number, campo: "titulo"|"nota"|"precio", valor: string) => {
    setServiciosBase((prev) => {
      const copia = [...prev];
      copia[index][campo] = valor;
      return copia;
    });
  };

  const handleGenerarPDF = async () => {
    
    const imgBase64 = await getImageBase64();


    
    const pdfBytes = await generarPDF({
      persona,
      lugar,
      fecha,
      notasGenerales,
      precioTotal,
      servicios: [...serviciosBase, ...serviciosExtra],
      
    },
  imgBase64 );

    
// pdfBytes viene de pdf-lib (Uint8Array)
const uint8 = new Uint8Array(pdfBytes);

// Copiar a un ArrayBuffer limpio REAL
const arrayBuffer = uint8.buffer.slice(0, uint8.byteLength);

// Crear el Blob sin problemas de tipos
const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte.pdf";
    a.click();
  };

  return (
    <main className="min-h-screen bg-white p-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-green-700">Formulario Jardinería</h1>

      {/* Datos básicos */}
      <section className="bg-green-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Datos del Cliente</h2>
        <div className="flex flex-col gap-3">
          <input className="border p-2 rounded" placeholder="Persona"
                 value={persona} onChange={(e) => setPersona(e.target.value)} />

          <input className="border p-2 rounded" placeholder="Lugar"
                 value={lugar} onChange={(e) => setLugar(e.target.value)} />

          <input type="date" className="border p-2 rounded"
                 value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
      </section>

      {/* Servicios base (A-E) */}
      <section className="bg-green-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Servicios</h2>

        {serviciosBase.map((serv, i) => (
          <div key={i} className="flex flex-col gap-2 p-3 border-b last:border-none">
            <div className="flex items-center gap-2 font-medium text-green-700">
              <span className="text-xl">🌲</span>
              {serv.titulo}
            </div>

            <input
              className="border p-2 rounded"
              placeholder="Nota"
              value={serv.nota}
              onChange={(e) => actualizarServicioBase(i, "nota", e.target.value)}
            />

            <input
              className="border p-2 rounded"
              placeholder="Precio"
              type="number"
              value={serv.precio}
              onChange={(e) => actualizarServicioBase(i, "precio", e.target.value)}
            />
          </div>
        ))}
      </section>

      {/* Servicios adicionales */}
      <ServiciosAdicionales onChange={setServiciosExtra} />

      {/* Notas generales */}
      <section className="bg-green-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Notas Generales</h2>
        <textarea
          className="border p-2 rounded w-full h-24"
          placeholder="Escribe notas..."
          value={notasGenerales}
          onChange={(e) => setNotasGenerales(e.target.value)}
        ></textarea>
      </section>

      {/* Precio total */}
      <section className="bg-green-50 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-green-800 mb-2">Precio Total</h2>
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="0"
          value={precioTotal}
          onChange={(e) => setPrecioTotal(e.target.value)}
        />
      </section>

      <button
        className="w-full bg-green-700 text-white p-3 rounded-xl shadow-lg text-lg font-semibold mt-4"
        onClick={handleGenerarPDF}
      >
        Generar PDF
      </button>
    </main>
  );
}
