const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://assignment-11-a7428.web.app",
      // "https://cardoctor-bd.firebaseapp.com",
    ],
  })
);
app.use(express.json());

// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4tsqecu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    const serviceCollection = client.db("Doctor").collection("services");

    const purchaseServicesCollection = client.db("Doctor").collection("card");

    app.get("/manageService", async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { customer_email: email };
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.put("/bookstatusupdate", async (req, res) => {
      try {
        const body = req.body;
        console.log(body);
        if (!req.body.id) {
          return res.status(408).json({ error: "No ID provided" });
        }

        const id = req.body.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: {
            status: body.status,
          },
        };

        const result = await purchaseServicesCollection.updateOne(
          filter,
          updateDoc
        );
        res.json(result);
      } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    //  app.put()
    app.put("/BookedServiceUpdate", async (req, res) => {
      try {
        const body = req.body;
        if (!req.query.id) {
          return res.status(408).json({ error: "No ID provided" });
        }

        const id = req.query.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };

        const updateDoc = {
          $set: {
            service_name: body.names,
            service_area: body.area,
            service_image: body.photo,
            service_price: body.price,
            service_price: body.price,
            // name: body.username,
            service_description: body.descriptions,
          },
        };

        const result = await serviceCollection.updateOne(filter, updateDoc);
        res.json(result);
      } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/deleteService/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/booked", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await purchaseServicesCollection.insertOne(data);
      // console.log(res);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/bookedService", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = purchaseServicesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const allar = req.body;
      console.log(allar);
      const result = await serviceCollection.insertOne(allar);
      console.log(result);
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`doctor is running`);
});

app.listen(port, () => {
  console.log(`Doctor Server is running${port}`);
});
