import { BaseSlideType } from './baseSlideType.js';

export class TitleSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    const contentHtml = `<div class="title-container">
      <h1 class="title-main">${this.formatMarkdownText(this.slide.explanation)}</h1>
      <p class="title-sub">${this.formatMarkdownText(this.slide.slide_content)}</p>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }
}