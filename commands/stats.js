const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('顯示伺服器統計資料'),
    async execute(interaction) {
        const guild = interaction.guild;
        await guild.members.fetch(); // 確保獲取最新的成員列表
        
        const members = guild.members.cache;
        const totalMembers = members.size;
        const bots = members.filter(member => member.user.bot).size;
        const humans = totalMembers - bots;
        const activeMembers = members.filter(member => member.presence?.status === 'online').size;

        const embed = new EmbedBuilder()
            .setColor('#B57EDC') // 薰衣草紫
            .setTitle('📊 伺服器統計資料')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }) || null)
            .addFields(
                { name: '👥 總成員數', value: `${totalMembers}`, inline: true },
                { name: '🙎 人類成員', value: `${humans}`, inline: true },
                { name: '🤖 機器人數量', value: `${bots}`, inline: true },
                { name: '🟢 在線成員', value: `${activeMembers}`, inline: true }
            )
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL()
            });

        await interaction.reply({ embeds: [embed] });
    }
};
