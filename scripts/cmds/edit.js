const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseApiUrl = async () => {
  try {
    const base = await axios.get(
      "https://noobs-api-team-url.vercel.app/N1SA9/baseApiUrl.json"
    );
    return base?.data?.rifat || "";
  } catch (e) {
    return "";
  }
};

module.exports = {
  config: {
    name: "edit",
    aliases: ["nano", "banana"],
    version: "1.1",
    author: "Mueid Mursalin Rifat (Fixed by NisaN)",
    countDown: 15,
    role: 0,
    usePrefix: true,
    shortDescription: "🎨 Edit images with Shadowx-AI",
    longDescription: "Apply various edits and styles to images using AI",
    category: "media",
    guide: "{pn} [prompt] (reply/image/url)\nExample: {pn} make anime",
    aliases: ["imageedit", "editimage"]
  },

  onStart: async function ({ api, event, args, message }) {
    let processingMsg;

    try {
      // ✅ Extract URL
      const urlMatch = args.find(arg => arg.match(/^https?:\/\//));

      // ✅ Extract prompt (without URL)
      const prompt = args
        .filter(arg => !arg.match(/^https?:\/\//))
        .join(" ");

      if (!prompt) {
        return message.reply(
          `🎨 Image Editor\n━━━━━━━━━━━━━━━━━━\n` +
          `📌 Usage:\n` +
          `• Reply to image: edit [prompt]\n` +
          `• Attach image: edit [prompt]\n` +
          `• Use URL: edit [prompt] [url]\n\n` +
          `✨ Example:\nmake anime style\nenhance quality`
        );
      }

      // ✅ Detect image source
      let imageUrl;

      if (urlMatch) {
        imageUrl = urlMatch;
      } else if (
        event.type === "message_reply" &&
        event.messageReply.attachments?.[0]
      ) {
        imageUrl = event.messageReply.attachments[0].url;
      } else if (event.attachments?.[0]) {
        imageUrl = event.attachments[0].url;
      }

      if (!imageUrl) {
        return message.reply("❌ Provide an image (reply / attach / URL)");
      }

      // ✅ Processing message
      processingMsg = await message.reply(
        `🎨 Processing...\n📝 ${prompt}\n⏳ 10-30 sec lagbe`
      );

      // ✅ API call
      const base = await baseApiUrl();
      if (!base) throw new Error("API base URL not found");

      const apiUrl = `${base}/edit?url=${encodeURIComponent(imageUrl)}&p=${encodeURIComponent(prompt)}`;

      const response = await axios.get(apiUrl, { timeout: 60000 });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Edit failed");
      }

      const editedUrl = data.catbox_url;
      if (!editedUrl) throw new Error("No image URL");

      // ✅ Download image
      const imgRes = await axios.get(editedUrl, {
        responseType: "arraybuffer",
        timeout: 30000
      });

      const tempPath = path.join(
        __dirname,
        `edited_${Date.now()}_${Math.floor(Math.random() * 1000)}.png`
      );

      fs.writeFileSync(tempPath, imgRes.data);

      // ✅ Remove processing msg
      if (processingMsg?.messageID) {
        await api.unsendMessage(processingMsg.messageID);
      }

      // ✅ Send result (NO auto unsend)
      await message.reply({
        body:
          `✅ Image Edited!\n━━━━━━━━━━━━━━━━━━\n` +
          `📝 Prompt: ${prompt}\n` +
          `⏱️ Time: ${data.job?.processing_time || "N/A"}`,
        attachment: fs.createReadStream(tempPath)
      });

      // ✅ Cleanup
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

    } catch (error) {
      console.error("Edit Error:", error);

      if (processingMsg?.messageID) {
        await api.unsendMessage(processingMsg.messageID);
      }

      let msg = "❌ Edit failed\n";

      if (error.code === "ECONNABORTED") {
        msg += "• Timeout hoise\n";
      } else if (error.response?.status === 413) {
        msg += "• Image too large\n";
      } else {
        msg += `• ${error.message}\n`;
      }

      msg += "\nTry again.";

      message.reply(msg);
    }
  }
};
