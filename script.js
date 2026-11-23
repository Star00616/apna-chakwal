let professionals = JSON.parse(localStorage.getItem('chakwalPros')) || [
  {
    name: "Ustad Tariq Mehmood",
    category: "Electrician & Solar",
    tehsil: "Kallar Kahar",
    phone: "923001234567",
    desc: "Solar system installation aur gharelu bijli ke tamam kaam.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com"
  },
  {
    name: "Ali Raza Studio",
    category: "Photographer & Events",
    tehsil: "Chakwal City",
    phone: "923121234567",
    desc: "Wedding photography aur events coverage poore Zila Chakwal mein.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com"
  }
];

function displayPros(list) {
  const container = document.getElementById('prosContainer');
  container.innerHTML = '';
  list.forEach(pro => {
    const media = pro.mediaType === 'video' 
      ? `<video src="${pro.mediaUrl}" controls></video>` 
      : `<img src="${pro.mediaUrl}">`;

    container.innerHTML += `
      <div class="card">
        <div class="media-preview">${media}</div>
        <div class="card-header">
          <span class="badge">${pro.category}</span>
          <span class="tehsil-tag">${pro.tehsil}</span>
          <h3>${pro.name}</h3>
          <p>${pro.desc}</p>
        </div>
        <div class="card-actions">
          <a href="https://wa.me{pro.phone}" target="_blank" class="btn btn-whatsapp">WhatsApp</a>
          <a href="tel:+${pro.phone}" class="btn btn-call">Call Now</a>
        </div>
      </div>`;
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
  const file = document.getElementById('proMedia').files[0];
  const reader = new FileReader();
  reader.onload = function(ev) {
    professionals.unshift({
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
