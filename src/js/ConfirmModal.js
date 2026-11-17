import { Modal } from './Modal.js';

export class ConfirmModal extends Modal {
  open({ title, message, onConfirm }) {
    const content = document.createElement('div');
    content.className = 'modal__content';

    const header = document.createElement('div');
    header.className = 'modal__header';
    const h = document.createElement('h2');
    h.className = 'modal__title';
    h.textContent = title;
    header.append(h);

    const body = document.createElement('p');
    body.className = 'modal__message';
    body.textContent = message;

    const footer = document.createElement('div');
    footer.className = 'modal__footer';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn';
    cancel.textContent = 'Отмена';
    cancel.addEventListener('click', () => this.close());

    const confirm = document.createElement('button');
    confirm.type = 'button';
    confirm.className = 'btn btn--danger';
    confirm.textContent = 'Удалить';
    confirm.addEventListener('click', async () => {
      confirm.disabled = true;
      try {
        await onConfirm();
        this.close();
      } finally {
        confirm.disabled = false;
      }
    });

    footer.append(cancel, confirm);
    content.append(header, body, footer);

    super.open(content); // ← было this.open(content)
  }
}