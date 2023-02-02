let timer = 2000;

if (window.innerWidth <= 720) {
  timer = 0;
}

window.onload = function() {
  setTimeout(function(){
    document.getElementById("loader").style.display = "none";
    document.getElementById("content-of-page").style.display = "block";
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        } else {
          entry.target.classList.remove('show');
        }
      }); 
    });
  
    const hiddenElements = document.querySelectorAll('.index-animate, .index-text');
    hiddenElements.forEach((element) => {
      observer.observe(element);
    });
  
  }, timer);
  
}