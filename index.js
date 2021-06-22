const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.json());
app.use(cors())


const port = process.env.PORT || 4500


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pfwqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("groceryStore").collection("elements");
  const ordersCollection = client.db("groceryStore").collection("orders");



  app.get('/addProduct', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })

  })


  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count:', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })




  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/orderedProduct', (req, res) => {
    ordersCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })

  })

  app.get('/addProducts/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, items) => {
        res.send(items)
      })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})