const { EmbedBuilder } = require('discord.js');  // 使用 EmbedBuilder 代替 MessageEmbed
const config = require("../config/antispam.json");

const userMessages = new Map();
const userWarnings = new Map();

// 自訂警告和禁言訊息
const warningEmbed = (member) => {
    return new EmbedBuilder() // 使用 EmbedBuilder 代替 MessageEmbed
      .setColor('#FF9900')  // 警告顏色
      .setTitle('⚠️ 警告！')
      .setDescription(`${member}, 你已經處於違規邊緣，請即刻停止！違規會帶來嚴重後果，快打住！`)
      .setFooter({ text: '請遵守伺服器規則' })
      .setTimestamp();
  };
  
  const muteEmbed = (member) => {
    return new EmbedBuilder() // 使用 EmbedBuilder 代替 MessageEmbed
      .setColor('#FF0000')  // 禁言顏色
      .setTitle('⛔ 禁言通知')
      .setDescription(`${member}, 你的行為讓你被困在禁言地獄，7天後才可重新發言！⏳`)
      .setFooter({ text: '請遵守伺服器規則' })
      .setTimestamp();
  };

async function warnOrMute(member, channel) {
  const userId = member.id;
  const guild = member.guild;
  const warningCount = userWarnings.get(userId) || 0;

  if (warningCount === 0) {
    userWarnings.set(userId, 1);
    const embed = warningEmbed(member); // 使用警告 Embed
    channel.send({ embeds: [embed] }); // 發送警告訊息
  } else {
    let muteRole = guild.roles.cache.find(r => r.name === "Muted");

    // 自動建立 Muted 角色
    if (!muteRole) {
      muteRole = await guild.roles.create({
        name: "Muted",
        color: "#888888",
        reason: "用於防止刷頻或違規使用者"
      });

      // 設定每個頻道的權限
      guild.channels.cache.forEach(channel => {
        channel.permissionOverwrites.create(muteRole, {
          SendMessages: false,
          AddReactions: false,
          Speak: false
        });
      });
    }

    await member.roles.add(muteRole);
    const embed = muteEmbed(member); // 使用禁言 Embed
    channel.send({ embeds: [embed] }); // 發送禁言訊息

    setTimeout(() => {
      member.roles.remove(muteRole).catch(() => {});
      userWarnings.set(userId, 0); // 重置警告次數
    }, 7 * 24 * 60 * 60 * 1000); // 7天後解除禁言
  }
}

module.exports = {
  async handleMessage(msg) {
    if (msg.author.bot || !msg.guild || !msg.member) return;

    const content = msg.content.trim();
    const userId = msg.author.id;

    // === 重複訊息 ===
    const now = Date.now();
    if (!userMessages.has(userId)) userMessages.set(userId, []);
    const history = userMessages.get(userId).filter(m => now - m.time <= config.duplicateInterval);
    history.push({ content, time: now });
    userMessages.set(userId, history);

    const duplicateCount = history.filter(m => m.content === content).length;
    if (duplicateCount >= 3) {
      await warnOrMute(msg.member, msg.channel);
      return;
    }

    // === 標註太多人 ===
    if (msg.mentions.users.size >= config.maxMentions) {
      await msg.delete().catch(() => {});
      await warnOrMute(msg.member, msg.channel);
      return;
    }

    // === 關鍵字過濾 ===
    for (const word of config.blacklist) {
      if (content.includes(word)) {
        await msg.delete().catch(() => {});
        await warnOrMute(msg.member, msg.channel);
        return;
      }
    }
  }
};
