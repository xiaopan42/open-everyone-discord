const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('踢出某位使用者')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('要踢出的使用者')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('踢出的原因')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || '無原因';

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply('❌你沒有權限踢出使用者！');
        }

        try {
            const member = await interaction.guild.members.fetch(target.id);
            await member.kick(reason);
            return interaction.reply(`✅ ${target.tag} kick by server ! reason：${reason}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('❌ 無法踢出該成員。');
        }
    },
};
