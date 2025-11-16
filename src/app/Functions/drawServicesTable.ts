import { rgb } from "pdf-lib";

export function drawServicesTable(
  page: any,
  font: any,
  fontBold: any,
  servicios: { titulo?: string; precio?: string; nota?: string }[],
  y: number
) {
  const rowHeight = 20;
  const x = 50;

  // Línea superior
  page.drawLine({
    start: { x, y },
    end: { x: 545, y },
    thickness: 0.8,
    color: rgb(0.6, 0.6, 0.6),
  });

  y -= 20;

  // Encabezado
  page.drawText("Servicio", { x, y, size: 12, font: fontBold });
  page.drawText("Precio", { x: x + 200, y, size: 12, font: fontBold });
  page.drawText("Notas", { x: x + 300, y, size: 12, font: fontBold });

  y -= rowHeight;

  // Línea debajo del encabezado
  page.drawLine({
    start: { x, y },
    end: { x: 545, y },
    thickness: 0.6,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 10;

  // Filas
  servicios.forEach((s) => {
    if (!s.precio && !s.nota) return; // no imprimir vacíos

    page.drawText(s.titulo ?? "", { x, y, size: 11, font });
    page.drawText(s.precio ?? "", { x: x + 200, y, size: 11, font });
    page.drawText(s.nota ?? "", { x: x + 300, y, size: 11, font });

    y -= rowHeight;

    // Línea entre filas
    page.drawLine({
      start: { x, y },
      end: { x: 545, y },
      thickness: 0.4,
      color: rgb(0.85, 0.85, 0.85),
    });

    y -= 10;
  });

  return y;
}

