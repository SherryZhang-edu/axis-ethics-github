'use strict';
(() => {
    const D = window.AXIS_DATA;
    const $ = id => document.getElementById(id);
    const KEY = 'axis-ieee-worksheet-v1';
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const clean = v => typeof v === 'string' ? v : '';
    const filled = v => typeof v === 'string' && v.trim().length > 0;
    const understanding = [
        { id: 'flaw', label: '1. What is the core technical flaw?', hint: 'In your own words, briefly summarize the core technical flaw that Lena discovered.' },
        { id: 'pressures', label: '2. What pressures encourage an on-time launch?', hint: 'Identify at least two pressures and explain how they could influence judgement.' }    ];
    const finalFields = [
        { id: 'justification', label: 'Why is this your recommended first action?', hint: 'Reference at least two specific IEEE clauses. Connect each to case evidence and address a counterargument or trade-off.' },
        { id: 'next', label: 'What should happen if that first action does not resolve the risk?', hint: 'Identify the next step, the responsible people and the conditions that would trigger it.' },
        { id: 'verification', label: 'What must be verified before supporting deployment?', hint: 'Specify evidence, tests, acceptance criteria or controls you would require. Identify who should review them.' }
    ];
    function emptyState() { return { version: 1, author: '', fields: {}, stakeholders: [1, 2, 3].map(id => ({ id, name: '', impact: '' })), selected: [], analyses: {}, options: {}, recommendation: '' }; }
    function normalize(raw) {
        const s = emptyState();
        if (!raw || typeof raw !== 'object' || raw.version !== 1) throw new Error('Unknown draft format');
        s.author = clean(raw.author); s.recommendation = ['escalate', 'restrict', 'launch', 'resign', 'report', 'other'].includes(raw.recommendation) ? raw.recommendation : '';
        for (const q of [...understanding, ...finalFields]) s.fields[q.id] = clean(raw.fields?.[q.id]);
        if (Array.isArray(raw.stakeholders) && raw.stakeholders.length) { s.stakeholders = raw.stakeholders.slice(0, 12).map((r, i) => ({ id: i + 1, name: clean(r?.name), impact: clean(r?.impact) })); }
        s.selected = D.clauses.map(c => c.id).filter(id => Array.isArray(raw.selected) && raw.selected.includes(id));
        for (const c of D.clauses) s.analyses[c.id] = { evidence: clean(raw.analyses?.[c.id]?.evidence), reason: clean(raw.analyses?.[c.id]?.reason), action: clean(raw.analyses?.[c.id]?.action) };
        for (const o of D.options) s.options[o.id] = { pros: clean(raw.options?.[o.id]?.pros), cons: clean(raw.options?.[o.id]?.cons), conditions: clean(raw.options?.[o.id]?.conditions) };
        return s;
    }
    let state = emptyState(), timer = null, storageAvailable = true, storageMessage = '';
    try { const raw = localStorage.getItem(KEY); if (raw) { state = normalize(JSON.parse(raw)); storageMessage = 'Saved draft restored in this browser.'; } else { storageMessage = 'Draft will save automatically in this browser.'; } }
    catch (error) { storageAvailable = false; storageMessage = 'Draft storage could not be read. Your responses are available for this session; export them before leaving.'; }
    function textField(id, label, value = '', hint = '', attrs = '') {
        return '<div class="field"><label for="' + esc(id) + '">' + esc(label) + (hint ? '<span class="hint">' + esc(hint) + '</span>' : '') + '</label><textarea id="' + esc(id) + '" rows="4" ' + attrs + '>' + esc(value) + '</textarea></div>';
    }
    function rootFields() { $('understanding-fields').innerHTML = understanding.map(q => textField(q.id, q.label, state.fields[q.id], q.hint, 'data-kind="field" data-key="' + q.id + '"')).join(''); $('recommendation-fields').innerHTML = finalFields.map(q => textField(q.id, q.label, state.fields[q.id], q.hint, 'data-kind="field" data-key="' + q.id + '"')).join(''); $('author').value = state.author; $('recommendation').value = state.recommendation; }
    function renderCase() {
        $('case-text').innerHTML = D.case.map(t => '<p>' + esc(t) + '</p>').join('');
        $('code-reference').innerHTML = D.clauses.map(c => '<details class="code-clause" id="reference-' + c.id + '"><summary><b>' + c.id + '</b>' + esc(c.title) + '</summary><p>' + esc(c.text) + '</p></details>').join('');
        $('clause-choices').innerHTML = D.clauses.map(c => '<label class="clause-choice" for="choose-' + c.id + '"><input type="checkbox" id="choose-' + c.id + '" data-clause="' + c.id + '" ' + (state.selected.includes(c.id) ? 'checked' : '') + '><span><strong>Clause ' + c.id + '</strong>' + esc(c.title) + '</span></label>').join('');
    }
    function renderStakeholders() {
        $('stakeholder-rows').innerHTML = state.stakeholders.map((r, i) => '<div class="stakeholder"><div class="row-top"><span>STAKEHOLDER ' + (i + 1) + '</span><button type="button" class="remove" data-remove="' + r.id + '" aria-label="Remove stakeholder ' + (i + 1) + '">Remove</button></div><div class="field"><label for="stake-name-' + r.id + '">Person or group</label><input id="stake-name-' + r.id + '" data-kind="stakeholder" data-row="' + r.id + '" data-key="name" value="' + esc(r.name) + '" placeholder="Who is affected?"></div>' + textField('stake-impact-' + r.id, 'What is at stake for them?', r.impact, 'Explain the specific consequences.', 'data-kind="stakeholder" data-row="' + r.id + '" data-key="impact"') + '</div>').join('');
        $('add-stakeholder').disabled = state.stakeholders.length >= 12;
    }
    function renderAnalyses() {
        $('principle-responses').innerHTML = D.clauses.filter(c => state.selected.includes(c.id)).map(c => {
            const a = state.analyses[c.id] || {}; return '<article class="principle-response"><h3>Clause ' + c.id + ' · ' + esc(c.title) + '</h3><blockquote class="quote">' + esc(c.text) + '</blockquote>' +
                textField('evidence-' + c.id, 'Which case facts make this clause relevant?', a.evidence, 'Cite a concrete detail.', 'data-kind="analysis" data-row="' + c.id + '" data-key="evidence"') +
                textField('reason-' + c.id, 'How does the principle apply?', a.reason, 'Explain the link between those facts and the ethical duty.', 'data-kind="analysis" data-row="' + c.id + '" data-key="reason"') +
                textField('action-' + c.id, 'What action does this principle support?', a.action, 'Explain whether it supports or challenges launching as planned, and why.', 'data-kind="analysis" data-row="' + c.id + '" data-key="action"') + '</article>';
        }).join('');
        $('clause-empty').hidden = state.selected.length > 0;
        for (const c of D.clauses) $('reference-' + c.id).classList.toggle('selected', state.selected.includes(c.id));
    }
    function renderOptions() {
        $('option-responses').innerHTML = D.options.map(o => {
            const a = state.options[o.id] || {}, open = Object.values(a).some(filled);
            return '<details class="option-card" ' + (open ? 'open' : '') + '><summary>' + esc(o.title) + '<span id="option-state-' + o.id + '">Not evaluated</span></summary><div class="option-body"><p>' + esc(o.text) + '</p>' +
                textField('pros-' + o.id, 'Potential benefits', a.pros, 'Who might benefit, and how?', 'data-kind="option" data-row="' + o.id + '" data-key="pros"') +
                textField('cons-' + o.id, 'Potential harm and drawbacks', a.cons, 'Who bears the risk? Consider practical and ethical consequences.', 'data-kind="option" data-row="' + o.id + '" data-key="cons"') +
                textField('conditions-' + o.id, 'Evidence, conditions or safeguards needed', a.conditions, 'What would need to be true for this option to be defensible?', 'data-kind="option" data-row="' + o.id + '" data-key="conditions"') + '</div></details>';
        }).join('');
    }
    function coverage() {
        const p1 = understanding.every(q => filled(state.fields[q.id]));
        const p2 = state.stakeholders.filter(r => filled(r.name) && filled(r.impact)).length >= 3;
        const p3 = state.selected.length >= 2 && state.selected.every(id => ['evidence', 'reason', 'action'].every(k => filled(state.analyses[id]?.[k])));
        const p4 = D.options.filter(o => ['pros', 'cons', 'conditions'].every(k => filled(state.options[o.id]?.[k]))).length >= 2;
        const p5 = filled(state.recommendation) && finalFields.every(q => filled(state.fields[q.id]));
        return [p1, p2, p3, p4, p5];
    }
    function updateProgress() {
        const covered = coverage(), count = covered.filter(Boolean).length;
        const msg = count + ' / 5 sections covered'; if ($('coverage').textContent !== msg) $('coverage').textContent = msg;
        $('overall-progress').value = count;
        covered.forEach((done, i) => { const el = $('state-' + (i + 1)); el.textContent = done ? 'Responses present' : 'To do'; el.classList.toggle('done', done); });
        for (const o of D.options) { const n = ['pros', 'cons', 'conditions'].filter(k => filled(state.options[o.id]?.[k])).length; $('option-state-' + o.id).textContent = n === 3 ? 'Evaluated' : n ? 'In progress' : 'Not evaluated'; }
    }
    function saveNow() {
        clearTimeout(timer);
        try { localStorage.setItem(KEY, JSON.stringify(state)); storageAvailable = true; $('save-status').textContent = 'Draft saved in this browser.'; }
        catch (error) { storageAvailable = false; $('save-status').textContent = 'Could not save this draft. Keep this page open and download your answers.'; }
    }
    function changed() {
        updateProgress(); $('review-summary').hidden = true; clearTimeout(timer);
        $('save-status').textContent = storageAvailable ? 'Saving draft…' : 'Draft is in this session. Download answers to keep a copy.';
        timer = setTimeout(saveNow, 600);
    }
    document.addEventListener('input', event => {
        const t = event.target, k = t.dataset.kind, key = t.dataset.key, row = t.dataset.row;
        if (t.id === 'author') state.author = t.value;
        else if (t.id === 'recommendation') state.recommendation = t.value;
        else if (k === 'field') state.fields[key] = t.value;
        else if (k === 'stakeholder') { const r = state.stakeholders.find(r => r.id === Number(row)); if (r) r[key] = t.value; }
        else if (k === 'analysis') { state.analyses[row] ??= {}; state.analyses[row][key] = t.value; }
        else if (k === 'option') { state.options[row] ??= {}; state.options[row][key] = t.value; }
        else return;
        changed();
    });
    document.addEventListener('change', event => {
        const t = event.target, id = t.dataset.clause;
        if (!id) return;
        if (t.checked) { if (!state.selected.includes(id)) state.selected.push(id); }
        else state.selected = state.selected.filter(x => x !== id);
        renderAnalyses(); changed();
    });
    $('add-stakeholder').addEventListener('click', () => {
        if (state.stakeholders.length >= 12) return;
        const id = Math.max(0, ...state.stakeholders.map(r => r.id)) + 1;
        state.stakeholders.push({ id, name: '', impact: '' }); renderStakeholders(); changed(); $('stake-name-' + id).focus();
    });
    $('stakeholder-rows').addEventListener('click', event => {
        const button = event.target.closest('[data-remove]'); if (!button) return;
        const id = Number(button.dataset.remove), row = state.stakeholders.find(r => r.id === id);
        if (row && (filled(row.name) || filled(row.impact)) && !window.confirm('Remove this stakeholder and their response?')) return;
        state.stakeholders = state.stakeholders.filter(r => r.id !== id); renderStakeholders(); changed(); $('add-stakeholder').focus();
    });
    $('analysis-form').addEventListener('submit', event => event.preventDefault());
    $('review').addEventListener('click', () => {
        const covered = coverage(), names = ['Understand the scenario', 'Identify stakeholders', 'Apply the IEEE Code', 'Evaluate actions', 'Recommend and justify'];
        const needs = ['Answer all evidence questions.', 'Complete the name and impact for at least three stakeholders.', 'Choose at least two clauses and complete all three fields for each selected clause.', 'Complete all three fields for at least two alternatives.', 'Choose a first action and complete the justification, next step and verification fields.'];
        const box = $('review-summary'); box.hidden = false;
        box.innerHTML = '<strong>' + covered.filter(Boolean).length + ' of 5 sections have the requested responses.</strong><ul>' + names.map((name, i) => '<li><a href="#part' + (i + 1) + '">' + esc(name) + '</a>: ' + (covered[i] ? 'responses present.' : esc(needs[i])) + '</li>').join('') + '</ul>';
        box.tabIndex = -1; box.focus(); saveNow();
    });
    function reportSections() {
        const sections = [];
        sections.push({ title: '1. Understanding the scenario', blocks: understanding.map(q => ({ label: q.label, text: state.fields[q.id] })) });
        sections.push({ title: '2. Stakeholders', blocks: state.stakeholders.map((r, i) => ({ label: 'Stakeholder ' + (i + 1) + ': ' + (r.name || '[not named]'), text: r.impact })) });
        sections.push({ title: '3. Applying the IEEE Code', blocks: state.selected.length ? D.clauses.filter(c => state.selected.includes(c.id)).flatMap(c => [{ label: 'Clause ' + c.id + ': ' + c.title, text: c.text, quote: true }, { label: 'Case evidence', text: state.analyses[c.id]?.evidence }, { label: 'Application of the principle', text: state.analyses[c.id]?.reason }, { label: 'Action supported', text: state.analyses[c.id]?.action }]) : [{ label: 'Selected clauses', text: '[No clauses selected]' }] });
        sections.push({ title: '4. Evaluating courses of action', blocks: D.options.flatMap(o => [{ label: o.title + ' — potential benefits', text: state.options[o.id]?.pros }, { label: 'Potential harm and drawbacks', text: state.options[o.id]?.cons }, { label: 'Evidence, conditions or safeguards', text: state.options[o.id]?.conditions }]) });
        const option = D.options.find(o => o.id === state.recommendation);
        sections.push({ title: '5. Recommendation and justification', blocks: [{ label: 'First action', text: state.recommendation === 'other' ? 'Another first action (see justification)' : option?.title }, ...finalFields.map(q => ({ label: q.label, text: state.fields[q.id] }))] });
        return sections;
    }
    function preparePrint() {
        const answer = v => filled(v) ? v.trim() : '[Not answered]';
        $('print-report').innerHTML = '<h1>The AXIS Decision</h1><p class="report-meta">IEEE ethics case analysis · ' + esc(state.author.trim() || 'Name/group not provided') + '<br>Simulated course case · IEEE Code of Ethics, June 2020<br>Response coverage: ' + coverage().filter(Boolean).length + '/5 sections (not a grade).</p>' + reportSections().map(s => '<section><h2>' + esc(s.title) + '</h2>' + s.blocks.map(b => '<h3>' + esc(b.label) + '</h3>' + (b.quote ? '<blockquote>' + esc(answer(b.text)) + '</blockquote>' : '<p class="report-answer">' + esc(answer(b.text)) + '</p>')).join('') + '</section>').join('');
    }
    window.addEventListener('beforeprint', preparePrint);
    $('print').addEventListener('click', () => { saveNow(); preparePrint(); window.print(); });
    $('clear').addEventListener('click', () => {
        if (!window.confirm('Clear all answers on this page and the saved draft in this browser? Download your answers first if you want to keep them.')) return;
        clearTimeout(timer); state = emptyState();
        try { localStorage.removeItem(KEY); storageAvailable = true; $('save-status').textContent = 'Draft cleared. New responses will save automatically.'; }
        catch (error) { storageAvailable = false; $('save-status').textContent = 'Page cleared, but stored data could not be removed. Clear this site’s browser data on a shared device.'; }
        rootFields(); renderCase(); renderStakeholders(); renderAnalyses(); renderOptions(); updateProgress(); $('review-summary').hidden = true; $('print-report').textContent = ''; $('author').focus();
    });
    rootFields(); renderCase(); renderStakeholders(); renderAnalyses(); renderOptions(); updateProgress(); $('save-status').textContent = storageMessage;
    window.addEventListener('pagehide', () => { if (timer) { clearTimeout(timer); saveNow(); } });
})();
