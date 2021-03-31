const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8888;
require('dotenv').config();
app.use(bodyParser.json())
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
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
    const newProduct = req.body;
    console.log(newProduct);
    productsCollection.insertOne(newProduct)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
    })
    
})

});



app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//database: 
//collection: 
