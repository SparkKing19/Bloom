const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true }
});
const TicketSetup = mongoose.models.TicketSetup || mongoose.model('TicketSetup', ticketSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-ticket')
        .setDescription('Ticket panel setup karein')
        .addChannelOption(option => 
            option.setName('channel').setDescription('Jahan ticket panel bhejna hai').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner) {
            return interaction.reply({ content: '❌ Yeh command sirf **Bot Owner** ya **Server Owner** use kar sakte hain!', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        await TicketSetup.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { channelId: channel.id },
            { upsert: true, new: true }
        );

        const ticketEmbed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('🎫 Support Tickets')
            .setDescription('Kisi bhi madad ya query ke liye niche diye gaye button par click karke ticket banayein.');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('create_ticket').setLabel('Create Ticket').setStyle(ButtonStyle.Primary).setEmoji('🎫')
        );

        await channel.send({ embeds: [ticketEmbed], components: [row] });

        return interaction.reply({ content: `✅ Ticket panel ${channel} par bhej diya gaya hai!`, ephemeral: true });
    }
};
