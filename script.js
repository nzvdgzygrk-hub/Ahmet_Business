
const LOGO_PATH = "logo.png";

function openTab(t){
 document.querySelectorAll('.tab').forEach(tab=>tab.style.display='none');
 document.getElementById(t).style.display='block';
 loadArchive();
}

['r','a','l'].forEach(t=>{
 document.getElementById(t+'_logo').style.backgroundImage = "url('" + LOGO_PATH + "')";
});

function addRow(t){
 let tbody = document.querySelector('#'+t+'_table tbody');
 let row = document.createElement('tr');
 let isL = t==='l';
 row.innerHTML = isL ?
 `<td></td><td contenteditable></td><td contenteditable>1</td><td contenteditable>Stk</td><td contenteditable></td>
  <td><button class='del' onclick="this.parentNode.parentNode.remove(); refresh('${t}')">X</button></td>`
 :
 `<td></td><td contenteditable></td><td contenteditable>1</td><td contenteditable>Stk</td>
  <td contenteditable>0</td><td>0</td>
  <td><button class='del' onclick="this.parentNode.parentNode.remove(); refresh('${t}')">X</button></td>`;
 tbody.appendChild(row);
 refresh(t);
}

function refresh(t){
 let rows = document.querySelectorAll('#'+t+'_table tbody tr');
 rows.forEach((r,i)=>{
   r.children[0].textContent = i+1;
   if(t!=='l'){
     let qty = parseFloat(r.children[2].textContent)||0;
     let price = parseFloat(r.children[4].textContent)||0;
     r.children[5].textContent = (qty*price).toFixed(2);
   }
 });
}

document.addEventListener("input", e=>{
 ['r','a'].forEach(t=>{
   if(e.target.closest('#'+t+'_table')) refresh(t);
 });
});

function clearDoc(t){
 document.getElementById(t+'_nr').value="";
 document.getElementById(t+'_kunde').value="";
 document.querySelector('#'+t+'_table tbody').innerHTML="";
}

function saveDoc(t){
 let nr=document.getElementById(t+'_nr').value;
 let kunde=document.getElementById(t+'_kunde').value;
 let rows=[];
 document.querySelectorAll('#'+t+'_table tbody tr').forEach(r=>{
   rows.push([...r.children].slice(1, t==='l'?5:6).map(c=>c.textContent));
 });
 let obj={type:t,nr,kunde,rows};
 localStorage.setItem("doc_"+t+"_"+nr, JSON.stringify(obj));
 loadArchive();
 alert("Gespeichert!");
}

function delDoc(key){
 localStorage.removeItem(key);
 loadArchive();
}

function loadArchive(){
 ['r','a','l'].forEach(t=>{
   let table=document.getElementById('archiv_'+t);
   if(!table)return;
   table.innerHTML="<tr><th>Nummer</th><th>Kunde</th><th>Öffnen</th><th>X</th></tr>";
   Object.keys(localStorage).forEach(k=>{
     if(k.startsWith("doc_"+t+"_")){
       let d=JSON.parse(localStorage.getItem(k));
       let tr=document.createElement('tr');
       tr.innerHTML=
       `<td>${d.nr}</td><td>${d.kunde}</td>
        <td><button onclick='loadDoc("${t}","${d.nr}")'>Öffnen</button></td>
        <td><button class='del' onclick='delDoc("${k}")'>X</button></td>`;
       table.appendChild(tr);
     }
   });
 });
}

function loadDoc(t,nr){
 let obj=JSON.parse(localStorage.getItem("doc_"+t+"_"+nr));
 document.getElementById(t+'_nr').value=obj.nr;
 document.getElementById(t+'_kunde').value=obj.kunde;
 let tbody=document.querySelector('#'+t+'_table tbody');
 tbody.innerHTML="";

 obj.rows.forEach(r=>{
  let row=document.createElement('tr');
  if(t==='l'){
    row.innerHTML=
    `<td></td><td contenteditable>${r[0]}</td><td contenteditable>${r[1]}</td>
     <td contenteditable>${r[2]}</td><td contenteditable>${r[3]}</td>
     <td><button class='del' onclick="this.parentNode.parentNode.remove(); refresh('${t}')">X</button></td>`;
  } else {
    row.innerHTML=
    `<td></td><td contenteditable>${r[0]}</td><td contenteditable>${r[1]}</td>
     <td contenteditable>${r[2]}</td><td contenteditable>${r[3]}</td>
     <td>${r[4]}</td>
     <td><button class='del' onclick="this.parentNode.parentNode.remove(); refresh('${t}')">X</button></td>`;
  }
  tbody.appendChild(row);
 });
 refresh(t);
 openTab(t);
}
