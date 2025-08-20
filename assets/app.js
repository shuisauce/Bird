
/* global Papa */
const DATA_URL = 'data/birds.csv';
let BIRDS = [];
let filtered = [];
let pageSize = 24;
let page = 0;

function csvToBird(row){
  const lat = row.latitude ? parseFloat(row.latitude) : null;
  const lon = row.longitude ? parseFloat(row.longitude) : null;
  const hasLatLon = !isNaN(lat) && !isNaN(lon);
  const mapsUrl = row.maps_url && row.maps_url.trim() !== '' 
    ? row.maps_url.trim()
    : (hasLatLon ? `https://www.google.com/maps?q=${lat},${lon}` : '');
  const slug = (row.common_name || 'unknown').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  return {
    date: row.date || '',
    common_name: row.common_name || '',
    scientific_name: row.scientific_name || '',
    location_name: row.location_name || '',
    city: row.city || '',
    region: row.region || '',
    country: row.country || '',
    latitude: hasLatLon ? lat : null,
    longitude: hasLatLon ? lon : null,
    maps_url: mapsUrl,
    photo: row.photo || '',
    notes: row.notes || '',
    audubon_page: row.audubon_page || '',
    book_edition: row.book_edition || '',
    slug
  };
}

function loadCSV(){
  return new Promise((resolve,reject)=>{
    Papa.parse(DATA_URL, {
      header: true,
      download: true,
      skipEmptyLines: true,
      complete: (results)=>{
        BIRDS = results.data.map(csvToBird);
        resolve(BIRDS);
      },
      error: reject
    });
  });
}

function uniqueSpecies(list){
  const set = new Set(list.map(b=>b.common_name.trim().toLowerCase()).filter(Boolean));
  return set.size;
}
function uniquePlaces(list){
  const set = new Set(list.map(b=>`${b.location_name}|${b.city}|${b.region}|${b.country}`));
  set.delete('|||');
  return set.size;
}

function setStats(){
  const total = BIRDS.length;
  const species = uniqueSpecies(BIRDS);
  const places = uniquePlaces(BIRDS);
  const years = [...new Set(BIRDS.map(b => (b.date||'').slice(0,4)).filter(Boolean))].length;
  const s = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  s('stat-total', total);
  s('stat-species', species);
  s('stat-places', places);
  s('stat-years', years);
}

function applyFilters(){
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const region = document.getElementById('region')?.value || '';
  const year = document.getElementById('year')?.value || '';
  filtered = BIRDS.filter(b => {
    const hay = `${b.common_name} ${b.scientific_name} ${b.location_name} ${b.city} ${b.region} ${b.country}`.toLowerCase();
    const matchQ = q === '' || hay.includes(q);
    const matchRegion = region === '' || [b.region,b.country].map(x=>x.toLowerCase()).includes(region.toLowerCase());
    const matchYear = year === '' || (b.date||'').startsWith(year);
    return matchQ && matchRegion && matchYear;
  });
  page = 0;
  renderPage(true);
  const countEl = document.getElementById('result-count');
  if(countEl){ countEl.textContent = `${filtered.length} sightings • ${uniqueSpecies(filtered)} unique species`; }
}

function renderCard(bird){
  const img = bird.photo && bird.photo.trim() !== '' ? bird.photo : 'images/placeholder.jpg';
  const sci = bird.scientific_name ? ` <span class="small">(${bird.scientific_name})</span>` : '';
  const locbits = [bird.location_name, bird.city, bird.region, bird.country].filter(Boolean).join(', ');
  const aud = bird.audubon_page ? `<span class="badge">Audubon p. ${bird.audubon_page}${bird.book_edition? ' • '+bird.book_edition:''}</span>` : '';
  const mapLink = bird.maps_url ? `<a href="${bird.maps_url}" target="_blank" rel="noopener">Open in Google Maps</a>` : '';
  return `
    <article class="card">
      <img class="thumb lazy" data-src="${img}" alt="${bird.common_name}">
      <div class="card-body">
        <h3 class="name">${bird.common_name}${sci}</h3>
        <div class="meta">${bird.date || ''}${bird.date && (locbits)? ' • ':''}${locbits}</div>
        <div class="meta">${mapLink}</div>
        <div style="margin-top:8px">${aud}</div>
      </div>
    </article>
  `;
}

function lazyLoad(){
  const imgs = document.querySelectorAll('img.lazy');
  const io = new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.onload = ()=> img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  }, {rootMargin: '200px'});
  imgs.forEach(img=>io.observe(img));
}

function renderPage(reset=false){
  const grid = document.getElementById('grid');
  if(!grid) return;
  if(reset) grid.innerHTML = '';
  const start = page * pageSize;
  const chunk = filtered.slice(start, start + pageSize);
  const html = chunk.map(renderCard).join('');
  grid.insertAdjacentHTML('beforeend', html);
  lazyLoad();
  const btn = document.getElementById('loadMore');
  if(btn){
    if(start + pageSize >= filtered.length){
      btn.style.display = 'none';
    } else {
      btn.style.display = 'block';
    }
  }
  page++;
}

function populateFilters(){
  const regionSel = document.getElementById('region');
  const yearSel = document.getElementById('year');
  if(regionSel){
    const regions = [...new Set(BIRDS.flatMap(b=>[b.region,b.country]).filter(Boolean))].sort();
    regionSel.innerHTML = '<option value="">All regions</option>' + regions.map(r=>`<option>${r}</option>`).join('');
  }
  if(yearSel){
    const years = [...new Set(BIRDS.map(b=>(b.date||'').slice(0,4)).filter(Boolean))].sort().reverse();
    yearSel.innerHTML = '<option value="">All years</option>' + years.map(y=>`<option>${y}</option>`).join('');
  }
}

async function initCommon(){
  await loadCSV();
  setStats();
}

async function initIndex(){
  await initCommon();
  // could add recent birds list
  const recent = [...BIRDS].sort((a,b)=> (b.date||'').localeCompare(a.date||'')).slice(0,6);
  const mount = document.getElementById('recent');
  if(mount){
    mount.innerHTML = recent.map(renderCard).join('');
    lazyLoad();
  }
}

async function initBirds(){
  await initCommon();
  filtered = [...BIRDS];
  populateFilters();
  applyFilters();
  const search = document.getElementById('search');
  const region = document.getElementById('region');
  const year = document.getElementById('year');
  [search,region,year].forEach(el=> el && el.addEventListener('input', applyFilters));
  const btn = document.getElementById('loadMore');
  btn && btn.addEventListener('click', ()=> renderPage(false));
}

window.BirdApp = { initIndex, initBirds };
