const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

const welcomeSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true }
});
const Welcome = mongoose.models.Welcome || mongoose.model('Welcome', welcomeSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome')
        .setDescription('Welcome channel set karein')
        .addChannelOption(option => 
            option.setName('channel').setDescription('Welcome channel chunein').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner) {
            return interaction.reply({ content: '❌ Yeh command sirf **Bot Owner** ya **Server Owner** use kar sakte hain!', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        await Welcome.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { channelId: channel.id },
            { upsert: true, new: true }
        );

        const embed = new EmbedBuilder()
            .setColor('#2ECC71')
            .setTitle('✅ Welcome Channel Set')
            .setDescription(`Successfully welcome channel set ho gaya hai: ${channel}`);

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
