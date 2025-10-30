import { BaseSlideType } from './baseSlideType.js';

export class TimelineSlideType extends BaseSlideType {
  render() {
    this.hideImage();
    
    // Parse the timeline content
    const content = this.slide.slide_content || '';
    const events = content.split('\n').filter(event => event.trim());
    
    // Create timeline HTML
    let eventsHtml = '';
    events.forEach((event, index) => {
      const parts = event.split(':');
      const year = parts[0] ? parts[0].trim() : '';
      const description = parts[1] ? parts[1].trim() : '';
      
      eventsHtml += `<div class="timeline-event" data-index="${index}">
        <div class="timeline-year">${this.formatMarkdownText(year)}</div>
        <div class="timeline-description">${this.formatMarkdownText(description)}</div>
      </div>`;
    });
    
    const contentHtml = `<div class="timeline-container">
      <h2 class="timeline-title">${this.formatMarkdownText(this.slide.explanation)}</h2>
      <div class="timeline">
        <div class="timeline-line"></div>
        ${eventsHtml}
      </div>
    </div>`;
    
    this.slideTextContent.innerHTML = contentHtml;
  }

  startAnimation() {
    // Animate timeline events appearing one by one
    const events = this.slideTextContent.querySelectorAll('.timeline-event');
    events.forEach((event, index) => {
      setTimeout(() => {
        event.classList.add('visible');
      }, 500 * index);
    });
  }
}