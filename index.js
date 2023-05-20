const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
const port = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atiqurrahman.ac8ixft.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 100,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // client.connect();

        const myToys = client.db('gameToys').collection('myToys')
        //    Get all data || home route
        app.get('/', async (req, res) => {
            const result = await myToys.find({}).toArray()
            res.send(result)
        })
        // Gallery route
        app.get('/gallery', async (req, res) => {
            const result = await myToys.find({}).limit(20).toArray()
            res.send(result)
        })
        // Shop By Categories
        app.get('/shopByCategory', async (req, res) => {
            const filter = {
                $or: [
                    { subCategory: "Action Figures" },
                    { subCategory: "Replica Items" },
                    { subCategory: "Collectible Statues" },
                    { subCategory: "Plush Toys" },
                    { subCategory: "Gaming Accessories" }
                ]
            }
            const result = await myToys.find(filter).toArray()
            res.send(result)
        })
        // Toy Details Route 
        app.get('/ToyDetails/:id', async (req, res) => {
            const id = req.params
            console.log(id);
            const query = { _id: new ObjectId(id) }


            const result = await myToys.findOne(query)
            res.send(result)
        })

        app.post('/search', async (req, res) => {

        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('App listening on port', port);
})