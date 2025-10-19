const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('停權某位使用者')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('要停權的使用者')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('停權的原因')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || '無原因';

        if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) {
            return interaction.reply('❌你沒有權限禁止使用者！');
        }

        try {
            const member = await interaction.guild.members.fetch(target.id);
            await member.ban({ reason: reason });
            return interaction.reply(`✅ ${target.tag} ban by server ! reason：${reason}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('❌ 無法封鎖該成員。');
        }
    },
};
