
module.exports = {
    create: [
        {
            type: 'string',
            required: true,
            path: 'name',
        },
        {
            type: 'string',
            required: true,
            path: 'adminId',
        },
    ],
    update: [
        {
            type: 'string',
            required: true,
            path: 'id',
        },
        {
            type: 'string',
            required: true,
            path: 'name',
        },
        {
            type: 'string',
            required: true,
            path: 'adminId',
        },
    ],
    delete: [
        {
            type: 'string',
            required: true,
            path: 'id',
        },
    ]
    
}


