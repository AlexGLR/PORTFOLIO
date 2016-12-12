$(document).pjax('a', '#pjax-container');

 

  $(document).ready(function () {
    //initialize swiper when document ready  
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 'auto',
        centeredSlides: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        parallax: true,
        paginationBulletRender: function (swiper, index, className) {
           return '<div class="' + className + '">' + '<span class="pagindex-container">' + ("0" + (index +1)) + '</span>' + '</div>';
        },
        speed: 800,
        autoplay: 8000,
        grabCursor: true,
        keyboardControl: true,
        mousewheelControl: true,
        mousewheelSensitivity: 0.5
         
    });    
  });