import mostraValorNaTabela from "./mostraValorNaTabela.js"

document.querySelector('#saveToExcel').addEventListener('click', () => {
  let table2excel = new Table2Excel();
  table2excel.export(document.querySelectorAll('#tabela'));
});

document.querySelector('#pdfs').addEventListener('change', (event) => {


  // The workerSrc property shall be specified.
  pdfjsLib.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

  const arquivos = Array.from(event.target.files);

  for (let i = 0; i < arquivos.length; i++) {
    const reader = new FileReader();

    reader.onload = () => {

      const typedArray = new Uint8Array(reader.result);
      const loadingTask = pdfjsLib.getDocument(typedArray);

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
    };

    reader.readAsArrayBuffer(arquivos[i]);
  }
});

class Dado {
  constructor(index, descricao, valor) {
    this.index = index;
    this.descricao = descricao;
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

      let i;
      // The main trick to obtain the text of the PDF page, use the getTextContent method
      pdfPage.getTextContent().then(function (textContent) {
        let textItems = textContent.items;
        let finalString = "";
        let objetoDados = [];

        for (i = 0; i < textItems.length; i++) {
          let valor = textItems[i].str;

          if (valor == 'DNV:') {
            break;
          }

          if (i == 4) {
            objetoDados.push(new Dado(i, "cpf", valor));
          }

          if (i == 6) {
            objetoDados.push(new Dado(i, "fili1", valor));
          }

          if (i == 8) {
            objetoDados.push(new Dado(i, "fili2", valor));
          }

          if (i == 10) {
            objetoDados.push(new Dado(i, "nasc", valor));
          }

          if (i == 14) {
            objetoDados.push(new Dado(i, "cor-raca", valor));
          }

          if (i == 17) {
            objetoDados.push(new Dado(i, "nacio", valor));
          }

          if (i == 19) {
            objetoDados.push(new Dado(i, "sexo", valor));
          }

          if (i == 20) {
            objetoDados.push(new Dado(i, "pais", valor));
          }

          if (i == 22) {
            objetoDados.push(new Dado(i, "muni", valor));
          }

          if (i == 28) {
            objetoDados.push(new Dado(i, "nome", valor));
          }

          if (i == 29) {
            objetoDados.push(new Dado(i, "cns", valor));
          }

          // Concatenate the string of the item to the final string
          finalString += (i) + ' ' + valor + ' ' + '<br>';
        }

        objetoDados.push(new Dado(i - 5, "ctt1", `(${textItems[i - 5].str}) ${textItems[i - 4].str}`));
        objetoDados.push(new Dado(i - 2, "ctt2", `(${textItems[i - 2].str}) ${textItems[i - 1].str}`));

        // Mostra os valores da tabela na tela
        mostraValorNaTabela(objetoDados);

        // Solve promise with the text retrieven from the page
        resolve(finalString);
      });
    });
  });
}