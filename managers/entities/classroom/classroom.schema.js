
module.exports = {
    create: [
        {
            type: 'string',
            required: true,
            path: 'name',
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
    ],
    delete: [
        {
            type: 'string',
            required: true,
            path: 'id',
        },
    ]
    
}


