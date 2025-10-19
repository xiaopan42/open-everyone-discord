const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('禁言某位使用者')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('要禁言的使用者')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('禁言時間（分鐘）')
                .setRequired(true)
                .setMinValue(1)
        )
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('禁言的原因')
                .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration'); // 禁言時間（分鐘）
        const reason = interaction.options.getString('reason') || '無原因';

        if (!interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            return interaction.reply('❌你沒有權限禁言使用者！');
        }

        try {
            const member = await interaction.guild.members.fetch(target.id);

            // 確保該成員有足夠的權限
            if (member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply('❌無法禁言具有管理權限的使用者');
            }

            // 計算禁言的毫秒數
            const muteDuration = duration * 60 * 1000; // 轉換成毫秒

            // 設定禁言
            await member.timeout(muteDuration, reason);

            return interaction.reply(`✅ ${target.tag} 成功禁言 持續 ${duration} 分鐘 原因：${reason}`);
        } catch (error) {
            console.error(error);
            return interaction.reply('❌ 禁言失敗。');
        }
    },
};
