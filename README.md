# Planning Poker Discord Bot

Planning Poker Discord Bot is an interactive bot designed to facilitate estimation sessions using the planning poker technique for agile development teams. With this bot, teams can easily conduct planning poker sessions directly within their Discord server, making remote estimation activities seamless and straightforward.

> [!NOTE]
> The bot currently only speaks German. Future updates may offer multilingual support.

## Features

- **Interactive Poker Sessions**: Create and manage poker sessions.
- **Automated Player Inclusion:** The bot automatically adds eligible members to a poker game round. To be eligible, a member must have the necessary role assigned and be online at the time a round starts.
- **Real-time Voting**: Allow team members to vote anonymously on tasks or user stories.
- **Automated Score Calculation**: Automatically calculate and display voting results to the team.

## Getting Started

### Create a Bot

To set up the Planning Poker Discord Bot, you'll need to create a bot user through the Discord Developer Portal. Here's how to do it:

1. Visit the [Discord Developer Portal](https://discord.com/developers).

2. Click on the "New Application" button to create a new application. Give it a name that relates to your bot for easy identification.

3. Navigate to the "Bot" tab on the left-hand side and click on the "Reset Token" button.

4. Under the bot settings, you'll find the newly generated token, which you'll use in your `.env` file. Keep this token private.

5. Navigate to the "Privileged Gateway Intents" section. Here, ensure that you enable the "PRESENCE INTENT" and "SERVER MEMBERS INTENT".

6. After setting up the bot, go to the "OAuth2" tab. Under "URL Generator," select "bot" and then in "Bot Permissions," select the "Send Messages" permission.

7. Use the generated URL to invite your bot to your server. Select the server you want to add the bot to from the dropdown menu, and click "Authorize."

Remember to handle your bot token securely and never share it with anyone.

### Installation

Node.js 16.11.0 or newer is required.

> [!NOTE]
> You can skip the installation via `npm install` if you only want to run the bot in a Docker container. For instructions on how to deploy using Docker, please refer to the [Docker Deployment](#docker-deployment) section.

```bash
# Clone the repository
git clone https://github.com/antonsarg/planning-poker-discord-bot.git

# Enter into the directory
cd planning-poker-discord-bot/

# Install the dependencies
npm install
```

### Configuration

Before you run the bot, you will need to set up your environment variables. A sample `.env.example` file is included in the repository, which you should rename to `.env` and update with your specific details.

Here is what each variable in the `.env` file represents:

- `DISCORD_BOT_TOKEN` - This is the token of the bot you saved earlier from the Discord Developer Portal when you created your bot.

- `GUILD_ID` - The server id of your Discord server. You can obtain this by right-clicking the server name on the top left corner and selecting "Copy Server ID".

- `CLIENT_ID` - This is your application id. You can obtain this either by right-clicking the bot's name in the server's user list on the right side and selecting "Copy Client ID", or by visiting the Discord Developer Portal. In the Developer Portal, find your application, and the 'Client ID' will be listed in the application's general information.

- `ROLE_ID` - The role ID for users who are eligible to be added to poker games. Right-click the role in the user detail panel where the role is assigned, and click 'Copy Role ID'.

After you've updated these values in your `.env` file, your bot will be ready to connect to your server with the appropriate permissions.

Remember to enable 'Developer Mode' in your Discord settings if you cannot see the options to copy IDs.

## Run the Bot

To run the Planning Poker Discord Bot, you'll need to have Node.js and npm installed. Depending on your use case, you can run the bot in a production environment or a development environment with live reload.

### For Production

Once you have configured your environment with the necessary variables, execute the command below to start the bot on your server in production mode:

```bash
npm start
```

This command runs the bot in a stable environment without live reloading. Use this for a live server where you want the bot to remain active without interruption.

### For Development

If you are continuing to develop and test new features for the bot, you might prefer to run it in a development environment that supports live reloading. This means the bot will automatically restart whenever you save changes to the code. Start the bot in development mode with the following command:

```bash
npm run dev
```

The npm run dev command leverages nodemon to watch for changes in your source files and restart the bot automatically, making it easier to test new features or changes.

### Docker Deployment

For those who prefer containerization, the Planning Poker Discord Bot can be easily run using Docker Compose.

Prerequisites:

- Docker installed on your system.
- Docker Compose installed on your system.

Steps to deploy with Docker Compose:

1. Build Container with `docker-compose build`
2. Run the container with `docker-compose up -d`

## Usage

With the bot now a part of your server and having been granted the necessary permissions, you can initiate a planning poker round effortlessly. Simply use the `/play` slash command followed by the task or question you want to estimate. The bot will then tally the results once everyone has cast their vote.

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

This project is licensed under the terms of the [MIT](https://choosealicense.com/licenses/mit/) - see the [LICENSE](LICENSE.txt) file for details.
