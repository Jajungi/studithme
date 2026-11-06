const STORAGE_KEY = 'studithme-last-subject';
const TERM_KEY = 'studithme-last-term';
const SUBJECT_KEY = 'studithme-last-subject-id';

/** @typedef {{ id: string, label: string, href: string, term?: string, at: number }} LastSubject */

const SUBJECTS = {
  chemistry: {
    id: 'chemistry',
    label: '화학',
    mid: { href: 'chemistry/', range: 'BS119 · Ch.13–16' },
    final: { href: 'chemistry/final/', range: 'BS119 · Ch.5·17·19' },
  },
  physics: {
    id: 'physics',
    label: '물리',
    mid: { href: 'physics/mid/', range: 'GP2 · Ch.1–6' },
    final: { href: 'physics/final/', range: 'GP2 · Ch.7–9' },
  },
  programming: {
    id: 'programming',
    label: '프로그래밍',
    mid: { href: 'programming/', range: 'Python · 동일 사이트' },
    final: { href: 'programming/', range: 'Python · 동일 사이트' },
  },
};

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

function readSubjectId() {
  try {
    const id = localStorage.getItem(SUBJECT_KEY);
    return id && SUBJECTS[id] ? id : null;
  } catch {
    return null;
  }
}

/** @param {string} id */
function writeSubjectId(id) {
  try {
    localStorage.setItem(SUBJECT_KEY, id);
  } catch {
    /* ignore */
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

/** @param {string | null} subjectId */
function showStep(subjectId) {
  const subjects = document.querySelector('[data-step="subjects"]');
  const termStep = document.querySelector('[data-step="term"]');
  const lead = document.querySelector('[data-lead]');
  const chip = document.querySelector('[data-subject-chip]');
  const midLink = document.querySelector('[data-pick-term="mid"]');
  const finalLink = document.querySelector('[data-pick-term="final"]');
  const rangeMid = document.querySelector('[data-range-mid]');
  const rangeFinal = document.querySelector('[data-range-final]');

  if (!subjectId || !SUBJECTS[subjectId]) {
    if (subjects) subjects.hidden = false;
    if (termStep) termStep.hidden = true;
    if (lead) lead.textContent = '먼저 과목을 고르세요 · 가로로 올려보세요';
    return;
  }

  const subject = SUBJECTS[subjectId];
  if (subjects) subjects.hidden = true;
  if (termStep) termStep.hidden = false;
  if (lead) {
    lead.textContent =
      subjectId === 'programming'
        ? `${subject.label} · 중간·기말 모두 같은 사이트로 연결됩니다`
        : `${subject.label} · 중간 / 기말을 고르면 새 탭에서 엽니다`;
  }
  if (chip) chip.textContent = subject.label;
  if (midLink) midLink.setAttribute('href', subject.mid.href);
  if (finalLink) finalLink.setAttribute('href', subject.final.href);
  if (rangeMid) rangeMid.textContent = subject.mid.range;
  if (rangeFinal) rangeFinal.textContent = subject.final.range;
}

function bindSubjectPick() {
  document.querySelectorAll('[data-pick-subject]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-pick-subject');
      if (!id || !SUBJECTS[id]) return;
      writeSubjectId(id);
      showStep(id);
    });
  });

  document.querySelector('[data-back-subject]')?.addEventListener('click', () => {
    showStep(null);
  });
}

function bindTermLinks() {
  document.querySelectorAll('[data-pick-term]').forEach((anchor) => {
    anchor.addEventListener('click', () => {
      const term = anchor.getAttribute('data-pick-term');
      if (term !== 'mid' && term !== 'final') return;
      const subjectId = readSubjectId();
      if (!subjectId || !SUBJECTS[subjectId]) return;
      writeTerm(term);
      const subject = SUBJECTS[subjectId];
      const href = term === 'final' ? subject.final.href : subject.mid.href;
      const existing = readLast();
      if (
        existing &&
        existing.id === subjectId &&
        existing.term === term &&
        typeof existing.href === 'string' &&
        existing.href.includes(`${subjectId}/`) &&
        !existing.href.endsWith(`${subjectId}/`) &&
        !existing.href.endsWith(`${subjectId}`)
      ) {
        writeLast({ ...existing, at: Date.now() });
        return;
      }
      writeLast({
        id: subjectId,
        label: subject.label,
        href,
        term,
        at: Date.now(),
      });
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
  bindSubjectPick();
  bindTermLinks();
  bindSplitHover(document.querySelector('[data-split-subjects]'));
  bindSplitHover(document.querySelector('[data-split]'));
  showStep(null);
  renderContinue();
});
