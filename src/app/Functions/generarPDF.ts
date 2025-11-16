import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { drawServicesTable } from "./drawServicesTable";

export async function generarPDF(
  data: {
    persona?: string;
    lugar?: string;
    fecha?: string;
    notasGenerales?: string;
    precioTotal?: string;
    servicios: { titulo?: string; precio?: string; nota?: string }[];
  },
  backgroundImageBase64?: string // ← opcional: puedes enviar la img desde React
) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 780;

  const drawText = (text: string, size = 14, x = 50, customFont = font) => {
    page.drawText(text, { x, y, size, font: customFont, color: rgb(0, 0, 0) });
    y -= size + 6;
  };

  // --- MARCA DE AGUA ---
  if (backgroundImageBase64) {
    const imgBytes = Uint8Array.from(atob(backgroundImageBase64), (c) =>
      c.charCodeAt(0)
    );
    const img = await pdf.embedJpg(imgBytes)

    

    page.drawImage(img, {
      x: 100,
      y: 200,
      width: 400,
      height: 400,
      opacity: 0.15,
    });
  }

  // --- TÍTULO ---
  drawText("Prados y Jardines EG", 28, 50, fontBold);
  y -= 14;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 1,
    color: rgb(0, 0.5, 0),
  });

  y -= 20;

  // --- DATOS PRINCIPALES ---
  drawText("Datos del cliente", 18, 50, fontBold);

  if (data.persona) drawText(`Persona: ${data.persona}`, 13);
  if (data.lugar) drawText(`Lugar: ${data.lugar}`, 13);
  if (data.fecha) drawText(`Fecha: ${data.fecha}`, 13);

  y -= 10;

  page.drawLine({
    start: { x: 50, y },
    end: { x: 545, y },
    thickness: 0.8,
    color: rgb(0.7, 0.7, 0.7),
  });

  y -= 30;

  // --- SERVICIOS ---
  drawText("Servicios incluidos", 18, 50, fontBold);

  y = drawServicesTable(page, font, fontBold, data.servicios, y);

  // --- NOTAS GENERALES ---
  if (data.notasGenerales) {
    y -= 20;
    drawText("Notas generales", 18, 50, fontBold);
    drawText(data.notasGenerales, 12);
  }

  // --- PRECIO TOTAL ---
  if (data.precioTotal) {
    y -= 20;

    drawText("Precio total", 18, 50, fontBold);

    page.drawText(`${data.precioTotal}`, {
      x: 50,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0, 0.5, 0),
    });

    y -= 30;
  }

  return await pdf.save();
}
