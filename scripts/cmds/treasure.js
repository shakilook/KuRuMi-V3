module.exports = {
	config: {
		name: "treasure",
		aliases: ["hunt", "dig"],
		version: "1.0",
		author: "NisaN EditZ",
		countDown: 5,
		role: 0,
		description: {
			en: "Play Treasure Hunt! Dig spots 1–5 and find hidden treasure. Limited to 20 games per 20 hours."
		},
		category: "economy",
		guide: {
			en: "{pn} <1-5>: dig a spot for treasure"
		}
	},

	onStart: async function({ message, usersData, event, args }) {
		if (!args[0] || isNaN(args[0]) || args[0] < 1 || args[0] > 5)
			return message.reply("Choose a spot number between 1 and 5!");

		const userChoice = parseInt(args[0]);

		// Bold serif
		const formatBoldSerif = (text) => {
			const map = {a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",
			k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",
			u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
			A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",
			K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",
			U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
			"0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗",
			"$":"$","!":"!","?":"?"," ":" "};
			return text.split('').map(c=>map[c]||c).join('');
		};

		// Limit system
		const now = Date.now();
		const limitData = await usersData.get(event.senderID, "treasureLimit") || { count: 0, lastTime: 0 };
		const hoursPassed = (now - limitData.lastTime) / (1000*60*60);
		if (hoursPassed >= 20) limitData.count = 0;
		if (limitData.count >= 20) {
			const wait = Math.ceil(20 - hoursPassed);
			return message.reply(formatBoldSerif(`You reached 20 games! Wait ${wait}h to dig again.`));
		}

		// Treasure random spot
		const treasureSpot = Math.floor(Math.random() * 5) + 1;

		const bet = 50;
		const userMoney = await usersData.get(event.senderID, "money") || 100;
		let newMoney;
		let textMessage;

		if (userChoice === treasureSpot) {
			newMoney = userMoney + bet * 3; // win 3x bet
			textMessage = `You dug at spot ${userChoice} 🏴‍☠️\nTreasure was at spot ${treasureSpot} 💰\nYou won $${bet*3}!`;
		} else {
			newMoney = Math.max(userMoney - bet, 0);
			textMessage = `You dug at spot ${userChoice} 🏴‍☠️\nTreasure was at spot ${treasureSpot} 💰\nYou lost $${bet}!`;
		}

		await usersData.set(event.senderID, newMoney, "money");
		limitData.count += 1;
		limitData.lastTime = now;
		await usersData.set(event.senderID, limitData, "treasureLimit");

		return message.reply(formatBoldSerif(textMessage));
	}
};
