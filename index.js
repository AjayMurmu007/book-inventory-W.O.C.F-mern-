const express = require("express");
const app = express();
const port = process.env.PORT || 5004;
const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());
//
// mern-book-store ,

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// MongoDB Config

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://mern-book-store:<password>@cluster0.ih9nona.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // create  a collection of document & database
    const bookCollections = client.db("BookInventory").collection("books");

    // insert a book to the DB: post method
    app.post("/upload-book", async(req, res) => {
        const data = req.body;
        const result = await bookCollections.insertOne(data);
        res.send(result);
    })
    
    ///

    // get all books from thye database

    app.get("/all-books", async(req ,res) => {
        const books = bookCollections.find();
        const result = await books.toArray();
        res.send(result);
    })

    ///

    // Update a book data : patch or update methods

    app.patch("/book/:id", async(req, res) => {
        const id = req.params.id;
        // console.log(id); 
        const updateBookData = req.body;
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true};

        const updateDoc = {
            $set : {
                ...updateBookData
            }
        }

        // Update
        const result = await bookCollections.updateOne(filter, updateDoc, options);
        res.send(result);
    })

    ///

    // Delete a Book Data

    app.delete("/book/:id", async(req, res) => {
        const id = req.params.id;
        // console.log(id); 
        const filter = {_id: new ObjectId(id)};

        const result = await bookCollections.deleteOne(filter);
        res.send(result);
    })

    ///


    // find by category 
    app.get("/all-books", async(req, res) => {
        let query = {};
        if(req.query?.category) {
            query = { category: req.query.category}
        }
        const result = await bookCollections.find(query).toArray();
        res.send(result);
    })

    ///



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  4UB1GerKNyuCWpXl
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
