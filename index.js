const express = require('express')
const cors = require('cors')
const app = express()
const port = 5001
require('dotenv').config()

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const database = client.db(process.env.DB_NAME);
        const jobsCollection = database.collection("jobs");
        const companyCollection = database.collection("companyCollection");
        const applicationCollection = database.collection("applicationCollection");


        app.post('/api/jobs', async (req, res) => {
            const job = req.body;

            const newJob = {
                ...job,
                createdAt: new Date()
            }

            const result = await jobsCollection.insertOne(newJob);

            res.json(result)

        })

        app.get('/api/jobs', async (req, res) => {
            const query = {};

            if (req.query.companyId) {
                query.companyId = req.query.companyId
            }
            if (req.query.status) {
                query.status = req.query.status
            }

            const cursor = jobsCollection.find(query);
            const result = await cursor.toArray();

            res.json(result)
        })
        app.get('/api/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }

            const result = await jobsCollection.findOne(query);

            res.json(result)
        })

        //application related apis
        app.get('/api/applications', async (req, res) => {
            const query = {};

            if (req.query.applicantId) {
                query.applicantId = req.query.applicantId;
            }
            if (req.query.jobId) {
                query.jobId = req.query.jobId;
            }

            const cursor = applicationCollection.find(query);
            const result = await cursor.toArray();

            res.json(result)
        })
        app.post('/api/applications', async (req, res) => {
            const application = req.body;

            const newApplication = {
                ...application,
                createdAt: new Date()
            }

            const result = await applicationCollection.insertOne(newApplication);
            res.json(result)

        })

        app.post('/api/companies', async (req, res) => {
            const company = req.body;

            const newCompany = {
                ...company,
                createdAt: new Date()
            }
            const result = await companyCollection.insertOne(newCompany);

            res.json(result)
        })

        app.get('/api/my/companies', async (req, res) => {
            const query = {};

            if (req.query.recruiterId) {
                query.recruiterId = req.query.recruiterId
            }

            const result = await companyCollection.findOne(query);
            console.log(result)
            res.json(result)
        })

    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})