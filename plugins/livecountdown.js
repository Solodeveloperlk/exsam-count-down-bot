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
            // Get current date and time
            const currentDate = new Date();
            const hours = currentDate.getHours(); // Get current hour
            const minutes = currentDate.getMinutes(); // Get current minute

            // Determine greeting based on the updated time ranges
            let greeting = "";

            // Good Morning: 12:01 AM - 11:01 AM
            if (
                (hours === 0 && minutes >= 1) ||
                (hours >= 1 && hours < 11) ||
                (hours === 11 && minutes <= 1)
            ) {
                greeting = "⛅️Good Morning!✨";
            }
            // Good Afternoon: 11:02 AM - 3:59 PM
            else if (
                (hours === 11 && minutes >= 2) ||
                (hours >= 12 && hours < 16)
            ) {
                greeting = "☁️Good Afternoon!✨";
            }
            // Good Night: 4:00 PM - 12:00 AM
            else {
                greeting = "🌥Good Night!✨";
            }

            // Set target date to March 1, 2025, at 23:59
            const targetDate = new Date("2025-03-01T23:59:00");

            // Calculate the difference in milliseconds
            const timeDifference = targetDate - currentDate;

            // If the date is in the past
            if (timeDifference < 0) {
                return reply(`⏳ The target date has already passed.`);
            }

            // Fetch quotes from a separate JSON file
            const quotesJsonLink =
                "https://exsam-countdown.pages.dev/masseg/quotes.json"; // Replace with your quotes JSON link
            const { data: quotesData } = await axios.get(quotesJsonLink);
            const quotes = quotesData.quotes || [];

            console.log(quotes); // Log the fetched quotes to debug

            if (!Array.isArray(quotes) || quotes.length === 0) {
                return await conn.sendMessage(from, {
                    text: "❌ No quotes found in the quotes JSON.",
                });
            }

            // Randomly select a quote and its emoji
            const randomQuote =
                quotes[Math.floor(Math.random() * quotes.length)];
            console.log(randomQuote); // Log the selected quote and emoji
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

            // Fetch image URL from the external JSON link
            const jsonLink =
                "https://exsam-countdown.pages.dev/Days/liveimage.json"; // Your JSON URL
            const { data } = await axios.get(jsonLink);
            const imageUrl =
                data.image || "https://i.ibb.co/98XnsZL/20241008-150032.png"; // Fallback image if none found in JSON

            // Generate the response message with greeting and countdown info
            const message = ` 
${greeting}

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
            reply(`${e}`);
        }
    },
);
