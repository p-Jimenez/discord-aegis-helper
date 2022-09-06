const { MessageEmbed } = require("discord.js");
const { thumbnails } = require("./thumbnails")

exports.buildEmbedMove = function (move, character) {
	const message = new MessageEmbed()
		.setColor('#71368A')
		.setTitle(move.name)
		.setThumbnail(thumbnails[character])
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

exports.renameKeys = function (obj, newKeys) {
	const keyValues = Object.keys(obj).map(key => {
		const newKey = newKeys[key] || key;
		return { [newKey]: obj[key] };
	});
	return Object.assign({}, ...keyValues);
}

function existy(x) {
	return typeof (x) != 'undefined' && x != null;
}