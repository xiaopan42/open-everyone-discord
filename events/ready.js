module.exports = {
    name: 'ready',
    once: true, // 設置 once 為 true，表示這個事件只會觸發一次
    execute(client) {
        console.log(`✅ ${client.user.tag} 已上線！`);
        client.user.setActivity('open everyone bot v1.0', { enum: 'PLAYING' });
    }
};