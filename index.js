const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

//const url = "mongodb://localhost:27017";
const url = "mongodb+srv://lucas_ramuh:bnhDmxAZthfSTaRA@cluster0.1ogva.mongodb.net";
const dbname = "ocean_lab";

async function main(){
  
  console.log("Conectando ao banco de dados");

  const client = await MongoClient.connect(url);
  const db = client.db(dbname);
  const collection = db.collection("herois");

  console.log("Banco de dados conectado com sucesso!")

  
  //Aplicação backend com express
  const app = express();



  //registrar que estamos usando Json no body da requisição
  app.use(express.json());

  app.get('/', function (req, res) {
    res.send('Hello World')
  });

  // /oi -> "Olá, mundo"
  app.get('/oi', function (req, res) {
      res.send('Olá mundo!')
    });

  //  Endpoints de Heróis
  // [GET] / herois -> Read all (Ler tudo)
  app.get("/herois", async function (req, res) {
   const documentos = await collection.find().toArray();
      res.send(documentos);
  });

  // [GET] /herois/:id -> read by id (ler pelo ID)
  app.get("/herois/:id", async function (req, res) {
    
    const id = req.params.id

    //Acessar o registro na collection
    const  item = await collection.findOne({ _id: new ObjectId(id) });
    
    res.send(item);
  })

  // [POST] -> Create (criar)
  app.post("/herois", async function(req, res) {
    //console.log(req.body);
    
    //Acessando o valor enviado no body da requisição
    const item = req.body;
    
    //insere o valor na collection
    await collection.insertOne(item)

    //Exibe uma mensagem de sucesso
    res.send(item);
  });

  //[PUT] /herois/:id -> UPDATE (atualizar)
  app.put("/herois/:id", function (req, res) {
    //Pegar o ID
    const id = req.params.id

    //Pegar o item a ser atualizado
    const item = req.body;

    //Atualizaer na lista o vaor recebido
    collection.updateOne({_id: ObjectId(id)}, {$set: item});

    //Envio uma mensagem de sucesso
    res.send(item);
  });

  //[DELETE] /herois/:id -> Delete (remover)
  app.delete("/herois/:id", async function (req, res) {
    //Pegar o id
    const id = req.params.id;

    //Remove o item da lista
   await collection.deleteOne({_id: new ObjectId(id)});

    //Exibimos uma mensagem de sucesso
    res.send("Item removido com sucesso.")
  })

  app.listen(process.env.PORT || 3000, function () {
      console.log("Aplicação rodando em http://localhost:3000");
  });
}

main();