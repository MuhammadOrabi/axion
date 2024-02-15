const roles = require("../../../static_arch/roles.system");

module.exports = class Student { 

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
            'post=delete'
        ];
        this.fnPermssions = {
            'create': [roles.schoolAdmin],
            'list': [roles.schoolAdmin],
            'update': [roles.schoolAdmin],
            'delete': [roles.schoolAdmin],
        }
    }


    async create({__longToken, __authorization, name, classroomIds}){
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        const student = { name, classroomIds, schoolId: school._id};
        // Data validation
        const errors = await this.validators.student.create(student);
        if(errors) return { errors };

        // Validate classroomIds
        const classroom = await this.mongomodels.classroom.find({ _id: classroomIds, schoolId: school._id });
        if (classroom.length != classroomIds.length) return { error: 'invalid classroom Ids' };

        // Creation Logic
        const created = await this.mongomodels.student.create(student);
        
        // Response
        return {
            student: created, 
        };
    }

    /**
     * Update student
     */
    async update({__longToken, __authorization, id, name, classroomIds}) {
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        // Data validation
        const errors = await this.validators.student.update({ id, name, classroomIds });
        if(errors) return { errors };

        const student = await this.mongomodels.student.findOne({ _id: id, schoolId: school._id });
        if (!student) return { error: 'student not found' };

        // Validate classroomIds
        const classroom = await this.mongomodels.classroom.find({ _id: classroomIds, schoolId: school._id });
        if (classroom.length != classroomIds.length) return { error: 'invalid classroom Ids' };
        
        // Update Logic
        student.name = name;
        student.classroomIds = classroomIds;
        await student.save();

        // Response
        return { message: 'student updated' };
    }

    /**
     * List studnets
     */
    async list({__longToken, __authorization, __query}) {
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };        

        const page = __query.page || 1;
        const limit = __query.limit || 10;
        const classroomId = __query.classroomId;

        const filters = { schoolId: school._id };
        if (classroomId) {
            const classroom = await this.mongomodels.classroom.findOne({ _id: classroomId, schoolId: school._id });
            if (!classroom) return { error: 'classroom not found' };

            filters.classroomIds = classroom._id;
        }

        const total = await this.mongomodels.student.countDocuments(filters);
        const pages = Math.ceil(total / limit);

        const studnets = await this.mongomodels.student.find(filters).skip((page - 1) * limit).limit(limit);

        return { studnets, pagination: { total, pages }};
    }

    async delete({__longToken, __authorization, id}){
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        // Data validation
        const errors = await this.validators.student.delete({ id });
        if(errors) return { errors };
        
        const student = await this.mongomodels.student.findOneAndDelete({ _id: id, schoolId: school._id});
        if (!student) return { error: 'student not found' };

        return { message: 'student deleted' };
    }
}
