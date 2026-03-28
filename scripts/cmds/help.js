const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.5",
    author: "Mostakim",
    usePrefix: false,
    role: 0,
    category: "info",
    priority: 1
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const prefix = getPrefix(event.threadID);
    const arg = args[0]?.toLowerCase();

    const header = "╔═━「 𝐇𝐄𝐋𝐏 𝐌𝐄𝐍𝐔 」━═╗";
    const footer = "╚═━──────────────━═╝";

    if (!arg) {
      const list = Array.from(commands.entries())
        .filter(([_, cmd]) => cmd.config?.role <= role)
        .map(([name]) => `┃ ✦ ${name}`)
        .join("\n");

      return message.reply(
        `${header}\n` +
        `┃ 🔑 Prefix: ${prefix}\n` +
        `┃ 📂 Total Commands: ${commands.size}\n` +
        `┃ ⚙ Available Commands:\n` +
        `${list}\n` +
        `${footer}\n` +
        `\n📌 Use \`${prefix}help -<category>\` to filter by category\n` +
        `📌 Use \`${prefix}help <command>\` to see command info`
      );
    }

    // category filter
    if (arg.startsWith("-")) {
      const category = arg.slice(1).toLowerCase();

      const matched = Array.from(commands.entries())
        .filter(([_, cmd]) =>
          cmd.config?.category?.toLowerCase() === category &&
          cmd.config.role <= role
        )
        .map(([name]) => `┃ ✦ ${name}`);

      if (matched.length === 0)
        return message.reply(`✘ No commands found under "${category}".`);

      return message.reply(
        `╔═━「 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐘: ${category.toUpperCase()} 」━═╗\n` +
        `${matched.join("\n")}\n` +
        `${footer}\n` +
        `\n📌 Try: \`${prefix}help <command>\` to view details`
      );
    }

    // command info
    const cmd =
      commands.get(arg) ||
      commands.get(global.GoatBot.aliases.get(arg));

    if (!cmd || cmd.config.role > role)
      return message.reply(`✘ Command "${arg}" not found.`);

    const info = cmd.config;

    const desc =
      typeof info.longDescription === "string"
        ? info.longDescription
        : info.longDescription?.en ||
          info.shortDescription?.en ||
          info.description?.en ||
          info.description ||
          "No description.";

    const guide =
      typeof info.guide === "string"
        ? info.guide
        : info.guide?.en || `${prefix}${info.name}`;

    return message.reply(
      `╔═━「 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐃𝐄𝐓𝐀𝐈𝐋𝐒 」━═╗\n` +
      `┃ ✦ Name: ${info.name}\n` +
      `┃ ✦ Description: ${desc}\n` +
      `┃ ✦ Usage: ${guide.replace(/{pn}/g, prefix).replace(/{p}/g, prefix).replace(/{n}/g, info.name)}\n` +
      `┃ ✦ Aliases: ${info.aliases?.length ? info.aliases.join(", ") : "None"}\n` +
      `┃ ✦ Role: ${info.role ?? 0}\n` +
      `┃ ✦ Category: ${info.category || "Uncategorized"}\n` +
      `┃ ✦ Author: ${info.author || "Unknown"}\n` +
      `┃ ✦ Version: ${info.version || "1.0"}\n` +
      `${footer}`
    );
  }
};
