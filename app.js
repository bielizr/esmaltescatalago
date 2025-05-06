// Função para buscar esmaltes da API (back-end) com filtro de classificação
function searchEsmaltes() {
    const searchValue = document.getElementById('search').value.trim();
    const filterValue = document.getElementById('filter').value;  // Obtendo o critério de filtro
  
    if (!searchValue) {
      alert('Por favor, digite uma cor!');
      return;
    }
  
    console.log(`Buscando esmaltes com a cor: ${searchValue} e classificando por: ${filterValue}`);
  
    // Enviando a requisição para o back-end (rota GET com classificação)
    fetch(`http://localhost:3000/buscar-esmalte/${searchValue}/classificar?criterio=${filterValue}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data);  // Verificar os dados recebidos
        displayEsmaltes(data);
      })
      .catch(error => {
        console.error('Erro ao buscar esmaltes:', error);
        alert('Erro ao buscar esmaltes. Tente novamente mais tarde.');
      });
  }
  
    // Enviando a requisição para o back-end (rota GET)
    fetch(`http://localhost:3000/buscar-esmalte/${searchValue}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro na resposta da API');
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data);  // Verificar os dados recebidos
        displayEsmaltes(data);
      })
      .catch(error => {
        console.error('Erro ao buscar esmaltes:', error);
        alert('Erro ao buscar esmaltes. Tente novamente mais tarde.');
      });
  
  
  // Função para exibir os esmaltes na tela
  function displayEsmaltes(esmaltes) {
    const container = document.getElementById('esmaltes-container');
    container.innerHTML = '';  // Limpa o container antes de adicionar novos esmaltes
  
    if (esmaltes.length === 0) {
      container.innerHTML = '<p>Nenhum esmalte encontrado para essa cor.</p>';
      return;
    }
  
    esmaltes.forEach(esmalte => {
      const esmalteCard = document.createElement('div');
      esmalteCard.classList.add('esmalte-card');
      
      esmalteCard.innerHTML = `
        <img src="${esmalte.imagem_url}" alt="${esmalte.nome}">
        <h3>${esmalte.nome}</h3>
        <p>Cor: ${esmalte.cor}</p>
        <p>Acabamento: ${esmalte.acabamento}</p>
        <p>Usos: ${esmalte.usos}</p>
      `;
      
      container.appendChild(esmalteCard);
    });
  }
  
  // Função para buscar e exibir a paleta de esmaltes
  function gerarPaleta() {
    const searchValue = document.getElementById('search').value.trim();
    if (!searchValue) {
      alert('Por favor, digite uma cor!');
      return;
    }
  
    console.log(`Gerando paleta com a cor: ${searchValue}`);
  
    // Enviando a requisição para o back-end para gerar a paleta
    fetch(`http://localhost:3000/gerar-paleta/${searchValue}`)
      .then(response => response.json())
      .then(data => {
        console.log('Paleta gerada:', data);  // Verificando os dados da paleta
        displayPaleta(data);
      })
      .catch(error => {
        console.error('Erro ao gerar paleta:', error);
        alert('Erro ao gerar paleta. Tente novamente mais tarde.');
      });
  }
  
  // Função para exibir a paleta de esmaltes na tela
  function displayPaleta(paleta) {
    const container = document.getElementById('paleta-container');
    container.innerHTML = '';  // Limpa o container antes de adicionar a paleta
  
    if (paleta.length === 0) {
      container.innerHTML = '<p>Nenhuma paleta encontrada para essa cor.</p>';
      return;
    }
  
    paleta.forEach(esmalte => {
      const esmalteCard = document.createElement('div');
      esmalteCard.classList.add('esmalte-card');
      
      esmalteCard.innerHTML = `
        <img src="${esmalte.imagem_url}" alt="${esmalte.nome}">
        <h3>${esmalte.nome}</h3>
        <p>Cor: ${esmalte.cor}</p>
      `;
      
      container.appendChild(esmalteCard);
    });
  }
  