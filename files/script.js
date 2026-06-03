/* ========================================
   SCHOLARFUND — INTERACTIVE LOGIC
   ======================================== */

// ===== WAITLIST COUNTERS =====
// In production this would pull from your backend/Formsubmit analytics.
// For now: starting display numbers + localStorage increments on each signup.
const STORAGE_KEY = 'scholarfund_signups';
const STARTING = { student: 0, parent: 0, investor: 0 };

function getCounts() {
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return {
    student: STARTING.student + (stored.student || 0),
    parent: STARTING.parent + (stored.parent || 0),
    investor: STARTING.investor + (stored.investor || 0),
  };
}

function updateCounters() {
  const counts = getCounts();
  const total = counts.student + counts.parent + counts.investor;
  document.getElementById('total-count').textContent = total;
  document.getElementById('student-count').textContent = counts.student;
  document.getElementById('parent-count').textContent = counts.parent;
  document.getElementById('investor-count').textContent = counts.investor;
}

function incrementCounter(type) {
  if (!['student', 'parent', 'investor'].includes(type)) return;
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  stored[type] = (stored[type] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  updateCounters();
}

function resetCounters() {
  localStorage.removeItem(STORAGE_KEY);
  updateCounters();
}

// ===== MODAL =====
const MODAL_CONTENT = {
  student: {
    icon: 'graduation-cap',
    title: "You're almost in",
    subtitle: "Drop your details and you'll hear from us when we launch on your campus. Takes 20 seconds.",
    contextPlaceholder: 'School & major (optional)',
  },
  parent: {
    icon: 'heart-handshake',
    title: "Let's get you on the list",
    subtitle: "Get early access to back your kid — or another student you believe in.",
    contextPlaceholder: "Your child's school (optional)",
  },
  investor: {
    icon: 'trending-up',
    title: 'Count me in',
    subtitle: "Leave your info and you'll be first in line when we open to investors.",
    contextPlaceholder: 'Investing experience (optional)',
  },
  university: {
    icon: 'award',
    title: "Let's talk",
    subtitle: "Leave your info and we'll reach out about bringing ScholarFund to your campus.",
    contextPlaceholder: 'University & department',
  },
};

function openModal(type) {
  const content = MODAL_CONTENT[type] || MODAL_CONTENT.student;
  document.getElementById('modal-icon').innerHTML = `<i data-lucide="${content.icon}"></i>`;
  document.getElementById('modal-title').textContent = content.title;
  document.getElementById('modal-subtitle').textContent = content.subtitle;
  document.getElementById('signup-context').placeholder = content.contextPlaceholder;

  document.getElementById('modal-form-view').classList.remove('hidden');
  document.getElementById('modal-success').classList.add('hidden');
  document.getElementById('signup-form').reset();
  document.getElementById('signup-type').value = type;

  // Show the modal overlay by removing hidden class
  const modalOverlay = document.getElementById('modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('hidden');
  }
  document.body.style.overflow = 'hidden';

  // Re-render Lucide icons after DOM updates
  if (window.lucide) lucide.createIcons();
}

function closeModal() {
  const modalOverlay = document.getElementById('modal');
  if (modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
  document.body.style.overflow = '';
}

function closeModalOnBg(e) {
  if (e.target === e.currentTarget) closeModal();
}

// ===== FORM SUBMISSION (Formsubmit) =====
// Prevent default, show success state, then submit via Formsubmit
document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const type = document.getElementById('signup-type').value;
  
  // Increment counter immediately on submit
  incrementCounter(type);
  
  // Show success state
  document.getElementById('modal-form-view').classList.add('hidden');
  document.getElementById('modal-success').classList.remove('hidden');
  
  // Close modal after 2.5 seconds
  setTimeout(closeModal, 2500);
  
  // Submit to Formsubmit after brief delay
  setTimeout(() => {
    this.submit();
  }, 500);
});

// ===== CALCULATOR =====
let calcMode = 'student';

function setCalcMode(mode) {
  calcMode = mode;
  document.querySelectorAll('.calc-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  document.getElementById('calc-student').classList.toggle('hidden', mode !== 'student');
  document.getElementById('calc-investor').classList.toggle('hidden', mode !== 'investor');
}

function getStudentRate(gpa) {
  if (gpa >= 3.7) return 5.0;
  if (gpa >= 3.3) return 6.0;
  if (gpa >= 2.7) return 7.5;
  return 9.0;
}

function getInvestorReturn(gpa) {
  if (gpa >= 3.7) return 8.0;
  if (gpa >= 3.3) return 6.5;
  if (gpa >= 2.7) return 5.0;
  return 3.5;
}

function updateStudentCalc() {
  const loan = parseInt(document.getElementById('loan-amount').value);
  const gpa = parseFloat(document.getElementById('gpa').value);
  const rate = getStudentRate(gpa);
  const privateRate = 11.5;
  const monthlySavings = Math.round((privateRate - rate) / 100 * loan / 12);
  const totalSavings = Math.round((privateRate - rate) / 100 * loan * 10);

  document.getElementById('loan-amount-display').textContent = '$' + loan.toLocaleString();
  document.getElementById('gpa-display').textContent = gpa.toFixed(1);
  document.getElementById('student-rate').textContent = rate.toFixed(1) + '%';
  document.getElementById('monthly-savings').textContent = '$' + monthlySavings.toLocaleString();
  document.getElementById('total-savings').textContent = '$' + totalSavings.toLocaleString();
}

function updateInvestorCalc() {
  const amount = parseInt(document.getElementById('invest-amount').value);
  const gpa = parseFloat(document.getElementById('gpa-inv').value);
  const ret = getInvestorReturn(gpa);
  const annual = Math.round(amount * ret / 100);
  const fiveYr = annual * 5;

  document.getElementById('invest-amount-display').textContent = '$' + amount.toLocaleString();
  document.getElementById('gpa-inv-display').textContent = gpa.toFixed(1);
  document.getElementById('investor-return').textContent = ret.toFixed(1) + '%';
  document.getElementById('annual-return').textContent = '+$' + annual.toLocaleString();
  document.getElementById('five-yr-return').textContent = '+$' + fiveYr.toLocaleString();
}

document.getElementById('loan-amount').addEventListener('input', updateStudentCalc);
document.getElementById('gpa').addEventListener('input', updateStudentCalc);
document.getElementById('invest-amount').addEventListener('input', updateInvestorCalc);
document.getElementById('gpa-inv').addEventListener('input', updateInvestorCalc);

// ===== FAQ =====
const FAQS = [
  { cat: 'For Parents', q: "Can I just invest directly in my own kid's loan?",
    a: "Yes, absolutely. Parents can fund up to 100% of their child's loan offering. You become their lender at a great rate — no bank taking a cut. And you earn back the interest, so it's not [...]
  { cat: 'For Parents', q: 'How is this different from a Parent PLUS loan?',
    a: "Parent PLUS charges ~9% plus a 4.2% fee upfront, and you're personally on the hook for repayment no matter what. With ScholarFund, your kid holds their own loan (zero liability to you), s[...]
  { cat: 'For Students', q: 'Who actually gets to see my GPA?',
    a: "Only verified investors who've funded your loan see your GPA updates each semester. Your full name and contact info stay private. Grades come straight from your university — you don't h[...]
  { cat: 'For Students', q: 'What if I bomb a semester?',
    a: "Your rate might nudge up slightly based on the schedule — but it'll never go above the cap you agreed to at the start. And if something serious happens (illness, family stuff, real hard[...]
  { cat: 'For Investors', q: 'What if the student just stops paying?',
    a: "Every loan has a 3% reserve fund set aside as a first line of protection. If defaults go beyond that, losses are shared proportionally across everyone who invested in that loan. We're bui[...]
  { cat: 'For Investors', q: 'Wait, is this actually legal?',
    a: "Yes — we operate under SEC Regulation Crowdfunding (Reg CF) on the investor side and through a licensed sponsor bank for loan origination. Full disclosures and risk statements before yo[...]
  { cat: 'For Investors', q: 'When do I actually get my money back?',
    a: "Interest payments start once the student begins repayment after graduation. After 12 months you can sell your position on our secondary market if you need liquidity sooner. Full principal[...]
  { cat: 'Our story', q: 'Why is someone building this?',
    a: "Our founder has been carrying over $150,000 in student debt for two decades. He'll still be paying when his own kids apply to college. That shouldn't be normal — and it doesn't have to [...]
];

function renderFAQs() {
  const list = document.getElementById('faq-list');
  list.innerHTML = FAQS.map((item, i) => `
    <div class="faq-item" data-index="${i}">
      <div class="faq-summary">
        <div class="faq-q-body">
          <p class="faq-cat">${item.cat}</p>
          <h3 class="faq-q">${item.q}</h3>
        </div>
        <div class="faq-toggle">+</div>
      </div>
      <p class="faq-a">${item.a}</p>
    </div>
  `).join('');

  list.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      list.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-toggle').textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('open');
        item.querySelector('.faq-toggle').textContent = '−';
      }
    });
  });
}

// ===== INIT =====
// Wait for DOM to be ready before initializing
function initializeApp() {
  updateCounters();
  updateStudentCalc();
  updateInvestorCalc();
  renderFAQs();

  // Render all Lucide icons on the page
  if (window.lucide) lucide.createIcons();

  // Escape closes modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already loaded (script ran after page load)
  initializeApp();
}
