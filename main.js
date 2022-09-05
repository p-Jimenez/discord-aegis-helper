require('dotenv').config();

// Require the necessary discord.js classes
const Fuse = require('fuse.js');
const fetch = require('node-fetch');
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { buildEmbedMove, getMoves } = require('./lib');


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
		const term = interaction.values[0];

		const [moveName, character, index] = term.split("/");

		const data = await fetch(`https://fullmeter.com/fatfiles/release/SFV/SFVFrameData.json?ts=${Date.now()}`).then(response => response.json());

		const framedata = getMoves(data[character].moves.normal);
		const searchOptions = { threshold: 0.6, keys: ["tradNot"] };
		const fuse = new Fuse(framedata, searchOptions);

		const results = fuse.search(moveName);
		
		message = interaction.message.delete();

		message = buildEmbedMove(results[parseInt(index)].item, character);
		await interaction.channel.send({ embeds: [message] });
	}

	return;
});

// Login to Discord with your client's token
client.login(process.env.TOKEN);