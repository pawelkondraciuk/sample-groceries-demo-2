"use strict";
var router_1 = require('nativescript-angular/router');
var login_component_1 = require("./pages/login/login.component");
var list_component_1 = require("./pages/list/list.component");
var routes = [
    { path: "", component: login_component_1.LoginComponent },
    { path: "List", component: list_component_1.ListComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.nsProvideRouter(routes, { enableTracing: false })
];
//# sourceMappingURL=app.routes.js.map