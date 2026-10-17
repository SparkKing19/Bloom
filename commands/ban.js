const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Kisi user ko server se ban karein')
        .addUserOption(option => option.setName('target').setDescription('User ko chunein').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Wajah likhein'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner && !interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply({ content: '❌ Aapke paas permissions nahi hain!', ephemeral: true });
        }

        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!target) return interaction.reply({ content: '❌ User nahi mila.', ephemeral: true });

        await target.ban({ reason });
        return interaction.reply({ content: `✅ **${target.user.tag}** ko ban kar diya gaya hai. Wajah: ${reason}` });
    }
};
