import { REST, Routes } from "discord.js";
import { PlayCommand } from "./play";
import dotenv from "dotenv";

dotenv.config();

const commands = [new PlayCommand().data.toJSON()];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || "");

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID || "",
        process.env.GUILD_ID || ""
      ),
      {
        body: commands,
      }
    );

    console.log("Successfully registered slash commands.");
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();
