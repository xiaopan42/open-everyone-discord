const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('問一個問題，讓機器人回答')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('你要問的問題')
                .setRequired(true)),
    async execute(interaction) {
        const responses = [
            '是', '不', '也許', '再試一次', '肯定', '我不確定', '我確定'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`🎱 **問題**: ${interaction.options.getString('question')}\n**回答**: ${randomResponse}`);
    }
};
