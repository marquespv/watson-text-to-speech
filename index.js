
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
require('dotenv').config();
var getStat = require('util').promisify(fs.stat);
//


//
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// acesso ao bd
const mysql = require('mysql');

const con = mysql.createConnection({
  host: process.env.SERVER_HOST, // O host do banco. Ex: localhost
  user: process.env.SERVER_USER, // Um usuário do banco. Ex: user 
  password: process.env.SERVER_PASSWORD, // A senha do usuário. Ex: user123
  database: process.env.SERVER_DATABASE // A base de dados a qual a aplicação irá se conectar, deve ser a mesma onde foi executado o Código 1. Ex: node_mysql
});


con.connect((err) => {
  if (err) {
    console.log('Erro de conexão ao banco de dados...', err)
    return
  }
  console.log('Conectado ao banco de dados!')
})


// watson
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1.js');
const { IamAuthenticator } = require('ibm-watson/auth');

const textToSpeech = new TextToSpeechV1({
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_KEY,
  }),
  serviceUrl: process.env.WATSON_URL,
});
//



//======== rotas 

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/lstmensagens', (req, res) => {
  con.query('SELECT * FROM mensagens', (err, rows) => {
    if (err) throw err
    res.json(rows);
  })
});

app.post('/inseremensagem', function (req, res) {
  const obj = {
    mensagem: req.body.mensagem
  };

  con.query(
    'INSERT INTO mensagens SET ?', obj, (err, res, fields) => {
      if (err) throw err
    })
  res.end();
});


app.get('/sintetizar', function (req, res) {
  leitura = req.query.textoLeitura;

  const synthesizeParams = {
    text: leitura,
    accept: 'audio/mp3',
    voice: 'pt-BR_IsabelaVoice',
  };

  textToSpeech
    .synthesize(synthesizeParams)
    .then(response => {
      const audio = response.result;
      audio.pipe(fs.createWriteStream(path.join(__dirname, '/public/media/audio.mp3')));
    })
    .catch(err => {
      console.log('error index.js 112:', err);
    });

  res.status(200).end();
});


app.get('/audio', async (req, res) => {

  const filePath = path.join(__dirname, '/public/media/audio.mp3');

  try {

    // usou a instrução await
    const stat = await getStat(filePath);

    // exibe uma série de informações sobre o arquivo
    //console.log(stat);

    // informações sobre o tipo do conteúdo e o tamanho do arquivo
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
    });

    const stream = fs.createReadStream(filePath);

    // só exibe quando terminar de enviar tudo
    stream.on('end', () => console.log('fim do streaming...'));

    // faz streaming do audio 
    stream.pipe(res);

  }
  catch (ex) {
    console.error("arquivo não pronto...", ex.message);
  }

});



// configuracao do servidor node para porta 3000
port = 3000 || process.env.PORT;
app.listen(port);
console.log('servidor rodando na porta 3000.');
