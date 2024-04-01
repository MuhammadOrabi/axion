const roles = require("../../../static_arch/roles.system");

module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.cache               = cache;
        this.tokenManager        = managers.token;
        this.adminExposed         = [
            'create',
            'get=list',
            'put=update',
            'delete',
        ];
        this.userExposed         = [
            'get=get',
        ];
        this.fnPermssions = {
            'create': [roles.superAdmin],
            'list': [roles.superAdmin],
            'update': [roles.superAdmin],
            'delete': [roles.superAdmin],
            'get': [roles.schoolAdmin],
        }
    }


    async create({__longToken, __authorization, name, adminId}){
        const school = { name, adminId };

        // Data validation
        const errors = await this.validators.school.create(school);
        if(errors) return { errors };

        // Check if school exists
        const exists = await this.mongomodels.school.findOne({ name });
        if (exists) return { error: 'school already exists' };

        // Validate admin
        const admin = await this.mongomodels.user.findOne({_id: adminId, role: roles.schoolAdmin });
        if (!admin) return { error: 'admin not found' };

        // Check if admin already have a school
        const adminHaveSchool = await this.mongomodels.school.findOne({ adminId });
        if (adminHaveSchool) return { error: 'admin already have a school' };

        // Creation Logic
        const created = await this.mongomodels.school.create(school);
        
        // Response
        return {
            school: created, 
        };
    }

        /**
         * Update school
         */
    async update({__longToken, __authorization, id, name, adminId}) {
        // Data validation
        const errors = await this.validators.school.update({ id, name, adminId });
        if(errors) return { errors };

        const school = await this.mongomodels.school.findById(id);
        if (!school) return { error: 'school not found' };

        // Check if school exists
        const exists = await this.mongomodels.school.findOne({ _id: { $ne: school._id }, name });
        if (exists) return { error: 'school exists with this name' };

        // Validate admin
        const admin = await this.mongomodels.user.findOne({_id: adminId, role: roles.schoolAdmin });
        if (!admin) return { error: 'admin not found' };
        
        // Check if admin already have a school
        const adminHaveSchool = await this.mongomodels.school.findOne({ _id: { $ne: school._id }, adminId });
        if (adminHaveSchool) return { error: 'admin already have a school' };

        // Update Logic
        school.name = name;
        school.adminId = adminId;
        await school.save();

        // Response
        return { message: 'school updated' };
    }

    /**
     * List schools
     */
    async list({__longToken, __authorization, __query}) {
        const page = __query.page || 1;
        const limit = __query.limit || 10;

        const total = await this.mongomodels.school.countDocuments();
        const pages = Math.ceil(total / limit);

        const schools = await this.mongomodels.school.find().skip((page - 1) * limit).limit(limit);

        return { schools, pagination: { total, pages }};
    }

    /**
     * Delete school
     */
    async delete({__longToken, __authorization, id}){
        // Data validation
        const errors = await this.validators.school.delete({ id });
        if(errors) return { errors };
        
        const school = await this.mongomodels.school.findByIdAndDelete(id);
        if (!school) return { error: 'school not found' };

        await this.mongomodels.classroom.deleteMany({ schoolId: school._id });
        await this.mongomodels.student.deleteMany({ schoolId: school._id });

        return { message: 'school deleted' };
    }

    /**
     * Get school
     */
    async get({__longToken, __authorization}) {
        const school = await this.mongomodels.school.findOne({ adminId: __longToken.userId });
        if (!school) return { error: 'school not found' };

        return { school };
    }
}
