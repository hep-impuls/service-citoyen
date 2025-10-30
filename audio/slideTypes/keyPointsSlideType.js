import { BaseSlideType } from './baseSlideType.js';

export class KeyPointsSlideType extends BaseSlideType {
  render(imagePath) {
    this.showImage();
    this.renderImage(imagePath);
    
    const headingHtml = `<h1 class="slide-heading">${this.escapeHTML(this.slide.concept)}</h1>`;
    
    // Parse the key points
    const content = this.slide.slide_content || '';
    const points = content.split('\n').filter(point => point.trim().startsWith('•'));
    
    const pointsHtml = points.map(point => {
      const pointText = point.trim().substring(1).trim(); // Remove the bullet character
      return `<div class="key-point">${this.formatMarkdownText(pointText)}</div>`;
    }).join('');
    
    const contentHtml = `<div class="key-points-container">
      <div class="key-points-content">
        ${pointsHtml}
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = headingHtml + contentHtml;
  }

  startAnimation() {
    const keyPoints = this.slideTextContent.querySelectorAll('.key-point');
    
    keyPoints.forEach((point, index) => {
      setTimeout(() => {
        point.classList.add('visible');
      }, 400 * index);
    });
  }
}