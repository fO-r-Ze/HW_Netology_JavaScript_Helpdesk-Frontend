import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from './api.js';
import { TicketItem } from './TicketItem.js';
import { TicketFormModal } from './TicketFormModal.js';
import { ConfirmModal } from './ConfirmModal.js';

export class TicketList {
  constructor(root) {
    this.root = root;
    this.tickets = [];
    this.expanded = new Map(); // id -> 'loading' | string description
    this.formModal = new TicketFormModal();
    this.confirmModal = new ConfirmModal();

    this.handleClick = this.handleClick.bind(this);
  }

  async init() {
    this.renderShell();
    await this.loadTickets();
  }

  renderShell() {
    this.root.innerHTML = `
      <div class="helpdesk">
        <header class="helpdesk__header">
          <h1 class="helpdesk__title">HelpDesk</h1>
          <button type="button" class="btn btn--primary js-add">Добавить тикет</button>
        </header>
        <div class="helpdesk__list js-list"></div>
        <div class="helpdesk__status js-status"></div>
      </div>
    `;
    this.listEl = this.root.querySelector('.js-list');
    this.statusEl = this.root.querySelector('.js-status');
    this.root
      .querySelector('.js-add')
      .addEventListener('click', () => this.openAddModal());
    this.listEl.addEventListener('click', this.handleClick);
  }

  async loadTickets() {
    this.setStatus('Загрузка...');
    try {
      this.tickets = await getAllTickets();
      this.renderTickets();
      this.setStatus('');
    } catch (err) {
      this.setStatus(`Ошибка загрузки: ${err.message}`, true);
    }
  }

  renderTickets() {
    this.listEl.innerHTML = '';
    if (!this.tickets.length) {
      const empty = document.createElement('div');
      empty.className = 'helpdesk__empty';
      empty.textContent = 'Тикетов пока нет';
      this.listEl.append(empty);
      return;
    }

    for (const ticket of this.tickets) {
      const item = new TicketItem(ticket, {
        expandedData: this.expanded.get(ticket.id),
      });
      this.listEl.append(item.render());
    }
  }

  handleClick(event) {
    const target = event.target;
    const itemEl = target.closest('.ticket');
    if (!itemEl) return;

    // Приводим ID к строке, чтобы избежать проблем со сравнением числа и строки
    const id = String(itemEl.dataset.id);
    const ticket = this.tickets.find((t) => String(t.id) === id);
    
    // Если тикет не найден — выходим
    if (!ticket) {
      console.warn('Тикет не найден по ID:', id);
      return;
    }

    // Чекбокс статуса
    if (target.closest('.js-toggle')) {
      event.preventDefault();
      this.toggleStatus(ticket);
      return;
    }

    // Редактирование
    if (target.closest('.js-edit')) {
      event.stopPropagation(); // Чтобы клик не улетел дальше и не вызвал разворот
      this.openEditModal(ticket);
      return;
    }

    // Удаление
    if (target.closest('.js-delete')) {
      event.stopPropagation();
      this.openDeleteModal(ticket);
      return;
    }

    // Клик по телу тикета (но не по кнопкам) — разворачиваем описание
    if (target.closest('.ticket__body')) {
      this.toggleExpand(ticket);
    }
  }

  async toggleStatus(ticket) {
    try {
      // Загружаем полный тикет, чтобы не потерять description при обновлении
      const full = await getTicketById(ticket.id);
      await updateTicket(ticket.id, {
        name: full.name,
        description: full.description || '',
        status: !full.status,
      });
      await this.loadTickets();
    } catch (err) {
      this.setStatus(`Ошибка: ${err.message}`, true);
      // Перерисовываем, чтобы вернуть чекбокс в реальное состояние
      this.renderTickets();
    }
  }

  async toggleExpand(ticket) {
    if (this.expanded.has(ticket.id)) {
      this.expanded.delete(ticket.id);
      this.renderTickets();
      return;
    }

    this.expanded.set(ticket.id, 'loading');
    this.renderTickets();

    try {
      const full = await getTicketById(ticket.id);
      this.expanded.set(ticket.id, full.description || '');
      const idx = this.tickets.findIndex((t) => t.id === ticket.id);
      if (idx !== -1) this.tickets[idx] = { ...this.tickets[idx], ...full };
      this.renderTickets();
    } catch (err) {
      this.expanded.set(
        ticket.id,
        `Ошибка загрузки описания: ${err.message}`
      );
      this.renderTickets();
    }
  }

  openAddModal() {
    this.formModal.open({
      title: 'Добавить тикет',
      onSubmit: async (data) => {
        try {
          await createTicket({ ...data, status: false });
          await this.loadTickets();
        } catch (err) {
          this.setStatus(`Ошибка: ${err.message}`, true);
        }
      },
    });
  }

  async openEditModal(ticket) {
    let full = ticket;
    if (!full.description) {
      try {
        full = { ...ticket, ...(await getTicketById(ticket.id)) };
      } catch {
        // если не удалось загрузить — редактируем тем, что есть
      }
    }

    this.formModal.open({
      title: 'Редактировать тикет',
      initial: {
        name: full.name,
        description: full.description || '',
      },
      onSubmit: async (data) => {
        try {
          await updateTicket(ticket.id, {
            ...data,
            status: ticket.status,
          });
          // сбрасываем кэш описания — оно могло измениться
          this.expanded.delete(ticket.id);
          await this.loadTickets();
        } catch (err) {
          this.setStatus(`Ошибка: ${err.message}`, true);
        }
      },
    });
  }

  openDeleteModal(ticket) {
    this.confirmModal.open({
      title: 'Удалить тикет?',
      message: `Тикет «${ticket.name}» будет удалён безвозвратно.`,
      onConfirm: async () => {
        try {
          await deleteTicket(ticket.id);
          this.expanded.delete(ticket.id);
          await this.loadTickets();
        } catch (err) {
          this.setStatus(`Ошибка: ${err.message}`, true);
        }
      },
    });
  }

  setStatus(text, isError = false) {
    this.statusEl.textContent = text;
    this.statusEl.classList.toggle('helpdesk__status--error', isError);
  }
}