const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Fuse = require('fuse.js');
const fetch = require('node-fetch');

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

			const move = results[0].item;
			const message = new MessageEmbed()
				.setColor('#71368A')
				.setTitle(move.name)
				.setThumbnail('https://game.capcom.com/cfn/sfv/as/img/character/thum/urn.png?h=8bb40555d0a2e4f9766e75d5a1cbd8d9')
				.addFields(
					{ name: 'Input', value: move.tradNot },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Start Up', value: move.startup.toString(), inline: true },
					{ name: 'Active', value: existy(move.active) ? move.active.toString() || 0 : '\u200B', inline: true },
					{ name: 'Recovery', value: existy(move.recovery) ? move.recovery.toString() || 0 : '\u200B', inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'On hit', value: existy(move.onHit) ? move.onHit.toString() || 0 : '\u200B', inline: true },
					{ name: 'On block', value: existy(move.onBlock) ? move.onBlock.toString() || 0 : '\u200B', inline: true },
					{ name: '\u200B', value: '\u200B' },
					{ name: 'Damage', value: existy(move.damage) ? move.damage.toString() || 0 : '\u200B', inline: true },
					{ name: 'Stun', value: existy(move.stun) ? move.stun.toString() || 0 : '\u200B', inline: true }
				);

			if (move.description) {
				let description = "";
				move.description.forEach((element, index) => {
					description += element;
					description += index != (move.description.length - 1) ? '\n': '';
				});
			}

			await interaction.editReply({ embeds: [message] });
		} else {
			await interaction.editReply("The move you are trying to search wasn't found 🥺")
		}
	},
};

function getMoves(array) {
	const movesArray = [];
	for (const key in array) {
		movesArray.push({
			name: array[key].moveName,
			tradNot: array[key].plnCmd,
			numNot: array[key].numCmd,
			startup: array[key].startup,
			active: array[key].active,
			recovery: array[key].recovery,
			onHit: array[key].onHit,
			onBlock: array[key].onBlock,
			damage: array[key].damage,
			stun: array[key].stun,
			description: array[key].extraInfo
		});
	}
	return movesArray;
}

function existy (x) {
    return typeof (x) != 'undefined' && x != null;
}

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