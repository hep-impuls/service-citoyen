import { BaseSlideType } from './baseSlideType.js';

export class VisualMetaphorSlideType extends BaseSlideType {
  render(imagePath) {
    this.showImage();
    this.renderImage(imagePath);
    
    const headingHtml = `<h1 class="slide-heading">${this.escapeHTML(this.slide.concept)}</h1>`;
    
    const contentHtml = `<div class="visual-metaphor-container">
      <div class="metaphor-image">
        ${this.slide.image_filename ? '' : '<div class="no-image-placeholder">No image available</div>'}
      </div>
      <div class="metaphor-text">
        <p class="metaphor-explanation">${this.formatMarkdownText(this.slide.explanation)}</p>
        <p class="metaphor-content">${this.formatMarkdownText(this.slide.slide_content)}</p>
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = headingHtml + contentHtml;
  }

  startAnimation() {
    const metaphorContainer = this.slideTextContent.querySelector('.visual-metaphor-container');
    const metaphorText = this.slideTextContent.querySelector('.metaphor-text');
    
    if (metaphorContainer) {
      setTimeout(() => {
        metaphorContainer.classList.add('visible');
        if (metaphorText) {
          setTimeout(() => metaphorText.classList.add('visible'), 600);
        }
      }, 300);
    }
  }
}