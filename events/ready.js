module.exports = {
    name: 'ready',
    once: true, 
    execute(client) {
        console.log(`✅ ${client.user.tag} 已上線！`);
        client.user.setActivity('open everyone bot v1.0', { enum: 'PLAYING' });
    }
};