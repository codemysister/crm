function s(n){const t=new Date(n),e=t.getUTCDate(),o=t.getUTCMonth()+1,a=t.getUTCFullYear(),r=e<10?`0${e}`:e,c=o<10?`0${o}`:o;return`${r}/${c}/${a}`}export{s as f};
