const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Importando o pacote CORS

const app = express();
const port = 3000;

// Habilitando o CORS para todas as requisições
app.use(cors());  

// Middleware para lidar com JSON
app.use(express.json());

// Conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Seu usuário MySQL
  password: '', // Sua senha MySQL
  database: 'esmaltes_catalogo'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL!');
  }
});

// Definindo uma rota para a página inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo ao catálogo de esmaltes!');
});

// Rota para adicionar um esmalte
app.post('/adicionar-esmalte', (req, res) => {
  const { nome, cor, acabamento, imagem_url } = req.body;
  const query = 'INSERT INTO esmaltes (nome, cor, acabamento, imagem_url) VALUES (?, ?, ?, ?)';
  db.query(query, [nome, cor, acabamento, imagem_url], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao adicionar esmalte' });
    } else {
      res.status(200).json({ message: 'Esmalte adicionado com sucesso!' });
    }
  });
});

// Rota para buscar esmaltes por cor
app.get('/buscar-esmalte/:cor', (req, res) => {
  const { cor } = req.params;
  const query = 'SELECT * FROM esmaltes WHERE cor LIKE ?';
  db.query(query, [`%${cor}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao buscar esmalte' });
    } else {
      res.status(200).json(results);  // Retorna os resultados encontrados no banco
    }
  });
});

// Rota para gerar uma paleta de cores com base em um esmalte
app.get('/gerar-paleta/:cor', (req, res) => {
  const { cor } = req.params;
  const query = 'SELECT * FROM esmaltes WHERE cor LIKE ?';

  db.query(query, [`%${cor}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar esmaltes para gerar paleta' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Nenhum esmalte encontrado para gerar paleta' });
    }

    // Lógica para gerar uma paleta com esmaltes encontrados
    const paleta = results.map(esmalte => ({
      nome: esmalte.nome,
      cor: esmalte.cor,
      imagem_url: esmalte.imagem_url
    }));

    res.status(200).json(paleta);
  });
});

// Rota para salvar a paleta no banco
app.post('/salvar-paleta', (req, res) => {
  const { nome_paleta, esmaltes } = req.body;
  const query = 'INSERT INTO paletas (nome_paleta, esmaltes) VALUES (?, ?)';

  db.query(query, [nome_paleta, JSON.stringify(esmaltes)], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao salvar paleta' });
    }

    res.status(200).json({ message: 'Paleta salva com sucesso!' });
  });
});

// Rota para buscar esmaltes com classificação
app.get('/buscar-esmalte/:cor/classificar', (req, res) => {
    const { cor } = req.params;
    const { criterio } = req.query;  // Critério de ordenação (cor, acabamento, mais usados)
  
    let orderBy = '';
    
    // Determinando o critério de classificação
    switch (criterio) {
      case 'cor':
        orderBy = 'cor ASC';  // Ordenar por cor (alfabeticamente)
        break;
      case 'acabamento':
        orderBy = 'acabamento ASC';  // Ordenar por acabamento (alfabeticamente)
        break;
      case 'mais_usados':
        orderBy = 'usos DESC';  // Ordenar pelos mais usados (maior para menor)
        break;
      case 'ultimo_usado':
        orderBy = 'ultimo_usado DESC';  // Ordenar pela data do último uso
        break;
      default:
        orderBy = 'nome ASC';  // Padrão de ordenação
    }
  
    const query = `SELECT * FROM esmaltes WHERE cor LIKE ? ORDER BY ${orderBy}`;
    
    db.query(query, [`%${cor}%`], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao buscar esmaltes' });
      } else {
        res.status(200).json(results);  // Retorna os esmaltes classificados
      }
    });
  });
  // Rota para buscar esmaltes com classificação e filtros
app.get('/buscar-esmalte/:cor/classificar', (req, res) => {
    const { cor } = req.params;
    const { criterio, acabamento, ultimo_usado } = req.query;
  
    let query = 'SELECT * FROM esmaltes WHERE cor LIKE ?';
    let params = [`%${cor}%`];
  
    // Adicionando filtros de acabamento e último uso
    if (acabamento) {
      query += ' AND acabamento = ?';
      params.push(acabamento);
    }
  
    if (ultimo_usado) {
      if (ultimo_usado === 'recente') {
        query += ' ORDER BY ultimo_usado DESC';
      } else if (ultimo_usado === 'antigo') {
        query += ' ORDER BY ultimo_usado ASC';
      }
    } else {
      query += ` ORDER BY ${criterio}`;  // Classificação por critério
    }
  
    db.query(query, params, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar esmaltes' });
      }
      res.status(200).json(results);  // Retorna os esmaltes filtrados e classificados
    });
  });
  

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
