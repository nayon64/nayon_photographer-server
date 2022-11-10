const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express()
require("dotenv").config();

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xicrlbt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() { 
	try {
		const blogsCollection = client.db('nayonPhotography').collection('blogs')
		const servicesCollection = client.db('nayonPhotography').collection('services')
		const reviewsCollection = client.db('nayonPhotography').collection('reviews')

		// get blogs data 

		app.get('/blogs', async (req, res) => {
			const query = {}
			const cursor = blogsCollection.find(query)
			const blogs = await cursor.toArray()
			res.send(blogs)
		})

		// get multiple services data  

		app.get('/services', async (req, res) => {
			const size = parseInt(req.query.size);
			const query = {}
			const cursor = servicesCollection.find(query).sort({ date: -1 });
			const services = await cursor.limit(size).toArray()
			res.send(services)
		})

		// add service data 
		app.post('/services', async (req, res) => {
			const service = req.body
			const result = await servicesCollection.insertOne(service)
			res.send(result)
		})

		// add post method of review 

		app.post('/reviews', async (req, res) => {
			const review = req.body
			const result = await reviewsCollection.insertOne(review)
			res.send(result)
		})

		// get review by service
		app.get('/reviews/:id', async (req, res) => {
			const serviceId = req.params.id;
			const query = { serviceId:serviceId};
			const cursor = reviewsCollection.find(query).sort({ date: -1 });
			const reviews = await cursor.toArray();
			res.send(reviews);
		})

		// get review by useruid
		app.get('/myReviews/:id', async (req, res) => {
			const userUid = req.params.id;
			const query = { userUid: userUid };
			console.log(query)
			const cursor = reviewsCollection.find(query).sort({ date: -1 });
			const reviews = await cursor.toArray();
			res.send(reviews);
		})

		// delete review
		app.delete('/myReviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await reviewsCollection.deleteOne(query);
			res.send(result);
		})

		// get service single data 

		app.get('/service/:id', async (req, res) => {
			const id = req.params.id
			const query = { _id: ObjectId(id) }
			const service = await servicesCollection.findOne(query)
			res.send(service)
		})
		

		// server root file 
		app.get("/", (req, res) => {
			res.send("server is running");
		});
	}
	finally {
		
	}
}
run().catch(err=>console.log(err))




app.listen(port, () => {
	console.log(`Server is running ${port}`)
})