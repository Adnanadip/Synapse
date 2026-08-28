(() => {
    'use strict';


    const DEPARTMENTS = [

        'Civil Engineering (CE)',
        'Mechanical Engineering (ME)',
        'Electrical and Electronic Engineering (EEE)',
        'Computer Science and Engineering (CSE)',
        'Chemical Engineering (ChE)',
        'Industrial and Production Engineering (IPE)',
        'Naval Architecture and Marine Engineering (NAME)',
        'Biomedical Engineering (BME)',
        'Materials and Metallurgical Engineering (MME)',
        'Architecture (Arch)',
        'Urban and Regional Planning (URP)',
        'Water Resources Engineering (WRE)',
        'Petroleum and Mineral Resources Engineering (PMRE)',
        'Nanomaterials and Ceramic Engineering (NCE)',
        'Mathematics (MATH)',
        'Physics (PHYS)',
        'Chemistry (CHEM)',
        'Humanities (HUM)',

    ];

    const LEVEL_TERMS = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

    const TITLE_LABEL_MAP = {

        'Lab Report': 'Experiment',
        'Assignment': 'Title',
        'Project Report': 'Project Title',
        'Term Paper': 'Title',

    };

    const DEFAULT_LOGO_SRC = './asset/frontPage/buetLogo.jpg';

    let currentLogoSrc = DEFAULT_LOGO_SRC;
    let currentAccentColor = '#a11f24';
    let fileNameTouched = false; 


    const el = (id) => document.getElementById(id);

    const escapeHtml = (str) =>
        (str || '').toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    const sanitizeForFile = (str) =>
        (str || '').toString().trim().replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');

    const stripParenthetical = (str) => (str || '').replace(/\s*\([^)]*\)\s*$/, '').trim();

    const ORDINAL_SUFFIX = (n) => {
        const v = n % 100;
        if (v >= 11 && v <= 13) return 'th';
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const formatDate = (value) => {
        if (!value) return '__________';
        const [y, m, d] = value.split('-').map(Number);
        if (!y || !m || !d) return '__________';
        const date = new Date(y, m - 1, d);
        const day = date.getDate();
        return `${DAY_NAMES[date.getDay()]}, ${day}${ORDINAL_SUFFIX(day)} ${MONTH_NAMES[date.getMonth()]}, ${date.getFullYear()}`;
    };

    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
        return chunks;
    };


    function populateSelects() {
        const deptSelect = el('department');
        DEPARTMENTS.forEach((d) => {
            const opt = document.createElement('option');
            opt.value = d;
            opt.textContent = d;
            deptSelect.appendChild(opt);
        });
        const customDeptOpt = document.createElement('option');
        customDeptOpt.value = 'Custom';
        customDeptOpt.textContent = 'Custom…';
        deptSelect.appendChild(customDeptOpt);
        deptSelect.value = 'Biomedical Engineering (BME)';

        const ltSelect = el('levelTerm');
        LEVEL_TERMS.forEach((lt) => {
            const [level, term] = lt.split('-');
            const opt = document.createElement('option');
            opt.value = lt;
            opt.textContent = `Level ${level} - Term ${term}`;
            ltSelect.appendChild(opt);
        });
        ltSelect.value = '2-1';
    }


    function syncConditionalFields() {
        el('customInstituteBlock').classList.toggle('hidden', el('instituteSelect').value !== 'custom');
        el('customDepartmentBlock').classList.toggle('hidden', el('department').value !== 'Custom');
        el('customFileTypeBlock').classList.toggle('hidden', el('fileType').value !== 'Custom');
        el('customTitleLabelBlock').classList.toggle('hidden', el('titleLabel').value !== 'Custom');
        el('groupBlock').classList.toggle('hidden', !el('isGroup').checked);
    }


    function collectFormData() {
        const instituteMode = el('instituteSelect').value;
        const instituteName = instituteMode === 'custom'
            ? (el('customInstituteName').value.trim() || 'Your Institution Name')
            : 'Bangladesh University of Engineering and Technology';

        const deptRaw = el('department').value;
        const department = deptRaw === 'Custom'
            ? (el('customDepartment').value.trim() || '__________')
            : stripParenthetical(deptRaw);

        const [level, term] = el('levelTerm').value.split('-');

        const fileTypeRaw = el('fileType').value;
        const fileType = fileTypeRaw === 'Custom'
            ? (el('customFileType').value.trim() || 'Document')
            : fileTypeRaw;

        const titleLabelRaw = el('titleLabel').value;
        const titleLabel = titleLabelRaw === 'Custom'
            ? (el('customTitleLabel').value.trim() || 'Title')
            : titleLabelRaw;

        const isGroup = el('isGroup').checked;
        const rolls = isGroup
            ? el('groupRolls').value.split(',').map((s) => s.trim()).filter(Boolean)
            : [];
        const rollsPerRow = Math.max(1, Math.min(8, parseInt(el('rollsPerRow').value, 10) || 5));

        return {
            instituteName,
            logoSrc: currentLogoSrc,
            department,
            level: level || '',
            term: term || '',
            courseCode: el('courseCode').value.trim(),
            courseName: el('courseName').value.trim(),
            fileType,
            docNumber: el('docNumber').value.trim(),
            titleLabel,
            titleText: el('titleText').value.trim(),
            name: el('studentName').value.trim(),
            studentId: el('studentId').value.trim(),
            section: el('section').value.trim(),
            isGroup,
            rolls,
            rollsPerRow,
            datePerformance: el('datePerformance').value,
            dateSubmission: el('dateSubmission').value,
            includeCredit: el('includeCredit').checked,
            accentColor: currentAccentColor,
        };
    }


    function renderRollTable(rolls, perRow) {
        if (!rolls.length) return '';
        const chunks = chunkArray(rolls, perRow);
        const rows = chunks.map((row) => {
            const cells = [...row];
            while (cells.length < perRow) cells.push('');
            return `<tr>${cells.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="pf-roll-table">${rows}</table>`;
    }

    function buildPreviewHtml(data) {
        const accentBar = data.accentColor && data.accentColor !== 'none'
            ? `<div class="pf-accent" style="background:${data.accentColor}"></div>`
            : '';

        const logo = data.logoSrc
            ? `<img src="${data.logoSrc}" class="pf-logo" alt="Institution logo" onerror="this.parentElement.style.display='none'; window.__synapseLogoMissing && window.__synapseLogoMissing();">`
            : '';

        const courseLine = [data.courseCode, data.courseName].filter(Boolean).join(': ');

        const docTypeLine = data.docNumber
            ? `${escapeHtml(data.fileType)} - ${escapeHtml(data.docNumber)}`
            : escapeHtml(data.fileType);

        const rollTable = data.isGroup ? renderRollTable(data.rolls, data.rollsPerRow) : '';

        const credit = data.includeCredit
            ? '<div class="pf-credit">Generated with Synapse</div>'
            : '';

        return `
            ${accentBar}
            <div class="pf-logo-wrap">${logo}</div>
            <div class="pf-uni">${escapeHtml(data.instituteName)}</div>
            ${data.department ? `<div class="pf-dept">Department of ${escapeHtml(data.department)}</div>` : ''}
            ${(data.level || data.term) ? `<div class="pf-level">Level - ${escapeHtml(data.level)}&nbsp;&nbsp;&nbsp;Term - ${escapeHtml(data.term)}</div>` : ''}
            ${courseLine ? `<div class="pf-course">${escapeHtml(courseLine)}</div>` : ''}
            <hr class="pf-rule">
            <div class="pf-doctype">${docTypeLine}</div>
            <hr class="pf-rule pf-rule-thick">
            <div class="pf-title"><span class="pf-title-label">${escapeHtml(data.titleLabel)}:</span> ${escapeHtml(data.titleText).toUpperCase() || '__________'}</div>
            <hr class="pf-rule">
            <div class="pf-submitted">
                <div class="pf-submitted-label">Submitted by:</div>
                <div class="pf-submitted-grid">
                    <div class="pf-row"><span>Name</span><span>:</span><span>${escapeHtml(data.name) || '__________'}</span></div>
                    <div class="pf-row"><span>Student ID</span><span>:</span><span>${escapeHtml(data.studentId) || '__________'}</span></div>
                    <div class="pf-row"><span>Section</span><span>:</span><span>${escapeHtml(data.section) || '__________'}</span></div>
                </div>
                ${rollTable}
            </div>
            <div class="pf-dates">
                <div>Date of Performance: <strong>${formatDate(data.datePerformance)}</strong></div>
                <div>Date of Submission: <strong>${formatDate(data.dateSubmission)}</strong></div>
            </div>
            ${credit}
        `;
    }

    function fitToOnePage(frame) {
        frame.classList.remove('pf-compact', 'pf-ultra-compact');
        let overflowing = frame.scrollHeight > frame.clientHeight;
        if (overflowing) {
            frame.classList.add('pf-compact');
        }
        overflowing = frame.scrollHeight > frame.clientHeight;
        if (overflowing) {
            frame.classList.add('pf-ultra-compact');
        }
        overflowing = frame.scrollHeight > frame.clientHeight;
        el('overflowWarning').classList.toggle('hidden', !overflowing && !frame.classList.contains('pf-compact'));
        return overflowing;
    }

    function updateFileNameField(data) {
        if (fileNameTouched) return;
        const parts = [
            sanitizeForFile(data.courseCode) || 'CoverPage',
            sanitizeForFile(data.fileType),
            data.docNumber ? `No${sanitizeForFile(data.docNumber)}` : '',
            sanitizeForFile(data.studentId),
        ].filter(Boolean);
        el('fileName').value = parts.join('_') || 'CoverPage';
    }

    function render() {
        syncConditionalFields();
        const data = collectFormData();
        const frame = el('pageFrame');
        frame.innerHTML = buildPreviewHtml(data);
        fitToOnePage(frame);
        updateFileNameField(data);
        updateScale();
    }

    function updateScale() {
        const viewport = el('pageViewport');
        const scaler = el('pageScaler');
        const frame = el('pageFrame');
        const available = viewport.clientWidth - 24;
        const scale = Math.min(available / 794, 1);
        frame.style.transform = `scale(${scale})`;
        scaler.style.width = `${794 * scale}px`;
        scaler.style.height = `${1123 * scale}px`;
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateScale, 80);
    });


    window.__synapseLogoMissing = () => {
        if (el('instituteSelect').value !== 'custom') {
            el('logoWarning').classList.remove('hidden');
        }
    };

    el('instituteSelect').addEventListener('change', () => {
        if (el('instituteSelect').value === 'custom') {
            const uploaded = el('customLogoUpload').dataset.src;
            currentLogoSrc = uploaded || '';
            el('logoWarning').classList.add('hidden');
        } else {
            currentLogoSrc = DEFAULT_LOGO_SRC;
        }
        render();
    });

    el('customLogoUpload').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            e.target.dataset.src = reader.result;
            if (el('instituteSelect').value === 'custom') {
                currentLogoSrc = reader.result;
                render();
            }
        };
        reader.readAsDataURL(file);
    });


    el('colorSwatches').addEventListener('click', (e) => {
        const btn = e.target.closest('.swatch');
        if (!btn) return;
        document.querySelectorAll('#colorSwatches .swatch').forEach((s) => s.classList.remove('active'));
        btn.classList.add('active');
        currentAccentColor = btn.dataset.color;
        render();
    });


    const form = el('coverForm');
    form.addEventListener('input', render);
    form.addEventListener('change', render);

    el('fileName').addEventListener('input', () => { fileNameTouched = true; });


    el('resetBtn').addEventListener('click', () => {
        if (!confirm('Reset all fields to their defaults?')) return;
        form.reset();
        el('instituteSelect').value = 'buet';
        el('department').value = 'Biomedical Engineering (BME)';
        el('levelTerm').value = '2-1';
        el('fileType').value = 'Lab Report';
        el('docNumber').value = '1';
        el('titleLabel').value = 'Experiment';
        el('rollsPerRow').value = 5;
        currentLogoSrc = DEFAULT_LOGO_SRC;
        currentAccentColor = '#a11f24';
        document.querySelectorAll('#colorSwatches .swatch').forEach((s) => s.classList.remove('active'));
        document.querySelector('#colorSwatches .swatch[data-color="#a11f24"]').classList.add('active');
        fileNameTouched = false;
        el('fileName').value = '';
        el('logoWarning').classList.add('hidden');
        render();
    });


    function showLoading(text) {
        el('loadingText').textContent = text;
        el('loadingOverlay').classList.add('active');
    }

    function hideLoading() {
        el('loadingOverlay').classList.remove('active');
    }

    async function withFullSizeFrame(fn) {
        const scaler = el('pageScaler');
        const frame = el('pageFrame');
        const prev = {
            transform: frame.style.transform,
            width: scaler.style.width,
            height: scaler.style.height,
            overflow: scaler.style.overflow,
        };
        frame.style.transform = 'none';
        scaler.style.width = '794px';
        scaler.style.height = '1123px';
        scaler.style.overflow = 'visible';
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        try {
            await fn();
        } finally {
            frame.style.transform = prev.transform;
            scaler.style.width = prev.width;
            scaler.style.height = prev.height;
            scaler.style.overflow = prev.overflow;
        }
    }

    el('generateBtn').addEventListener('click', async () => {
        if (typeof html2canvas === 'undefined' || !window.jspdf) {
            alert('The PDF engine failed to load (no internet connection to the CDN?). Use the "Print / Save as PDF" button instead — it works completely offline.');
            return;
        }
        showLoading('COMPILING DOCUMENT...');
        try {
            await withFullSizeFrame(async () => {
                showLoading('RENDERING A4 CANVAS...');
                const canvas = await html2canvas(el('pageFrame'), {
                    scale: 3,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                });
                showLoading('WRITING PDF FILE...');
                const imgData = canvas.toDataURL('image/jpeg', 0.97);
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
                const name = (el('fileName').value.trim() || 'CoverPage').replace(/\.pdf$/i, '') + '.pdf';
                pdf.save(name);
            });
        } catch (err) {
            console.error(err);
            alert('Something went wrong generating the PDF. If this page was opened directly as a local file, try serving it through a local server (e.g. VS Code Live Server) instead — or use "Print / Save as PDF" below.');
        } finally {
            hideLoading();
        }
    });

    el('printBtn').addEventListener('click', () => {
        window.print();
    });

    populateSelects();

    el('fileType').addEventListener('change', () => {
        const mapped = TITLE_LABEL_MAP[el('fileType').value];
        if (mapped) el('titleLabel').value = mapped;
    });

    render();
})();
