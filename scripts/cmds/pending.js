const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "approve",
    aliases: ["pen", "pend", "pe", "pending"],
    version: "1.6.9",
    author: "N1SA9",
    countDown: 5,
    role: 0,
    shortDescription: "Handle pending requests",
    longDescription: "Approve or reject pending users or group requests",
    category: "utility"
  },

  onReply: async function ({ api, event, Reply }) {
    if (!Reply) return;

    const { author, pending, messageID } = Reply;

    if (String(event.senderID) !== String(author)) return;

    const { body, threadID } = event;

    if (!body) return;

    if (body.trim().toLowerCase() === "c") {
      try {
        await api.unsendMessage(messageID);
        return api.sendMessage("Operation has been canceled!", threadID);
      } catch {
        return;
      }
    }

    const indexes = body.split(/\s+/).map(Number);

    if (isNaN(indexes[0])) {
      return api.sendMessage("× Invalid input! Please try again.", threadID);
    }

    let count = 0;

    for (const idx of indexes) {

      if (idx <= 0 || idx > pending.length) continue;

      const group = pending[idx - 1];
      const prefix = global.GoatBot.config.prefix || "/";

      try {

        await api.sendMessage(
          `✓ Group approved!\nType ${prefix}help to see available commands.`,
          group.threadID
        );

        await api.changeNickname(
          global.GoatBot.config.nickNameBot || "Bot",
          group.threadID,
          api.getCurrentUserID()
        );

        count++;

      } catch {
        count++;
      }
    }

    return api.sendMessage(
      `✓ Successfully approved ${count} group(s)!`,
      threadID
    );
  },

  onStart: async function ({ api, event, args, usersData }) {

    const { threadID, messageID } = event;

    const type = args[0]?.toLowerCase();

    if (!type) {
      return api.sendMessage(
        "Usage: approve [user/thread/all]",
        threadID
      );
    }

    let msg = "";
    let index = 1;

    try {

      const spam = (await api.getThreadList(100, null, ["OTHER"])) || [];
      const pending = (await api.getThreadList(100, null, ["PENDING"])) || [];

      const list = [...spam, ...pending];

      let filteredList = [];

      if (type.startsWith("u")) filteredList = list.filter(t => !t.isGroup);
      else if (type.startsWith("t")) filteredList = list.filter(t => t.isGroup);
      else if (type === "all") filteredList = list;

      if (filteredList.length === 0) {
        return api.sendMessage("No pending requests found.", threadID);
      }

      for (const single of filteredList) {

        const name =
          single.name ||
          (await usersData.getName(single.threadID)) ||
          "Unknown";

        msg += `[ ${index} ] ${name}\n`;
        index++;
      }

      msg += "\n✓ Reply with the number to approve.";
      msg += "\n× Reply 'c' to cancel.";

      if (!global.GoatBot.onReply) global.GoatBot.onReply = new Map();

      return api.sendMessage(
        `[ Pending ${type.toUpperCase()} List ]\n\n${msg}`,
        threadID,
        (err, info) => {

          global.GoatBot.onReply.set(info.messageID, {
            commandName: "approve",
            messageID: info.messageID,
            author: event.senderID,
            pending: filteredList
          });

        },
        messageID
      );

    } catch (error) {

      return api.sendMessage(
        "× Failed to retrieve pending list.",
        threadID
      );

    }
  }
};
