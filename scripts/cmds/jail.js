const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "jail",
    version: "4.0",
    author: "N1SA9",
    countDown: 5,
    role: 0,
    shortDescription: "Jail image",
    longDescription: "Reply / Mention / Default jail system",
    category: "image",
    guide: {
      en: "{pn} [reply/@tag/text]"
    }
  },

  onStart: async function ({ event, message, usersData, args }) {
    try {
      let uid;

      // Priority: Reply > Mention > Self
      if (event.messageReply) {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else {
        uid = event.senderID;
      }

      const avatarURL = await usersData.getAvatarUrl(uid);
      const img = await new DIG.Jail().getImage(avatarURL);

      const pathSave = `${__dirname}/tmp/${uid}_Jail.png`;
      fs.writeFileSync(pathSave, Buffer.from(img));

      // Clean text (mention remove)
      let content = args.join(" ");
      if (Object.keys(event.mentions).length > 0) {
        content = content.replace(Object.keys(event.mentions)[0], "").trim();
      }

      message.reply({
        body: content || "🚔 You're in jail!",
        attachment: fs.createReadStream(pathSave)
      }, () => fs.unlinkSync(pathSave));

    } catch (err) {
      console.log(err);
      message.reply("❌ | Error creating image!");
    }
  }
};
