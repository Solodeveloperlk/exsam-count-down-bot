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
                    text: "*⚠️මෙම Command බාවිතය නිර්මාණ කරුට පමණක් සීමා වී ඇත,කරුකාකර ඔහුට දැනුම් දෙන්න +94729787759 🚫*",
                });
            }

            // Send initial confirmation message
            await conn.sendMessage(from, {
                text: "⏳ මදක් රැදි සිටින්න , Countdown Massage Seding ආරම්භකර ඇත⏳",
            });

            // Fetch data from JIDs JSON link
            const jidsJsonLink =
                "https://exsam-countdown.pages.dev/masseg/jid2.json";
            const { data: jidsData } = await axios.get(jidsJsonLink);

            // Extract JIDs and images from the JIDs JSON file
            const forwardJIDs = jidsData.jids || [];
            const images = jidsData.images || {};

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
            const randomQuote =
                quotes[Math.floor(Math.random() * quotes.length)];
            const dailyQuote = randomQuote.quote; // Get the quote
            const emoji = randomQuote.emoji; // Get the emoji

            // Get current date and time
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();

            // Determine greeting based on the updated time ranges
            let greeting = "";
            if (
                (hours === 0 && minutes >= 1) ||
                (hours >= 1 && hours < 11) ||
                (hours === 11 && minutes <= 1)
            ) {
                greeting = "⛅️Good Morning!✨";
            } else if (
                (hours === 11 && minutes >= 2) ||
                (hours >= 12 && hours < 16)
            ) {
                greeting = "☁️Good Afternoon!✨";
            } else {
                greeting = "🌥Good Night!✨";
            }

            // Set target date to March 1, 2025, at 23:59:00 (11:59 PM)
            const targetDate = new Date("2025-03-01T00:01:00");

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

            // Select the appropriate image based on the number of days remaining
            let selectedImage = images["100"]; // Default image
            if (images[daysRemaining]) {
                selectedImage = images[daysRemaining];
            }

            // Generate the response message
            const caption = ` 
${greeting}

⏳ *🎖 2024 O/L විභාගයට තව,* ⏳

🏆 *Daily Quote:* 
_*${dailyQuote} ${emoji}*_ 

*⌛️* *මාස* *:* *${monthsRemaining}*
*⌛️* *සති*  *:* *${weeksRemaining}*
*⌛️* *දින*  *:* *${daysRemaining}*
*⏰* *පැය*  *:* *${hoursRemaining}*

📅 *අද* *:* *${currentDate.toISOString().split("T")[0]}*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴡᴀᴅʜɪᴛʜᴀ ɴɪʀᴍᴀʟ🧑‍💻*
`;

            // Send the image with caption to all JIDs from the JSON link
            for (const jid of forwardJIDs) {
                await conn.sendMessage(jid, {
                    image: { url: selectedImage },
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
