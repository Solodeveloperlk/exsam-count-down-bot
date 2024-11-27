const axios = require("axios");
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
            // Check if the sender is the owner
            if (!isOwner) {
                return await conn.sendMessage(from, {
                    text: "❌ You are not authorized to use this command. Only the owner can use it.",
                });
            }

            // Send initial confirmation message
            await conn.sendMessage(from, {
                text: "⏳ Starting the countdown broadcast...",
            });

            // Fetch data from JIDs JSON link
            const jidsJsonLink =
                "https://exsam-countdown.pages.dev/masseg/jid.json";
            const { data: jidsData } = await axios.get(jidsJsonLink);

            // Extract JIDs and image URL from the JIDs JSON file
            const forwardJIDs = jidsData.jids || [];
            const imageUrl =
                jidsData.image || "https://i.ibb.co/sW7rZNX/95.jpg";

            if (!Array.isArray(forwardJIDs) || forwardJIDs.length === 0) {
                return await conn.sendMessage(from, {
                    text: "⏳ No JIDs found in the provided JSON.",
                });
            }

            // Fetch quotes from a separate JSON file
            const quotesJsonLink =
                "https://exsam-countdown.pages.dev/masseg/quotes.json"; // Replace with your quotes JSON link
            const { data: quotesData } = await axios.get(quotesJsonLink);
            const quotes = quotesData.quotes || [];

            if (!Array.isArray(quotes) || quotes.length === 0) {
                return await conn.sendMessage(from, {
                    text: "❌ No quotes found in the quotes JSON.",
                });
            }

            // Select a random quote
            const dailyQuote =
                quotes[Math.floor(Math.random() * quotes.length)];

            // Get current date and time
            const currentDate = new Date();
            const hours = currentDate.getHours();

            // Determine greeting
            const greeting =
                hours < 12
                    ? "⛅️Good Morning!✨"
                    : hours < 18
                      ? "☁️Good Afternoon!✨"
                      : "🌥Good Night!✨";

            // Set target date to March 1, 2025, at 23:59:00 (11:59 PM)
            const targetDate = new Date("2025-03-01T23:59:00");

            // Calculate the difference in milliseconds
            const timeDifference = targetDate - currentDate;

            // If the date is in the past
            if (timeDifference < 0) {
                return await conn.sendMessage(from, {
                    text: "⏳ The target date has already passed.",
                });
            }

            // Calculate time components
            const daysRemaining = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24),
            );
            const hoursRemaining = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const weeksRemaining = Math.floor(daysRemaining / 7);
            const monthsRemaining = Math.floor(daysRemaining / 30);

            // Generate the response message
            const caption = `
${greeting}

⏳ *🎖 2024 O/L විභාගයට තව,* ⏳

🏆 *Daily Quote:* 
_*${dailyQuote}👊💪*_

*⌛️* *මාස* *:* *${monthsRemaining}*
*⌛️* *සති*  *:* *${weeksRemaining}*
*⌛️* *දින*  *:* *${daysRemaining}*
*⏰* *පැය*  *:* *${hoursRemaining}*

📅 *අද* *:* *${currentDate.toISOString().split("T")[0]}*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴡᴅʜɪᴛʜᴀ ɴɪʀᴍᴀʟ🧑‍💻*
`;

            // Send the image with caption to all JIDs from the JSON link
            for (const jid of forwardJIDs) {
                await conn.sendMessage(jid, {
                    image: { url: imageUrl },
                    caption,
                });
            }

            // Confirm successful broadcast
            await reply(
                "✅ Countdown message with daily quote successfully forwarded.",
            );
        } catch (e) {
            console.log(e);
            await conn.sendMessage(from, { text: `❌ Error: ${e.message}` });
        }
    },
);
