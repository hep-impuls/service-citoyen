import { BaseSlideType } from './baseSlideType.js';

export class AVsBSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    // Create heading from concept
    const headingHtml = `<h1 class="slide-heading">${this.formatMarkdownText(this.slide.concept)}</h1>`;
    
    // Parse the slide content for comparison
    const parts = (this.slide.slide_content || '').split('---');
    const partA = (parts[0] || '').trim().split('\n');
    const partB = (parts[1] || '').trim().split('\n');
    const titleA = this.formatMarkdownText(partA.shift());
    const titleB = this.formatMarkdownText(partB.shift());
    const contentA = partA.map(line => this.formatMarkdownText(line)).join('<br>');
    const contentB = partB.map(line => this.formatMarkdownText(line)).join('<br>');
    
    // Create comparison content
    const contentHtml = `<div class="comparison-container">
      <div class="comparison-box">
        <h3>${titleA}</h3>
        <p>${contentA}</p>
      </div>
      <div class="comparison-box">
        <h3>${titleB}</h3>
        <p>${contentB}</p>
      </div>
    </div>`;
    
    // Combine heading and content
    this.slideTextContent.innerHTML = headingHtml + contentHtml;
  }

  startAnimation() {
    const boxes = this.slideTextContent.querySelectorAll('.comparison-box');
    if (boxes.length > 0) boxes[0].classList.add('visible');
    if (boxes.length > 1) {
      window.textAnimationTimeout = setTimeout(() => boxes[1].classList.add('visible'), 450);
    }
  }
}