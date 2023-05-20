const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
// middleware
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello World!')
})



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
        const singleDetailsToy = client.db('Toy-Shop').collection('details');
        const orderCollection = client.db('Toy-Shop').collection('order');

        // gallery section photo
        app.get('/gallery-photo', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/category-data/:categoryId', async (req, res) => {
            const categoryId = parseInt(req.params.categoryId);

            try {
                const data = await singleDetailsToy.find({ category_id: categoryId }).toArray();
                res.send(data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'An error occurred' });
            }
        });

        app.get('/single-toy/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await singleDetailsToy.findOne(query)
            res.send(result)
        })
        app.post('/order-collection', async (req, res) => {
            const orderData = req.body;
            const result = await orderCollection.insertOne(orderData);
            res.send(result);
        });

        app.get('/order-collection', async (req, res) => {
            const getData = orderCollection.find();
            const totalData = await getData.toArray();
            res.send(totalData);
        })
        app.get('/my-toys', async (req, res) => {
            const findData = orderCollection.find();
            const data = await findData.toArray();
            res.send(data);
        })

        // here is delete section 
        app.delete('/my-toys/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await orderCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/update-toy-collection/:id',async(req,res)=>{
            const id=req.params.id
            const filter={_id: new ObjectId(id)}
            const options={ upsert:true}
            const updateToys=req.body
            const toys={
                $set:{
                    quantity: updateToys.quantity,
                    price:updateToys.price,
                    description:updateToys.description,
                }
            }
            const result=await orderCollection.updateOne(filter,toys,options)
            res.send(result)
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