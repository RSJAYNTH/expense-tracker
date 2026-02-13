const API = 'http://localhost:3000';
let expenses = [];
let isEditing = false;
let editId = null;

// DOM Elements
const expenseList = document.getElementById('expense-list');
const totalEl = document.getElementById('total-amount');
const categorySummaryEl = document.getElementById('category-summary');
const form = document.getElementById('expense-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const toast = document.getElementById('toast');

// Inputs
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');

// Fetch initial data
fetchData();

async function fetchData() {
   try {
      const [expRes, sumRes] = await Promise.all([
         fetch(`${API}/expenses`),
         fetch(`${API}/summary`)
      ]);

      const expenseData = await expRes.json();
      const summaryData = await sumRes.json();

      renderExpenses(expenseData);
      renderSummary(summaryData);
   } catch (err) {
      console.error("Fetch error", err);
   }
}

function renderSummary(data) {
   totalEl.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.total);

   categorySummaryEl.innerHTML = '';
   Object.entries(data.categoryTotals).forEach(([cat, amount]) => {
      const pill = document.createElement('div');
      pill.className = 'pill';
      pill.innerHTML = `<strong>${cat}</strong>: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount)}`;
      categorySummaryEl.appendChild(pill);
   });
}

function renderExpenses(data) {
   expenseList.innerHTML = '';
   data.forEach(exp => {
      const li = document.createElement('li');
      li.className = 'expense-item';
      li.dataset.id = exp.id;
      li.innerHTML = `
            <div class="item-info">
                <h4>${exp.description}</h4>
                <span>${exp.category}</span>
            </div>
            <div class="item-actions">
                <span class="item-amount">${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(exp.amount)}</span>
                <button class="btn-icon" onclick="editMode('${exp.id}')">✏️</button>
                <button class="btn-icon btn-delete" onclick="deleteItem('${exp.id}')">🗑️</button>
            </div>
        `;
      expenseList.appendChild(li);
   });
   expenses = data;
}

// Form Submit
form.addEventListener('submit', async (e) => {
   e.preventDefault();
   submitBtn.disabled = true;

   const payload = {
      description: descInput.value,
      amount: amountInput.value,
      category: categoryInput.value
   };

   try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API}/expenses/${editId}` : `${API}/expenses`;

      const res = await fetch(url, {
         method,
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
      });

      if (res.ok) {
         showToast(isEditing ? 'Updated Successfully' : 'Added Successfully');
         resetForm();
         fetchData();
      }
   } catch (err) {
      console.error(err);
   } finally {
      submitBtn.disabled = false;
   }
});

// Edit Mode
window.editMode = (id) => {
   const item = expenses.find(e => e.id === id);
   if (!item) return;

   isEditing = true;
   editId = id;

   descInput.value = item.description;
   amountInput.value = item.amount;
   categoryInput.value = item.category;

   formTitle.textContent = 'Edit Expense';
   submitBtn.textContent = 'Update Expense';
   cancelBtn.classList.remove('hidden');

   // Smooth scroll to form
   form.scrollIntoView({ behavior: 'smooth' });
};

// Cancel Edit
cancelBtn.addEventListener('click', resetForm);

function resetForm() {
   isEditing = false;
   editId = null;
   form.reset();
   formTitle.textContent = 'Add Expense';
   submitBtn.textContent = 'Add Expense';
   cancelBtn.classList.add('hidden');
}

// Delete Item
window.deleteItem = async (id) => {
   if (!confirm('Delete this expense?')) return;

   // Optimistic UI Removal with Animation
   const itemEl = document.querySelector(`li[data-id="${id}"]`) ||
      Array.from(document.querySelectorAll('li')).find(li => li.dataset.id === id);

   if (itemEl) {
      itemEl.style.animation = 'fadeOutRight 0.3s forwards';
   }

   try {
      await fetch(`${API}/expenses/${id}`, { method: 'DELETE' });
      setTimeout(() => fetchData(), 300); // Wait for animation
      showToast('Deleted');
   } catch (err) {
      console.error(err);
   }
};

function showToast(msg) {
   toast.textContent = msg;
   toast.classList.remove('hidden');
   setTimeout(() => {
      toast.classList.add('hidden');
   }, 3000);
}
