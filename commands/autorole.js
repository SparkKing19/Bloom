const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');

const autoroleSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    roleId: { type: String, required: true }
});
const AutoRole = mongoose.models.AutoRole || mongoose.model('AutoRole', autoroleSchema);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-autorole')
        .setDescription('Naye members ke liye auto-role set karein')
        .addRoleOption(option => option.setName('role').setDescription('Role chunein').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const isBotOwner = interaction.client.owners.includes(interaction.user.id);
        const isServerOwner = interaction.guild.ownerId === interaction.user.id;

        if (!isBotOwner && !isServerOwner) {
            return interaction.reply({ content: '❌ Yeh command sirf Bot Owner ya Server Owner use kar sakte hain!', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        await AutoRole.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { roleId: role.id },
            { upsert: true, new: true }
        );

        return interaction.reply({ content: `✅ Auto-role successfully set to ${role.name}`, ephemeral: true });
    }
};
