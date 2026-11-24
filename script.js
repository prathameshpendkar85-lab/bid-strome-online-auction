// ===== REGISTER + LOGIN - NO PHONE =====
let users = JSON.parse(localStorage.getItem('bidstrome_users')||'[]');
if(!users.length){ users=[{name:"Demo Bidder",email:"bidder@demo.com",pass:"123456",role:"bidder"},{name:"Demo Admin",email:"admin@demo.com",pass:"123456",role:"admin"}]; localStorage.setItem('bidstrome_users',JSON.stringify(users)); }
function showLogin(){ document.getElementById('registerScreen').style.display='none'; document.getElementById('loginScreen').style.display='flex'; document.getElementById('loginMsg').style.display='block'; }
function showRegister(){ document.getElementById('loginScreen').style.display='none'; document.getElementById('registerScreen').style.display='flex'; }
function doRegister(){ let n=document.getElementById('rName').value.trim(), e=document.getElementById('rEmail').value.trim().toLowerCase(), p=document.getElementById('rPass').value, r=document.getElementById('rRole').value; if(!n||!e) return alert("Fill Name, Email"); if(p.length<6) return alert("Password min 6"); if(users.find(u=>u.email===e)) return alert("Already Registered! Login karo."), showLogin(); users.push({name:n,email:e,pass:p,role:r}); localStorage.setItem('bidstrome_users',JSON.stringify(users)); alert("🎉 Register Done! Ab Login karo"); document.getElementById('lEmail').value=e; showLogin(); }
function doLogin(){ let e=document.getElementById('lEmail').value.trim().toLowerCase(), p=document.getElementById('lPass').value, u=users.find(x=>x.email===e&&x.pass===p); if(!u) return alert("❌ Wrong Email/Password! Pehle Register karo.\nDemo: bidder@demo.com / 123456"); currentUser={name:u.name,email:u.email,role:u.role}; enterApp(); }
function quickLogin(role){ currentUser=role==='admin'?{name:'Demo Admin',email:'admin@demo.com',role:'admin'}:{name:'Demo Bidder',email:'bidder@demo.com',role:'bidder'}; enterApp(); }

// ===== VOICE SYSTEM =====
let recognition=null, isListening=false, voiceEnabled=true;
function initVoice(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ console.log('Voice not supported'); return; }
  recognition = new SR(); recognition.continuous=false; recognition.interimResults=true; recognition.lang='en-US';
  recognition.onstart=()=>{ isListening=true; let b=document.getElementById('voiceBtn'); if(b){b.classList.add('listening'); b.innerText='● Listening...';} let s=document.getElementById('voiceStatus'); if(s) s.innerText='🎧 Listening...'; showTranscript('Listening...'); };
  recognition.onend=()=>{ isListening=false; let b=document.getElementById('voiceBtn'); if(b){b.classList.remove('listening'); b.innerText='🎙 Voice';} let s=document.getElementById('voiceStatus'); if(s) s.innerText='🔊 Voice On'; };
  recognition.onresult=(e)=>{ let t=e.results[0][0].transcript; showTranscript('You: '+t); if(e.results[0].isFinal) processVoiceCommand(t.toLowerCase()); };
  recognition.onerror=()=>{ isListening=false; document.getElementById('voiceBtn')?.classList.remove('listening'); };
}
function toggleVoice(){ if(!recognition) initVoice(); if(isListening){ recognition.stop(); return; } recognition.start(); }
function showTranscript(t){ let el=document.getElementById('voiceTranscript'); if(!el) return; el.innerText=t; el.style.display='block'; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),4000); }
function speak(text){ if(!voiceEnabled) return; window.speechSynthesis.cancel(); let u=new SpeechSynthesisUtterance(text); u.rate=1; u.pitch=1.05; u.volume=0.9; window.speechSynthesis.speak(u); }
function processVoiceCommand(cmd){
  if(cmd.includes('search')||cmd.includes('find')||cmd.includes('look for')){ let term=cmd.replace(/search|find|look for|for|me|the|product/g,'').trim(); document.getElementById('q').value=term; render(); speak(`Searching for ${term}. Found ${getFiltered().length} products`); return; }
  if(cmd.includes('my bids')){ switchTab('mybids'); speak('Showing your bids'); return; }
  if(cmd.includes('won')||cmd.includes('checkout')){ switchTab('won'); speak('Showing won items and checkout'); return; }
  if(cmd.includes('catalog')||cmd.includes('home')||cmd.includes('all products')){ switchTab('catalogue'); speak('Showing catalogue'); return; }
  if(cmd.includes('admin')){ switchTab('admin'); speak('Opening admin'); return; }
  if(cmd.includes('clear')){ clearSearch(); speak('Search cleared'); return; }
  if(cmd.includes('bid')||cmd.includes('buy')){ let matched=PRODUCTS.find(p=>cmd.includes(p.name.toLowerCase().split(' ')[0].toLowerCase())); if(matched){ placeBid(matched.id); speak(`Placing bid on ${matched.name}`);} else if(getFiltered().length>0){ placeBid(getFiltered()[0].id); speak(`Bidding on ${getFiltered()[0].name}`);} else speak('Tell me product name to bid'); return; }
  if(cmd.includes('pay')||cmd.includes('check out')){ checkout(); speak('Proceeding to checkout'); return; }
  speak('Try: search Rolex, show my bids, bid on camera, clear search');
}

// ===== APP DATA - 48 PRODUCTS - 16 CATEGORIES =====
const CATS=["Watches","Cameras","Art","Electronics","Cars","Jewelry","Sneakers","Collectibles","Fashion","Gaming","Sports","Vintage","Home Decor","Toys","Books","Luxury"];
let PRODUCTS=[
  {id:1,name:"Rolex Submariner 1978",cat:"Watches",price:4200,bids:14,img:"https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600",end:"2h 14m"},
  {id:2,name:"Leica M6 Film Camera",cat:"Cameras",price:3200,bids:22,img:"https://images.unsplash.com/photo-1452780212940-6f5c84d7fa94?w=600",end:"1h 05m"},
  {id:3,name:"Banksy Original Print",cat:"Art",price:8500,bids:31,img:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",end:"45m"},
  {id:4,name:"MacBook Pro M3 Max",cat:"Electronics",price:2100,bids:9,img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",end:"3h 20m"},
  {id:5,name:"1967 Ford Mustang Shell",cat:"Cars",price:15000,bids:42,img:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",end:"12m"},
  {id:6,name:"Diamond Tennis Bracelet",cat:"Jewelry",price:5600,bids:18,img:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",end:"5h 10m"},
  {id:7,name:"Jordan 1 Chicago 1985",cat:"Sneakers",price:1200,bids:27,img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",end:"2h 55m"},
  {id:8,name:"Rare Charizard Holo",cat:"Toys",price:900,bids:33,img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",end:"8m"},
  {id:9,name:"Omega Speedmaster Moon",cat:"Watches",price:5800,bids:11,img:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",end:"1h 40m"},
  {id:10,name:"Sony A7R V Mirrorless",cat:"Cameras",price:3900,bids:16,img:"https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=600",end:"3h 05m"},
  {id:11,name:"Kaws Companion Figure",cat:"Toys",price:2400,bids:29,img:"https://images.unsplash.com/photo-1549490349-8643362247b5?w=600",end:"2h 10m"},
  {id:12,name:"iPhone 15 Pro Titanium",cat:"Electronics",price:1100,bids:51,img:"https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600",end:"22m"},
  {id:13,name:"Porsche 911 GT3 RS Lego",cat:"Toys",price:450,bids:8,img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600",end:"4h 30m"},
  {id:14,name:"Cartier Love Ring",cat:"Luxury",price:3200,bids:13,img:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",end:"1h 15m"},
  {id:15,name:"Travis Scott x Nike SB",cat:"Sneakers",price:850,bids:38,img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",end:"35m"},
  {id:16,name:"Supreme Box Logo Hoodie",cat:"Fashion",price:650,bids:19,img:"https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=600",end:"55m"},
  {id:17,name:"Audemars Piguet Royal Oak",cat:"Luxury",price:28000,bids:6,img:"https://images.unsplash.com/photo-1548169874-53e85f753f1e?w=600",end:"6h 00m"},
  {id:18,name:"Canon AE-1 Vintage",cat:"Vintage",price:450,bids:24,img:"https://images.unsplash.com/photo-1495745966610-2a67f2297e8e?w=600",end:"1h 50m"},
  {id:19,name:"Yayoi Kusama Pumpkin",cat:"Home Decor",price:12000,bids:15,img:"https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?w=600",end:"2h 40m"},
  {id:20,name:"PS5 Pro Limited",cat:"Gaming",price:800,bids:44,img:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600",end:"18m"},
  {id:21,name:"Tesla Roadster Model",cat:"Toys",price:280,bids:12,img:"https://images.unsplash.com/photo-1617704548623-340376564e68?w=600",end:"3h 45m"},
  {id:22,name:"Van Cleef Alhambra",cat:"Luxury",price:4800,bids:21,img:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",end:"2h 05m"},
  {id:23,name:"Yeezy Boost 350 V2",cat:"Sneakers",price:320,bids:26,img:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",end:"1h 25m"},
  {id:24,name:"First Edition Pokemon Box",cat:"Collectibles",price:5500,bids:35,img:"https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",end:"28m"},
  {id:25,name:"Patek Philippe Nautilus",cat:"Luxury",price:35000,bids:9,img:"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",end:"5h 30m"},
  {id:26,name:"Hasselblad 500CM",cat:"Vintage",price:2600,bids:17,img:"https://images.unsplash.com/photo-1452780212940-6f5c84d7fa94?w=600",end:"4h 10m"},
  {id:27,name:"Casio G-Shock Limited",cat:"Watches",price:350,bids:19,img:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600",end:"1h 05m"},
  {id:28,name:"Apple Watch Ultra 2",cat:"Electronics",price:699,bids:33,img:"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",end:"5h 40m"},
  {id:29,name:"GoPro Hero 12 Black",cat:"Cameras",price:320,bids:21,img:"https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=600",end:"1h 30m"},
  {id:30,name:"Nikon Z6 II + Lens",cat:"Cameras",price:1650,bids:15,img:"https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600",end:"2h 00m"},
  {id:31,name:"Madhubani Painting",cat:"Art",price:450,bids:9,img:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600",end:"6h 45m"},
  {id:32,name:"Vintage Oil Portrait",cat:"Vintage",price:3200,bids:17,img:"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600",end:"9h 10m"},
  {id:33,name:"Samsung Galaxy S24 Ultra",cat:"Electronics",price:950,bids:31,img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600",end:"6h 00m"},
  {id:34,name:"Sony WH-1000XM5",cat:"Electronics",price:280,bids:18,img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",end:"1h 50m"},
  {id:35,name:"AirPods Pro 2",cat:"Electronics",price:180,bids:26,img:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",end:"3h 05m"},
  {id:36,name:"BMW M4 2021",cat:"Cars",price:58000,bids:88,img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600",end:"10h 00m"},
  {id:37,name:"Vintage Mustang 1969",cat:"Vintage",price:45000,bids:73,img:"https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=600",end:"12h 00m"},
  {id:38,name:"Tesla Model 3",cat:"Cars",price:32000,bids:65,img:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600",end:"9h 30m"},
  {id:39,name:"Gold Necklace 22K",cat:"Jewelry",price:2100,bids:23,img:"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",end:"7h 00m"},
  {id:40,name:"Diamond Ring 1 Carat",cat:"Luxury",price:3400,bids:19,img:"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600",end:"8h 05m"},
  {id:41,name:"Silver Bracelet 925",cat:"Jewelry",price:180,bids:8,img:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600",end:"2h 25m"},
  {id:42,name:"Nike Dunk Low Panda",cat:"Sneakers",price:150,bids:40,img:"https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600",end:"1h 20m"},
  {id:43,name:"New Balance 550 White",cat:"Sneakers",price:130,bids:16,img:"https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600",end:"3h 40m"},
  {id:44,name:"Adidas Yeezy Boost",cat:"Sneakers",price:280,bids:34,img:"https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600",end:"2h 50m"},
  {id:45,name:"Antique Coin Set",cat:"Collectibles",price:980,bids:21,img:"https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600",end:"6h 55m"},
  {id:46,name:"Vintage Cricket Bat Signed",cat:"Sports",price:650,bids:13,img:"https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600",end:"5h 35m"},
  {id:47,name:"Pokemon Charizard Card PSA 9",cat:"Collectibles",price:1200,bids:91,img:"https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=600",end:"1h 45m"},
  {id:48,name:"RTX 4070 GPU 12GB",cat:"Gaming",price:580,bids:45,img:"https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600",end:"5h 25m"},
];

let currentUser=null, myBids=new Set(JSON.parse(localStorage.getItem('myBids')||'[]')), won=new Set(JSON.parse(localStorage.getItem('won')||'[]')), activeCat='All';
function enterApp(){
  document.getElementById('registerScreen').style.display='none';
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('mainApp').style.display='block';
  document.getElementById('userArea').innerHTML=`<span style="font-size:13px">Hi, ${currentUser.name}</span> <button onclick="logout()" style="margin-left:8px;border:none;border-radius:999px;padding:6px 12px;background:#facc15;color:#020617;cursor:pointer;font-weight:700">Logout</button>`;
  if(currentUser.role==='admin') document.getElementById('adminNav').style.display='inline';
  initFilters(); render(); updateCounts(); initVoice(); setTimeout(()=>speak('Bid Strome Live. 48 auctions live. Tap voice to bid by voice'),800);
}
function logout(){ location.reload(); }
function initFilters(){ let catSel=document.getElementById('catSel'); catSel.innerHTML='<option value="All">All Categories</option>'+CATS.map(c=>`<option>${c}</option>`).join(''); let grid=document.getElementById('catGrid'); grid.innerHTML='<div class="pill '+(activeCat==='All'?'active':'')+'" onclick="setCat(\'All\')">All</div>'+CATS.map(c=>`<div class="pill ${activeCat===c?'active':''}" onclick="setCat('${c}')">${c}</div>`).join(''); }
function setCat(c){ activeCat=c; document.getElementById('catSel').value=c; initFilters(); render(); speak(`Filtering ${c}`); }
function clearSearch(){ document.getElementById('q').value=''; render(); }
function switchTab(t){ ['catalogue','mybids','won','admin'].forEach(x=>{ let el=document.getElementById(x+'Tab'); if(el) el.style.display=x===t?'block':'none'; }); document.querySelectorAll('.topnav nav a').forEach(a=>a.classList.remove('active')); let map={catalogue:'navCat',mybids:'navBid',won:'navWon',admin:'adminNav'}; document.getElementById(map[t])?.classList.add('active'); if(t==='mybids') renderBids(); if(t==='won') renderWon(); if(t==='admin') renderAdmin(); }
function getFiltered(){ let q=document.getElementById('q').value.toLowerCase(), cat=document.getElementById('catSel').value, sort=document.getElementById('sortSel').value; let list=PRODUCTS.filter(p=>(cat==='All'||p.cat===cat)&&(activeCat==='All'||p.cat===activeCat)&&p.name.toLowerCase().includes(q)); if(sort==='priceLow') list.sort((a,b)=>a.price-b.price); if(sort==='priceHigh') list.sort((a,b)=>b.price-a.price); if(sort==='bids') list.sort((a,b)=>b.bids-a.bids); if(sort==='ending') list.sort((a,b)=>a.end.localeCompare(b.end)); return list; }
function render(){ let grid=document.getElementById('grid'); if(!grid) return; let list=getFiltered(); grid.innerHTML=list.map(p=>`<div class="card"><img src="${p.img}" onclick="openDetail(${p.id})"><div class="card-body"><div class="meta"><span>${p.cat}</span><span>⏱ ${p.end} • ${p.bids} bids</span></div><h3>${p.name}</h3><div class="price">$${p.price.toLocaleString()}</div><div class="card-actions"><button onclick="openDetail(${p.id})">View</button><button class="primary" onclick="placeBid(${p.id})">${myBids.has(p.id)?'Bidding • $'+(p.price+50):'Place Bid'}</button></div></div></div>`).join(''); }
function openDetail(id){ let p=PRODUCTS.find(x=>x.id===id); document.getElementById('modal').innerHTML=`<div style="display:flex;flex-wrap:wrap"><img src="${p.img}" style="width:50%;min-width:280px;height:360px;object-fit:cover"><div style="padding:22px;flex:1"><h2 style="font-family:Syne">${p.name}</h2><p style="color:#888;margin:8px 0">${p.cat} • ${p.bids} bids • Ends in ${p.end}</p><div style="font-size:28px;font-weight:800;margin:14px 0">$${p.price}</div><p>Authentic item. Live bidding. Buyer protection included. Say "Bid" to bid by voice.</p><div style="display:flex;gap:10px;margin-top:18px"><button class="btn-primary" onclick="placeBid(${p.id});closeModal()">Bid $${p.price+100} →</button><button onclick="addToBids(${p.id})" style="padding:12px 16px;border-radius:999px;border:1px solid #ddd;background:#fff">Add to My Bids</button></div></div></div>`; document.getElementById('backdrop').classList.add('show'); speak(`${p.name}, ${p.price} dollars, ${p.bids} bids`); }
function closeModal(){ document.getElementById('backdrop').classList.remove('show'); }
function placeBid(id){ myBids.add(id); let p=PRODUCTS.find(x=>x.id===id); p.price+=Math.floor(Math.random()*100)+50; p.bids++; save(); render(); updateCounts(); renderBids(); speak(`Bid placed on ${p.name}`); }
function addToBids(id){ myBids.add(id); save(); updateCounts(); speak('Added to my bids'); }
function updateCounts(){ document.getElementById('bidCount').innerText=myBids.size; document.getElementById('wonCount').innerText=won.size; }
function save(){ localStorage.setItem('myBids',JSON.stringify([...myBids])); localStorage.setItem('won',JSON.stringify([...won])); }
function renderBids(){ let grid=document.getElementById('bidsGrid'); let list=PRODUCTS.filter(p=>myBids.has(p.id)); if(!list.length) grid.innerHTML='<p style="color:#888">No bids yet. Go to Catalogue or say Search Rolex.</p>'; else grid.innerHTML=list.map(p=>`<div class="card"><img src="${p.img}"><div class="card-body"><h3>${p.name}</h3><div class="price">$${p.price}</div><div class="card-actions"><button onclick="myBids.delete(${p.id});won.add(${p.id});save();renderBids();updateCounts()">Mark as Won</button><button class="primary" onclick="placeBid(${p.id})">Raise Bid</button></div></div></div>`).join(''); }
function renderWon(){ let grid=document.getElementById('wonGrid'); let list=PRODUCTS.filter(p=>won.has(p.id)); let sum=list.reduce((s,p)=>s+p.price,0); if(!list.length) grid.innerHTML='<p style="color:#888">Win auctions to checkout here.</p>'; else grid.innerHTML=list.map(p=>`<div class="card"><img src="${p.img}"><div class="card-body"><h3>${p.name}</h3><div class="price">$${p.price}</div></div></div>`).join(''); document.getElementById('checkoutSummary').innerHTML=list.length?`${list.length} items • Total <b>$${sum.toLocaleString()}</b>`:'No items won yet.'; }
function checkout(){ if(!won.size) return alert('No won items'); let total=PRODUCTS.filter(p=>won.has(p.id)).reduce((s,p)=>s+p.price,0); speak(`Checkout successful, ${total} dollars paid`); alert('Checkout successful! $'+total+' paid.'); won.clear(); save(); renderWon(); updateCounts(); }
function renderAdmin(){ let q=(document.getElementById('adminQ')?.value||'').toLowerCase(); let table=document.getElementById('adminTable'); if(!table) return; let list=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)); table.innerHTML='<tr><th>ID</th><th>Product</th><th>Cat</th><th>Price</th><th>Action</th></tr>'+list.map(p=>`<tr><td>${p.id}</td><td>${p.name}</td><td>${p.cat}</td><td>$${p.price}</td><td><button onclick="editP(${p.id})">Edit</button> <button onclick="delP(${p.id})">Delete</button></td></tr>`).join(''); }
function openAdd(){ let name=prompt('Product name:'); if(!name) return; let cat=prompt('Category: '+CATS.join(','))||'Art'; let price=parseInt(prompt('Price:')||'1000'); PRODUCTS.unshift({id:Date.now(),name,cat,price,bids:0,img:'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',end:'1h 00m'}); render(); renderAdmin(); speak('Product added'); }
function editP(id){ let p=PRODUCTS.find(x=>x.id===id); let pr=prompt('New price',p.price); if(pr) p.price=parseInt(pr); renderAdmin(); render(); }
function delP(id){ PRODUCTS=PRODUCTS.filter(x=>x.id!==id); renderAdmin(); render(); }