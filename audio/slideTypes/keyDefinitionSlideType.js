import { BaseSlideType } from './baseSlideType.js';

export class KeyDefinitionSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    // Parse the definition content
    const content = this.slide.slide_content || '';
    const parts = content.split('\n');
    const term = parts[0] ? parts[0].replace('Term: ', '').trim() : '';
    const definition = parts[1] ? parts[1].replace('Definition: ', '').trim() : '';
    
    const contentHtml = `<div class="key-definition-container">
      <div class="definition-term">${this.formatMarkdownText(term)}</div>
      <div class="definition-separator"></div>
      <div class="definition-text">${this.formatMarkdownText(definition)}</div>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }

  startAnimation() {
    const definitionTerm = this.slideTextContent.querySelector('.definition-term');
    const definitionSeparator = this.slideTextContent.querySelector('.definition-separator');
    const definitionText = this.slideTextContent.querySelector('.definition-text');
    
    if (definitionTerm) {
      setTimeout(() => definitionTerm.classList.add('visible'), 300);
    }
    if (definitionSeparator) {
      setTimeout(() => definitionSeparator.classList.add('visible'), 600);
    }
    if (definitionText) {
      setTimeout(() => definitionText.classList.add('visible'), 900);
    }
  }
}