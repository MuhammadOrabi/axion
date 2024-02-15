
module.exports = {
    create: [
        {
            type: 'Array',
            required: true,
            path: 'classroomIds',
        },
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
        {
            type: 'Array',
            required: true,
            path: 'classroomIds',
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


