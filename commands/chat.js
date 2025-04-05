const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

const chatDataPath = './chatData.json';

function loadChatData() {
    if (!fs.existsSync(chatDataPath)) return {};
    return JSON.parse(fs.readFileSync(chatDataPath, 'utf8'));
}

function saveChatData(data) {
    fs.writeFileSync(chatDataPath, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('管理自動回覆指令')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('新增自動回覆')
                .addStringOption(option => 
                    option.setName('關鍵字')
                        .setDescription('輸入要觸發的關鍵字')
                        .setRequired(true))
                .addStringOption(option => 
                    option.setName('回應')
                        .setDescription('輸入機器人要回覆的內容 (可用 \\n 換行)')
                        .setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('刪除自動回覆')
                .addStringOption(option => 
                    option.setName('關鍵字')
                        .setDescription('輸入要刪除的關鍵字')
                        .setRequired(true))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // 只有管理員能用

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const chatData = loadChatData();

        if (subcommand === 'add') {
            const keyword = interaction.options.getString('關鍵字');
            const response = interaction.options.getString('回應');

            chatData[keyword] = response;
            saveChatData(chatData);

            await interaction.reply(`✅ 已新增回覆：**${keyword}** → \`${response.replace(/\\n/g, '\n')}\``);
        }

        if (subcommand === 'remove') {
            const keyword = interaction.options.getString('關鍵字');

            if (!chatData[keyword]) {
                return interaction.reply(`❌ 找不到關鍵字：**${keyword}**`);
            }

            delete chatData[keyword];
            saveChatData(chatData);

            await interaction.reply(`✅ 已刪除關鍵字：**${keyword}**`);
        }
    }
};
