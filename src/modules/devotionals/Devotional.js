export class Devotional {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.slug = data.slug ?? '';
    this.author = data.author ?? '';
    this.scripture = data.scripture ?? '';
    this.content = data.content ?? '';
    this.prayer = data.prayer ?? '';
    this.category = data.category ?? '';
    this.tags = data.tags ?? [];
    this.publishedAt = data.publishedAt ?? null;
  }
}
