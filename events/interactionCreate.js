module.exports = {
    name: 'interactionCreate',
    execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (command) {
            try {
                command.execute(interaction);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: '❌ 執行指令時發生錯誤！', ephemeral: true });
            }
        }
    }
};
