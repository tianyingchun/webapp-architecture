enyo.kind({
    name: "Master.models.user.UserModel",
    kind: "Master.Model",
    apis: {
        login: {
            url: "/login",
            cache: false,
            dto: "userInfoDTO"
        },
        resetPwd: {
            url: "/user/changePwd",
            cache: false
        },
        createNewUser: {
            url: "/user/createNewUser",
            cache: false,
            dto: "userInfoDTO"
        }
    },
    attributes: {
        username: "",
        password: "",
        lastActive: "",
        token: "",
        roles: "admin" // default roles is admin.
    },
    // user login.
    login: function(user, fn) {
        this.username = user.username;
        this.password = user.password;
        this.commit({
            apiKey: "login",
            method: "POST",
            data: {
                username: user.username,
                password: user.password
            },
            callback: fn
        });
    },
    createNewUser: function(user, fn) {
        this.commit({
            apiKey: "createNewUser",
            method: "POST",
            data: {
                username: user.username,
                password: user.password,
                roles: user.roles
            },
            callback: fn
        });
    },
    resetPassword: function(user, fn) {
        this.commit({
            apiKey: "resetPwd",
            method: "POST",
            data: {
                username: user.username,
                password: user.password
            },
            callback: fn
        });
    },
    // login callback data dto.
    userInfoDTO: function(data, options) {
        return {
            token: "",
            username: data.UserName,
            roles: data.Roles
        };
    }
});
