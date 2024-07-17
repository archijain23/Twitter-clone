import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectToMongo = async () => {
  try {
    await connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.resic4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("---***Database Connected Successfully***---");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongo;
