
const prev=document.querySelector('.prev');
const next=document.querySelector('.next');

const comment=document.querySelector('#list-comment')

// trả về arry 6 thẻ <li>
const commentItem=document.querySelectorAll('#list-comment .item')
let count=commentItem.length;

let translateY=0;


prev.addEventListener('click',(e)=>{
    e.preventDefault();
    if(count===6){
        return false
    }
    translateY += 308;
    comment.style.transform=`translateY(${translateY}px)`

    count++;
})

next.addEventListener('click',(e)=>{
    e.preventDefault();
    if(count===1){
        return false
    }
    translateY += -308;
    comment.style.transform=`translateY(${translateY}px)`

    count--;
})



