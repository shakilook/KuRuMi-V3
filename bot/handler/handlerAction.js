const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");

module.exports = (
  api,
  threadModel,
  userModel,
  dashBoardModel,
  globalModel,
  usersData,
  threadsData,
  dashBoardData,
  globalData
) => {
  const handlerEvents = require(
    process.env.NODE_ENV === "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(
    api,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    usersData,
    threadsData,
    dashBoardData,
    globalData
  );

  return async function (event) {
    try {

      // ————————— CHECK ANTI INBOX —————————
      if (
        global.GoatBot.config?.antiInbox === true &&
        (event.senderID === event.threadID ||
          event.userID === event.senderID ||
          event.isGroup === false)
      ) {
        return;
      }

      const message = createFuncMessage(api, event);

      // ————————— CHECK DATABASE —————————
      await handlerCheckDB(usersData, threadsData, event).catch(() => { });

      const handlerChat = await handlerEvents(event, message);
      if (!handlerChat) return;

      // ————————— APPROVAL SYSTEM —————————
      if (global.GoatBot.config?.approval) {
        let approvedtid =
          (await globalData.get("approved", "data", {}).catch(() => ({}))) || {};

        if (!approvedtid.approved) {
          approvedtid.approved = [];
          await globalData.set("approved", approvedtid, "data");
        }

        if (!approvedtid.approved.includes(event.threadID)) return;
      }

      const {
        onAnyEvent,
        onFirstChat,
        onStart,
        onChat,
        onReply,
        onEvent,
        handlerEvent,
        onReaction,
        typ,
        presence,
        read_receipt
      } = handlerChat;

      // ————————— ANY EVENT —————————
      if (typeof onAnyEvent === "function") onAnyEvent();

      switch (event.type) {

        case "message":
        case "message_reply":
        case "message_unsend":
          if (typeof onFirstChat === "function") onFirstChat();
          if (typeof onChat === "function") onChat();
          if (typeof onStart === "function") onStart();
          if (typeof onReply === "function") onReply();
          break;

        case "event":
          if (typeof handlerEvent === "function") handlerEvent();
          if (typeof onEvent === "function") onEvent();
          break;

        case "message_reaction":
          if (typeof onReaction === "function") onReaction();

          const { delete: del = [], kick = [] } =
            global.GoatBot.config?.reactBy || {};

          // ——— DELETE MESSAGE REACTION ———
          if (del.includes(event.reaction)) {
            if (event.senderID === api.getCurrentUserID()) {
              if (global.GoatBot.config?.adminBot?.includes(event.userID)) {
                api.unsendMessage(event.messageID);
              }
            }
          }

          // ——— KICK USER REACTION ———
          if (kick.includes(event.reaction)) {
            if (global.GoatBot.config?.adminBot?.includes(event.userID)) {
              api.removeUserFromGroup(
                event.senderID,
                event.threadID,
                (err) => {
                  if (err) console.log(err);
                }
              );
            }
          }

          break;

        case "typ":
          if (typeof typ === "function") typ();
          break;

        case "presence":
          if (typeof presence === "function") presence();
          break;

        case "read_receipt":
          if (typeof read_receipt === "function") read_receipt();
          break;

        default:
          break;
      }

    } catch (err) {
      console.error("HandlerAction Error:", err);
    }
  };
};
