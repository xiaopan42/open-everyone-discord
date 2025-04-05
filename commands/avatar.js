const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('顯示使用者的大頭貼')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('選擇要查看頭像的使用者')
                .setRequired(false)),
    async execute(interaction) {
        // 獲取目標使用者（如果沒有提供，則使用執行指令的人）
        const user = interaction.options.getUser('target') || interaction.user;

        // 獲取頭像 URL（支援 GIF）
        const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });

        // 傳送頭像圖片
        await interaction.reply({ content: `🖼 **${user.tag} 的頭像**:\n${avatarURL}` });
    }
};
