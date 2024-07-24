import {Component, signal, Signal, WritableSignal} from '@angular/core';
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {InventoryService} from "../inventory.service";
import {DialogModule} from "primeng/dialog";
import {firstValueFrom, Subject} from "rxjs";

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    Button,
    DialogModule
  ],
  templateUrl: './inventory-page.component.html',
  styleUrl: './inventory-page.component.css'
})
export class InventoryPageComponent {
  product: string = '';
  showCreateCategoryDialog = false;
  categoryToSave = '';
  mappedSummary: WritableSignal<{category: string, counting: number}[]> = signal([]);
  categorySaving: Subject<string> = new Subject<string>();

  constructor(protected inventoryService: InventoryService) {
  }

  saveCategory() {
    this.inventoryService.addCategory(this.categoryToSave);
    this.categorySaving.next(this.categoryToSave);
    this.showCreateCategoryDialog = false;
  }

  async saveProduct() {
    const productToSave = this.product;
    this.product = '';

    let category = this.inventoryService.searchCategory(productToSave);
    if (!category) {
      category = await this.createCategory(productToSave);
    }

    this.inventoryService.addProduct(category, productToSave);
    const summary = this.getSummary();
    this.mappedSummary.set(summary);
  }

  getSummary(): { category: string, counting: number }[] {
    const summary = this.inventoryService.summary();
    const mappedSummary: { category: string, counting: number }[] = [];
    for (const [category, counting] of summary.entries()) {
      mappedSummary.push({category, counting});
    }

    return mappedSummary;
  }

  async createCategory(product: string): Promise<string> {
    const categoryRegex = /[a-zA-Z]+/i;
    const match = product.match(categoryRegex);

    if (match) {
      this.categoryToSave = match[0];
    }

    this.showCreateCategoryDialog = true;
    return firstValueFrom(this.categorySaving);
  }
}
