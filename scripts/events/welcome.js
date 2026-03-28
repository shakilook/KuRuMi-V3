const { getTime, drive } = global.utils;
if (!global.temp.welcomeEvent)
  global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "2.0",
    author: "Nisan",
    category: "events"
  },

  langs: {
    en: {
      session1: "🌅 morning",
      session2: "☀️ noon",
      session3: "🌇 afternoon",
      session4: "🌙 evening",
      multiple1: "you",
      multiple2: "you guys",
      defaultWelcomeMessage: `📌এ গ্রুপে জয়েন হওয়ার জন্য আপনাকে অসংখ্য ধন্যবাদ😊❤️\n\n╔━━❖❖👑❖❖━━╗\n ✨{userNameTag}🎀\n╚━━❖❖🤗❖❖━━╝\n\n  🥰❖😍❖☺️❖🤗❖😘\n💞💞𝗪𝗘𝗟𝗖𝗢𝗠𝗘💞💞\n
　　          ┊┊┊┊┊💜      
　         　 ┊┊┊┊♥️  
　　          ┊┊┊🖤    
　　          ┊┊🤍         
　　          ┊💚          
　　          💛 \n\n『 {boxName} 』\n\n𒁍⃝⃝🥰গ্রুঁপেঁরঁ পঁক্ষঁ থেঁকেঁ♥⃝🪽\n\n𒁍⃝⃝꧁𝗪𝗘𝗟𝗟𝗖𝗢𝗠𝗘꧂♥⃝🪽\n\n📪এর গ্রুপে আপনাকে স্বাগতম।🌹\n\n📌এই গ্রুপের পক্ষ থেকে আপনাকে ভালোবাসা অবিরাম,আমার গ্রুপটি ভালো লাগলে গ্রুপের সাথে থাকুন।(ধন্যবাদ)\n𒁍⃝⃝🥰আ্ঁপ্ঁনি্ঁ এ্ঁই্ঁ গু্ঁরু্ঁপে্ঁর্ঁ👥{memberCount}না্ঁম্ব্ঁর্ঁ মে্ঁম্বা্ঁর্ঁ.\n\n🌹মনে রাখবেন সবাই একই গ্রুপে আছি মানে সবাই আমরা একে অপর এর ভাই বোন 🫂🥰\n\n🔰আশা করি সারা জীবন আমাদের পাশে থাকবেন🥰\n\n🙂যেকোনো প্রয়োজনে মেসেজ দিন⤵️\n╔━━━❖❖👑❖❖━━━╗\n✨গুরুপের এডমিনকে🎀\n╚━━━❖❖🤗❖❖━━━╝\n\n😘Love You My All New Members🤗\n💫 Have a nice {session}!\n\n👤 Added by: {inviter}`
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const hours = getTime("HH");
    const { threadID } = event;
    const { nickNameBot } = global.GoatBot.config;
    const prefix = global.utils.getPrefix(threadID);
    const dataAddedParticipants = event.logMessageData.addedParticipants;

    // if new member is bot
    if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
      if (nickNameBot)
        api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
      return message.send(
        `🤖 Thank you Baby for inviting me! 🌟\n🚀 Let's get started! Here's some useful information:\n- Bot Prefix: ${prefix} \n- To discover the list of available commands, type: ${prefix}help\n📚 Need assistance or have questions? Feel free to reach out admins anytime. Enjoy your time in the group! 🌈✨`
      );
    }

    // if new member:
    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = {
        joinTimeout: null,
        dataAddedParticipants: []
      };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
      const threadData = await threadsData.get(threadID);
      if (threadData.settings.sendWelcomeMessage == false) return;

      const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const dataBanned = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;
      const userName = [], mentions = [];
      let multiple = false;

      if (dataAddedParticipants.length > 1) multiple = true;

      for (const user of dataAddedParticipants) {
        if (dataBanned.some((item) => item.id == user.userFbId)) continue;
        userName.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (userName.length == 0) return;

      // inviter er info (je add koreche)
      const inviterID = event.author || event.logMessageData.inviter || event.senderID;
      let inviterName = "Unknown User";
      try {
        const info = await api.getUserInfo(inviterID);
        inviterName = info[inviterID]?.name || "Unknown User";
      } catch (e) {}

      // total member count
      let memberCount = 0;
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        memberCount = threadInfo.participantIDs.length;
      } catch (e) {}

      let { welcomeMessage = getLang("defaultWelcomeMessage") } = threadData.data;

      const form = {
        mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
      };

      welcomeMessage = welcomeMessage
        .replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
        .replace(/\{boxName\}|\{threadName\}/g, threadName)
        .replace(/\{multiple\}/g, multiple ? getLang("multiple2") : getLang("multiple1"))
        .replace(/\{session\}/g,
          hours <= 10 ? getLang("session1")
          : hours <= 12 ? getLang("session2")
          : hours <= 18 ? getLang("session3")
          : getLang("session4")
        )
        .replace(/\{inviter\}/g, inviterName)
        .replace(/\{memberCount\}/g, memberCount);

      form.body = `𒁍⃝⃝♥️আসসালামু আলাইকুম♥⃝🪽\n\n${welcomeMessage}\n\n😘Love You My All New Members🤗\n📌Welcome Set Your Nickname `;

      if (threadData.data.welcomeAttachment) {
        const files = threadData.data.welcomeAttachment;
        const attachments = files.reduce((acc, file) => {
          acc.push(drive.getFile(file, "stream"));
          return acc;
        }, []);
        form.attachment = (await Promise.allSettled(attachments))
          .filter(({ status }) => status == "fulfilled")
          .map(({ value }) => value);
      }
      message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
