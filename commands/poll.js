// commands/vote.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('建立一個投票')
        .addStringOption(option =>
            option.setName('題目')
                .setDescription('投票問題')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('選項')
                .setDescription('用逗號分隔的選項，例如: 蘋果,香蕉,橘子')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('多選')
                .setDescription('是否允許多選 (預設: 否)'))
        .addIntegerOption(option =>
            option.setName('時間')
                .setDescription('投票持續時間 (分鐘) 預設 1 分鐘')
                .setRequired(false)),

    async execute(interaction) {
        const question = interaction.options.getString('題目');
        const options = interaction.options.getString('選項').split(',').map(o => o.trim());
        const multi = interaction.options.getBoolean('多選') || false;
        const duration = interaction.options.getInteger('時間') || 1; // 預設 1 分鐘

        if (options.length < 2) {
            return interaction.reply({ content: '❌ 至少要有兩個選項！', ephemeral: true });
        }
        if (options.length > 10) {
            return interaction.reply({ content: '❌ 最多只能有 10 個選項！', ephemeral: true });
        }

        const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

        const embed = new EmbedBuilder()
            .setTitle('📊 投票開始')
            .setDescription(`**${question}**\n\n${options.map((o,i) => `${emojis[i]} ${o}`).join('\n')}`)
            .setFooter({ text: `投票結束時間: ${duration} 分鐘後` })
            .setColor('Blue')
            .setTimestamp();

        const voteMsg = await interaction.reply({ embeds: [embed], fetchReply: true });

        // 加上反應
        for (let i = 0; i < options.length; i++) {
            await voteMsg.react(emojis[i]);
        }

        // 計時器
        setTimeout(async () => {
            const fetchedMsg = await voteMsg.fetch();

            // 統計結果
            let results = options.map((o, i) => {
                const reaction = fetchedMsg.reactions.cache.get(emojis[i]);
                return { option: o, count: reaction ? reaction.count - 1 : 0 }; // 減掉機器人自己
            });

            // 單選：取最多票  
            if (!multi) {
                // 每人只算一票：取該人第一個投的反應
                // 這裡可再進階做 "一人多投只算第一票"
                results.sort((a, b) => b.count - a.count);
            }

            const resultText = results.map(r => `${r.option}：${r.count} 票`).join('\n');

            const resultEmbed = new EmbedBuilder()
                .setTitle('📊 投票結束！')
                .setDescription(`**${question}**\n\n${resultText}`)
                .setColor('Green')
                .setTimestamp();

            await interaction.followUp({ embeds: [resultEmbed] });

        }, duration * 60 * 1000); // 轉換成毫秒
    }
};
