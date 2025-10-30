import { BaseSlideType } from './baseSlideType.js';

export class ReflectiveQuestionSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    const contentHtml = `<div class="reflective-container">
      <p class="reflective-text">${this.formatMarkdownText(this.slide.explanation)}</p>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }
}