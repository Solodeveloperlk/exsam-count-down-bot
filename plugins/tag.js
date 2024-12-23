const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "tagall",
    desc: "Mention all group members",
    category: "group",
    react: "📢",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      body,
      command,
      args,
      isGroup,
      groupMetadata,
      participants,
      groupAdmins,
      isBotAdmins,
      isAdmins,
      sender,
      reply,
    }
  ) => {
    try {
      // Ensure the command is used in a group
      if (!isGroup) {
        return reply("*📛 THIS COMMAND CAN ONLY BE USED IN GROUPS*");
      }

      // Check if the bot is an admin
      if (!isBotAdmins) {
        return reply("*📛 BOT MUST BE AN ADMIN TO USE THIS COMMAND*");
      }

      // Check if the sender is an admin
      if (!isAdmins) {
        return reply("*📛 YOU MUST BE AN ADMIN TO USE THIS COMMAND*");
      }

      // Extract the message to be sent
      const customMessage =
        body.slice(command.length + 1).trim() || "Attention everyone!";
      let message = `乂 *Attention Everyone* 乂\n\n*Message:* ${customMessage}\n\n`;

      // Tag all participants
      for (let participant of participants) {
        message += `❒ @${participant.id.split("@")[0]}\n`;
      }

      // Send the message to the group
      await conn.sendMessage(
        from,
        {
          text: message,
          mentions: participants.map((p) => p.id),
        },
        { quoted: mek }
      );
    } catch (error) {
      console.error("Error:", error);
      reply("An error occurred while processing the command.");
    }
  }
);
