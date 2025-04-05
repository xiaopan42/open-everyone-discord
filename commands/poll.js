const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('創建一個投票')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('投票問題')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('選項 1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('選項 2')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');

        // 發送投票訊息
        const pollEmbed = {
            color: 0x3498db,
            title: question,
            description: `1️⃣ ${option1}\n2️⃣ ${option2}`,
            timestamp: new Date(),
        };

        const pollMessage = await interaction.reply({ content: '投票開始！', embeds: [pollEmbed], fetchReply: true });
        
        // 加上反應按鈕
        await pollMessage.react('1️⃣');
        await pollMessage.react('2️⃣');
    }
};
