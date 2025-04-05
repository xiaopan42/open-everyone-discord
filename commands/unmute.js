const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('解除禁言指定的成員')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('要解除禁言的成員')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // 需要「管理成員」權限
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const member = await interaction.guild.members.fetch(target.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: '❌ 找不到該成員！', ephemeral: true });
        }

        try {
            await member.timeout(null); // 解除 Timeout
            return interaction.reply({ content: `✅${target.tag} 已解除禁言！` });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '❌ 解除禁言失敗，請確認機器人有足夠的權限。', ephemeral: true });
        }
    }
};
