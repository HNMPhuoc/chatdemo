var express = require('express');
var router = express.Router();
var roleController = require('../controllers/roles');
var { CreateSuccessRes } = require('../utils/responseHandler');

router.get('/', async function (req, res, next) {
  try {
    const requiredRoles = ['admin', 'user', 'mod'];
    const existingRoles = await roleController.GetAllRoles();
    const existingRoleNames = existingRoles.map(role => role.name);

    const rolesToCreate = requiredRoles.filter(role => !existingRoleNames.includes(role));

    let createdRoles = [];

    for (const roleName of rolesToCreate) {
      const newRole = await roleController.CreateARole(roleName);
      createdRoles.push(newRole);
    }

    if (createdRoles.length === 0) {
      return CreateSuccessRes(res, 'Roles already exist', 200);
    }

    return CreateSuccessRes(res, createdRoles, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
