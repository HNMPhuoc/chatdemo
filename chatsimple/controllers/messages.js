// 📁 controllers/messages.js
const Conversation = require('../schemas/Conversation');
const Message = require('../schemas/messages');

module.exports = {
    // Tạo hoặc lấy một cuộc trò chuyện giữa hai người dùng
    GetOrCreateConversation: async function (user1Id, user2Id) {
        try {
            let convo = await Conversation.findOne({
                participants: { $all: [user1Id, user2Id], $size: 2 }
            });

            if (!convo) {
                convo = new Conversation({ participants: [user1Id, user2Id] });
                await convo.save();
            }
            return convo;
        } catch (err) {
            throw new Error(err.message);
        }
    },

    // Gửi một tin nhắn trong một cuộc trò chuyện
    SendMessage: async function (conversationId, senderId, toUserId, content) {
        try {
            const msg = new Message({
                conversation: conversationId,
                receiver: toUserId,
                sender: senderId,
                content: content
            });
            return await msg.save();
        } catch (err) {
            throw new Error(err.message);
        }
    },

    // Lấy tin nhắn của một cuộc trò chuyện
    GetMessagesByConversation: async function (conversationId) {
        try {
            return await Message.find({ conversation: conversationId });
        } catch (err) {
            throw new Error(err.message);
        }
    },

    // Lấy danh sách các cuộc trò chuyện của user
    GetConversationsByUser: async function (userId) {
        try {
            return await Conversation.find({
                participants: userId
            });
        } catch (err) {
            throw new Error(err.message);
        }
    },
    GetMessagesBetween: async function (user1Id, user2Id) {
        try {
            // 1. Tìm conversation
            const convo = await Conversation.findOne({
                participants: { $all: [user1Id, user2Id], $size: 2 }
            });

            if (!convo) return []; // Không có cuộc trò chuyện nào

            // 2. Tìm tất cả tin nhắn trong conversation đó
            const messages = await Message.find({
                conversation: convo._id
            }).sort({ createdAt: 1 }); // sắp xếp theo thời gian tăng dần

            return messages;
        } catch (err) {
            throw new Error(err.message);
        }
    },
};
