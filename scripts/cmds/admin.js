const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "admin",
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			en: "Add, remove, list admin role"
		},
		category: "owner",
		guide: {
			en:
			"{pn} add <uid | @tag>\n" +
			"{pn} remove <uid | @tag>\n" +
			"{pn} list"
		}
	},

	langs: {
		en: {
			added: "✅ | Added admin for %1 user(s):\n%2",
			alreadyAdmin: "⚠ | Already admin:\n%1",
			missingIdAdd: "⚠ | Enter UID or tag to add admin",
			removed: "✅ | Removed admin for %1 user(s):\n%2",
			notAdmin: "⚠ | Not admin:\n%1",
			missingIdRemove: "⚠ | Enter UID or tag to remove admin",
			listAdmin: "👑 | Bot Admin List:\n%1",
			adminOnly: "⚠ | Only bot admin can use this command"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {

		const isAdmin = config.adminBot.includes(event.senderID);

		switch (args[0]) {

			case "add":
			case "-a": {

				if (!isAdmin)
					return message.reply(getLang("adminOnly"));

				if (!args[1])
					return message.reply(getLang("missingIdAdd"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				const added = [];
				const already = [];

				for (const uid of uids) {

					if (config.adminBot.includes(uid))
						already.push(uid);
					else {
						config.adminBot.push(uid);
						added.push(uid);
					}
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					added.map(uid => usersData.getName(uid).then(n => `• ${n} (${uid})`))
				);

				return message.reply(
					(added.length ? getLang("added", added.length, names.join("\n")) : "") +
					(already.length ? "\n" + getLang("alreadyAdmin", already.join("\n")) : "")
				);
			}

			case "remove":
			case "-r": {

				if (!isAdmin)
					return message.reply(getLang("adminOnly"));

				if (!args[1])
					return message.reply(getLang("missingIdRemove"));

				let uids = [];

				if (Object.keys(event.mentions).length > 0)
					uids = Object.keys(event.mentions);
				else if (event.messageReply)
					uids.push(event.messageReply.senderID);
				else
					uids = args.filter(arg => !isNaN(arg));

				const removed = [];
				const notAdmin = [];

				for (const uid of uids) {

					if (config.adminBot.includes(uid)) {

						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
						removed.push(uid);
					}
					else
						notAdmin.push(uid);
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				const names = await Promise.all(
					removed.map(uid => usersData.getName(uid).then(n => `• ${n} (${uid})`))
				);

				return message.reply(
					(removed.length ? getLang("removed", removed.length, names.join("\n")) : "") +
					(notAdmin.length ? "\n" + getLang("notAdmin", notAdmin.join("\n")) : "")
				);
			}

			case "list":
			case "-l": {

				if (!config.adminBot.length)
					return message.reply("No bot admins");

				const list = await Promise.all(
					config.adminBot.map(uid =>
						usersData.getName(uid).then(name => `• ${name} (${uid})`)
					)
				);

				return message.reply(getLang("listAdmin", list.join("\n")));
			}

			default:
				return message.SyntaxError();
		}
	}
};
