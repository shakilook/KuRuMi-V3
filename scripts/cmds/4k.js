const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://noobs-api-team-url.vercel.app/N1SA9/baseApiUrl.json`
  );
  return base.data.mostakim;
};
module.exports.config = {
  name: "4k",
  aliases: ["4k", "remini"],
  category: "enhanced",
  author: "Romim"
};

module.exports.onStart = async ({ api, event, args }) => {
  try {

    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.", event.threadID, event.messageID);
    }


    const Romim = event.messageReply?.attachments[0]?.url;


    const apiUrl = (`${await baseApiUrl()}/remini?input=${encodeURIComponent(Romim)}`);
 

    const imageStream = await axios.get(apiUrl,{
      responseType: 'stream'
    });


    api.sendMessage({
      body: "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐩𝐡𝐨𝐭𝐨",
      attachment: imageStream.data
    }, event.threadID, event.messageID);

  } catch (e) {
    api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
  }
};
