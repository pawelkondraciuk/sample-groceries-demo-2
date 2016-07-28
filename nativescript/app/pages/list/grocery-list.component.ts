import {ChangeDetectorRef, NgZone, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform} from "@angular/core";
import {Grocery} from "../../shared/grocery/grocery";
import {GroceryStore} from "../../shared/grocery/grocery-list.service";

@Pipe({
  name: "itemStatus"
})
export class ItemStatusPipe implements PipeTransform {
  value: Array<Grocery> = [];
  constructor(private _ref: ChangeDetectorRef) {}
  transform(items: Array<Grocery>, deleted: boolean) {
    if (items && items.length) {
      this.value = items.filter((grocery: Grocery) => {
        return grocery.deleted == deleted;
      });
      this._ref.markForCheck();
    }
    return this.value;
  }
}

@Component({
  selector: "grocery-list",
  templateUrl: "./pages/list/grocery-list.html",
  styleUrls: ["./pages/list/grocery-list.css"],
  pipes: [ItemStatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroceryList {
  @Input() showDeleted: boolean;
  @Output() itemsLoaded = new EventEmitter();

  listLoaded = false;

  constructor(private store: GroceryStore, private _zone: NgZone) {}

  ngOnInit() {
    this.store.load()
      .subscribe(() => {
         this.itemsLoaded.emit("itemsLoaded");
         this.listLoaded = true; 
      });
  }

  imageSource(grocery) {
    if (grocery.deleted) {
      return grocery.done ? "res://selected" : "res://nonselected"
    }
    return grocery.done ? "res://checked" : "res://unchecked";
  }

  toggleDone(grocery: Grocery) {
    if (grocery.deleted) {
      this._zone.run(() => {
        grocery.done = !grocery.done;
      });
      return;
    }
    this._zone.run(() => {
      this.store.toggleDoneFlag(grocery)
        .subscribe(
          () => {},
          () => { alert("An error occurred managing your grocery list") }
        );
      });
  }

  delete(grocery: Grocery) {
    this._zone.run(() => {
      this.store.setDeleteFlag(grocery)
        .subscribe(
          () => {},
          () => alert("An error occurred while deleting an item from your list.")
        );
    });
  }
}