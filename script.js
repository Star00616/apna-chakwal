let professionals = JSON.parse(localStorage.getItem('chakwalPros')) || [
  {
    isDemo: true,
    name: "Sample: Solar & Electrician (Demo)",
    category: "Electrician & Solar",
    tehsil: "Kallar Kahar",
    phone: "",
    desc: "Ye ek demo profile hai. Aapki profile bhi isi tarah tasveer, kaam ki tafseel aur WhatsApp button ke sath dikhegi.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com"
  },
  {
    isDemo: true,
    name: "Sample: Event Photographer (Demo)",
    category: "Photographer & Events",
    tehsil: "Chakwal City",
    phone: "",
    desc: "Ye ek demo profile hai. Apna asli kaam aur WhatsApp number register karne ke liye upar yellow button dabayein.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com"
  }
];

function displayPros(list) {
  const container = document.getElementById('prosContainer');
  container.innerHTML = '';
  list.forEach(pro => {
    const media = pro.mediaType === 'video' 
      ? '<video src="' + pro.mediaUrl + '" controls></video>' 
      : '<img src="' + pro.mediaUrl + '">';

    const demoBadge = pro.isDemo 
      ? '<span style="background:#dc3545; color:#fff; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">DEMO</span>' 
      : '';

    const actionButtons = pro.isDemo
      ? '<button onclick="openModal()" class="btn" style="background:#6c757d; border:none; cursor:pointer;">Ye Demo Hai - Apna Kaam Add Karein</button>'
      : '<a href="https://wa.me' + pro.phone + '" target="_blank" class="btn btn-whatsapp">WhatsApp</a>' +
        '<a href="tel:+' + pro.phone + '" class="btn btn-call">Call Now</a>';

    container.innerHTML += 
      '<div class="card">' +
        '<div class="media-preview">' + media + '</div>' +
        '<div class="card-header">' +
          '<span class="badge">' + pro.category + '</span>' + demoBadge +
          '<span class="tehsil-tag">' + pro.tehsil + '</span>' +
          '<h3>' + pro.name + '</h3>' +
          '<p>' + pro.desc + '</p>' +
        '</div>' +
        '<div class="card-actions">' + actionButtons + '</div>' +
      '</div>';
  });
}

function filterPros() {
  const s = document.getElementById('searchInput').value.toLowerCase();
  const t = document.getElementById('tehsilFilter').value;
  const c = document.getElementById('categoryFilter').value;
  const filtered = professionals.filter(p => 
    (p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s)) &&
    (t === 'All' || p.tehsil === t) &&
    (c === 'All' || p.category === c)
  );
  displayPros(filtered);
}

function addProfessional(e) {
  e.preventDefault();
  const file = document.getElementById('proMedia').files;
  const reader = new FileReader();
  reader.onload = function(ev) {
    professionals.unshift({
      isDemo: false,
      name: document.getElementById('proName').value,
      category: document.getElementById('proCategory').value,
      tehsil: document.getElementById('proTehsil').value,
      phone: document.getElementById('proPhone').value,
      desc: document.getElementById('proDesc').value,
      mediaType: file.type.startsWith('video') ? 'video' : 'image',
      mediaUrl: ev.target.result
    });
    localStorage.setItem('chakwalPros', JSON.stringify(professionals));
    displayPros(professionals);
    closeModal();
    document.getElementById('proForm').reset();
  };
  if (file) reader.readAsDataURL(file);
}

function openModal() { document.getElementById('registerModal').style.display = 'block'; }
function closeModal() { document.getElementById('registerModal').style.display = 'none'; }
displayPros(professionals);
      
