const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Bot ke sabhi commands ki list dekhein'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('📜 Bot Command Menu')
            .addFields(
                { name: '⚙️ Owner / Admin Setup', value: `\`/set-welcome\` - Welcome channel set karein\n\`/set-ticket\` - Ticket panel setup karein\n\`/set-autorole\` - Auto role configure karein` },
                { name: '🛠️ Moderation & Utilities', value: `\`/ban\` - User ko ban karein\n\`/kick\` - User ko kick karein\n\`/giveaway\` - Giveaway start karein\n\`/rank\` - Apna level check karein` }
            )
            .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
