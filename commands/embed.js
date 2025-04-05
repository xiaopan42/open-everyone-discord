const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('發送帶顏色的嵌套消息')
        .addStringOption(option => option.setName('color').setDescription('顏色 (HEX)').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('訊息內容').setRequired(true)),

    async execute(interaction) {
        const color = interaction.options.getString('color');
        const message = interaction.options.getString('message');

        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            return interaction.reply('顏色格式無效，請使用 HEX 顏色格式，例如：#ff5733');
        }

        const formattedMessage = message.replace(/\\n/g, '\n');  // 替換掉文字中的 \n

        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(formattedMessage)
            .setFooter({ 
                text: interaction.client.user.username, 
                iconURL: interaction.client.user.displayAvatarURL() 
            });

        await interaction.reply({ embeds: [embed] });
    },
};
