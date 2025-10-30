import { BaseSlideType } from './baseSlideType.js';

export class QuoteSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    const contentHtml = `<div class="quote-container">
      <p class="quote-text">${this.formatMarkdownText(this.slide.explanation)}</p>
      <p class="quote-source">${this.formatMarkdownText(this.slide.slide_content)}</p>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }
}