import { BaseSlideType } from './baseSlideType.js';

export class ClassicBulletPointSlideType extends BaseSlideType {
  render(imagePath) {
    this.showImage();
    this.renderImage(imagePath);
    
    const headingHtml = `<h1 class="slide-heading">${this.escapeHTML(this.slide.concept)}</h1>`;
    
    const allLines = String(this.slide.slide_content || '').split('\n');
    const bulletLines = allLines.slice(1);
    const bulletsHtml = bulletLines.map(line => `<p class="list-item">${this.formatMarkdownText(line)}</p>`).join('');
    const contentHtml = `<p class="explanation-callout">${this.formatMarkdownText(this.slide.explanation)}</p>${bulletsHtml}`;
    
    this.slideTextContent.innerHTML = headingHtml + contentHtml;
  }

  startAnimation() {
    const explanationElement = this.slideTextContent.querySelector('.explanation-callout');
    const bulletElements = this.slideTextContent.querySelectorAll('.list-item');
    
    if (explanationElement) {
      setTimeout(() => {
        explanationElement.classList.add('visible');
        if (bulletElements.length > 0) {
          window.textAnimationTimeout = setTimeout(() => this.animateListItems(0, bulletElements, 900), 1500);
        }
      }, 200);
    }
  }

  animateListItems(index, elements, delay) {
    if (index >= elements.length) return;
    elements[index].classList.add('visible');
    window.textAnimationTimeout = setTimeout(() => this.animateListItems(index + 1, elements, delay), delay);
  }
}