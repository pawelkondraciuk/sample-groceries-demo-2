"use strict";
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var grocery_list_service_1 = require("../../shared/grocery/grocery-list.service");
var config_1 = require("../../shared/config");
var grocery_list_component_1 = require("./grocery-list.component");
var ListComponent = (function () {
    function ListComponent(_router, store) {
        this._router = _router;
        this.store = store;
        this.grocery = "";
        this.isLoading = false;
        this.isShowingRecent = false;
    }
    ListComponent.prototype.ngOnInit = function () {
        if (!config_1.Config.token) {
            this._router.navigate(["Login"]);
            return;
        }
        this.isLoading = true;
    };
    ListComponent.prototype.hideLoadingIndicator = function () {
        this.isLoading = false;
    };
    ListComponent.prototype.add = function () {
        var _this = this;
        if (this.grocery.trim() === "") {
            alert("Enter a grocery item");
            return;
        }
        this.store.add(this.grocery)
            .subscribe(function () {
            _this.grocery = "";
        }, function () {
            alert("An error occurred while adding a grocery to your list.");
        });
    };
    ListComponent.prototype.toggleRecent = function () {
        var _this = this;
        if (this.isShowingRecent) {
            this.store.restore()
                .subscribe(function () { _this.isShowingRecent = false; }, function () { alert("An error occurred while adding groceries to your list."); });
        }
        else {
            this.isShowingRecent = true;
        }
    };
    ListComponent = __decorate([
        core_1.Component({
            selector: "list",
            directives: [grocery_list_component_1.GroceryList],
            templateUrl: "./pages/list/list.html",
            styleUrls: ["./pages/list/list.css"],
            providers: [grocery_list_service_1.GroceryStore]
        }), 
        __metadata('design:paramtypes', [router_1.Router, grocery_list_service_1.GroceryStore])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map