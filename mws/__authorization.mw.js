module.exports = ({ meta, config, managers, mongomodels }) => {
  return async ({ req, res, next, results }) => {
    let decodedUser;
    if (results.__longToken) {
      decodedUser = results.__longToken;
    } else if (results.__shortToken) {
      decodedUser = results.__shortToken;
    } else if (results.__token) {
      decodedUser = results.__token;
    }

    if (decodedUser) {
      const found = await mongomodels.user.findOne({ 
        _id: decodedUser.userId, role: decodedUser.userKey, active: true 
      });
      if (!found) {
        decodedUser = null;
      }
    }

    const { moduleName, fnName } = req.params;
    const apiManager = managers.userApi;

    let requiredRoles =  [];
    if (Object.keys(managers[moduleName]).includes(apiManager.permissionsProp)) {
      const modulePermssions = managers[moduleName][apiManager.permissionsProp];
      if (Object.keys(modulePermssions).includes(fnName)) {
        requiredRoles = modulePermssions[fnName];
      }
    }

    if (requiredRoles.length && (!decodedUser || !requiredRoles.includes(decodedUser.userKey))) {
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 403,
        errors: "You're unauthorized to access this resource.",
      });
    }

    next();
  };
};
