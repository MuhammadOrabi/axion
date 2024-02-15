const bcrypt = require("bcrypt");
const { user } = require("../../../static_arch/superadmin.seed");
const roles = require("../../../static_arch/roles.system");

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.cache               = cache;
        this.tokenManager        = managers.token;
        this.userExposed         = [
            'get=seed',
            'login',
            'create',
            'get=list',
            'put=update',
            'delete',
        ];
        this.fnPermssions = {
            'create': [roles.superAdmin],
            'list': [roles.superAdmin],
            'delete': [roles.superAdmin],
        }
    }

    /**
     * Seed superadmin account
     */
    async seed() {
        const superAdmin = user;
        if (!superAdmin.password) return { error: 'superadmin password not set' };

        // Check if superadmin exists
        let existingUser = await this.mongomodels.user.findOne({ 
            $or: [{ email: user.email }, { username: user.username }] 
        });
        if (existingUser) return {error: 'superadmin already exists'};

        // Creation Logic
        superAdmin.password = await bcrypt.hash(superAdmin.password, 10);
        await this.mongomodels.user.create(superAdmin);

        // Response
        return { message: 'superadmin created' };
    }

    /**
     * Login user
     */
    async login({email, password}){
        // Data validation
        const errors = await this.validators.user.login({email, password});
        if(errors) return { errors };

        // Check if user exists
        const user = await this.mongomodels.user.findOne({ email }).select('+password');
        if (!user) return { error: 'user not found' };

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return { error: 'invalid password' };

        // Generate auth token
        const longToken = this.tokenManager.genLongToken({userId: user._id.toString(), userKey: user.role });

        // Response
        return {
            user, 
            token: longToken 
        };
    }

    /**
     * Create user
     */
    async create({__longToken, __authorization, username, email, password, role}){
        const user = { username, email, password, role };

        // Data validation
        const errors = await this.validators.user.create(user);
        if(errors) return { errors };
        // Check if user exists
        let existingUser = await this.mongomodels.user.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return { error: 'user already exists' };

        // Creation Logic
        user.password = await bcrypt.hash(user.password, 10);
        const createdUser = await this.mongomodels.user.create(user);
        
        // Response
        return {
            user: createdUser, 
        };
    }


    /**
     * Update user
     */
    async update({__longToken, password}) {
        // Data validation
        const errors = await this.validators.user.update({ password });
        if(errors) return { errors };

        // Check if user exists
        const userId = __longToken.userId;
        const user = await this.mongomodels.user.findOne({ _id: userId });
        if (!user) return { error: 'user not found' };

        // Update password
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        // Response
        return { message: 'password updated' };
    }

    /**
     * List users
     */
    async list({__longToken, __authorization, __query}) {
        const page = __query.page || 1;
        const limit = __query.limit || 10;

        const total = await this.mongomodels.user.countDocuments();
        const pages = Math.ceil(total / limit);

        const users = await this.mongomodels.user.find().skip((page - 1) * limit).limit(limit);

        return { users, pagination: { total, pages }};
    }

    async delete({__longToken, __authorization, id}){
        // Data validation
        const errors = await this.validators.user.delete({ id });
        if(errors) return { errors };
        
        // Check if user exists
        const exists = await this.mongomodels.user.findOne({ _id: id });
        if (!exists) return { error: 'user not found' };
        id
        // Deletion Logic
        await this.mongomodels.user.deleteOne({ _id: id });
        
        await this.mongomodels.school.updateMany({ adminId: id }, { adminId: null });
        
        // Response
        return { message: 'user deleted' };
    }
}
