const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { PDFDocument } = require("pdf-lib");

async function embedAnnotationsWithNewPage(
  pdfPath,
  annotationsTextPath,
  outputPath
) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Create a new page at the end of the document
  const newPage = pdfDoc.addPage([595, 842]); // Default A4 size

  const annotations = fs.readFileSync(annotationsTextPath, "utf-8").split("\n");
  let yOffset = 800; // Start near the top of the page

  for (let ann of annotations) {
    if (!ann.trim()) continue; // Skip empty lines

    const [pageStr, ...textParts] = ann.split(" ");

    if (!pageStr || textParts.length === 0) {
      console.log("Problematic line:", ann);
      continue; // Skip processing this line and move to the next
    }

    const pageNumber = parseInt(pageStr, 10);

    const text = textParts.join(" ");

    const textWithPageNumber = `Page ${pageNumber}  ${text}`;

    console.log("Appending annotation:", textWithPageNumber);
    newPage.drawText(textWithPageNumber, { x: 50, y: yOffset, size: 12 });

    yOffset -= 20; // Move down for the next annotation
  }

  const modifiedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, modifiedPdfBytes);
}

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 <pdf> <annotations_txt> <output_pdf>")
  .demandCommand(3).argv;

embedAnnotationsWithNewPage(argv._[0], argv._[1], argv._[2]);
