import { Modal } from './Modal.js';

export class TicketFormModal extends Modal {
  open({ title, initial = {}, onSubmit }) {
    const content = document.createElement('div');
    content.className = 'modal__content';

    const header = document.createElement('div');
    header.className = 'modal__header';
    const h = document.createElement('h2');
    h.className = 'modal__title';
    h.textContent = title;
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'modal__close';
    closeBtn.setAttribute('aria-label', 'Закрыть');
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', () => this.close());
    header.append(h, closeBtn);

    const nameField = document.createElement('label');
    nameField.className = 'field';
    const nameLabel = document.createElement('span');
    nameLabel.className = 'field__label';
    nameLabel.textContent = 'Краткое описание';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'field__input';
    nameInput.value = initial.name || '';
    nameInput.placeholder = 'Краткое описание';
    nameField.append(nameLabel, nameInput);

    const descField = document.createElement('label');
    descField.className = 'field';
    const descLabel = document.createElement('span');
    descLabel.className = 'field__label';
    descLabel.textContent = 'Подробное описание';
    const descInput = document.createElement('textarea');
    descInput.className = 'field__input field__input--textarea';
    descInput.rows = 5;
    descInput.value = initial.description || '';
    descInput.placeholder = 'Подробное описание';
    descField.append(descLabel, descInput);

    const footer = document.createElement('div');
    footer.className = 'modal__footer';

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.className = 'btn';
    cancel.textContent = 'Отмена';
    cancel.addEventListener('click', () => this.close());

    const submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'btn btn--primary';
    submit.textContent = 'Сохранить';

    const doSubmit = async () => {
      const name = nameInput.value.trim();
      const description = descInput.value.trim();
      if (!name) {
        nameInput.focus();
        nameInput.classList.add('field__input--error');
        return;
      }
      nameInput.classList.remove('field__input--error');
      submit.disabled = true;
      try {
        await onSubmit({ name, description });
        this.close();
      } finally {
        submit.disabled = false;
      }
    };

    submit.addEventListener('click', doSubmit);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSubmit();
    });

    footer.append(cancel, submit);
    content.append(header, nameField, descField, footer);

    super.open(content); // ← было this.open(content)
    nameInput.focus();
  }
}