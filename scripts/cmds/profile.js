module.exports = {
  config: {
    name: "profile",
    aliases: ["pfp", "pp"],
    version: "1.2",
    author: "dipto",
    countDown: 5,
    role: 0,
    requiredMoney: 5000,
    description: {
      en: "Get profile image (cost 5000)"
    },
    commandCategory: "image",
    guide: {
      en: "{pn} @tag | userID | reply | facebook url"
    }
  },

  langs: {
    en: {
      notEnoughMoney: "⚠️ You need 5000$ to use this command!",
      error: "⚠️ Error: %1"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {

    const userData = await usersData.get(event.senderID);
    const money = userData.data.money || 0;

    if (money < 5000)
      return message.reply(getLang("notEnoughMoney"));

    const getAvatarUrl = async (uid) => await usersData.getAvatarUrl(uid);
    const uid = Object.keys(event.mentions)[0] || args[0] || event.senderID;
    let avt;

    try {
      if (event.type === "message_reply") {
        avt = await getAvatarUrl(event.messageReply.senderID);
      }
      else if (args.join(" ").includes("facebook.com")) {
        const match = args.join(" ").match(/(\d+)/);
        if (match) avt = await getAvatarUrl(match[0]);
        else throw new Error("Invalid Facebook URL.");
      }
      else {
        avt = await getAvatarUrl(uid);
      }

      message.reply({
        body: "",
        attachment: await global.utils.getStreamFromURL(avt)
      });

    } catch (error) {
      message.reply(getLang("error", error.message));
    }
  }
};
