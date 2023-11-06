import dotenv from "dotenv";

import { client } from "./client";

dotenv.config();

// distinguishing the different types of error
// otherwhise we can use only one try/catch block and return a general error
const login = async () => {
  const credentials = process.env.TOKEN || false;

  if (credentials) {
    try {
      await client.login(process.env.TOKEN);
    } catch (e) {
      console.log(e);
      // TOKEN is not valid, failed to login
      console.log("The token provided not seems to be valid");
      process.exit(1);
    }
  } else {
    // TOKEN is empty or cannot find .env file
    console.log("You must provide a token");
    process.exit(1);
  }
};

login();
