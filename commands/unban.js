const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('解除使用者的封鎖')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('要解除封鎖的使用者 ID')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // 需要 Ban 成員權限
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        try {
            const banList = await interaction.guild.bans.fetch();
            const bannedUser = banList.get(userId);

            if (!bannedUser) {
                return interaction.reply({ content: '❌ 該使用者未被封鎖！', ephemeral: true });
            }

            await interaction.guild.bans.remove(userId);
            return interaction.reply({ content: `✅ 成功解除封鎖 <@${userId}>（${userId}）！` });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ 解除封鎖失敗，請確認 ID 是否正確，或機器人是否有足夠權限。', ephemeral: true });
        }
    }
};
