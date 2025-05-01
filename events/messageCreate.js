const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const chatDataPath = './chatData.json';
const levelDataPath = './levelData.json';

function loadChatData() {
    if (!fs.existsSync(chatDataPath)) return {};
    const raw = fs.readFileSync(chatDataPath, 'utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
}

function loadLevelData() {
    if (!fs.existsSync(levelDataPath)) return {};
    const raw = fs.readFileSync(levelDataPath, 'utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
}

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        // === 等級系統處理 ===
        let levelData = loadLevelData();
        const userId = message.author.id;

        if (!levelData[userId]) {
            levelData[userId] = {
                xp: 0,
                level: 1,
            };
        }

        levelData[userId].xp += Math.floor(Math.random() * 10) + 1;
        const nextLevelXp = levelData[userId].level * 100;

        if (levelData[userId].xp >= nextLevelXp) {
            levelData[userId].xp -= nextLevelXp;
            levelData[userId].level += 1;

            const levelUpEmbed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🎉 升級了！')
                .setDescription(`<@${userId}> 現在是 **等級 ${levelData[userId].level}** 了！`)
                .setTimestamp();

            message.channel.send({ embeds: [levelUpEmbed] });
        }

        fs.writeFileSync(levelDataPath, JSON.stringify(levelData, null, 2));

        // === 自動回覆系統 ===
        const chatData = loadChatData();
        const response = chatData[message.content];

        if (response) {
            const replyEmbed = new EmbedBuilder()
                .setTitle('🎮 回復系統')
                .setDescription(response.replace(/\\n/g, '\n'))
                .setColor('#B57EDC')
                .setFooter({
                    text: message.client.user.username,
                    iconURL: message.client.user.displayAvatarURL()
                });

            message.reply({ embeds: [replyEmbed] });
        }
    }
};
