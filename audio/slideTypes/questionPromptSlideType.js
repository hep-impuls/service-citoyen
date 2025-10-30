import { BaseSlideType } from './baseSlideType.js';

export class QuestionPromptSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    const contentHtml = `<div class="question-prompt-container">
      <div class="question-icon">?</div>
      <h2 class="question-prompt-title">${this.formatMarkdownText(this.slide.explanation)}</h2>
      <div class="question-prompt-content">
        ${this.formatMarkdownText(this.slide.slide_content)}
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }

  startAnimation() {
    const questionIcon = this.slideTextContent.querySelector('.question-icon');
    const questionTitle = this.slideTextContent.querySelector('.question-prompt-title');
    const questionContent = this.slideTextContent.querySelector('.question-prompt-content');
    
    if (questionIcon) {
      setTimeout(() => questionIcon.classList.add('visible'), 300);
    }
    if (questionTitle) {
      setTimeout(() => questionTitle.classList.add('visible'), 600);
    }
    if (questionContent) {
      setTimeout(() => questionContent.classList.add('visible'), 900);
    }
  }
}