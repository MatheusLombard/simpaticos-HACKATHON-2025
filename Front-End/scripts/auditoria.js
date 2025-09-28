// const pdf = require("pdf-poppler");
// const Tesseract = require("tesseract.js");
// const path = require("path");
// const fs = require("fs");

// const pdfPath = "./pdf_images/Exame Laboratorial 2.pdf";
// const outputDir = "./png_images";

// // 1. Converter PDF em imagens
// async function convertPdfToImages() {
//   const opts = {
//     format: "png",
//     out_dir: outputDir,
//     out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
//     page: null,
//   };
//   await pdf.convert(pdfPath, opts);
// }

// // 2. Fazer OCR nas imagens geradas
// // async function ocrImages() {
// //   const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
// //   for (const file of files) {
// //     const { data: { text } } = await Tesseract.recognize(
// //       path.join(outputDir, file),
// //       'por'
// //     );
// //     console.log(Texto extraído de ${file}:\n${text});
// //   }
// // }
// async function ocrImages() {
//   const resultado = await Tesseract.recognize(
//     path.join(outputDir, pdfPath),
//     "por"
//   );

//   console.log(`resultadoo extraído de ${pdfPath}:\n${resultado.data.text}`);
// }

// (async () => {
//   await convertPdfToImages();
//   await ocrImages();
// })();

// import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/+esm";
// import { createWorker } from "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/+esm";

// const input = document.getElementById("pdfUpload");
// const output = document.getElementById("output");

// input.addEventListener("change", async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   output.textContent = "Processando PDF...\n";

//   const arrayBuffer = await file.arrayBuffer();

//   // Criar worker explicitamente
//   const loadingTask = pdfjsLib.getDocument({
//     data: arrayBuffer,
//     worker: new Worker(
//       "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
//     ),
//   });

//   const pdf = await loadingTask.promise;
//   output.textContent += `Número de páginas: ${pdf.numPages}\n\n`;

//   // Criar worker do Tesseract uma vez
//   const worker = createWorker({
//     logger: (m) => console.log(m),
//   });

//   await worker.load();
//   await worker.loadLanguage("por");
//   await worker.initialize("por");

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const viewport = page.getViewport({ scale: 2 });

//     const canvas = document.createElement("canvas");
//     canvas.width = viewport.width;
//     canvas.height = viewport.height;
//     const context = canvas.getContext("2d");

//     await page.render({ canvasContext: context, viewport }).promise;

//     const imageDataUrl = canvas.toDataURL("image/png");

//     output.textContent += `🔍 Lendo página ${pageNum}...\n`;

//     const {
//       data: { text },
//     } = await worker.recognize(imageDataUrl);

//     output.textContent += `📄 Texto da página ${pageNum}:\n${text}\n\n`;
//   }

//   await worker.terminate();
//   output.textContent += "✅ OCR concluído!";
// });

// document.getElementById("submitBtn").addEventListener("click", async () => {
//   const fileInput = document.getElementById("pdfFile");
//   const statusDiv = document.getElementById("status");
//   statusDiv.textContent = "";

//   if (!fileInput.files || fileInput.files.length === 0) {
//     statusDiv.textContent = "Por favor, selecione um arquivo PDF.";
//     return;
//   }

//   const file = fileInput.files[0];
//   statusDiv.textContent = "Lendo o PDF...";

//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     let texto = "";
//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       const strings = content.items.map((item) => item.str);
//       texto += strings.join(" ") + "\n";
//     }
//     statusDiv.textContent = "Texto extraído:";
//     const pre = document.createElement("pre");
//     pre.textContent = texto;
//     statusDiv.appendChild(pre);
//   } catch (err) {
//     statusDiv.textContent = "Erro ao ler o PDF: " + err.message;
//   }
// });

// document.getElementById("submitBtn").addEventListener("click", async () => {
//   const fileInput = document.getElementById("pdfFile");
//   // const statusDiv = document.getElementById("status");
//   // statusDiv.textContent = "";

//   // if (!fileInput.files || fileInput.files.length === 0) {
//   //   statusDiv.textContent = "Por favor, selecione um arquivo PDF.";
//   //   return;
//   // }

//   const file = fileInput.files[0];
//   // statusDiv.textContent = "Lendo o PDF e extraindo texto via OCR...";

//   try {
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     let textoExtraido = "";
//     for (let i = 1; i <= pdf.numPages; i++) {
//       // statusDiv.textContent = `Processando página ${i} de ${pdf.numPages}...`;
//       const page = await pdf.getPage(i);
//       const viewport = page.getViewport({ scale: 2 });
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;
//       await page.render({ canvasContext: context, viewport: viewport }).promise;
//       // OCR com Tesseract.js
//       const {
//         data: { text },
//       } = await Tesseract.recognize(canvas, "por");
//       textoExtraido += `Texto extraído de página ${i}:\n` + text + "\n\n";
//     }
//     // Exibir apenas o texto após 'Exames Laboratoriais' e enviar para o backend como texto separado por vírgula
//     let textoFiltrado = textoExtraido;
//     const idx = textoExtraido.toLowerCase().indexOf("exames laboratoriais");
//     if (idx !== -1) {
//       textoFiltrado = textoExtraido
//         .slice(idx + "exames laboratoriais".length)
//         .trim();
//     }
//     // Separar exames por linha, removendo vazios
//     const exames = textoFiltrado
//       .split(/\n|\r/)
//       .map((e) => e.trim())
//       .filter((e) => e);
//     const examesTexto = exames.join("|");
//     statusDiv.textContent = "Enviando exames para o backend...";
//     console.log(examesTexto);
//     // Enviar para o backend como texto separado por vírgula
//     fetch(
//       "https://semidiurnal-undespondently-gertie.ngrok-free.dev/autorizacao",
//       {
//         method: "POST",
//         headers: { "Content-Type": "text/plain" },
//         body: examesTexto,
//       }
//     )
//       .then((res) => res.text())
//       .then((data) => {
//         statusDiv.textContent = "Exames enviados com sucesso!";
//         const pre = document.createElement("pre");
//         pre.textContent = data;
//         // statusDiv.appendChild(pre);
//         console.log(pre);
//       })
//       .catch((err) => {
//         statusDiv.textContent = "Erro ao enviar para o backend: " + err.message;
//       });
//   } catch (err) {
//     statusDiv.textContent = "Erro ao ler o PDF: " + err.message;
//   }
// });
