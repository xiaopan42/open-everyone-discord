const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const fs = require('fs');
const chatDataPath = './chatData.json';
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const player = new Player(client);
client.player = player;

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

function loadChatData() {
    if (!fs.existsSync(chatDataPath)) return {};
    return JSON.parse(fs.readFileSync(chatDataPath, 'utf8'));
}

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const chatData = loadChatData();
    const response = chatData[message.content];

    if (response) {
        const embed = new EmbedBuilder()
            .setTitle('🎮 回復系統')
            .setDescription(response.replace(/\\n/g, '\n'))
            .setColor('#B57EDC')
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() }); // 機器人頭像和名稱

        await message.reply({ embeds: [embed] });
    }
});

client.on('ready', () => {
    console.log(`✅ ${client.user.tag} 已上線！`);
    client.user.setActivity('Rust', { enum: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ 執行指令時發生錯誤！', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
