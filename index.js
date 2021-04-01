const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8888;
require('dotenv').config();
app.use(bodyParser.json())
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2jkon.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




app.get('/', (req, res) => {
  res.send('Hello World!')
})




client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION);
  const ordersCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION2);
  console.log("Connected");
  app.post('/addProduct', (req, res) => {
    try {
      const newProduct = req.body;
      console.log(newProduct);
      productsCollection.insertOne(newProduct)
        .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
        })
    }
    catch{
      res.send(false);
    }
  })
  app.get('/allProducts', (req, res) => {
    try {
      productsCollection.find({})
        .toArray((err, document) => {
          res.send(document);
        })
    }
    catch {
      res.send([]);
    }
  });
  app.get('/product/:id', (req, res) => {
    try {
      const id = ObjectID(req.params.id);
      console.log(id);
      productsCollection.find({ _id: id })
        .toArray((err, document) => {
          res.send(document[0]);
        })
    }
    catch {
      res.send({})
    }
  });
  app.post('/newOrder', (req, res) => {
    try {
      const newOrder = req.body;
      console.log(newOrder);
      ordersCollection.insertOne(newOrder)
        .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
        })
    }
    catch {
      res.send(false);
    }
  })

  app.get('/allOrders', (req, res) => {
    try {
      const email = req.query.email;
      console.log(email);
      ordersCollection.find({ email: email })
        .toArray((err, docs) => {
          res.send(docs);
        })
    }
    catch {
      res.send([]);
    }
  });

  app.delete('/deleteProduct/:id', (req, res) => {
    try {
      const id = ObjectID(req.params.id);
      console.log(id);
      productsCollection.findOneAndDelete({ _id: id })
        .then(document => {
          res.send({ "message:": "delete" });
        })
    }
    catch {
      res.send(false);
    }
  })

});



app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//database: 
//collection: 
