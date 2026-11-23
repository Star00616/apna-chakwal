var CLOUD_NAME = "zecpaz41";
var UPLOAD_PRESET = "ml_default";
var BIN_ID = "6b03fa82ac6210605a9d718c";
var MASTER_KEY = "$2a$10$UOyf6un8H0ntC/PfqZjsgufyIGI/X3/DOkqVtRT.L4YsUtViFisKa";
var BIN_URL = "https://jsonbin.io" + BIN_ID;

var myId = localStorage.getItem('cid') || ('u' + Date.now());
localStorage.setItem('cid', myId);
var isAdmin = false, taps = 0, pros = [];

function enableAdmin() {
  if (++taps >= 5 && prompt("Admin Code:") === "7860") { isAdmin = true; showPros(pros); alert("Admin Mode On!"); }
}

function mkImg(c, t, w, h) {
  var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  var x = cv.getContext('2d'); x.fillStyle = c; x.fillRect(0, 0, w, h);
  x.fillStyle = '#fff'; x.font = 'bold ' + (h/7) + 'px sans-serif';
  x.textAlign = 'center'; x.fillText(t, w/2, h/2); return cv.toDataURL();
}

var demoPros = [
  { id: 1, oid: "sys", isDemo: true, name: "Ustad Tariq Solar", category: "Electrician & Solar", tehsil: "Kallar Kahar", serviceType: "Ghar Aa Kar Kaam (Home Service)", location: "Kallar Kahar", phone: "923000000000", desc: "Solar aur bijli ke kaam.", avatarUrl: mkImg('#198754','TM',100,100), mediaList: [{type:"image",url:mkImg('#146c43','Solar Work (Demo)',500,300)}], reviews: [{user:"Asif",stars:5,comment:"Bohat acha kaam kiya."}] },
  { id: 2, oid: "sys", isDemo: true, name: "Bismillah Mobile Lab", category: "Mobile & Laptop Repairing", tehsil: "Chakwal City", serviceType: "Shop / Dukaan", location: "Talagang Chowk Chakwal", phone: "923000000000", desc: "Mobile repairing shop.", avatarUrl: mkImg('#0d6efd','BM',100,100), mediaList: [{type:"image",url:mkImg('#0a58ca','Mobile Shop (Demo)',500,300)}], reviews: [] }
];

function loadPros() {
  document.getElementById('prosContainer').innerHTML = '<p style="text-align:center;grid-column:1/-1;padding:30px;">Data load ho raha hai...</p>';
  fetch(BIN_URL + "/latest", { headers: { "X-Master-Key": MASTER_KEY } })
    .then(r => r.json())
    .then(d => {
      var list = Array.isArray(d.record) ? d.record.filter(x => !x.init) : [];
      pros = list.length ? list : demoPros;
      showPros(pros);
    }).catch(() => { pros = demoPros; showPros(pros); });
}

function syncCloud(cb) {
  var clean = pros.filter(p => !p.isDemo);
  fetch(BIN_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Master-Key": MASTER_KEY },
    body: JSON.stringify(clean.length ? clean : [{init: true}])
  }).then(() => { if(cb) cb(); showPros(pros); });
}

function uploadCloud(file) {
  var fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  return fetch("https://cloudinary.com" + CLOUD_NAME + "/auto/upload", { method: "POST", body: fd })
    .then(r => r.json())
    .then(d => ({ type: file.type.startsWith('video') ? 'video' : 'image', url: d.secure_url }));
}

function showPros(list) {
  var box = document.getElementById('prosContainer'); box.innerHTML = '';
  list.forEach(function(p) {
    var idx = pros.indexOf(p), m = p.mediaList.item ? p.mediaList.item(0) : p.mediaList;
    var mHtml = m.type === 'video' ? '<video src="'+m.url+'" muted></video>' : '<img src="'+m.url+'">';
    var avg = p.reviews && p.reviews.length ? (p.reviews.reduce((a,b)=>a+Number(b.stars),0)/p.reviews.length).toFixed(1) : 'New';
    var btns = ((!p.isDemo && p.oid === myId) || isAdmin) ? '<div class="owner-actions"><button onclick="editPro('+idx+')" class="btn btn-edit">Edit</button><button onclick="delPro('+idx+')" class="btn btn-delete">Delete</button></div>' : '';
    box.innerHTML += '<div class="card">'+(p.isDemo?'<span class="demo-tag">DEMO</span>':'')+'<div class="media-preview" onclick="openGallery('+idx+')">'+mHtml+'<span class="media-count-tag">📸 '+p.mediaList.length+'</span></div><div class="card-header"><div class="tags-row"><span class="badge">'+p.category+'</span><span class="tehsil-tag">'+p.tehsil+'</span></div><div><span class="service-tag">'+p.serviceType+'</span><span class="rating-badge">⭐ '+avg+'</span></div><div class="profile-row"><img src="'+p.avatarUrl+'" class="avatar"><h3>'+p.name+'</h3></div><div class="location-text">📍 '+p.location+'</div><p>'+p.desc+'</p><div class="card-extra-btns"><button onclick="openGallery('+idx+')" class="btn-gallery">🖼️ Kaam ('+p.mediaList.length+')</button><button onclick="openReviews('+idx+')" class="btn-review">⭐ Reviews ('+(p.reviews?p.reviews.length:0)+')</button></div></div><div class="card-actions"><a href="whatsapp://send?phone='+p.phone+'" class="btn btn-whatsapp">WhatsApp</a><a href="tel:+'+p.phone+'" class="btn btn-call">Call</a></div>'+btns+'</div>';
  });
}

function openReviews(i) {
  var p = pros[i]; document.getElementById('reviewProIndex').value = i; document.getElementById('reviewTitle').innerText = p.name + " Reviews";
  var b = document.getElementById('reviewsList'); b.innerHTML = (p.reviews||[]).map(r=>'<div class="review-item"><strong>'+r.user+'</strong><span class="review-stars">'+'⭐'.repeat(r.stars)+'</span><p>'+r.comment+'</p></div>').join('') || '<p style="text-align:center;font-size:12px;">Koi review nahi.</p>';
  document.getElementById('reviewModal').style.display = 'block';
}
function closeReviews() { document.getElementById('reviewModal').style.display = 'none'; }
function submitReview(e) {
  e.preventDefault(); var i = document.getElementById('reviewProIndex').value;
  if(!pros[i].reviews) pros[i].reviews = [];
  pros[i].reviews.unshift({user:document.getElementById('reviewerName').value, stars:document.getElementById('reviewStars').value, comment:document.getElementById('reviewComment').value});
  document.getElementById('reviewForm').reset(); openReviews(i); syncCloud();
}

function openGallery(i) {
  var p = pros[i]; document.getElementById('galleryTitle').innerText = p.name;
  document.getElementById('galleryItems').innerHTML = p.mediaList.map(m=>m.type==='video'?'<video src="'+m.url+'" controls playsinline></video>':'<img src="'+m.url+'">').join('');
  document.getElementById('galleryModal').style.display = 'block';
}
function closeGallery() { document.getElementById('galleryModal').style.display = 'none'; }

function filterPros() {
  var s=document.getElementById('searchInput').value.toLowerCase(), t=document.getElementById('tehsilFilter').value, st=document.getElementById('serviceTypeFilter').value, c=document.getElementById('categoryFilter').value;
  showPros(pros.filter(p=>(p.name.toLowerCase().includes(s)||p.desc.toLowerCase().includes(s)||p.location.toLowerCase().includes(s))&&(t==='All'||p.tehsil===t)&&(st==='All'||p.serviceType===st)&&(c==='All'||p.category===c)));
}

function delPro(i) { if(confirm("Delete karein?")){ pros.splice(i,1); syncCloud(); } }
function editPro(i) {
  var p=pros[i]; document.getElementById('editIndex').value=i; document.getElementById('proName').value=p.name; document.getElementById('proCategory').value=p.category; document.getElementById('proTehsil').value=p.tehsil; document.getElementById('proServiceType').value=p.serviceType; document.getElementById('proLocation').value=p.location; document.getElementById('proPhone').value=p.phone; document.getElementById('proDesc').value=p.desc; document.getElementById('registerModal').style.display='block';
}

async function saveProfessional(e) {
  e.preventDefault();
  var btn = document.getElementById('submitBtn'); btn.innerText = "Upload ho raha hai... Sabar karein"; btn.disabled = true;
  var idx = parseInt(document.getElementById('editIndex').value);
  var avF = document.getElementById('proAvatar').files.item(0);
  var mF = document.getElementById('proMedia').files;
  
  var avUrl = avF ? (await uploadCloud(avF)).url : (idx !== -1 ? pros[idx].avatarUrl : '');
  var ml = idx !== -1 ? pros[idx].mediaList : [];
  if (mF.length) {
    ml = [];
    for (var i = 0; i < mF.length; i++) ml.push(await uploadCloud(mF.item(i)));
  }
  
  var d = { id:Date.now(), oid:idx===-1?myId:pros[idx].oid, isDemo:false, name:document.getElementById('proName').value, category:document.getElementById('proCategory').value, tehsil:document.getElementById('proTehsil').value, serviceType:document.getElementById('proServiceType').value, location:document.getElementById('proLocation').value, phone:document.getElementById('proPhone').value, desc:document.getElementById('proDesc').value, avatarUrl:avUrl, mediaList:ml, reviews:idx===-1?[]:pros[idx].reviews };
  pros = pros.filter(p => !p.isDemo);
  if (idx === -1) pros.unshift(d); else pros[idx] = d;
  syncCloud(() => { btn.innerText = "Profile Live Karein"; btn.disabled = false; closeModal(); alert("Mubarak ho! Aapki profile poore Zila Chakwal ke liye live ho gayi hai!"); });
}

function openModal() { document.getElementById('editIndex').value="-1"; document.getElementById('proForm').reset(); document.getElementById('registerModal').style.display='block'; }
function closeModal() { document.getElementById('registerModal').style.display='none'; }
loadPros();
    
