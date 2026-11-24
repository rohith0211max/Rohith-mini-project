// Login Form Handling
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Login successful! Redirecting to dashboard...');
    window.location.href = 'dashboard.html';
  });
  
  // Registration Form Handling
  document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Registration successful! Redirecting to login...');
    window.location.href = 'login.html';
  });

  // Quick Actions: Transactions / Profile / Help
  (function(){
    const whatsappUrl = 'https://chat.whatsapp.com/HXSU2tRkjgvLOxtXppw3m4?mode=ems_share_t';

    function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
    function fmtDate(d){ return d.toLocaleString(); }

    const btnTransactions = document.querySelector('#services .card .cta-button')?.closest('.card')?.querySelector('.cta-button');
    // safer: select by heading
    const btnViewHistory = Array.from(document.querySelectorAll('.card')).find(c => c.querySelector('h3')?.textContent?.includes('View Transactions'))?.querySelector('.cta-button');
    const btnEditProfile = Array.from(document.querySelectorAll('.card')).find(c => c.querySelector('h3')?.textContent?.includes('Profile'))?.querySelector('.cta-button');
    const btnHelp = document.getElementById('btn-help');

    const modalTransactions = document.getElementById('modal-transactions');
    const transactionsList = document.getElementById('transactions-list');
    const closeTransactions = document.getElementById('close-transactions');
    const transactionsCloseBtn = document.getElementById('transactions-close');

    function genTx(n=5){
      const items=['Old Phone','Laptop','Battery','TV','Router','Hard Drive'];
      return Array.from({length:n}).map(()=>({
        id: 'TX'+randInt(10000,99999), item: items[randInt(0,items.length-1)], amount: (randInt(10,500)+Math.random()).toFixed(2), date: new Date(Date.now()-randInt(0,1000*60*60*24*60))
      }));
    }

  function openModal(m){ m.setAttribute('aria-hidden','false'); m.classList.add('open'); }
  function closeModal(m){ m.setAttribute('aria-hidden','true'); m.classList.remove('open'); }
  // expose so other modules/IIFEs can use them
  try{ window.openModal = openModal; window.closeModal = closeModal; }catch(e){}

    function renderTransactions(list){
      transactionsList.innerHTML='';
      list.forEach(t=>{
        const li=document.createElement('li'); li.className='transaction-item';
        li.innerHTML=`<strong>${t.item}</strong> <span class="tx-id">${t.id}</span><div class="tx-meta">Amount: ₹${t.amount} • ${fmtDate(new Date(t.date))}</div>`;
        transactionsList.appendChild(li);
      });
    }

    btnViewHistory?.addEventListener('click', ()=>{ renderTransactions(genTx(randInt(3,8))); openModal(modalTransactions); });
    closeTransactions?.addEventListener('click', ()=>closeModal(modalTransactions));
    transactionsCloseBtn?.addEventListener('click', ()=>closeModal(modalTransactions));

    // Profile
    const modalProfile = document.getElementById('modal-profile');
    const closeProfile = document.getElementById('close-profile');
    const profileCancel = document.getElementById('profile-cancel');
    const profileForm = document.getElementById('profile-form');

    btnEditProfile?.addEventListener('click', ()=>{
      // load saved
      try{ const p=JSON.parse(localStorage.getItem('electro_profile')||'null'); if(p){ document.getElementById('profile-name').value=p.name||''; document.getElementById('profile-email').value=p.email||''; document.getElementById('profile-photo').value=p.photo||''; } }catch(e){}
      openModal(modalProfile);
    });
    closeProfile?.addEventListener('click', ()=>closeModal(modalProfile));
    profileCancel?.addEventListener('click', ()=>closeModal(modalProfile));

    profileForm?.addEventListener('submit', function(e){
      e.preventDefault();
      const name=document.getElementById('profile-name').value;
      const email=document.getElementById('profile-email').value;
      const photo=document.getElementById('profile-photo').value;
      try{ localStorage.setItem('electro_profile', JSON.stringify({name,email,photo})); }catch(e){}
      alert('Profile saved');
      closeModal(modalProfile);
    });

    // Help redirect
    btnHelp?.addEventListener('click', ()=>{ window.open(whatsappUrl,'_blank'); });

    // overlay/escape
    document.addEventListener('click', function(e){ if(e.target.classList.contains('modal')) closeModal(e.target); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') document.querySelectorAll('.modal.open').forEach(m=>closeModal(m)); });

  })();

  // Payments modal handling
  (function(){
    const btnPayments = document.getElementById('btn-payments');
    const modalPayments = document.getElementById('modal-payments');
    const closePayments = document.getElementById('close-payments');
    const paymentsCloseBtn = document.getElementById('payments-close');
    const paymentsList = document.getElementById('payments-list');

    function copyToClipboard(text){
      if(navigator.clipboard) return navigator.clipboard.writeText(text);
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); return Promise.resolve();
    }

    function renderPayments(list){
      paymentsList.innerHTML = '';
      list.forEach(p => {
        const tile = document.createElement('div'); tile.className='payment-tile';
        tile.innerHTML = `<div class="tile-body"><strong>${p.method}</strong><div class="tile-detail">${p.details}</div></div><div class="tile-actions"><button class="cta-button copy-btn" data-copy="${p.details}">Copy</button></div>`;
        paymentsList.appendChild(tile);
      });
      paymentsList.querySelectorAll('.copy-btn').forEach(b=>b.addEventListener('click', function(){ copyToClipboard(this.dataset.copy).then(()=>alert('Copied to clipboard')); }));
    }

    btnPayments?.addEventListener('click', ()=>{
      fetch('payments.json').then(r=>r.ok?r.json():Promise.reject()).then(data=>{ renderPayments(data.payments||[]); (window.openModal||openModal)(modalPayments); }).catch(()=>{ renderPayments([{method:'UPI',details:'electrohub@upi'}]); (window.openModal||openModal)(modalPayments); });
    });
    closePayments?.addEventListener('click', ()=> (window.closeModal||closeModal)(modalPayments));
    paymentsCloseBtn?.addEventListener('click', ()=> (window.closeModal||closeModal)(modalPayments));
  })();

const btn = document.getElementById('getLocationBtn');
const status = document.getElementById('locationStatus');

btn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    status.textContent = 'Detecting location...';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;

            // Default display: coordinates
            let display = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

            // Optional: convert coordinates to a readable address
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await res.json();
                if (data.display_name) display = data.display_name;
            } catch (e) {
                // keep the coordinates if the address lookup fails
            }

            document.getElementById('location').value = display;
            status.textContent = 'Location detected ✔';
        },
        (error) => {
            const messages = {
                1: 'Permission denied. Please allow location access.',
                2: 'Location unavailable.',
                3: 'Request timed out. Try again.'
            };
            status.textContent = messages[error.code] || 'Could not get location.';
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
});

