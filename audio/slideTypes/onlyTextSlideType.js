import { BaseSlideType } from './baseSlideType.js';

export class OnlyTextSlideType extends BaseSlideType {
  render(imagePath) {
    // Show the image container for this slide type
    this.showImage();
    
    // Create heading from explanation
    const headingHtml = `<h1 class="slide-heading">${this.formatMarkdownText(this.slide.explanation)}</h1>`;
    
    // Create text content
    const textContentHtml = `<div class="only-text-container">
      <p>${this.formatMarkdownText(this.slide.slide_content)}</p>
    </div>`;
    
    // Combine heading and text content
    this.slideTextContent.innerHTML = headingHtml + textContentHtml;
    
    // Render the image if available, but don't show warning if not found
    if (this.slide.image_filename) {
      this.renderImage(imagePath);
    } else {
      // Clear the image container if no image is available
      this.slideImageContainer.innerHTML = '';
    }
  }
}