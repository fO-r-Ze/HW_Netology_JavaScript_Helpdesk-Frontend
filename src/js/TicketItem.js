export class TicketItem {
  constructor(ticket, { expandedData } = {}) {
    this.ticket = ticket;
    this.expandedData = expandedData;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'ticket';
    el.dataset.id = String(this.ticket.id);
    if (this.ticket.status) el.classList.add('ticket--done');

    const body = document.createElement('div');
    body.className = 'ticket__body';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'ticket__check js-toggle';
    checkbox.checked = !!this.ticket.status;
    checkbox.title = 'Отметить как выполненный';

    const name = document.createElement('div');
    name.className = 'ticket__name';
    name.textContent = this.ticket.name;

    const created = document.createElement('div');
    created.className = 'ticket__created';
    created.textContent = this.formatDate(this.ticket.created);

    body.append(checkbox, name, created);

    const actions = document.createElement('div');
    actions.className = 'ticket__actions';

    const edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'ticket__action js-edit';
    edit.title = 'Редактировать';
    edit.innerHTML =
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5zM3 12.6V13h.4l9-9-1.4-1.4-8 8z"/></svg>';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'ticket__action js-delete';
    del.title = 'Удалить';
    del.innerHTML =
      '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M3.3 3.3l9.4 9.4-1 1L2.3 4.3l1-1zM12.7 3.3l1 1-9.4 9.4-1-1 9.4-9.4z"/></svg>';

    actions.append(edit, del);
    el.append(body, actions);

    if (this.expandedData !== undefined) {
      const desc = document.createElement('div');
      desc.className = 'ticket__description';
      if (this.expandedData === 'loading') {
        desc.textContent = 'Загрузка...';
        desc.classList.add('ticket__description--loading');
      } else {
        desc.textContent = this.expandedData || '(без описания)';
      }
      el.append(desc);
    }

    return el;
  }

  formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}