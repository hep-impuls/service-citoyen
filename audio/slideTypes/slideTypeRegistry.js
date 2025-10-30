export class SlideTypeRegistry {
  constructor() {
    this.slideTypes = new Map();
  }

  register(typeName, slideTypeClass) {
    this.slideTypes.set(typeName, slideTypeClass);
  }

  create(typeName, slide, slideTextContent, slideImageContainer) {
    const SlideTypeClass = this.slideTypes.get(typeName);
    if (!SlideTypeClass) {
      console.warn(`Unknown slide type: ${typeName}. Using default.`);
      return new this.slideTypes.get('classic_bullet_point')(slide, slideTextContent, slideImageContainer);
    }
    return new SlideTypeClass(slide, slideTextContent, slideImageContainer);
  }

  getRegisteredTypes() {
    return Array.from(this.slideTypes.keys());
  }
}