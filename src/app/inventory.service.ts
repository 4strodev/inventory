import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private categories: Set<string> = new Set();
  private products: Map<string, Set<string>> = new Map();

  constructor() {
  }

  getCategories(): Array<string> {
    return Array.from(this.categories);
  }

  removeCategory(value: string): void {
    this.categories.delete(value);
  }

  addCategory(value: string) {
    this.categories.add(value);
  }

  searchCategory(product: string): string | undefined {
    const match = product.match(/[a-zA-Z]+/i);
    for (const category of this.categories) {
      if (!match) {
        if (product.includes(category)) {
          return category;
        }
      } else {
        const expectedCategory = match[0];
        if (expectedCategory === category) {
          return category;
        }
      }
    }

    return;
  }

  categoryExist(category: string): boolean {
    return this.categories.has(category);
  }

  addProduct(category: string, product: string) {
    if (!this.categoryExist(category)) {
      throw new Error(`category ${category} does not exist`);
    }

    const productsSet = this.products.get(category) || new Set();
    productsSet.add(product);

    this.products.set(category, productsSet);
  }

  summary() {
    const summary: Map<string, number> = new Map();
    for (const [category, productSet] of this.products) {
      summary.set(category, productSet.size);
    }

    return summary;
  }
}
