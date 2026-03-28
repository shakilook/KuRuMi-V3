module.exports = {
	config: {
		name: "slot",
		aliases: ["slots", "casino"],
		version: "1.3",
		author: "NisaN EditZ",
		countDown: 5,
		role: 0,
		description: {
			en: "Play a slot machine game with random win/loss! Limited to 20 games per 20 hours."
		},
		category: "economy",
		guide: {
			en: "{pn}: play the slot game"
		}
	},

	onStart: async function({ message, usersData, event }) {

		const formatBoldSerif = (text) => {
			const boldMap = {
				a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",
				k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",
				u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
				A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",
				K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",
				U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
				"0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗",
				"$":"$","!":"!","?":"?"," ":" "
			};
			return text.split('').map(c=>boldMap[c]||c).join('');
		};

		// Limit system: 20 games per 20 hours
		const now = Date.now();
		const limitData = await usersData.get(event.senderID, "slotLimit") || { count: 0, lastTime: 0 };
		const hoursPassed = (now - limitData.lastTime) / (1000*60*60);

		if (hoursPassed >= 20) limitData.count = 0;

		if (limitData.count >= 20) {
			const waitHours = Math.ceil(20 - hoursPassed);
			return message.reply(formatBoldSerif(`You have reached the 20 games limit! Wait ${waitHours}h to play again.`));
		}

		// Slot emojis
		const slotEmojis = ["💛","💚","💙","💜","🖤","❤️"];
		const result = [];
		for (let i = 0; i < 3; i++) result.push(slotEmojis[Math.floor(Math.random() * slotEmojis.length)]);

		// Determine win/lose randomly
		const isWin = Math.random() < 0.5; // 50% chance to win
		const bet = 50;
		const userMoney = await usersData.get(event.senderID, "money") || 100;
		let newMoney;
		let messageText;

		if (isWin) {
			newMoney = userMoney + bet * 2;
			messageText = `Baby, you won $${bet * 2}!\nGame Results: [ ${result.join(" | ")} ]\nWin Rate Today: (1/2)`;
		} else {
			newMoney = Math.max(userMoney - bet, 0);
			messageText = `Baby, you lost $${bet}!\nGame Results: [ ${result.join(" | ")} ]\nWin Rate Today: (1/2)`;
		}

		// Update money
		await usersData.set(event.senderID, newMoney, "money");

		// Update limit
		limitData.count += 1;
		limitData.lastTime = now;
		await usersData.set(event.senderID, limitData, "slotLimit");

		return message.reply(formatBoldSerif(messageText));
	}
};
