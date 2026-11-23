// Har device/browser ke liye ek unique secret ID banti hai
var myDeviceId = localStorage.getItem('chakwalDeviceId');
if (!myDeviceId) {
  myDeviceId = 'dev_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
  localStorage.setItem('chakwalDeviceId', myDeviceId);
}

var isAdmin = false;
var tapCount = 0;
function enableAdmin() {
  tapCount++;
  if (tapCount >= 5) {
    var code = prompt("Admin Code:");
    if (code === "7860") {
      isAdmin = true;
      displayPros(professionals);
      alert("Admin Mode On! Ab aap kisi bhi profile ko delete/edit kar sakte hain.");
    }
    tapCount = 0;
  }
}

function makeImg(bg, text, w, h) {
  var c = document.createElement('canvas');
  c.width = w; c.height = h;
  var ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold ' + Math.floor(h / 7) + 'px sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2);
  return c.toDataURL();
}

var professionals = JSON.parse(localStorage.getItem('chakwalProsV9')) || [
  {
    id: "demo_1",
    ownerId: "system",
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
    id: "demo_2",
    ownerId: "system",
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
  }
];

function displayPros(list) {
  var container = document.getElementById('prosContainer');
  container.innerHTML = '';
  for (var i = 0; i < list.length; i++) {
    var pro = list[i];
    var realIndex = professionals.indexOf(pro);
    var media = pro.mediaType === 'video' 
      ? '<video src="' + pro.mediaUrl + '" controls></video>' 
      : '<img src="' + pro.mediaUrl + '">';

    var demoBadge = pro.isDemo ? '<span class="demo-tag">DEMO</span>' : '';
    var waLink = 'whatsapp://send?phone=' + pro.phone;
    
    // Sirf us bande ko buttons dikhenge jis ki apni profile hai (ya Admin ko)
    var canEdit = (!pro.isDemo && pro.ownerId === myDeviceId) || isAdmin;
    var ownerBtns = canEdit ? 
      '<div class="owner-actions">' +
        '<button onclick="editPro(' + realIndex + ')" class="btn btn-edit">✏️ Edit</button>' +
        '<button onclick="deletePro(' + realIndex + ')" class="btn btn-delete">🗑️ Delete</button>' +
      '</div>' : '';

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
          '<a href="' + waLink + '" class="btn btn-whatsapp">WhatsApp</a>' +
          '<a href="tel:+' + pro.phone + '" class="btn btn-call">Call Now</a>' +
        '</div>' +
        ownerBtns +
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

function deletePro(index) {
  if (confirm("Kya aap waqai apni is profile ko delete karna chahte hain?")) {
    professionals.splice(index, 1);
    localStorage.setItem('chakwalProsV9', JSON.stringify(professionals));
    displayPros(professionals);
  }
}

function editPro(index) {
  var p = professionals[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('modalTitle').innerText = "Apni Profile Edit Karein";
  document.getElementById('submitBtn').innerText = "Tabdeeli Save Karein";
  document.getElementById('proName').value = p.name;
  document.getElementById('proCategory').value = p.category;
  document.getElementById('proTehsil').value = p.tehsil;
  document.getElementById('proServiceType').value = p.serviceType;
  document.getElementById('proLocation').value = p.location;
  document.getElementById('proPhone').value = p.phone;
  document.getElementById('proDesc').value = p.desc;
  document.getElementById('proAvatar').required = false;
  document.getElementById('proMedia').required = false;
  document.getElementById('registerModal').style.display = 'block';
}

function saveProfessional(e) {
  e.preventDefault();
  var idx = parseInt(document.getElementById('editIndex').value);
  var avatarFile = document.getElementById('proAvatar').files;
  var mediaFile = document.getElementById('proMedia').files;

  function finishSave(avUrl, medUrl, medType) {
    var data = {
      id: idx === -1 ? 'pro_' + Date.now() : professionals[idx].id,
      ownerId: idx === -1 ? myDeviceId : professionals[idx].ownerId,
      isDemo: false,
      name: document.getElementById('proName').value,
      category: document.getElementById('proCategory').value,
      tehsil: document.getElementById('proTehsil').value,
      serviceType: document.getElementById('proServiceType').value,
      location: document.getElementById('proLocation').value,
      phone: document.getElementById('proPhone').value,
      desc: document.getElementById('proDesc').value,
      avatarUrl: avUrl,
      mediaType: medType,
      mediaUrl: medUrl
    };
    if (idx === -1) {
      professionals.unshift(data);
    } else {
      professionals[idx] = data;
    }
    localStorage.setItem('chakwalProsV9', JSON.stringify(professionals));
    displayPros(professionals);
    closeModal();
  }

  var oldAv = idx !== -1 ? professionals[idx].avatarUrl : '';
  var oldMed = idx !== -1 ? professionals[idx].mediaUrl : '';
  var oldType = idx !== -1 ? professionals[idx].mediaType : 'image';

  if (avatarFile && mediaFile) {
    var r1 = new FileReader();
    r1.onload = function(e1) {
      var r2 = new FileReader();
      r2.onload = function(e2) {
        finishSave(e1.target.result, e2.target.result, mediaFile.type.startsWith('video') ? 'video' : 'image');
      };
      r2.readAsDataURL(mediaFile);
    };
    r1.readAsDataURL(avatarFile);
  } else if (avatarFile) {
    var r1 = new FileReader();
    r1.onload = function(e1) { finishSave(e1.target.result, oldMed, oldType); };
    r1.readAsDataURL(avatarFile);
  } else if (mediaFile) {
    var r2 = new FileReader();
    r2.onload = function(e2) { finishSave(oldAv, e2.target.result, mediaFile.type.startsWith('video') ? 'video' : 'image'); };
    r2.readAsDataURL(mediaFile);
  } else {
    finishSave(oldAv, oldMed, oldType);
  }
}

function openModal() {
  document.getElementById('editIndex').value = "-1";
  document.getElementById('modalTitle').innerText = "Apni Profile / Shop Register Karein";
  document.getElementById('submitBtn').innerText = "Profile Live Karein";
  document.getElementById('proForm').reset();
  document.getElementById('proAvatar').required = true;
  document.getElementById('proMedia').required = true;
  document.getElementById('registerModal').style.display = 'block';
}
function closeModal() { document.getElementById('registerModal').style.display = 'none'; }
displayPros(professionals);
      
