const Fuse = require('fuse.js');
const fetch = require('node-fetch');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbedMove, getMoves } = require('../lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('frame')
		.setDescription('Character Frame Data')
		.addStringOption(option => option.setName('character').setDescription('Character').setRequired(true))
		.addStringOption(option => option.setName('move').setDescription('Input+Button (d+LP; b,f+LK; qcf+LP, f+MP > f+HP)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const data = await fetch(`https://fullmeter.com/fatfiles/release/SFV/SFVFrameData.json?ts=${Date.now()}`).then(response => response.json());

		const searchOptions = { threshold: 0.6, keys: ["tradNot"] };

		const characters = Object.keys(data);
		const characterFuse = new Fuse(characters, { threshold: 0.8, keys: ["tradNot"] });

		// fang gets corrected as zangief for some reason that i dont know
		const characterTerm = interaction.options.getString('character').toLowerCase() === "fang" ? "F.A.N.G" : interaction.options.getString('character');

		const character = characterFuse.search(characterTerm);

		if (character.length === 0) {
			return interaction.editReply('Character not found');
		}

		console.log("character", character[0].item);

		const framedata = getMoves(data[character[0].item]?.moves.normal);

		const framedataFuse = new Fuse(framedata, searchOptions);

		const results = framedataFuse.search(interaction.options.getString('move'));

		if (results.length > 0) {

			if (results.length == 1) {
				buildEmbedMove(results[0].item);
				await interaction.editReply({ embeds: [message] });
			}

			else {
				const selectOptions = [];

				const moveName = interaction.options.getString('move').replace(/\//g, "");

				for (let index = 0; index < Math.min(results.length, 5); index++) {
					const move = results[index].item;
					selectOptions.push({
						label: move.name,
						description: move.tradNot,
						value: `${moveName}/${character[0].item}/${index.toString()}`
					})
				}

				const row = new MessageActionRow()
					.addComponents(
						new MessageSelectMenu()
							.setCustomId('select')
							.setPlaceholder('Nothing selected')
							.addOptions(selectOptions),
					);

				await interaction.editReply({ content: 'Select one move', components: [row] })
			}

		} else {
			await interaction.editReply("The move you are trying to search wasn't found 🥺")
		}
	},
};

/*
{
  moveName: 'Stand LP',
  plnCmd: 'LP',
  numCmd: '5LP',
  startup: 4,
  active: 2,
  recovery: 10,
  total: 15,
  onHit: 4,
  onBlock: 2,
  vtc1OnHitF: '2 / -16',
  vtc1OnBlockF: '0 / -20',
  vtc1OnHitB: '-5 / -18',
  vtc1OnBlockB: '-7 / -20',
  vtc1OnHitD: '-17 / -20',
  vtc1OnBlockD: '-19 / -22',
  vtc2OnHit: 2,
  vtc2OnBlock: 0,
  damage: 30,
  stun: 70,
  hcWinSpCa: 11,
  hcWinTc: 11,
  hcWinVt: 11,
  attackLevel: 'H',
  cancelsTo: [ 'sp', 'su', 'vt1', 'vt2' ],
  airmove: false,
  followUp: false,
  projectile: false,
  extraInfo: [ 'Primarily used for Headbutt Loops' ],
  moveType: 'normal',
  moveMotion: 'N',
  moveButton: 'LP',
  i: 1
}
*/