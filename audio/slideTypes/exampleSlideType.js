import { BaseSlideType } from './baseSlideType.js';

export class ExampleSlideType extends BaseSlideType {
  render(imagePath) {
    this.showImage();
    this.renderImage(imagePath);
    
    const headingHtml = `<h1 class="slide-heading">${this.escapeHTML(this.slide.concept)}</h1>`;
    
    // Extract the example part from the content
    const content = this.slide.slide_content || '';
    const exampleMatch = content.match(/^Example:\s*(.+)/);
    const exampleText = exampleMatch ? exampleMatch[1] : content;
    
    const contentHtml = `<div class="example-container">
      <div class="example-image">
        ${this.slide.image_filename ? '' : '<div class="no-image-placeholder">No image available</div>'}
      </div>
      <div class="example-text">
        <p class="example-label">Example:</p>
        <p class="example-content">${this.formatMarkdownText(exampleText)}</p>
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = headingHtml + contentHtml;
  }

  startAnimation() {
    const exampleContainer = this.slideTextContent.querySelector('.example-container');
    const exampleText = this.slideTextContent.querySelector('.example-text');
    
    if (exampleContainer) {
      setTimeout(() => {
        exampleContainer.classList.add('visible');
        if (exampleText) {
          setTimeout(() => exampleText.classList.add('visible'), 600);
        }
      }, 300);
    }
  }
}