export class BaseSlideType {
  constructor(slide, slideTextContent, slideImageContainer) {
    this.slide = slide;
    this.slideTextContent = slideTextContent;
    this.slideImageContainer = slideImageContainer;
  }

  render() {
    throw new Error('render method must be implemented by subclass');
  }

  startAnimation() {
    // Default implementation can be overridden
  }

  formatMarkdownText(text) {
    let t = this.escapeHTML(text);
    t = t.replace(/ß/g, 'ss'); // Replace ß with ss
    t = t.replace(/\n/g, '<br>');
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong class="bold-text">$1</strong>');
    t = t.replace(/(^|[\s(])\*(.+?)\*(?=[\s).,!?:;]|$)/g, '$1<em class="italic-text">$2</em>');
    return t;
  }

  escapeHTML(s) {
    return String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  renderImage(imagePath) {
    if (!this.slide.image_filename) return;
    
    this.slideImageContainer.innerHTML = `<img src="${imagePath}" alt="${this.escapeHTML(this.slide.concept)}" onerror="this.style.display='none'; this.parentElement.innerHTML='<p>Image not found.</p>';">`;
  }

  hideImage() {
    this.slideImageContainer.style.display = 'none';
  }

  showImage() {
    this.slideImageContainer.style.display = 'flex';
  }
}