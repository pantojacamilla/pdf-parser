const mostraValorNaTabela = (objetoDados) => {
  const tabela = document.querySelector('#valores-tabela');
  const row = document.createElement('tr');

  let municipio = objetoDados[8].valor;
  municipio = municipio.substr(0, municipio.indexOf(' '));
  let uf = objetoDados[8].valor;
  uf = uf.substr(uf.indexOf('-') + 2, uf.length);

  row.innerHTML = `
        <td>${objetoDados[10].valor}</td>
        <td>${objetoDados[9].valor}</td>
        <td>${objetoDados[0].valor}</td>
        <td>(${objetoDados[11].valor}) ${objetoDados[12].valor}</td>
        <td>(${objetoDados[13].valor}) ${objetoDados[14].valor}</td>
        <td>${objetoDados[3].valor}</td>
        <td>${objetoDados[1].valor}</td>
        <td>${objetoDados[2].valor}</td>
        <td>${objetoDados[6].valor}</td>
        <td>${objetoDados[4].valor}</td>
        <td>${objetoDados[5].valor}</td>
        <td>${objetoDados[7].valor}</td>
        <td>${municipio}</td>
        <td>${uf}</td>
      `;
  tabela.appendChild(row);
};

// 4, 6, 8, 10, 14, 17, 19, 20, [22], 28, 29
export default mostraValorNaTabela;