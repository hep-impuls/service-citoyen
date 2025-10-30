import { BaseSlideType } from './baseSlideType.js';

export class OnlyImageSlideType extends BaseSlideType {
  render(imagePath) {
    this.slideImageContainer.style.flex = '1 1 100%';
    this.slideImageContainer.style.padding = '0';
    this.showImage();
    this.renderImage(imagePath);
    this.slideTextContent.innerHTML = '';
  }
}