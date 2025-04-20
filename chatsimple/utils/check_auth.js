let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let {CreateSuccessRes, CreateErrorRes} = require('../utils/responseHandler')
let userController = require('../controllers/users');
const e = require('express');
module.exports = {
    check_authentication: async function (req, res, next) {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization;
            if (authorization.startsWith("Bearer")) {
                let token = authorization.split(" ")[1]
                let result = jwt.verify(token, constants.SECRET_KEY);
                if (result.expire > Date.now()) {
                    let user = await userController.GetUserByID(result.id);
                    req.user = user;
                    next();
                } else {
                    CreateErrorRes(res, "Vui lòng đăng nhập lại", 401);
                }
            } else {
                CreateErrorRes(res, "Vui lòng đăng nhập lại", 401);
            }
        } else {
            CreateErrorRes(res, "Vui lòng đăng nhập lại", 401);
        }
    },
    check_authorization: function (roles) {
        return async function (req, res, next) {
            try {
                let roleOfUser = req.user.role.name;
                if (roles.includes(roleOfUser)) {
                    next();
                } else {
                    CreateErrorRes(res, "Bạn không có quyền truy cập", 403);
                }
            } catch (error) {
                next(error)
            }
        }
    }
}