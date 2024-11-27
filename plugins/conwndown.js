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
            // Get current date and time
            const currentDate = new Date();
            const hours = currentDate.getHours();  // Get current hour

            // Determine greeting based on time of day
            let greeting = "";
            if (hours >= 0 && hours < 12) {
                greeting = "⛅️Good Morning!✨";
            } else if (hours >= 12 && hours < 18) {
                greeting = "☁️Good Evening!✨";
            } else {
                greeting = "🌥Good Night!✨";
            }

            // Set default date if no argument is provided
            const defaultDate = "2024-12-31";
            const targetDateStr = q && !isNaN(Date.parse(q)) ? q : defaultDate;

            // Parse the target date
            const targetDate = new Date(targetDateStr);

            // Calculate the difference in milliseconds
            const timeDifference = targetDate - currentDate;

            // If the date is in the past
            if (timeDifference < 0) {
                return reply(`⏳ The target date has already passed.`);
            }

            // Calculate time components
            const daysRemaining = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hoursRemaining = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const weeksRemaining = Math.floor(daysRemaining / 7);
            const monthsRemaining = Math.floor(daysRemaining / 30);

            // Generate the response message with greeting and countdown info
            const message = `
${greeting}

⏳ *🎖 2024 O/L විභාගයට තව,* ⏳

🕒 මාස : *${monthsRemaining}*
🕒 සති : *${weeksRemaining}*
🕒 දින : *${daysRemaining}*
🕒 පැය : *${hoursRemaining}*

📅 අද: *${currentDate.toLocaleDateString()}*
`;

            // Send the message
            await conn.sendMessage(from, { text: message }, { quoted: mek });
        } catch (e) {
            console.log(e);
            reply(`${e}`);
        }
    },
);
