const axios = require("axios");
const { cmd, commands } = require("../command");

cmd(
    {
        pattern: "forward",
        desc: "Forward any message from a specific JID to other JIDs (groups or channels)",
        category: "main",
        react: "📤",
        filename: __filename,
    },

    async (
        conn,
        mek,
        m,
        {
            from,
            quoted,
            body,
            isCmd,
            command,
            args,
            q,
            isGroup,
            sender,
            senderNumber,
            botNumber2,
            botNumber,
            pushname,
            isMe,
            isOwner,
            groupMetadata,
            groupName,
            participants,
            groupAdmins,
            isBotAdmins,
            isAdmins,
            reply,
        },
    ) => {
        try {
            // Check if the sender is the owner (you can modify this to allow others)
            if (!isOwner) {
                return await conn.sendMessage(from, {
                    text: "❌ You are not authorized to use this command. Only the owner can use it.",
                });
            }

            // Send confirmation message
            await conn.sendMessage(from, {
                text: "📤 Forwarding the message from the specified JID...",
            });

            // Define the specific JID to forward from (you can replace this with a dynamic JID if needed)
            const forwardFromJID = "1234567890@s.whatsapp.net"; // Replace with the JID from where to forward messages

            // Fetch the JIDs (group and channel) from a remote JSON link
            const jidsJsonLink = "https://exsam-countdown.pages.dev/masseg/jid2.json"; // Your JIDs JSON link
            const { data: jidsData } = await axios.get(jidsJsonLink);
            const forwardJIDs = jidsData.jids || []; // JIDs to forward the message to
            const imageUrl = jidsData.image || "https://i.ibb.co/sW7rZNX/95.jpg"; // Default image URL

            // Check if there are no JIDs to forward
            if (!Array.isArray(forwardJIDs) || forwardJIDs.length === 0) {
                return await conn.sendMessage(from, {
                    text: "⏳ No JIDs found in the provided JSON.",
                });
            }

            // Get the message to forward (quoted message or the original message)
            let messageToForward = mek;
            if (quoted) {
                messageToForward = quoted;
            }

            // If no quoted message, send a fallback message
            if (!messageToForward) {
                return await conn.sendMessage(from, {
                    text: "❌ No message found to forward.",
                });
            }

            // Forward the message to all specified JIDs (groups, channels, etc.)
            for (const jid of forwardJIDs) {
                try {
                    await conn.forwardMessage(jid, messageToForward, true); // Forward message (media or text)
                } catch (err) {
                    console.log(`Error forwarding message to ${jid}:`, err);
                    await conn.sendMessage(jid, {
                        text: "❌ Unable to forward the message. Please try again later.",
                    });
                }
            }

            // Confirm successful forwarding
            await reply("✅ Message forwarded successfully from the specified JID to groups and channels.");
        } catch (e) {
            console.log(e);
            await conn.sendMessage(from, { text: `❌ Error: ${e.message}` });
        }
    },
);
