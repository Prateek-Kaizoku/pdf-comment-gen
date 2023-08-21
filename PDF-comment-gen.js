const pdfjsLib = require("pdfjs-dist/build/pdf");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

async function extractAnnotations(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;

  const maxPages = pdfDocument.numPages;
  const annotationsByPage = {};

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const annotations = await page.getAnnotations();

    const textAnnotations = annotations
      .filter((ann) => ann.subtype === "Text") // Filter out any non-'Text' annotations
      .map((ann) => {
        let content = "N/A";
        if (ann.contentsObj && ann.contentsObj.str) {
          content = ann.contentsObj.str;
        } else if (ann.contents) {
          content = ann.contents;
        }
        return content; // Returning only the content without 'Text: ' prefix, as it's redundant now
      });

    if (textAnnotations.length > 0) {
      annotationsByPage[pageNum] = textAnnotations;
    }
  }

  return annotationsByPage;
}

async function saveAnnotationsToText(annotations, outputFile) {
  const content = [];

  for (const [page, anns] of Object.entries(annotations)) {
    content.push(`Page ${page}:`);
    content.push(...anns, ""); // spread the annotations for each page
  }

  fs.writeFileSync(outputFile, content.join("\n"));
}

async function appendAnnotationsToPDF(annotations, inputPdf, outputPdf) {
  const pdfBytes = fs.readFileSync(inputPdf);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const newPage = pdfDoc.addPage([595, 842]); // Default A4 size
  let yOffset = 800; // Start near the top of the page

  for (const [page, anns] of Object.entries(annotations)) {
    const textWithPageNumber = `Page ${page}:`;
    newPage.drawText(textWithPageNumber, { x: 50, y: yOffset, size: 12 });
    yOffset -= 20; // Move down for the next annotation

    anns.forEach((ann) => {
      newPage.drawText(ann, { x: 50, y: yOffset, size: 12 });
      yOffset -= 20; // Move down for each annotation
    });
  }

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPdf, modifiedPdfBytes);
}

(async function main() {
  if (process.argv.length !== 5) {
    console.log("Usage: node script.js <path_to_pdf> <output_file> <action>");
    console.log("<action> can be 'text' or 'pdf'");
    process.exit(1);
  }

  const pdfPath = process.argv[2];
  const outputFile = process.argv[3];
  const action = process.argv[4];

  const annotations = await extractAnnotations(pdfPath);

  if (action === "text") {
    await saveAnnotationsToText(annotations, outputFile);
    console.log(`Annotations saved to ${outputFile}.`);
  } else if (action === "pdf") {
    await appendAnnotationsToPDF(annotations, pdfPath, outputFile);
    console.log(`Annotations appended to ${outputFile}.`);
  } else {
    console.log("Invalid action. Please specify 'text' or 'pdf'.");
    process.exit(1);
  }
})();
