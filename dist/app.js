import {statistics,clean} from './core.js';
const $=id=>document.getElementById(id),keys=['trim','spaces','blank','dedupe','invisible','nfc'],nf=new Intl.NumberFormat('ko');let timer;
function render(){
 const source=$('input').value,result=clean(source,Object.fromEntries(keys.map(k=>[k,$(k).checked]))),before=statistics(source),after=result===source?before:statistics(result);
 $('output').value=result;for(const k of ['characters','nonspace','bytes'])$(k).textContent=nf.format(before[k]);$('lines').textContent=`${nf.format(before.words)} / ${nf.format(before.lines)}`;
 $('changed').textContent=result===source?'변경 없음':'정리 적용됨';$('result-stats').textContent=`${nf.format(after.characters)}글자 · ${nf.format(after.bytes)}바이트`;$('copy').disabled=$('download').disabled=!result;
 $('message').textContent=before.fallback?'이 브라우저는 문자 묶음을 지원하지 않아 유니코드 코드 포인트 단위로 계산합니다.':source.length===500000?'최대 입력 길이에 도달했습니다. 긴 문서는 나누어 확인하세요.':'';
}
$('input').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,120);});keys.forEach(k=>$(k).addEventListener('change',render));
$('sample').addEventListener('click',()=>{if($('input').value){$('message').textContent='원문이 있습니다. 원문을 지운 뒤 예시를 넣어주세요.';return;}$('input').value='  안녕하세요.   반갑습니다.  \n\n\n같은 줄\n같은 줄\n한글 가 · 영문 A · 가족 👨‍👩‍👧‍👦';render();});
$('clear').addEventListener('click',()=>{$('input').value='';render();$('input').focus();});
$('copy').addEventListener('click',async()=>{clearTimeout(timer);render();try{await navigator.clipboard.writeText($('output').value);$('message').textContent='정리 결과를 복사했습니다.';}catch{$('output').focus();$('output').select();$('message').textContent='자동 복사를 사용할 수 없어 결과를 선택했습니다. 복사 단축키를 누르세요.';}});
$('download').addEventListener('click',()=>{clearTimeout(timer);render();const url=URL.createObjectURL(new Blob([$('output').value],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='정리한-글.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);});
render();
