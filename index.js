const express = require('express')
const cors = require('cors')
const app = express()
require("dotenv").config();

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xicrlbt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() { 
	try {
		const blogsCollection = client.db('nayonPhotography').collection('blogs')
		app.get('/blogs', async (req, res) => {
			const query = {}
			const cursor = blogsCollection.find(query)
			const blogs = await cursor.toArray()
			res.send(blogs)
		})
		
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