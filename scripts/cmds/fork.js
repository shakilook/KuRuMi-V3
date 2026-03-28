module.exports = {
  config: {
    name: "fork",
    version: "2.3",
    author: "N1SA9",
    countDown: 5,
    role: 0,
    shortDescription: "Send repo with image",
    longDescription: "Send repo info with image",
    category: "info",
  },

  onStart: async function () {}, // ✅ must থাকতেই হবে

  onChat: async function ({ event, message }) {
    const text = event.body?.toLowerCase().trim();

    if (text !== "fork" && text !== "repo") return;

    try {
      const imgURL = "https://files.catbox.moe/t7vcp3.jpg";
      const attachment = await global.utils.getStreamFromURL(imgURL);

      return message.reply({
        body: `🚀 𝗞𝘂𝗥𝘂𝗠𝗶 𝗩3 𝗥𝗲𝗽𝗼

🔗 Fork Here:
https://github.com/EpicDanger198/KuRuMi-V3.git

— ɴiនꫝɴ✘Ꭼᴅɪᴛᴢ ⸙`,
        attachment
      });

    } catch (err) {
      console.log(err);
      message.reply("❌ Image load failed!");
    }
  },
};
