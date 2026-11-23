function makeImg(bg, text, w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  var ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold ' + Math.floor(h / 7) + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  return c.toDataURL();
}

var professionals = JSON.parse(localStorage.getItem('chakwalProsV6')) || [
  {
    isDemo: true,
    name: "Ustad Tariq Solar & Electric",
    category: "Electrician & Solar",
    tehsil: "Kallar Kahar",
    serviceType: "Ghar Aa Kar Kaam (Home Service)",
    location: "Kallar Kahar aur qareebi gaon",
    phone: "923000000000",
    desc: "Solar system installation, inverter setting aur gharelu bijli ke tamam kaam ghar aa kar kiye jate hain.",
    avatarUrl: makeImg('#198754', 'TM', 120, 120),
    mediaType: "image",
    mediaUrl: makeImg('#146c43', 'Solar & Electric Work (Demo)', 600, 320)
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
    avatarUrl: makeImg('#0d6efd', 'BM', 120, 120),
    mediaType: "image",
    mediaUrl: makeImg('#0a58ca', 'Mobile Repairing Shop (Demo)', 600, 320)
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
    avatarUrl: makeImg('#d63384', 'AM', 120, 120),
    mediaType: "image",
    mediaUrl: makeImg('#ab296a', 'Mistri & Labour Team (Demo)', 600, 320)
  }
];

function displayPros(list) {
  var container = document.getElementById('prosContainer');
  container.innerHTML = '';
  for (var i = 0; i < list.length; i++) {
    var pro = list[i];
    var media = pro.mediaType === 'video' 
      ? '<video src="' + pro.mediaUrl + '" controls></video>' 
      : '<img src="' + pro.mediaUrl + '">';

    var demoBadge = pro.isDemo ? '<span class="demo-tag">DEMO</span>' : '';
    var waLink = 'https://whatsapp.com' + pro.phone;

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
          '<a href="' + waLink + '" target="_blank" class="btn btn-whatsapp">WhatsApp</a>' +
          '<a href="tel:+' + pro.phone + '" class="btn btn-call">Call Now</a>' +
        '</div>' +
      '</div>';
  }
}

function filterPros() {
  var s = document.getElementById('searchInput').value.toLowerCase();
  var t = document.getElementById('tehsilFilter').value;
  var st = document.getElementById('serviceTypeFilter').value;
  var c = document.getElementById('categoryFilter').value;
  
  var filtered = professionals.filter(function(p) {
    return (p.name.toLowerCase().includes(s) || p.desc.toLowerCase().includes(s) || p.location.toLowerCase().includes(s)) &&
      (t === 'All' || p.tehsil === t) &&
      (st === 'All' || p.serviceType === st) &&
      (c === 'All' || p.category === c);
  });
  displayPros(filtered);
}

function addProfessional(e) {
  e.preventDefault();
  var avatarFile = document.getElementById('proAvatar').files;
  var mediaFile = document.getElementById('proMedia').files;
  
  var reader1 = new FileReader();
  reader1.onload = function(ev1) {
    var reader2 = new FileReader();
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
      localStorage.setItem('chakwalProsV6', JSON.stringify(professionals));
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
