export class Category {
    id: number;
    name: string;
    description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_tags: string;
    uploaded_file: string;
    file_path: string;
    image_alt: string;
    constructor(category: Category) {
      {
        this.id = category.id || 0;
        this.name = category.name || '';
        this.description = category.description || '';
        this.meta_title = category.meta_title || '';
        this.meta_description = category.meta_description || '';
        this.meta_keywords = category.meta_keywords || '';
        this.meta_tags = category.meta_tags || '';
        this.uploaded_file = category.uploaded_file || '';
        this.file_path = category.file_path || '';
        this.image_alt = category.image_alt || '';
      }
    }
  }
  