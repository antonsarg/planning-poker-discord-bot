import {
  ComponentType,
  CommandInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  User,
  userMention,
  SlashCommandBuilder,
  SlashCommandStringOption,
  Message,
  TextChannel,
  PermissionsBitField,
  ButtonComponent,
} from "discord.js";
import { Command } from "./command";
import { Poker } from "../poker";

export class PlayCommand implements Command {
  name: string;
  description: string;
  poker?: Poker;
  data: SlashCommandBuilder;
  gameDetailsReply?: Message<boolean>;

  constructor() {
    this.name = "play";
    this.description = "Starte eine neue Runde Planning Poker";
    this.data = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .addStringOption((option: SlashCommandStringOption) =>
        option
          .setName("task")
          .setDescription("Was soll geschätzt werden?")
          .setRequired(true)
      ) as SlashCommandBuilder;
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    // Check if a game is already running
    if (this.poker) {
      await interaction.reply({
        content: "Es läuft bereits eine Runde!",
        ephemeral: true,
      });
      return;
    }

    const question = interaction.options.get("task")?.value as string;

    const users = await this.getUsersWithRoleInChannel(
      interaction,
      process.env.ROLE_ID as string
    );
    this.poker = new Poker(question, users);

    // split the array every 5 elements
    const answersSplit = Poker.ANSWERS.reduce((acc, curr, i) => {
      const index = Math.floor(i / 5);
      acc[index] = acc[index] ? [...acc[index], curr] : [curr];
      return acc;
    }, [] as number[][]);

    const playingCardRows = answersSplit.map((answerRow) => {
      const buttons = answerRow.map(this.createButton);
      return this.createActionRow(buttons);
    });

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("Runde beenden")
      .setStyle(ButtonStyle.Danger);

    const cancelRow = this.createActionRow([cancel]);

    const usersString = users
      .map((user) => `- ${userMention(user.id)} *️⃣`)
      .join("\n");

    this.gameDetailsReply = await interaction.reply({
      content: [`Task: ${question}`, "", "Spieler:", usersString].join("\n"),
      components: [...playingCardRows, cancelRow],
      fetchReply: true,
    });

    const collector = this.gameDetailsReply.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });

    collector.on("collect", async (interaction) => {
      if (!this.poker) {
        interaction.reply({
          content: "Diese Runde ist bereits vorbei!",
          ephemeral: true,
        });
        return;
      }

      if (interaction.customId === "cancel") {
        this.disableButtons();

        const summary = this.poker.cancelQuestion(interaction.user);
        await interaction.reply(summary);
        this.poker = undefined;
        return;
      }

      const answer = parseInt(interaction.customId.split("-")[1]);
      const response = this.poker.addAnswer(interaction.user, answer);

      // Show user his answer
      await interaction.reply({
        content: response.message,
        ephemeral: true,
      });

      this.updateGameDetails();

      // Show summary if all users have answered
      const summary = this.poker.checkIfAllUsersHaveAnswered();

      if (summary) {
        this.disableButtons();
        await interaction.channel?.send(summary);
        this.gameDetailsReply = undefined;
        this.poker = undefined;
      }
    });
  }

  // Updates the game details message with the current question and answers
  updateGameDetails(): void {
    const usersString = this.poker?.users
      .map((user) => {
        // Check if user has already answered
        const answer = this.poker?.currentAnswers.find(
          (answer) => answer.user.id === user.id
        );

        return `- ${userMention(user.id)} ${answer ? "✅" : "*️⃣"}`;
      })
      .join("\n");

    this.gameDetailsReply?.edit({
      content: [
        `Task: ${this.poker?.currentQuestion}`,
        "",
        "Spieler:",
        usersString,
      ].join("\n"),
    });
  }

  createButton(answer: number): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(`card-${answer}`)
      .setLabel(answer.toString())
      .setStyle(ButtonStyle.Primary);
  }

  createActionRow(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder> {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons);
  }

  disableButtons() {
    const newComponents = this.gameDetailsReply?.components.map((row) => {
      {
        const buttons = row.components.map((button) => {
          const buttonComponent = button as ButtonComponent;
          return new ButtonBuilder()
            .setCustomId(buttonComponent.customId || "")
            .setLabel(buttonComponent.label || "")
            .setStyle(buttonComponent.style || ButtonStyle.Primary)
            .setDisabled(true);
        });

        return this.createActionRow(buttons);
      }
    });

    this.gameDetailsReply?.edit({
      content: this.gameDetailsReply.content,
      components: newComponents,
    });
  }

  async getUsersWithRoleInChannel(
    interaction: CommandInteraction,
    roleId: string
  ): Promise<User[]> {
    // Ensure this interaction is in a guild (server) and not a DM
    if (!interaction.guild)
      throw new Error("This command can only be used in a guild.");

    // Ensure the interaction channel is a text channel
    if (!interaction.channel || !(interaction.channel instanceof TextChannel))
      throw new Error("This command can only be used in a text channel.");

    const textChannel: TextChannel = interaction.channel;
    const guild = interaction.guild;

    // Fetch all members with the "Planning Poker" role
    const role = guild.roles.cache.get(roleId);
    if (!role)
      throw new Error(`Role with ID "${roleId}" not found in the guild.`);

    // Fetch all members in the guild to ensure we have a full member list to check against
    await guild.members.fetch();

    // Filter members who have access to the channel and have the "Planning Poker" role
    const membersWithRoleAndAccess = textChannel.members.filter(
      (member) =>
        member.roles.cache.has(role.id) &&
        textChannel
          .permissionsFor(member)
          .has(PermissionsBitField.Flags.ViewChannel)
    );

    const usersWithRoleAndAccess: User[] = membersWithRoleAndAccess.map(
      (member) => member.user
    );

    return usersWithRoleAndAccess;
  }
}
