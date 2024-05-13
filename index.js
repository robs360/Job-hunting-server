const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// middle Ware
app.use(cors())
app.use(express.json())
require('dotenv').config()






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const jobCollection = client.db('jobdb').collection('jobs')
        const applicantCollection = client.db('jobdb').collection('apply')
        app.get('/jobs', async (req, res) => {
            const result = await jobCollection.find().toArray()
            res.send(result)
        })
        app.get('/jobs/:id',async (req,res)=>{
             const id=req.params.id;
             const query={_id: new ObjectId(id)}
             const result=await jobCollection.findOne(query)
             res.send(result)
        })
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.findOne(query);
            res.send(result)
        })
        app.delete('/jobs/:id',async (req,res)=>{
            const id=req.params.id;
            console.log(id);
            const query={_id: new ObjectId(id)}
            const result =await jobCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/job/:id',async (req,res)=>{
             const id=req.params.id;
             const update=req.body;
             console.log(update)
             const query={_id:new ObjectId(id)}
             const options={upsert:true}
             const updateUser={
                $set:{
                       name:update.name,
                       email:update.email,
                       catigory:update.category,
                       post:update.post,
                       descrip:update.description,
                       title:update.title,
                       date:update.lastDate,
                       salary:update.salary
                }
             }
             const result=await jobCollection.updateOne(query,updateUser,options)
             res.send(result)
        })
        app.put('/jobs/:id',async (req,res)=>{
            const id=req.params.id;
            console.log(id)
            const update=req.body;
            console.log(update)
            const query = { _id: new ObjectId(id) };
            const options={upsert:true};
            const updateUser={
                $set:{
                    applicant:update.app
                }
            }
            const result=await jobCollection.updateOne(query,updateUser,options)
            res.send(result)
        })
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job);
            res.send(result);
        })
        app.get('/search', async (req,res)=>{

               let search='';
               if(req.query.q){
                  search=req.query.q
               }
               console.log(search)
               const result=await jobCollection.find({
                   title:{$regex:search , $options:'i'}
               }).toArray()
                
               res.send(result)
        })
        app.get('/apply',async (req,res)=>{
            const result = await applicantCollection.find().toArray()
            res.send(result)
        })
        app.post('/apply', async (req,res)=>{
            const apply=req.body;
            const result=await applicantCollection.insertOne(apply)
            res.send(result)
        })
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