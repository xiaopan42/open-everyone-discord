const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('刪除指定數量的訊息')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('要刪除的訊息數量 (最多100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // 需要管理訊息權限
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: '❌ 請輸入 1~100 之間的數字！', flags: 64 });
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({ content: `✅ 成功刪除 ${amount} 則訊息！`, flags: 64 });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ 無法刪除訊息，請確認機器人有權限。', flags: 64 });
        }
    }
};
