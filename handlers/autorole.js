const AutoRole = require('../models/AutoRole');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        try {
            const data = await AutoRole.findOne({ guildId: member.guild.id });
            if (!data) return;

            const role = member.guild.roles.cache.get(data.roleId);
            if (role) {
                await member.roles.add(role).catch(() => {});
            }
        } catch (err) {
            console.error('AutoRole Error:', err);
        }
    });
};
