"use strict";
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var config_1 = require("../config");
var grocery_1 = require("./grocery");
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
var GroceryStore = (function () {
    function GroceryStore(_http) {
        this._http = _http;
        this.items = new Rx_1.BehaviorSubject([]);
        this._allItems = [];
    }
    GroceryStore.prototype.load = function () {
        var _this = this;
        var headers = this.getHeaders();
        headers.append("X-Everlive-Sort", JSON.stringify({ ModifiedAt: -1 }));
        return this._http.get(config_1.Config.apiUrl + "Groceries", {
            headers: headers
        })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            data.Result.forEach(function (grocery) {
                _this._allItems.push(new grocery_1.Grocery(grocery.Id, grocery.Name, grocery.Done || false, grocery.Deleted || false));
                _this.publishUpdates();
            });
        })
            .catch(this.handleErrors);
    };
    GroceryStore.prototype.add = function (name) {
        var _this = this;
        return this._http.post(config_1.Config.apiUrl + "Groceries", JSON.stringify({ Name: name }), { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            _this._allItems.unshift(new grocery_1.Grocery(data.Result.Id, name, false, false));
            _this.publishUpdates();
        })
            .catch(this.handleErrors);
    };
    GroceryStore.prototype._put = function (id, data) {
        return this._http.put(config_1.Config.apiUrl + "Groceries/" + id, JSON.stringify(data), { headers: this.getHeaders() })
            .catch(this.handleErrors);
    };
    GroceryStore.prototype.setDeleteFlag = function (item) {
        var _this = this;
        return this._put(item.id, { Deleted: true, Done: false })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            item.deleted = true;
            item.done = false;
            _this.publishUpdates();
        });
    };
    GroceryStore.prototype.restore = function () {
        var _this = this;
        var indeces = [];
        this._allItems.forEach(function (grocery) {
            if (grocery.deleted && grocery.done) {
                indeces.push(grocery.id);
            }
        });
        var headers = this.getHeaders();
        headers.append("X-Everlive-Filter", JSON.stringify({
            "Id": {
                "$in": indeces
            }
        }));
        return this._http.put(config_1.Config.apiUrl + "Groceries", JSON.stringify({
            Deleted: false,
            Done: false
        }), { headers: headers })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            _this._allItems.forEach(function (grocery) {
                if (grocery.deleted && grocery.done) {
                    grocery.deleted = false;
                    grocery.done = false;
                }
            });
            _this.publishUpdates();
        })
            .catch(this.handleErrors);
    };
    GroceryStore.prototype.toggleDoneFlag = function (item) {
        var _this = this;
        return this._put(item.id, { Done: !item.done })
            .map(function (res) { return res.json(); })
            .map(function (data) {
            item.done = !item.done;
            _this.publishUpdates();
        });
    };
    GroceryStore.prototype.deleteForever = function (item) {
        return this._http.delete(config_1.Config.apiUrl + "Groceries/" + item.id, { headers: this.getHeaders() })
            .map(function (res) { return res.json(); })
            .catch(this.handleErrors);
    };
    GroceryStore.prototype.getHeaders = function () {
        var headers = new http_1.Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", "Bearer " + config_1.Config.token);
        return headers;
    };
    GroceryStore.prototype.publishUpdates = function () {
        this.items.next(this._allItems.slice());
    };
    GroceryStore.prototype.handleErrors = function (error) {
        console.log(error);
        return Rx_1.Observable.throw(error);
    };
    GroceryStore = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], GroceryStore);
    return GroceryStore;
}());
exports.GroceryStore = GroceryStore;
//# sourceMappingURL=grocery-list.service.js.map