const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('測試機器人的延遲'),
    async execute(interaction) {
        const ping = interaction.client.ws.ping;
        await interaction.reply(`🏓 Pong! 機器人正常運行中 / 延遲: ${ping}ms`);
    }
};
