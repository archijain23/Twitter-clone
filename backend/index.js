import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import connectToMongo from "./subs-db/subsdb.js";
import payment from "./routes/payment.js";
import { sendReceiptEmail } from "./services/emailService.js";
import otpRoutes from "./routes/otproutes.js";

import path from "path";
import { fileURLToPath } from "url";

//resolving dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "https://xwiitter.netlify.app",
  })
);
app.use(express.json());
app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      }
    },
  })
);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist"));
});

connectToMongo();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.resic4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export const userCollection = client.db("database").collection("users");
const postCollection = client.db("database").collection("posts");

async function run() {
  try {
    await client.connect();

    //   const postCollection = client.db("database").collection("posts");
    // export const userCollection = client.db("database").collection("users");

    //get
    app.get("/posts", async (req, res) => {
      const posts = (await postCollection.find({}).toArray()).reverse();
      res.json(posts);
    });

    app.get("/user", async (req, res) => {
      const user = await userCollection.find({}).toArray();
      res.json(user);
    });

    app.get("/loggedInUser", async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.setHeader("Content-Type", "application/json");
      res.json(user);
    });
    app.get("/userPost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postCollection.find({ email: email }).toArray()
      ).reverse();
      res.setHeader("Content-Type", "application/json");
      res.json(post);
    });

    //post
    app.post("/posts", async (req, res) => {
      const post = req.body;
      const result = await postCollection.insertOne(post);
      console.log(result);
      res.json(result);
    });

    app.post("/register", async (req, res) => {
      console.log("Received registration request:", req.body);
      const { username, name, email, photoURL, firebaseUid } = req.body;

      try {
        // Check if user already exists
        let user = await userCollection.findOne({ email: email });
        console.log("Existing user:", user);

        let result;
        if (user) {
          // Update existing user
          result = await userCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                firebaseUid: firebaseUid,
                name: name,
                username: username,
                photoURL: photoURL,
                lastLogin: new Date(),
              },
            }
          );
          console.log("Update result:", result);
        } else {
          // Create new user
          const newUser = {
            firebaseUid: firebaseUid,
            email: email,
            name: name,
            username: username,
            photoURL: photoURL,
            createdAt: new Date(),
            lastLogin: new Date(),
            subscription: {
              plan: "Free Plan",
              startDate: new Date(),
              endDate: null,
              status: "active",
            },
          };

          result = await userCollection.insertOne(newUser);
          console.log("Insert result:", result);
        }

        res.status(200).json({
          success: true,
          message: "User registered successfully",
          result,
        });
      } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({
          success: false,
          message: "An error occurred during registration",
          error: error.toString(),
        });
      }
    });

    // API to update user's subscription
    app.post("/update-subscription", async (req, res) => {
      try {
        console.log("Received update subscription request:", req.body);
        const { userId, plan, amount } = req.body;

        if (!userId || !plan || amount === undefined) {
          return res
            .status(400)
            .json({ success: false, message: "Missing required fields" });
        }

        const result = await userCollection.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              "subscription.plan": plan,
              "subscription.amount": amount,
              "subscription.startDate": new Date(),
              "subscription.status": "active",
            },
          }
        );
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }

        // Fetch the updated user document
        const updatedUser = await userCollection.findOne({
          _id: new ObjectId(userId),
        });

        console.log("Updated user subscription:", updatedUser.subscription);
        res.json({ success: true, subscription: updatedUser.subscription });
      } catch (error) {
        console.error("Detailed error in update-subscription:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        });
      }
    });

    //patch
    app.patch("/userUpdates/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const { profilePhoto } = req.body;
      const options = { upsert: true };
      const lastLogin = new Date();

      const updateDoc = {
        $set: { ...profile, profilePhoto: profilePhoto, lastLogin: lastLogin },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      console.log(result.value);
      res.json(result);
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
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist"));
});

app.use("/payment", payment);
app.use("/api/otp", otpRoutes);

app.listen(port, () => {
  console.log(`Twitter listening on port ${port}`);
  console.log(`${process.env.PORT}`);
});
