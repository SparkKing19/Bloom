const Welcome = require('../models/Welcome');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        try {
            const data = await Welcome.findOne({ guildId: member.guild.id });
            if (!data) return;

            const channel = member.guild.channels.cache.get(data.channelId);
            if (!channel) return;

            await channel.send(`👋 Welcome ${member} to **${member.guild.name}**! Humare server mein aane ke liye shukriya. 🎉`);
        } catch (err) {
            console.error('Welcome Handler Error:', err);
        }
    });
};
