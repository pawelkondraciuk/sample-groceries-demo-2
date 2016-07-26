"use strict";
var core_1 = require("@angular/core");
var grocery_list_service_1 = require("../..//shared/grocery/grocery-list.service");
var ItemStatusPipe = (function () {
    function ItemStatusPipe(_ref) {
        this._ref = _ref;
        this.value = [];
    }
    ItemStatusPipe.prototype.transform = function (items, deleted) {
        if (items && items.length) {
            this.value = items.filter(function (grocery) {
                return grocery.deleted == deleted;
            });
            this._ref.markForCheck();
        }
        return this.value;
    };
    ItemStatusPipe = __decorate([
        core_1.Pipe({
            name: "itemStatus"
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef])
    ], ItemStatusPipe);
    return ItemStatusPipe;
}());
exports.ItemStatusPipe = ItemStatusPipe;
var GroceryList = (function () {
    function GroceryList(store, _zone) {
        this.store = store;
        this._zone = _zone;
        this.itemsLoaded = new core_1.EventEmitter();
        this.listLoaded = false;
    }
    GroceryList.prototype.ngOnInit = function () {
        var _this = this;
        this.store.load()
            .subscribe(function () {
            _this.itemsLoaded.emit("itemsLoaded");
            _this.listLoaded = true;
        });
    };
    GroceryList.prototype.imageSource = function (grocery) {
        if (grocery.deleted) {
            return grocery.done ? "res://selected" : "res://nonselected";
        }
        return grocery.done ? "res://checked" : "res://unchecked";
    };
    GroceryList.prototype.toggleDone = function (grocery) {
        var _this = this;
        if (grocery.deleted) {
            this._zone.run(function () {
                grocery.done = !grocery.done;
            });
            return;
        }
        this._zone.run(function () {
            _this.store.toggleDoneFlag(grocery)
                .subscribe(function () { }, function () { alert("An error occurred managing your grocery list"); });
        });
    };
    GroceryList.prototype.delete = function (grocery) {
        var _this = this;
        this._zone.run(function () {
            _this.store.setDeleteFlag(grocery)
                .subscribe(function () { }, function () { return alert("An error occurred while deleting an item from your list."); });
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], GroceryList.prototype, "showDeleted", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], GroceryList.prototype, "itemsLoaded", void 0);
    GroceryList = __decorate([
        core_1.Component({
            selector: "grocery-list",
            template: "\n  <ListView [items]=\"store.items | async | itemStatus:showDeleted\" row=\"2\" class=\"small-spacing\" [class.visible]=\"listLoaded\">\n    <template let-item=\"item\">\n      <GridLayout columns=\"30, *, auto\">\n        <StackLayout class=\"toggle-button\" col=\"0\" (tap)=\"toggleDone(item)\">\n          <Image [src]=\"imageSource(item)\"></Image>\n        </StackLayout>\n        <Label col=\"1\" [text]=\"item.name\" class=\"medium-spacing\" [class.done]=\"item.done && !item.deleted\"></Label>\n        <StackLayout col=\"2\" class=\"delete-container\" (tap)=\"delete(item)\" *ngIf=\"!item.deleted\">\n          <Image src=\"res://delete\"></Image>\n        </StackLayout>\n      </GridLayout>\n    </template>\n  </ListView>\n  ",
            styleUrls: ["./pages/list/grocery-list.css"],
            pipes: [ItemStatusPipe],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [grocery_list_service_1.GroceryStore, core_1.NgZone])
    ], GroceryList);
    return GroceryList;
}());
exports.GroceryList = GroceryList;
//# sourceMappingURL=grocery-list.component.js.map