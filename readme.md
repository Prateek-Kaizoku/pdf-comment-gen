---

# PDF Comment Generator (`PDF-comment-gen`)

`PDF-comment-gen` is a Node.js utility designed to extract annotations from PDF files and provide the user with two output options:
1. Generate a text file with the extracted annotations.
2. Append the annotations to the end of the original PDF on a new page.

## Requirements

- Node.js (tested on v14 and v16; compatibility with newer versions may vary)
- npm

## Dependencies

- `pdfjs-dist`: For reading and extracting annotations from PDFs.
- `pdf-lib`: For appending annotations to a PDF.

To install all the required dependencies, run the following:

```bash
npm install
```

## Usage

```bash
node PDF-comment-gen.js <input_pdf_path> <output_path> <action>
```

Arguments:

- `<input_pdf_path>`: The path to the input PDF file from which annotations will be extracted.
- `<output_path>`: The path where the output (text or modified PDF) will be saved.
- `<action>`: The desired action. It can be:
  - `text`: To save the extracted annotations to a text file.
  - `pdf`: To append the annotations to the original PDF.

For example, to extract annotations from `file.pdf` and save them to `annotations.txt`, use:

```bash
node PDF-comment-gen.js file.pdf annotations.txt text
```

To append the annotations to `file.pdf` and save the result as `file_with_annotations.pdf`, use:

```bash
node PDF-comment-gen.js file.pdf file_with_annotations.pdf pdf
```

---

You can save the content above in a `README.md` file in the root directory of your project. Modify any details as necessary based on your project's specifics or any additional features you might add in the future.
