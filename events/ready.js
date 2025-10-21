// events/ready.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady, 
    once: true,
    execute(client) {
        console.log(`🤖 Bot 已啟動並登入：${client.user.tag}`);

        // 設定遊玩文字 / 狀態
        client.user.setPresence({
            activities: [{ name: '測試階段 0.1', type: 0 }], 
            status: 'online', // 可選: online / idle / dnd / invisible
        });
    },
};
