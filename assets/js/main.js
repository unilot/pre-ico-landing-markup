$(function() {

$('#demo').RollingSlider({
        showArea:"#example",
        prev:"#jprev",
        next:"#jnext",
        moveSpeed:300,
        autoPlay:false
      });



   ////слайдер
// var $lis = $('.wrap__block').find('span'),
//       length = $lis.length;

//      $lis.each(function(index,item){
//       $(item).attr('data-id',index);
//      });


//      function slider($lis,index,length){
//       $lis.each(function(index,item){
//         item.className = '';
//       });
//       index +=length;       
//       $($lis[index%length]).addClass('active');
//       $($lis[(index-1)%length]).addClass('left1');
//       $($lis[(index-2)%length]).addClass('left2');
//       $($lis[(index+1)%length]).addClass('right1');
//       $($lis[(index+2)%length]).addClass('right2');
//      }




//     $lis.on('click',function(e){
//       var id = parseInt($(e.target).parents('span').attr('data-id'));
//       slider($lis,id,length);
//     });



// Swiper
var swiper = new Swiper('#swiper-1', {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 1,
      loopFillGroupWithBlank: true,
      navigation: {
        nextEl: '#next1',
        prevEl: '#prev1',
      },
      breakpoints: {
        767: {
          slidesPerView: 1,
          spaceBetween: 80
        },
      }
    });



var swiper = new Swiper('#swiper-2', {
      slidesPerView: 3,
      spaceBetween: 30,
      slidesPerGroup: 1,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '#next',
        prevEl: '#prev',
      },
      breakpoints: {
        767: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 30
        }
      }
    });
	
 //Мобильная менюшка
var slideout = new Slideout({
  'panel': document.getElementById('panel'),
  'menu': document.getElementById('menu'),
  'padding': 350,
  'tolerance': 70
});

document.querySelector('.menu-open').addEventListener('click', function(event) {
  slideout.open();
  $('body').addClass('on');
});

document.querySelector('.menu-close').addEventListener('click', function(event) {
  slideout.close();
  $('body').removeClass('on');
});

function close(eve) {
  eve.preventDefault();
  slideout.close();
}
    // Сайт затемняет
    slideout
      .on('beforeopen', function() {
        this.panel.classList.add('panel-open');
      })
      .on('open', function() {
        this.panel.addEventListener('click', close);
      })
      .on('beforeclose', function() {
        this.panel.classList.remove('panel-open');
        this.panel.removeEventListener('click', close);
      });
  
slideout.on('translatestart', function() {
  $('body').addClass('on');
});

slideout.on('close', function() { 
  $('body').removeClass('on');
});



// Якорь
 $(document).ready(function(){
    $("#link, #link-1").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
});

// select
$('.js-submit-on-change').change(function(event){
    var $target = $(this);
    $target.closest('form').submit();
});

$('.js-countdown').countdown("02/15/2018", function(event){
    $(this).text(event.strftime('%D : %H : %M : %S'))
});

// Сварачивающиеся блоки
$(document).ready(function(){  
    $('.faq__block .name').hide();
    $('.faq__block a').on('click', function() {
      $('.faq__block .name').slideUp(500);
      $(this).parent().find('.name').slideToggle(500);
    });
});
$(".faq__block").click(function () {
  $(this).toggleClass("active");
});


var scene = $('.scene').get(0);
var parallaxInstance = new Parallax(scene);
var scene = $('.scene1').get(0);
var parallaxInstance = new Parallax(scene);
var scene = $('.scene2').get(0);
var parallaxInstance = new Parallax(scene);

});

function hideAlert() {
  var alert = document.getElementById('alert');
  alert.style.display = 'none';
}