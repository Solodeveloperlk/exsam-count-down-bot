const axios = require("axios"); // Ensure axios is included
const { cmd, commands } = require("../command");

cmd(
    {
        pattern: "livecountdown",
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
            // JSON file URL for fetching the target date
            const targetDateJsonLink =
                "https://exsam-countdown.pages.dev/Days/targetDate.json"; // Replace with your JSON link

            // Fetch target date from the JSON file
            const { data: targetData } = await axios.get(targetDateJsonLink);

            // Extract the target date from the JSON
            const targetDate = new Date(targetData.targetDate);

            // Get current date and time
            const currentDate = new Date();

            // Calculate the difference in milliseconds
            const timeDifference = targetDate - currentDate;

            // If the date is in the past
            if (timeDifference < 0) {
                return reply("⏳ The target date has already passed.");
            }

            // Get current hour and minute
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();

            // Determine greeting based on time
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

            // Randomly select a quote and its emoji
            const randomQuote =
                quotes[Math.floor(Math.random() * quotes.length)];
            const dailyQuote = randomQuote.quote;
            const emoji = randomQuote.emoji;

            // Calculate time components
            const daysRemaining = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24),
            );
            const hoursRemaining = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            );
            const weeksRemaining = Math.floor(daysRemaining / 7);
            const monthsRemaining = Math.floor(daysRemaining / 30);

            // Fetch image URL based on days remaining from external JSON link
            const jsonLink =
                "https://exsam-countdown.pages.dev/Days/liveimage.json"; // Your JSON URL
            const { data: imageData } = await axios.get(jsonLink);

            // Find the image based on the remaining days
            let imageUrl = imageData[daysRemaining]
                ? imageData[daysRemaining].image
                : "https://i.ibb.co/98XnsZL/20241008-150032.png"; // Default image if not found

            // Generate the response message with greeting and countdown info
            const message = `${greeting}

⏳ *🎖 2024 O/L විභාගයට තව,* ⏳

🏆 *Daily Quote:* 
_*${dailyQuote} ${emoji}*_

*🕒* *මාස* *:* *${monthsRemaining}*
*🕒* *සති* *:* *${weeksRemaining}*
*🕒* *දින* *:* *${daysRemaining}*
*🕒* *පැය* *:* *${hoursRemaining}*

📅 *අද* *:* *${currentDate.toISOString().split("T")[0]}*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴀᴡᴅʜʏᴛʜᴀ ɴɪʀᴍᴀʟ🧑‍💻*
`;

            // Send the message with an image and caption
            await conn.sendMessage(
                from,
                {
                    image: { url: imageUrl },
                    caption: message,
                },
                { quoted: mek },
            );
        } catch (e) {
            console.log(e);
            reply(`❌ An error occurred: ${e.message}`);
        }
    },
);
