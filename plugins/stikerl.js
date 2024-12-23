const { cmd, commands } = require("../command");
const fs = require("fs/promises");
const config = require("../../config.cjs");

cmd(
  {
    pattern: "sticker",
    desc: "Convert image/video to sticker",
    category: "utility",
    react: "🖼️",
    filename: __filename,
  },
  async (
    conn,
    mek,
    m,
    {
      from,
      quoted,
      command,
      args,
      isCmd,
      isGroup,
      reply,
    }
  ) => {
    try {
      // Sticker settings
      const packname = global.packname || "𝐄𝐭𝐡𝐢𝐱-𝐌𝐃";
      const author = global.author || "🥵💫👿";

      // Handle auto-sticker toggle
      if (command === "autosticker") {
        const arg = args[0]?.toLowerCase();
        if (arg === "on") {
          config.AUTO_STICKER = true;
          return reply("Auto-sticker is now enabled.");
        } else if (arg === "off") {
          config.AUTO_STICKER = false;
          return reply("Auto-sticker is now disabled.");
        } else {
          return reply("Usage: /autosticker on|off");
        }
      }

      // Auto sticker functionality
      if (config.AUTO_STICKER && !m.key.fromMe) {
        if (m.type === "imageMessage") {
          const media = await m.download();
          await conn.sendImageAsSticker(from, media, m, { packname, author });
          console.log(`Auto sticker detected`);
          return;
        } else if (m.type === "videoMessage" && m.msg.seconds <= 11) {
          const media = await m.download();
          await conn.sendVideoAsSticker(from, media, m, { packname, author });
          return;
        }
      }

      // Process sticker command
      if (!quoted || (quoted.mtype !== "imageMessage" && quoted.mtype !== "videoMessage")) {
        return reply(`Send/Reply with an image or video to convert into a sticker. Example: /${command}`);
      }

      const media = await quoted.download();
      if (!media) throw new Error("Failed to download media.");

      const filePath = `./${Date.now()}.${
        quoted.mtype === "imageMessage" ? "png" : "mp4"
      }`;
      await fs.writeFile(filePath, media);

      // Convert to sticker based on media type
      if (quoted.mtype === "imageMessage") {
        const stickerBuffer = await fs.readFile(filePath);
        await conn.sendImageAsSticker(from, stickerBuffer, m, { packname, author });
      } else if (quoted.mtype === "videoMessage") {
        await conn.sendVideoAsSticker(from, filePath, m, { packname, author });
      }

      // Cleanup temporary file
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error:", error);
      reply("An error occurred while processing the sticker command.");
    }
  }
);
