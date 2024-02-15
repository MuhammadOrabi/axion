const systemRoles = require("../../../static_arch/roles.system")
const roles = Object.values(systemRoles);

module.exports = {
    login: [
        {
            model: 'email',
            required: true,
            path: 'email',
        },
        {
            model: 'password',
            required: true,
        },
    ],
    create: [
        {
            model: 'username',
            required: true,
            path: 'username',
        },
        {
            model: 'email',
            required: true,
            path: 'email',
        },
        {
            model: 'password',
            required: true,
        },
        {
            required: true,
            path: 'role',
            type: 'String',
            oneOf: roles,
        },
    ],
    update: [
        {
            model: 'password',
            required: true,
        },
    ],
    delete: [
        {
            model: 'id',
            required: true,
        },
    ],
}


