const Fuse = require('fuse.js');
const fetch = require('node-fetch');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { buildEmbedMove, getMoves } = require('../lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ufd')
		.setDescription('Urien Frame Data')
		.addStringOption(option => option.setName('move').setDescription('Input+Button (d+LP; b,f+LK; qcf+LP, f+MP > f+HP)').setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const { Urien } = await fetch('https://raw.githubusercontent.com/D4RKONION/fatsfvframedatajson/master/sfv.json').then(response => response.json());

		const urienFramedata = getMoves(Urien.moves.normal);
		const searchOptions = { threshold: 0.6, keys: ["tradNot"] };
		const fuse = new Fuse(urienFramedata, searchOptions);

		const results = fuse.search(interaction.options.getString('move'));

		if (results.length > 0) {

			if (results.length == 1) {
				buildEmbedMove(results[0].item);
				await interaction.editReply({ embeds: [message] });
			}


			else {
				const selectOptions = [];
				for (let index = 0; index < Math.min(results.length, 5); index++) {
					const move = results[index].item;
					selectOptions.push({
						label: move.name,
						description: move.tradNot,
						value: interaction.options.getString('move') + index.toString()
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