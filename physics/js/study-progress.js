/** Shared progress + hub deep-continue helpers for GP2 Physics. */
(function () {
  const PROGRESS_KEY = 'gp2-progress';
  const HUB_KEY = 'studithme-last-subject';
  const SUBJECT = { id: 'physics', labelPrefix: '물리' };

  function readProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return {};
      const data = JSON.parse(raw);
      return data && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  function writeProgress(map) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    } catch {
      /* ignore */
    }
  }

  function setStatus(id, status, opts) {
    opts = opts || {};
    const map = readProgress();
    const rank = { seen: 1, attempted: 2, solved: 3 };
    const prev = map[id] && map[id].status;
    if (!opts.force && prev && (rank[prev] || 0) > (rank[status] || 0)) {
      map[id] = Object.assign({}, map[id], { at: Date.now() });
    } else {
      map[id] = { status: status, at: Date.now() };
    }
    writeProgress(map);
    return map[id];
  }

  function getStatus(id) {
    const row = readProgress()[id];
    return (row && row.status) || '';
  }

  function rememberHub(opts) {
    opts = opts || {};
    var path = window.location.pathname;
    var m = path.match(/\/studithme\/(physics\/.*)/);
    var rel = m ? m[1].replace(/\/?$/, '/') : 'physics/';
    var title = opts.title ? SUBJECT.labelPrefix + ' · ' + opts.title : SUBJECT.labelPrefix;
    try {
      localStorage.setItem(
        HUB_KEY,
        JSON.stringify({ id: SUBJECT.id, label: title, href: rel, at: Date.now() })
      );
    } catch (e) {
      /* ignore */
    }
  }

  window.StudyProgress = { readProgress: readProgress, setStatus: setStatus, getStatus: getStatus, rememberHub: rememberHub, PROGRESS_KEY: PROGRESS_KEY };
})();
