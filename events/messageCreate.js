// events/messageCreate.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // 忽略機器人自己的訊息
        if (message.author.bot) return;

        // 這裡可以加上你未來需要的功能
        // 例如關鍵字觸發、管理功能等
    },
};
