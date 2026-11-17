export class Modal {
  constructor() {
    this.element = null;
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  open(content) {
    this.close();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.append(content);

    overlay.append(modal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    document.body.append(overlay);
    document.addEventListener('keydown', this.onKeyDown);
    this.element = overlay;
    return modal;
  }

  onKeyDown(e) {
    if (e.key === 'Escape') this.close();
  }

  close() {
    if (this.element && this.element.parentNode) this.element.remove();
    this.element = null;
    document.removeEventListener('keydown', this.onKeyDown);
  }
}