const STORAGE_KEY = 'studithme-last-subject';
const TERM_KEY = 'studithme-last-term';

/**
 * @typedef {{ id: string, label: string, href: string, term?: string, at: number }} LastSubject
 */

/** @returns {LastSubject | null} */
function readLast() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.id !== 'string' || typeof data.href !== 'string') return null;
    return data;
  } catch {
    return null;
  }
}

/** @param {LastSubject} subject */
function writeLast(subject) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subject));
  } catch {
    /* ignore */
  }
}

function readTerm() {
  try {
    const t = localStorage.getItem(TERM_KEY);
    return t === 'final' ? 'final' : t === 'mid' ? 'mid' : null;
  } catch {
    return null;
  }
}

/** @param {'mid'|'final'} term */
function writeTerm(term) {
  try {
    localStorage.setItem(TERM_KEY, term);
  } catch {
    /* ignore */
  }
}

function renderContinue() {
  const panel = document.querySelector('[data-continue]');
  const link = document.querySelector('[data-continue-link]');
  const label = document.querySelector('[data-continue-label]');
  if (!panel || !link || !label) return;

  const last = readLast();
  if (!last) {
    panel.classList.remove('is-visible');
    panel.hidden = true;
    return;
  }

  const termTag = last.term === 'final' ? '기말 · ' : last.term === 'mid' ? '중간 · ' : '';
  label.textContent = `${termTag}${last.label}`;
  link.href = last.href;
  panel.hidden = false;
  panel.classList.add('is-visible');
}

/** @param {'mid'|'final'} term */
function applySubjectHrefs(term) {
  document.querySelectorAll('[data-subject]').forEach((anchor) => {
    const href =
      term === 'final'
        ? anchor.getAttribute('data-href-final')
        : anchor.getAttribute('data-href-mid');
    if (href) anchor.setAttribute('href', href);
  });

  const chemRange = document.querySelector('[data-range-chem]');
  const physRange = document.querySelector('[data-range-phys]');
  if (chemRange) {
    chemRange.textContent =
      term === 'final' ? 'BS119 · Ch.5·17·19 기말' : 'BS119 · Ch.13–16 중간';
  }
  if (physRange) {
    physRange.textContent =
      term === 'final' ? 'GP2 · Ch.7+ 기말' : 'GP2 · Ch.1–6 중간';
  }
}

/** @param {'mid'|'final'|null} term */
function showStep(term) {
  const termSplit = document.querySelector('[data-step="term"]');
  const subjects = document.querySelector('[data-step="subjects"]');
  const lead = document.querySelector('[data-lead]');
  const chip = document.querySelector('[data-term-chip]');

  if (!term) {
    if (termSplit) termSplit.hidden = false;
    if (subjects) subjects.hidden = true;
    if (lead) lead.textContent = '먼저 중간 / 기말을 고르세요 · 가로로 올려보세요';
    return;
  }

  if (termSplit) termSplit.hidden = true;
  if (subjects) subjects.hidden = false;
  if (lead) {
    lead.textContent =
      term === 'final'
        ? '기말 트랙 · 과목을 고르면 새 탭에서 엽니다'
        : '중간 트랙 · 과목을 고르면 새 탭에서 엽니다';
  }
  if (chip) {
    chip.dataset.term = term;
    chip.textContent = term === 'final' ? '기말 Final' : '중간 Midterm';
  }
  applySubjectHrefs(term);
}

function bindTermPick() {
  document.querySelectorAll('[data-pick-term]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-pick-term');
      if (term !== 'mid' && term !== 'final') return;
      writeTerm(term);
      showStep(term);
    });
  });

  document.querySelector('[data-back-term]')?.addEventListener('click', () => {
    showStep(null);
  });
}

function bindSubjectLinks() {
  document.querySelectorAll('[data-subject]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const id = anchor.getAttribute('data-subject') || '';
      const term = readTerm() || 'mid';
      const existing = readLast();
      if (
        existing &&
        existing.id === id &&
        existing.term === term &&
        typeof existing.href === 'string' &&
        existing.href.includes(`${id}/`) &&
        !existing.href.endsWith(`${id}/`) &&
        !existing.href.endsWith(`${id}`)
      ) {
        writeLast({ ...existing, at: Date.now() });
        return;
      }
      const label = anchor.getAttribute('data-label') || id;
      const href = anchor.getAttribute('href') || '';
      writeLast({ id, label, href, term, at: Date.now() });
    });
  });
}

/** @param {Element | null} split */
function bindSplitHover(split) {
  if (!split) return;
  split.querySelectorAll('[data-side]').forEach((pane) => {
    const side = pane.getAttribute('data-side');
    if (!side) return;
    pane.addEventListener('pointerenter', () => {
      split.setAttribute('data-hover', side);
    });
    pane.addEventListener('focus', () => {
      split.setAttribute('data-hover', side);
    });
  });
  split.addEventListener('pointerleave', () => {
    split.removeAttribute('data-hover');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindTermPick();
  bindSubjectLinks();
  bindSplitHover(document.querySelector('[data-split]'));
  bindSplitHover(document.querySelector('[data-split-subjects]'));
  showStep(null);
  renderContinue();
});
