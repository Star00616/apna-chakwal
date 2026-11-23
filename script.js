let professionals = JSON.parse(localStorage.getItem('chakwalProsV4')) || [
  {
    isDemo: true,
    name: "Ustad Tariq Solar & Electric",
    category: "Electrician & Solar",
    tehsil: "Kallar Kahar",
    serviceType: "Ghar Aa Kar Kaam (Home Service)",
    location: "Kallar Kahar aur qareebi gaon",
    phone: "923000000000",
    desc: "Solar system installation, inverter setting aur gharelu bijli ke tamam kaam ghar aa kar kiye jate hain.",
    avatarUrl: "https://ui-avatars.com",
    mediaType: "image",
    mediaUrl: "https://placehold.co"
  },
  {
    isDemo: true,
    name: "Bismillah Mobile Repairing Lab",
    category: "Mobile & Laptop Repairing",
    tehsil: "Chakwal City",
    serviceType: "Shop / Dukaan",
    location: "Main Mobile Market, Talagang Chowk, Chakwal",
    phone: "923000000000",
    desc: "Har qisam ke mobile panel, charging jack, aur software ka kaam foran aur guarantee ke sath.",
    avatarUrl: "https://ui-avatars.com",
    mediaType: "image",
    mediaUrl: "https://placehold.co"
  },
  {
    isDemo: true,
    name: "Haji Akram Mistri & Labour Team",
    category: "Mistri & Labour (Mazdoor)",
    tehsil: "Talagang",
    serviceType: "Ghar Aa Kar Kaam (Home Service)",
    location: "Poore Tehsil Talagang aur Lawa mein dastiyab",
    phone: "923000000000",
    desc: "Makaan ki tameer, plaster, tile work aur rozana mazdoori (labour) ke liye rabta karein.",
    avatarUrl: "https://ui-avatars.com",
    mediaType: "image",
    mediaUrl: "https://placehold.co"
  }
];

function displayPros(list) {
  const container = document.getElementById('prosContainer');
  container.innerHTML = '';
  list.forEach(pro => {
    const media = pro.mediaType === 'video' 
      ? '<video src="' + pro.mediaUrl + '" controls></video>' 
      : '<img src="' + pro.mediaUrl + '">';

    const demoBadge = pro.isDemo ? '<span class="demo-tag">DEMO</span>' : '';

    container.innerHTML += 
      '<div class="card">' +
        demoBadge +
        '<div class="media-preview">' + media + '</div>' +
        '<div class="card-header">' +
          '<div class="tags-row">' +
            '<span class="badge">' + pro.category + '</span>' +
            '<span class="tehsil-tag">' + pro.tehsil + '</span>' +
          '</div>' +
          '<span class="service-tag">' + pro.serviceType + '</span>' +
          '<div class="profile-row">' +
            '<img src="' + pro.avatarUrl + '" class="avatar">' +
            '<h3>' + pro.name + '</h3>' +
          '</div>' +
          '<div class="location-text">📍 ' + pro.location + '</div>' +
          '<p>' + pro.desc + '</p>' +
        '</div>' +
        '<div class="card-actions">' +
          '<a href="https://wa.me' + pro.phone + '" target="_blank" class="btn btn-whatsapp">WhatsApp</a>' +
          '<a href="tel:+' + pro.phone + '" class="btn btn-call">Call Now</a>' +
        '</div>' +
      '</div>';
  });
}

function filterPros() {
  const s = document.getElementById('searchInput').value.toLowerCase();
  const t = document.getElementById('tehsilFilter').value;
  const st = document.getElementById('serviceTypeFilter').value;
  const c = document.getElementById('categoryFilter').value;
  
  const filtered = professionals.filter(p => 
    (p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || p.location.toLowerCase().includes(s)) &&
    (t === 'All' || p.tehsil === t) &&
    (st === 'All' || p.serviceType === st) &&
    (c === 'All' || p.category === c)
  );
  displayPros(filtered);
}

function addProfessional(e) {
  e.preventDefault();
  const avatarFile = document.getElementById('proAvatar').files;
  const mediaFile = document.getElementById('proMedia').files;
  
  const reader1 = new FileReader();
  reader1.onload = function(ev1) {
    const reader2 = new FileReader();
    reader2.onload = function(ev2) {
      professionals.unshift({
        isDemo: false,
        name: document.getElementById('proName').value,
        category: document.getElementById('proCategory').value,
        tehsil: document.getElementById('proTehsil').value,
        serviceType: document.getElementById('proServiceType').value,
        location: document.getElementById('proLocation').value,
        phone: document.getElementById('proPhone').value,
        desc: document.getElementById('proDesc').value,
        avatarUrl: ev1.target.result,
        mediaType: mediaFile.type.startsWith('video') ? 'video' : 'image',
        mediaUrl: ev2.target.result
      });
      localStorage.setItem('chakwalProsV4', JSON.stringify(professionals));
      displayPros(professionals);
      closeModal();
      document.getElementById('proForm').reset();
    };
    if (mediaFile) reader2.readAsDataURL(mediaFile);
  };
  if (avatarFile) reader1.readAsDataURL(avatarFile);
}

function openModal() { document.getElementById('registerModal').style.display = 'block'; }
function closeModal() { document.getElementById('registerModal').style.display = 'none'; }
displayPros(professionals);
