const demoState = {
    currentStep: 0,
    isPlaying: false,
    duration: 180, // Total seconds (3 mins) - tentative
    currentTime: 0
};

// DOM Elements
const cursor = document.getElementById('cursor');
const caption = document.getElementById('caption-text');
const sceneTitle = document.getElementById('scene-title');
const scenes = document.querySelectorAll('.scene');

// Demo Sequence Data
const timeline = [
    { time: 0, action: startStep1, caption: "System continuously monitors secure IMAP channels for innovative data." },
    { time: 5, action: startStep2, caption: "AI Engine extracts structured data from unstructured PDF documents." },
    { time: 10, action: startStep3, caption: "Intelligent validation checks TDS rates and nature of payment automatically." },
    { time: 15, action: startStep4, caption: "Case is auto-created in the dashboard with full audit trail." },
    { time: 20, action: startStep5, caption: "Form 15CB is auto-filled. CA reviews, edits, and approves in one click." },
    { time: 27, action: startStep6, caption: "End-to-End automation: Zero manual data entry. 100% Compliant." },
];

function initGame() {
    console.log("Initializing Demo...");
    // Start automatically for now
    playDemo();
}

function playDemo() {
    demoState.isPlaying = true;
    updateTimer();
}

function updateTimer() {
    if (!demoState.isPlaying) return;

    demoState.currentTime += 0.1; // update every 100ms
    const progress = (demoState.currentTime / demoState.duration) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    // Check timeline triggers
    timeline.forEach(event => {
        if (Math.abs(demoState.currentTime - event.time) < 0.15) {
            if (event.action) event.action();
            if (event.caption) setCaption(event.caption);
        }
    });

    if (demoState.currentTime < demoState.duration) {
        requestAnimationFrame(() => setTimeout(updateTimer, 100)); // Throttled loop
    } else {
        console.log("Demo Complete");
    }
}

function setCaption(text) {
    caption.innerText = text;
    caption.classList.remove('fade-in');
    void caption.offsetWidth; // trigger reflow
    caption.classList.add('fade-in');
}

function switchScene(sceneId, title) {
    scenes.forEach(s => s.classList.remove('active'));
    document.getElementById(sceneId).classList.add('active');
    sceneTitle.innerText = title;
}

// Moves the fake cursor to an element and clicks it
function moveCursorTo(selector, callback) {
    const target = document.querySelector(selector);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    cursor.style.display = 'block';
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;

    // Click effect after movement
    setTimeout(() => {
        cursor.classList.add('clicking');
        setTimeout(() => {
            cursor.classList.remove('clicking');
            if (callback) callback();
        }, 200);
    }, 600); // Wait for move transition
}

// --- Step 1: Email Monitoring ---
function startStep1() {
    switchScene('scene-email', 'Step 1: Email Monitoring');

    // Simulate "incoming email"
    setTimeout(() => {
        const emailList = document.getElementById('email-list-content');
        const newEmail = document.createElement('div');
        newEmail.className = 'email-item unread fade-in';
        newEmail.id = 'target-email';
        newEmail.innerHTML = `
            <div><strong>Sandeep Kumar</strong> <span class="new-email-badge">NEW</span></div>
            <div>Invoice #INV-2026-001 for Form 15CB...</div>
            <div>Just now</div>
        `;
        emailList.prepend(newEmail);

        // Move cursor to click it
        setTimeout(() => {
            moveCursorTo('#target-email', () => {
                document.getElementById('target-email').classList.add('selected');
                setCaption("System auto-detects relevant invoice attachments.");
                // Transition to Step 2...
            });
        }, 2000);

    }, 1500);
}

// --- Step 2: PDF Extraction ---
function startStep2() {
    switchScene('scene-pdf', 'Step 2: PDF Extraction');
    const sidebar = document.getElementById('extraction-sidebar');
    const pdfDoc = document.getElementById('pdf-doc');
    sidebar.innerHTML = '<div style="font-weight:bold; margin-bottom:10px;">AI Extracted Data</div>';

    const fields = [
        { label: "Invoice #", value: "INV-2026-001", target: "inv-num" },
        { label: "Date", value: "Feb 18, 2026", target: "inv-date" },
        { label: "Amount", value: "$5,000.00 USD", target: "inv-amount" }
    ];

    let delay = 500;
    fields.forEach(field => {
        setTimeout(() => {
            // Add highlight box
            const targetEl = document.getElementById(field.target);
            if (targetEl) {
                const box = document.createElement('div');
                box.className = 'highlight-box';
                box.style.width = targetEl.offsetWidth + 'px';
                box.style.height = targetEl.offsetHeight + 'px';
                box.style.top = targetEl.offsetTop + 'px';
                box.style.left = targetEl.offsetLeft + 'px';
                box.style.opacity = 1;
                pdfDoc.appendChild(box);
            }

            // Add sidebar data
            const div = document.createElement('div');
            div.className = 'extracted-field visible';
            div.innerHTML = `<div class="extracted-label">${field.label}</div><div class="extracted-value">${field.value}</div>`;
            sidebar.appendChild(div);

        }, delay);
        delay += 1000;
    });
}

// --- Step 3: AI Processing ---
function startStep3() {
    switchScene('scene-processing', 'Step 3: AI Validation');

    const steps = ['step-tds', 'step-dtaa', 'step-15ca'];
    let delay = 500;

    steps.forEach((stepId, index) => {
        setTimeout(() => {
            const stepEl = document.getElementById(stepId);
            stepEl.classList.add('active');

            // Mark validation done
            setTimeout(() => {
                stepEl.classList.remove('active');
                stepEl.classList.add('done');
            }, 1000); // Process for 1 sec

        }, delay);
        delay += 1500;
    });
}

// Boot
// --- Step 4: Dashboard ---
function startStep4() {
    switchScene('scene-dashboard', 'Step 4: Compliance Dashboard');

    // Animate new row appearing
    setTimeout(() => {
        const tbody = document.getElementById('case-table-body');
        const tr = document.createElement('tr');
        tr.className = 'fade-in';
        tr.style.background = "#e6fffa"; // Highlight new row
        tr.innerHTML = `
            <td><strong>REF-9001</strong></td>
            <td>Acme Corp Studios</td>
            <td>$5,000</td>
            <td><span class="status-badge pending">Draft Ready</span></td>
            <td>Just Now</td>
        `;
        tbody.prepend(tr);
        setCaption("New case created instantly. Ready for review.");
    }, 1000);
}

// --- Step 5: Form 15CB ---
function startStep5() {
    switchScene('scene-form', 'Step 5: Form 15CB Automation');

    // Typewriter effect for fields
    const fields = [
        { id: 'field-name', val: 'Acme Corp Studios' },
        { id: 'field-pan', val: 'ABCDE1234F' },
        { id: 'field-nature', val: 'Consulting Charges (Technical)' },
        { id: 'field-amount', val: '4,15,000 INR (Exch Rate: 83.0)' }
    ];

    let delay = 500;
    fields.forEach(f => {
        setTimeout(() => {
            document.getElementById(f.id).value = f.val;
        }, delay);
        delay += 600;
    });

    // Simulate "Approve" click
    setTimeout(() => {
        moveCursorTo('button.btn', () => {
            // Click effect handled by moveCursorTo
            setCaption("CA reviews, edits, and approves in one click.");
        });
    }, 4000);
}

// --- Step 6: Portal Submission ---
function startStep6() {
    switchScene('scene-portal', 'Step 6: Final Submission & UDIN');

    // Start upload bar
    setTimeout(() => {
        document.getElementById('upload-area').classList.add('active');
        document.getElementById('upload-bar').style.width = '100%';

        setTimeout(() => {
            document.getElementById('upload-area').style.display = 'none';
            document.getElementById('portal-success').classList.add('visible');
            document.getElementById('scene-title').innerText = "Process Complete";
        }, 3000); // Wait for bar
    }, 1000);
}

window.onload = initGame;
