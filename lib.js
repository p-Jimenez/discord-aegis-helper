const { MessageEmbed } = require("discord.js");

exports.buildEmbedMove = function (move) {
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
			description += index != (move.description.length - 1) ? '\n' : '';
		});
        message.setDescription(description);
	}

	return message
}

exports.getMoves = function (array) {
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

function existy(x) {
	return typeof (x) != 'undefined' && x != null;
}