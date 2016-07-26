"use strict";
var Config = (function () {
    function Config() {
    }
    Object.defineProperty(Config, "token", {
        get: function () {
            return localStorage.getItem("token");
        },
        set: function (theToken) {
            localStorage.setItem("token", theToken);
        },
        enumerable: true,
        configurable: true
    });
    Config.hasActiveToken = function () {
        return !!localStorage.getItem("token");
    };
    Config.apiUrl = "https://api.everlive.com/v1/GWfRtXi1Lwt4jcqK/";
    return Config;
}());
exports.Config = Config;
//# sourceMappingURL=config.js.map