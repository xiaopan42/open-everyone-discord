const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('顯示使用者的詳細資訊')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('選擇要查看的使用者')
                .setRequired(false)),
    async execute(interaction) {
        try {
            // 獲取目標使用者（如果沒有提供，則使用執行指令的人）
            const user = interaction.options.getUser('target') || interaction.user;
            const member = await interaction.guild.members.fetch(user.id, { cache: false }); // 關閉緩存，避免超時問題

            const embed = new EmbedBuilder()
                .setColor('#B57EDC') // 薰衣草紫
                .setTitle('🧑‍🤝‍🧑 使用者資訊')
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
                .addFields(
                    { name: '名字', value: user.tag, inline: true },
                    { name: 'ID', value: user.id, inline: true },
                    { name: '加入伺服器的時間', value: member.joinedAt.toLocaleDateString(), inline: true },
                    { name: '註冊時間', value: user.createdAt.toLocaleDateString(), inline: true },
                    { name: '暱稱', value: member.nickname || '無', inline: true },
                    { name: '狀態', value: user.presence ? user.presence.status : '離線', inline: true },
                    { name: '角色', value: member.roles.cache.map(role => role.name).join(', ') || '無', inline: true }
                )
                .setFooter({
                    text: interaction.client.user.username,
                    iconURL: interaction.client.user.displayAvatarURL()
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ 執行指令時發生錯誤！', flags: 64 }); // 用 flags 代替 ephemeral
        }
    }
};
