const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "Out",
		aliases: ["l"],
		version: "1.0",
		author: "𝙽𝟷𝚂𝙰𝟿",
		countDown: 5,
		role: 2,
		shortDescription: "bot will leave gc",
		longDescription: "",
		category: "admin",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [tid,blank]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('𝚈𝙾𝚄𝚁 𝙱𝙰𝙱𝚈 𝙻𝙴𝙵𝚃 𝚃𝙷𝙴 𝙶𝚁𝙾𝚄𝙿', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
