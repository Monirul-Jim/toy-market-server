const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Toy-Shop:mIN9QBBr9I4Mdzhg@cluster0.dsd2lyy.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('Toy-Shop').collection('gallery');
    // gallery section photo
    app.get('/gallery-photo', async (req, res) => {
        const cursor = productCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// Toy-Shop
// mIN9QBBr9I4Mdzhg

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})