const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const chatDataPath = './chatData.json';

function loadChatData() {
    if (!fs.existsSync(chatDataPath)) return {};
    return JSON.parse(fs.readFileSync(chatDataPath, 'utf8'));
}

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.author.bot) return;

        const chatData = loadChatData();
        const response = chatData[message.content];

        if (response) {
            const embed = new EmbedBuilder()
                .setTitle('🎮 回復系統')
                .setDescription(response.replace(/\\n/g, '\n'))
                .setColor('#B57EDC')
                .setFooter({ text: message.client.user.username, iconURL: message.client.user.displayAvatarURL() });

            message.reply({ embeds: [embed] });
        }
    }
};