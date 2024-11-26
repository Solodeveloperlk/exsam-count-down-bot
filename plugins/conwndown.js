const { cmd, commands } = require("../command");

cmd(
    {
        pattern: "countdown",
        desc: "Count down days to a specific date",
        category: "main",
        react: "⏳",
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
            // Set default date if no argument is provided
            const defaultDate = "2024-12-31";
            const targetDateStr = q && !isNaN(Date.parse(q)) ? q : defaultDate;

            // Parse the target date
            const targetDate = new Date(targetDateStr);
            const currentDate = new Date();

            // Calculate the difference in milliseconds
            const timeDifference = targetDate - currentDate;

            // If the date is in the past
            if (timeDifference < 0) {
                return reply(
                    `⏳ The date *${targetDateStr}* has already passed.`,
                );
            }

            // Calculate days remaining
            const daysRemaining = Math.ceil(
                timeDifference / (1000 * 60 * 60 * 24),
            );

            // Generate the response message
            const message = `⏳ *Countdown Timer* ⏳\n\n📅 Target Date: *${targetDateStr}*\n🕒 Days Remaining: *${daysRemaining}*\n\nStart planning now! 🚀`;

            // Send the message
            await conn.sendMessage(from, { text: message }, { quoted: mek });
        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    },
);
