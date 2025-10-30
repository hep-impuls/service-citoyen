import { BaseSlideType } from './baseSlideType.js';

export class ConceptMapSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    // Parse the concept map content
    const mapContent = this.slide.slide_content || '';
    const nodes = mapContent.split('←→').map(node => node.trim());
    
    // Create concept map HTML
    let nodesHtml = '';
    nodes.forEach((node, index) => {
      nodesHtml += `<div class="concept-node" data-index="${index}">
        <div class="node-content">${this.formatMarkdownText(node)}</div>
      </div>`;
    });
    
    // Add connections between nodes
    let connectionsHtml = '';
    for (let i = 0; i < nodes.length - 1; i++) {
      connectionsHtml += `<div class="concept-connection" data-from="${i}" data-to="${i+1}"></div>`;
    }
    
    const contentHtml = `<div class="concept-map-container">
      <h2 class="concept-map-title">${this.escapeHTML(this.slide.explanation)}</h2>
      <div class="concept-map">
        ${connectionsHtml}
        ${nodesHtml}
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }

  startAnimation() {
    // Animate nodes appearing one by one
    const nodes = this.slideTextContent.querySelectorAll('.concept-node');
    nodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('visible');
        // Also show the connection to the next node
        const connection = this.slideTextContent.querySelector(`.concept-connection[data-from="${index}"]`);
        if (connection) connection.classList.add('visible');
      }, 800 * index);
    });
  }
}