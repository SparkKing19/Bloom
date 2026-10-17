const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Server mein giveaway start karein')
        .addStringOption(option => option.setName('prize').setDescription('Giveaway ka inaam').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner) {
            return interaction.reply({ content: '❌ Yeh command sirf Bot Owner ya Server Owner use kar sakte hain!', ephemeral: true });
        }

        const prize = interaction.options.getString('prize');
        const embed = new EmbedBuilder()
            .setColor('#E91E63')
            .setTitle('🎉 GIVEAWAY 🎉')
            .setDescription(`Prize: **${prize}**\nHosted by: ${interaction.user}\n\nNiche diye gaye emoji par click karke enter karein!`);

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
        await msg.react('🎉');
    }
};
