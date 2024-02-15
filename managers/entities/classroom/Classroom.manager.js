const roles = require("../../../static_arch/roles.system");

module.exports = class Classroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.cache               = cache;
        this.tokenManager        = managers.token;
        this.userExposed         = [
            'create',
            'get=list',
            'put=update',
            'delete'
        ];
        this.fnPermssions = {
            'create': [roles.schoolAdmin],
            'list': [roles.schoolAdmin],
            'update': [roles.schoolAdmin],
            'delete': [roles.schoolAdmin],
        }
    }


    async create({__longToken, __authorization, name}){
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        const classroom = { name, schoolId: school._id};
        // Data validation
        const errors = await this.validators.classroom.create(classroom);
        if(errors) return { errors };

        // Check if exists
        const exists = await this.mongomodels.classroom.findOne({ name, schoolId: school._id});
        if (exists) return { error: 'classroom already exists' };

        // Creation Logic
        const created = await this.mongomodels.classroom.create(classroom);
        
        // Response
        return {
            classroom: created, 
        };
    }

    /**
     * Update classroom
     */
    async update({__longToken, __authorization, id, name}) {
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        // Data validation
        const errors = await this.validators.classroom.update({ id, name });
        if(errors) return { errors };

        const classroom = await this.mongomodels.classroom.findOne({ _id: id, schoolId: school._id });
        if (!classroom) return { error: 'classroom not found' };

        // Check if school exists
        const exists = await this.mongomodels.school.findOne({ _id: { $ne: school._id }, name, schoolId: school._id });
        if (exists) return { error: 'classroom exists with this name' };

        // Update Logic
        classroom.name = name;
        await classroom.save();

        // Response
        return { message: 'classroom updated' };
    }

    /**
     * List classrooms
     */
    async list({__longToken, __authorization, __query}) {
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        const page = __query.page || 1;
        const limit = __query.limit || 10;

        const total = await this.mongomodels.classroom.countDocuments({ schoolId: school._id });
        const pages = Math.ceil(total / limit);

        const classrooms = await this.mongomodels.classroom.find({ schoolId: school._id }).skip((page - 1) * limit).limit(limit);

        return { classrooms, pagination: { total, pages }};
    }

    async delete({__longToken, __authorization, id}){
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        // Data validation
        const errors = await this.validators.classroom.delete({ id });
        if(errors) return { errors };
        

        const classroom = await this.mongomodels.classroom.findOneAndDelete({ _id: id, schoolId: school._id });
        if (!classroom) return { error: 'classroom not found' };


        // Update students
        await this.mongomodels.student.updateMany({ $pull: { classroomIds: classroom._id } });

        return { message: 'classroom deleted' };
    }

}
