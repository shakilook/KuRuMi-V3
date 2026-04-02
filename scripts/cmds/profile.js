const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "profile",
    aliases: ["pp"," pfp"],
    version: "0.0.1",
    author: "AHMED TARIF",
    countDown: 3,
    role: 0,
    shortDescription: "𝐒𝐡𝐨𝐰 𝐩𝐫𝐨𝐟𝐢𝐥𝐞 𝐩𝐢𝐜𝐭𝐮𝐫𝐞",
    longDescription: "pokpok",
    category: "image",
    guide: {
      en: "{pn}[@tag | reply | uid]"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    try {
      let targetID =
        (event.type === "message_reply" && event.messageReply?.senderID) ||
        (event.mentions && Object.keys(event.mentions)[0]) ||
        (args[0] && !isNaN(args[0]) && args[0]) ||
        event.senderID;

      const name = await usersData.getName(targetID).catch(() => "Unknown User");

      const avatarURL = await usersData.getAvatarUrl(targetID);

      const replyText = ``;

      return message.reply({
        body: replyText,
        attachment: await global.utils.getStreamFromURL(avatarURL)
      });

    } catch (err) {
      console.error("𝐜𝐨𝐦𝐦𝐚𝐧𝐝 𝐞𝐫𝐫𝐨𝐫:", err);

      const errorText = `😡| POK POK  LOCKED VAG🏌️‍♀️ `;

      return message.reply(errorText);
    }
  }
};
