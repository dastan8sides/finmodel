/* Small dependency-free OOXML exporter. ZIP entries use the standard STORE method. */
(function(root){
const enc=new TextEncoder(),escapeXml=s=>String(s).replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
function zip(files){const chunks=[],central=[];let offset=0;const table=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0});
const header=(length,entries)=>{const a=new Uint8Array(length),v=new DataView(a.buffer);for(const [pos,val,size] of entries)size===2?v.setUint16(pos,val,true):v.setUint32(pos,val,true);return a};
for(const [name,content]of Object.entries(files)){const n=enc.encode(name),d=enc.encode(content);let crc=0xffffffff;for(const b of d)crc=table[(crc^b)&255]^(crc>>>8);crc=(crc^0xffffffff)>>>0;
const local=header(30,[[0,0x04034b50,4],[4,20,2],[10,0,2],[12,33,2],[14,crc,4],[18,d.length,4],[22,d.length,4],[26,n.length,2]]);chunks.push(local,n,d);
central.push(header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[14,33,2],[16,crc,4],[20,d.length,4],[24,d.length,4],[28,n.length,2],[42,offset,4]]),n);offset+=30+n.length+d.length;}
const size=central.reduce((s,a)=>s+a.length,0),count=Object.keys(files).length;chunks.push(...central,header(22,[[0,0x06054b50,4],[8,count,2],[10,count,2],[12,size,4],[16,offset,4]]));const out=new Uint8Array(offset+size+22);let at=0;for(const a of chunks){out.set(a,at);at+=a.length;}return out;}
root.FinZip=zip; })(typeof window!=="undefined"?window:globalThis);