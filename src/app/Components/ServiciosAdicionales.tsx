import { useState } from "react";

type ServicioExtra = {
  id: number;
  titulo: string;
  nota: string;
  precio: string;
};

interface Props {
  onChange?: (valor: ServicioExtra[]) => void;
}

export default function ServiciosAdicionales({ onChange }: Props) {
  const [extraServices, setExtraServices] = useState<ServicioExtra[]>([]);

  const actualizarEstado = (nuevoValor: ServicioExtra[]) => {
    setExtraServices(nuevoValor);
    if (onChange) onChange(nuevoValor); // ✅ Avisamos al padre
  };

  const addService = () => {
    const nuevo = [
      ...extraServices,
      { id: Date.now(), titulo: "", nota: "", precio: "" }
    ];
    actualizarEstado(nuevo);
  };

  const updateService = (id: number, field: keyof ServicioExtra, value: string) => {
    const nuevo = extraServices.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    actualizarEstado(nuevo);
  };

  const removeService = (id: number) => {
    const nuevo = extraServices.filter(s => s.id !== id);
    actualizarEstado(nuevo);
  };

  return (
    <section className="bg-green-50 p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold text-green-800 mb-2">
        Servicios Adicionales
      </h2>

      <button
        type="button"
        onClick={addService}
        className="w-full bg-green-600 text-white p-2 rounded-xl mb-4 hover:bg-green-700"
      >
        + Añadir servicio
      </button>

      {extraServices.map(service => (
        <div
          key={service.id}
          className="flex flex-col gap-2 p-3 mb-3 bg-white rounded-xl border"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-medium text-green-700">
              🌲 Servicio adicional
            </div>

            <button
              onClick={() => removeService(service.id)}
              className="text-red-600 font-bold"
            >
              X
            </button>
          </div>

          <input
            className="border p-2 rounded"
            placeholder="Título"
            value={service.titulo}
            onChange={(e) => updateService(service.id, "titulo", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Nota"
            value={service.nota}
            onChange={(e) => updateService(service.id, "nota", e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Precio"
            type="number"
            value={service.precio}
            onChange={(e) => updateService(service.id, "precio", e.target.value)}
          />
        </div>
      ))}
    </section>
  );
}
