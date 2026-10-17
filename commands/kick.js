const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kisi user ko server se kick karein')
        .addUserOption(option => option.setName('target').setDescription('User ko chunein').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Wajah likhein'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner && !interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: '❌ Aapke paas permissions nahi hain!', ephemeral: true });
        }

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: '❌ User nahi mila.', ephemeral: true });

        await target.kick(reason);
        return interaction.reply({ content: `✅ **${target.user.tag}** ko kick kar diya gaya hai. Wajah: ${reason}` });
    }
};
