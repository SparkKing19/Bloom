const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Apna current level aur XP check karein'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle(`📊 ${interaction.user.username}'s Rank`)
            .setDescription('Level: **1**\nXP: **150 / 500**');

        return interaction.reply({ embeds: [embed] });
    }
};
