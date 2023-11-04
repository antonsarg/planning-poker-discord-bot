import { CommandInteraction, SlashCommandBuilder, Message } from "discord.js";

export interface Command {
  name: string;
  description?: string;
  label?: string;
  execute(interaction: CommandInteraction): Promise<void>;
  data: SlashCommandBuilder;
  gameDetailsReply?: Message<boolean>;
}
