const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middle Ware
app.use(cors())
app.use(express.json())
require('dotenv').config()






const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tju8r4h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
      
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
       
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Jobhunter is running')
})
app.listen(port, () => {
    console.log(`it is running on port ${port}`)
})