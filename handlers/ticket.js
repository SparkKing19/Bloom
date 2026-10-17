const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const TicketSetup = require('../models/Ticket');

module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'create_ticket') {
            await interaction.deferReply({ ephemeral: true });
            const guild = interaction.guild;

            try {
                const ticketChannel = await guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
                    ]
                });

                const embed = new EmbedBuilder()
                    .setColor('#5865F2')
                    .setTitle('🎫 Support Ticket')
                    .setDescription('Staff member jald hi aapki madad karega. Ticket close karne ke liye niche diye gaye button par click karein.');

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
                );

                await ticketChannel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
                return interaction.editReply(`✅ Aapka ticket ban gaya hai: ${ticketChannel}`);
            } catch (err) {
                return interaction.editReply('❌ Ticket create karne mein error aaya.');
            }
        }

        if (interaction.customId === 'close_ticket') {
            await interaction.channel.send('🔒 Ticket 5 seconds mein delete ho raha hai...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        }
    });
};
