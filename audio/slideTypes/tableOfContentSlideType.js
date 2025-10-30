import { BaseSlideType } from './baseSlideType.js';

export class TableOfContentSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    const tocItems = String(this.slide.slide_content || '').split('\n').map(line => 
      `<p class="toc-list-item">${this.formatMarkdownText(line)}</p>`
    ).join('');
    
    this.slideTextContent.innerHTML = tocItems;
  }

  startAnimation() {
    this.animateListItems(0, this.slideTextContent.querySelectorAll('.toc-list-item'), 500);
  }

  animateListItems(index, elements, delay) {
    if (index >= elements.length) return;
    elements[index].classList.add('visible');
    window.textAnimationTimeout = setTimeout(() => this.animateListItems(index + 1, elements, delay), delay);
  }
}