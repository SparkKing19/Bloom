const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true }
});
const Welcome = mongoose.model('Welcome', welcomeSchema);

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
