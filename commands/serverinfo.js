const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('顯示伺服器的詳細資訊'),
    async execute(interaction) {
        const guild = interaction.guild;
        
        if (!guild) {
            return interaction.reply({ content: '❌ 這個指令只能在伺服器內使用！', ephemeral: true });
        }

        try {
            // 建立嵌入式訊息
            const embed = new EmbedBuilder()
                .setColor('#B57EDC') // 設定薰衣草紫
                .setTitle('🏢 伺服器資訊')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }) || null) // 設定伺服器圖標
                .addFields(
                    { name: '📌 伺服器名稱', value: guild.name, inline: true },
                    { name: '🆔 伺服器 ID', value: guild.id, inline: true },
                    { name: '📅 創建時間', value: guild.createdAt.toLocaleDateString(), inline: true },
                    { name: '🌍 伺服器區域', value: guild.preferredLocale, inline: true },
                    { name: '👥 成員數量', value: guild.memberCount.toString(), inline: true },
                    { name: '👑 伺服器擁有者', value: (await guild.fetchOwner()).user.tag, inline: true }
                )
                .setFooter({ 
                    text: interaction.client.user.username, 
                    iconURL: interaction.client.user.displayAvatarURL() 
                });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ 獲取伺服器資訊時發生錯誤。', ephemeral: true });
        }
    }
};
