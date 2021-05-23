import mostraValorNaTabela from "./mostraValorNaTabela.js"

document.querySelector('#saveToExcel').addEventListener('click', (event) => {
  let table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll('#tabela'));
});

document.querySelector('#pdfs').addEventListener('change', (event) => {
  const arquivos = Array.from(event.target.files);

  // The workerSrc property shall be specified.
  pdfjsLib.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

  for (let i = 0; i < arquivos.length; i++) {
    const loadingTask = pdfjsLib.getDocument(`../pdf-exemplo/jose-expedito-magalhaes/${arquivos[i].name}`);
    loadingTask.promise.then((pdf) => {

      let pdfDocument = pdf;
      let pagesPromises = [];

      for (let i = 0; i < pdf.numPages; i++) {
        // Required to prevent that i is always the total of pages
        (function (pageNumber) {
          pagesPromises.push(getPageText(pageNumber, pdfDocument));
        })(i + 1);
      }
    }, function (reason) {
      // PDF loading error
      console.error(reason);
    });

  }
  alert("Todos os arquivos foram processados");
});

class Dado {
  constructor(i, valor) {
    this.i = i;
    this.valor = valor;
  }
}

/**
 * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
 *
 * @param {Integer} pageNum Specifies the number of the page
 * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
 **/
function getPageText(pageNum, PDFDocumentInstance) {
  // Return a Promise that is solved once the text of the page is retrieven
  return new Promise(function (resolve, reject) {
    PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function (textContent) {
        let textItems = textContent.items;
        let finalString = "";
        let objetoDados = [];

        // Concatenate the string of the item to the final string
        for (let i = 0; i < textItems.length; i++) {
          let item = textItems[i];
          if (item.str == 'DNV:') {
            break;
          }

          if (i == 4 || i == 6 || i == 8 || i == 10
            || i == 14 || i == 17 || i == 19 || i == 20
            || i == 22 || i == 28 || i == 29 || i == 56
            || i == 57 || i == 59 || i == 60) {
            objetoDados.push(new Dado(i, item.str));
          }
        }

        // Mostra os valores da tabela na tela
        mostraValorNaTabela(objetoDados);

        // Solve promise with the text retrieven from the page
        resolve(finalString);
      });
    });
  });
}