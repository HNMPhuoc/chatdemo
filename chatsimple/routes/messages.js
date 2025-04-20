// 📁 routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const { check_authentication } = require('../utils/check_auth');
const { CreateSuccessRes } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

// Gửi tin nhắn (tự tạo conversation nếu chưa có)
router.post('/send', check_authentication, async function (req, res, next) {
    try {
        const { toUserId, content } = req.body;
        const fromUserId = req.user.id;

        const convo = await messageController.GetOrCreateConversation(fromUserId, toUserId);
        const message = await messageController.SendMessage(convo._id, fromUserId, toUserId, content);

        CreateSuccessRes(res, message, 200);
    } catch (error) {
        next(error);
    }
});

// Lấy tin nhắn theo conversation ID
router.get('/conversation/:id', check_authentication, async function (req, res, next) {
    try {
        const conversationId = req.params.id;
        const messages = await messageController.GetMessagesByConversation(conversationId);

        CreateSuccessRes(res, messages, 200);
    } catch (error) {
        next(error);
    }
});

// Lấy danh sách các cuộc trò chuyện của user
router.get('/conversations', check_authentication, async function (req, res, next) {
    try {
        const userId = req.user.id;
        const conversations = await messageController.GetConversationsByUser(userId);

        CreateSuccessRes(res, conversations, 200);
    } catch (error) {
        next(error);
    }
});

router.get('/:userId', check_authentication, async (req, res, next) => {
    try {
        const fromUserId = req.user.id;
        const toUserId = req.params.userId;

        const messages = await messageController.GetMessagesBetween(fromUserId, toUserId);
        CreateSuccessRes(res, messages, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;