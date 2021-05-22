import mostraValorNaTabela from "./mostraValorNaTabela.js"

let url = '../pdf-exemplo/impressao_cadastro_700000822051006.pdf';
// var url = '../pdf-exemplo/impressao_cadastro_700501902050657.pdf';

// The workerSrc property shall be specified.
pdfjsLib.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

const loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then((pdf) => {

  var pdfDocument = pdf;
  var pagesPromises = [];

  for (let i = 0; i < pdf.numPages; i++) {
    // Required to prevent that i is always the total of pages
    (function (pageNumber) {
      pagesPromises.push(getPageText(pageNumber, pdfDocument));
    })(i + 1);
  }

  Promise.all(pagesPromises)
    .then(function (pagesText) {
      // Remove loading
      let loading_info = document.querySelector('#loading-info');
      loading_info.remove();

      // Render text
      let pdf_text = document.querySelector('#pdf-text');

      for (let i = 0; i < pagesText.length; i++) {
        let texto = pagesText[i];
        pdf_text.innerHTML = texto;
      }
    });

}, function (reason) {
  // PDF loading error
  console.error(reason);
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
            || i == 22 || i == 29) {
            objetoDados.push(new Dado(i, item.str));
          }

          // finalString += (i) + ' ' + item.str + ' ' + '<br>';
        }

        // função coloca valor na tabela
        mostraValorNaTabela(objetoDados);

        // Solve promise with the text retrieven from the page
        resolve(finalString);
      });
    });
  });
}