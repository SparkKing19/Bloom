module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;
        // XP tracking logic can be expanded here
    });
};
