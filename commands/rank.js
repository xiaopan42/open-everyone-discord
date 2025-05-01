const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const levelFile = path.join(__dirname, '../levelData.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('查看你的等級與 XP'),
  async execute(interaction) {
    const userId = interaction.user.id;

    let levelData = {};
    try {
      levelData = JSON.parse(fs.readFileSync(levelFile, 'utf8'));
    } catch (err) {
      console.error('讀取等級資料失敗：', err);
    }

    const userData = levelData[userId];
    if (!userData) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❗ 尚未有資料')
            .setDescription('你還沒有任何 XP，快開始聊天吧！'),
        ],
        flags: 64,
      });
    }

    const nextLevelXp = userData.level * 100;

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`${interaction.user.username} 的等級資訊`)
      .addFields(
        { name: '等級', value: `${userData.level}`, inline: true },
        { name: 'XP', value: `${userData.xp} / ${nextLevelXp}`, inline: true }
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
