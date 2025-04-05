const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { ButtonStyle } = require('discord.js'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lottery')
        .setDescription('管理員用來啟動抽獎')
        .addIntegerOption(option => 
            option.setName('winners')
                .setDescription('設定獲獎者的數量')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('prize')
                .setDescription('抽什麼獎品')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('設定抽獎持續時間（秒）')
                .setRequired(true)
        )
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('指定能參加抽獎的身分組')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('note')
                .setDescription('抽獎的備註，使用 Markdown 格式來增加標題或文字大小')
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: '❌ 你必須是管理員才能使用這個指令！', ephemeral: true });
        }

        const winnersCount = interaction.options.getInteger('winners'); // 獲獎人數
        const prize = interaction.options.getString('prize'); // 獎品
        const duration = interaction.options.getInteger('duration'); // 抽獎時間（秒）
        const role = interaction.options.getRole('role'); // 抽獎的身分組
        const note = interaction.options.getString('note'); // 備註（Markdown）

        if (winnersCount <= 0) {
            return interaction.reply({ content: '❌ 請設定有效的獲獎人數（至少 1 人）。', ephemeral: true });
        }

        if (duration <= 0) {
            return interaction.reply({ content: '❌ 請設定有效的抽獎時間（至少 1 秒）。', ephemeral: true });
        }

        const participants = []; 

        let eligibleMembers = interaction.guild.members.cache;
        if (role) {
            eligibleMembers = eligibleMembers.filter(member => member.roles.cache.has(role.id));
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('joinLottery')
                .setLabel('參加抽獎')
                .setStyle(ButtonStyle.Primary)  
        );

        const embed = new EmbedBuilder()
            .setColor('#8A2BE2') 
            .setTitle('# 🎉 抽獎開始！')
            .setDescription(`## 🎁 獎品：${prize}\n## 🕒 參加時間：${duration} 秒\n## 🎟️ 參加按鈕已啟用，點擊來參加抽獎！`)
            .setFooter({ text: `由 ${interaction.user.tag} 發起的抽獎` })
            .setTimestamp();

        if (note) {
            embed.addFields({ name: '📋 備註', value: note });
        }

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const filter = (buttonInteraction) => buttonInteraction.customId === 'joinLottery';

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: duration * 1000, 
        });

        collector.on('collect', async (buttonInteraction) => {
            if (participants.includes(buttonInteraction.user)) {
                return buttonInteraction.reply({ content: '你已經參加過抽獎！', ephemeral: true });
            }

            if (!eligibleMembers.has(buttonInteraction.user.id)) {
                return buttonInteraction.reply({ content: '你無權參加這次抽獎！', ephemeral: true });
            }

            participants.push(buttonInteraction.user);
            await buttonInteraction.reply({ content: `你已經成功參加了抽獎！`, ephemeral: true });
        });

        collector.on('end', async () => {
            if (participants.length === 0) {
                return interaction.followUp({ content: '❌ 沒有參加者，無法進行抽獎！' });
            }

            const winners = [];
            for (let i = 0; i < winnersCount; i++) {
                if (participants.length > 0) {
                    const winner = participants[Math.floor(Math.random() * participants.length)];
                    winners.push(winner);
                    participants.splice(participants.indexOf(winner), 1); 
                }
            }

            const winnerTags = winners.map((winner) => winner.tag).join(', ');
            const resultEmbed = new EmbedBuilder()
                .setColor('#32CD32')  
                .setTitle('# 🎉 抽獎結束！')
                .setDescription(`## 獲獎者：${winnerTags}\n## 獎品：${prize}\n## 感謝大家的參與！`)
                .setFooter({ text: `由 ${interaction.user.tag} 發起的抽獎` })
                .setTimestamp();

            await interaction.followUp({
                embeds: [resultEmbed]
            });
        });
    },
};
