import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  name: string;
  description?: string;
  data: SlashCommandBuilder;
  execute(interaction: CommandInteraction): Promise<void>;
}
