export function statistics(text){
 const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter('ko',{granularity:'grapheme'}):null;
 let characters=0,nonspace=0;
 for(const part of segmenter?segmenter.segment(text):Array.from(text).map(segment=>({segment}))){characters++;if(!/^\s+$/u.test(part.segment))nonspace++;}
 return {characters,nonspace,bytes:new TextEncoder().encode(text).length,words:(text.match(/\S+/gu)||[]).length,lines:text?text.split(/\r\n|\r|\n/).length:0,fallback:!segmenter};
}
export function clean(text,options={}){
 let result=text;
 if(options.nfc)result=result.normalize('NFC');
 if(options.invisible)result=result.replace(/[\u200b\ufeff\u00ad]/gu,'');
 // Textareas normalize line endings to LF; pure functions handle CR and CRLF too.
 let lines=result.split(/\r\n|\r|\n/);
 if(options.trim)lines=lines.map(line=>line.trim());
 if(options.spaces)lines=lines.map(line=>line.replace(/[^\S\r\n]+/gu,' '));
 if(options.blank)lines=lines.filter((line,i)=>i===0||line.trim()!==''||lines[i-1].trim()!=='');
 if(options.dedupe){const seen=new Set();lines=lines.filter(line=>{if(seen.has(line))return false;seen.add(line);return true;});}
 return lines.join('\n');
}
