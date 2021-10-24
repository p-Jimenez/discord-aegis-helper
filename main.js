// Require the necessary discord.js classes
const Fuse = require('fuse.js');
const fetch = require('node-fetch');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { buildEmbedMove, getMoves } = require('./lib');
// const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (interaction.isCommand()) {
		const { commandName } = interaction;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

	if (interaction.isSelectMenu()) {
		const { Urien } = await fetch('https://raw.githubusercontent.com/D4RKONION/fatsfvframedatajson/master/sfv.json').then(response => response.json());
		const urienFramedata = getMoves(Urien.moves.normal);
		const searchOptions = { threshold: 0.6, keys: ["tradNot"] };
		const fuse = new Fuse(urienFramedata, searchOptions);
		const term = interaction.values[0];

		const results = fuse.search(term.slice(0,-1));
		
		message = interaction.message.delete();

		message = buildEmbedMove(results[parseInt(term.slice(term.length - 1))].item);
		await interaction.channel.send({ embeds: [message] });
	}

	return;
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);