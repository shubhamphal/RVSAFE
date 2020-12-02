var backButton = document.querySelector('.back-button')

function backAnim(){  
  if (backButton.classList.contains('back')){
    backButton.classList.remove('back');
  }
  else{
    backButton.classList.add('back');
    setTimeout(backAnim, 1000);  
  }
}
backButton.addEventListener('click', backAnim); 
