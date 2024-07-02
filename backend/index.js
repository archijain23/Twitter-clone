import dotenv from "dotenv";
import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5000",
    methods: ["GET", "POST", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//use the client app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.resic4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const postCollection = client.db("database").collection("posts");
    const userCollection = client.db("database").collection("users");

    //get
    app.get("/posts", async (req, res) => {
      const posts = (await postCollection.find({}).toArray()).reverse();
      res.send(posts);
    });

    app.get("/user", async (req, res) => {
      const user = await userCollection.find({}).toArray();
      res.send(user);
    });

    app.get("/loggedInUser", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.send(user);
    });
    app.get("/userPost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postCollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });

    //post
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      console.log(result);
      res.send(result);
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    //patch
    app.patch("/userUpdates/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const { profilePhoto } = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: { ...profile, profilePhoto: profilePhoto } };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log(result.value);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (e) {
    console.error(e);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Twitter listening on port ${port}`);
  console.log(`${process.env.PORT}`);
});

//Render client for any path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
