
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
 let tbody=document.querySelector('#'+t+'_table tbody');
 let row=document.createElement('tr');
 if(t==='l'){
   row.innerHTML=`<td></td><td contenteditable></td><td contenteditable>1</td><td contenteditable>Stk</td><td contenteditable></td>
   <td><button class='del' onclick="this.parentNode.parentNode.remove();refresh('${t}')">X</button></td>`;
 } else {
   row.innerHTML=`<td></td><td contenteditable></td><td contenteditable>1</td><td contenteditable>Stk</td>
   <td contenteditable>0</td><td>0</td>
   <td><button class='del' onclick="this.parentNode.parentNode.remove();refresh('${t}')">X</button></td>`;
 }
 tbody.appendChild(row);
 refresh(t);
}

document.addEventListener("input", e=>{
 ['r','a'].forEach(t=>{
  if(e.target.closest('#'+t+'_table')) refresh(t);
 });
});

function refresh(t){
 let rows=document.querySelectorAll('#'+t+'_table tbody tr');
 let netto=0;
 rows.forEach((r,i)=>{
   r.children[0].textContent=i+1;
   if(t!=='l'){
     let m=parseFloat(r.children[2].textContent)||0;
     let p=parseFloat(r.children[4].textContent)||0;
     let g=m*p;
     r.children[5].textContent=g.toFixed(2);
     netto+=g;
   }
 });
 if(t!=='l'){
   let mw=document.getElementById(t+'_mwst').value;
   let mwst=netto*(mw/100);
   let brutto=netto+mwst;
   document.getElementById(t+'_sum_netto').textContent=netto.toFixed(2);
   document.getElementById(t+'_sum_mwst').textContent=mwst.toFixed(2);
   document.getElementById(t+'_sum_brutto').textContent=brutto.toFixed(2);
 }
}

function clearDoc(t){
 let fields=document.querySelectorAll('#'+t+' input, #'+t+' textarea');
 fields.forEach(f=>f.value="");
 document.querySelector('#'+t+'_table tbody').innerHTML="";
 refresh(t);
}

function saveDoc(t){
 let doc={type:t, data:{}};
 let inputs=document.querySelectorAll('#'+t+' input, #'+t+' textarea, #'+t+' select');
 inputs.forEach(i=>doc.data[i.id]=i.value);

 let rows=[];
 document.querySelectorAll('#'+t+'_table tbody tr').forEach(r=>{
   rows.push([...r.children].map(c=>c.textContent));
 });
 doc.rows=rows;

 let key="doc_"+t+"_"+(doc.data[t+'_nr']||Date.now());
 localStorage.setItem(key,JSON.stringify(doc));
 alert("Gespeichert!");
 loadArchive();
}

function loadArchive(){
 ['r','a','l'].forEach(t=>{
   let table=document.getElementById('archiv_'+t);
   table.innerHTML="<tr><th>Nummer</th><th>Datum</th><th>Kunde</th><th>Anzeigen</th><th>Löschen</th></tr>";
   Object.keys(localStorage).forEach(k=>{
     if(k.startsWith("doc_"+t+"_")){
       let d=JSON.parse(localStorage.getItem(k));
       let nr=d.data[t+'_nr']||"";
       let dat=d.data[t+'_datum']||"";
       let kd=d.data[t+'_kunde']||"";
       let tr=document.createElement('tr');
       tr.innerHTML=`<td>${nr}</td><td>${dat}</td><td>${kd}</td>
       <td><button onclick="loadDoc('${t}','${k}')">Anzeigen</button></td>
       <td><button class='del' onclick="delDoc('${k}')">Löschen</button></td>`;
       table.appendChild(tr);
     }
   });
 });
}

function delDoc(k){
 localStorage.removeItem(k);
 loadArchive();
}

function loadDoc(t,key){
 let d=JSON.parse(localStorage.getItem(key));
 clearDoc(t);
 Object.keys(d.data).forEach(id=>{
    let el=document.getElementById(id);
    if(el) el.value=d.data[id];
 });
 let tbody=document.querySelector('#'+t+'_table tbody');
 d.rows.forEach(r=>{
   let tr=document.createElement('tr');
   tr.innerHTML=r.map((v,i)=> i===0?`<td>${v}</td>`
     : i===6? `<td><button class='del' onclick="this.parentNode.parentNode.remove();refresh('${t}')">X</button></td>`
     : `<td contenteditable>${v}</td>` ).join("");
   tbody.appendChild(tr);
 });
 refresh(t);
 openTab(t);
}

function printDoc(){ window.print(); }
function printPdf(){ window.print(); }
