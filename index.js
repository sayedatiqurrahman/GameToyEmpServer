const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atiqurrahman.ac8ixft.mongodb.net/?retryWrites=true&w=majority`;

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

        const myToys = client.db('gameToys').collection('myToys')
        //    Get all data || home route
        app.get('/', async (req, res) => {
            const result = await myToys.find({}).limit(20).toArray()
            res.send(result)
        })
        app.post('/', async (req, res) => {
            const data = req.body
            const result = await myToys.insertOne(data)
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

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const body = req.body;
            const updateDoc = {
                $set: {
                    subCategory: body.subCategory,
                    releaseDate: body.releaseDate,
                    rating: body.rating,
                    price: body.price,
                    pictureURL: body.pictureURL,
                    name: body.name,
                    detailDescription: body.detailDescription,
                    availableQuantity: body.availableQuantity
                }
            }
            const result = await myToys.updateOne(query, updateDoc)
            res.send(result)
        })

        app.get('/search/:text', async (req, res) => {
            const search = req.params.text;
            const result = await myToys.find(
                { name: { $regex: search, $options: "i" } }).toArray()
            res.send(result)

        })
        app.get('/myToys/:email', async (req, res) => {
            console.log(req.params.email)
            const result = await myToys.find({
                sellerEmail: req.params.email
            }).toArray()
            res.send(result)
        })

    } finally {
    }
}
run().catch(console.dir);




app.listen(port, () => {
    console.log('App listening on port', port);
})