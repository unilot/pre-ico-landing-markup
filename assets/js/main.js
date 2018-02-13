(function () {

    $('#demo').RollingSlider({
        showArea: "#example",
        prev: "#jprev",
        next: "#jnext",
        moveSpeed: 300,
        autoPlay: false
    });

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

    document.querySelector('.menu-open').addEventListener('click', function (event) {
        slideout.open();
        $('body').addClass('on');
    });

    document.querySelector('.menu-close').addEventListener('click', function (event) {
        slideout.close();
        $('body').removeClass('on');
    });

    function close(eve) {
        eve.preventDefault();
        slideout.close();
    }

    // Сайт затемняет
    slideout
        .on('beforeopen', function () {
            this.panel.classList.add('panel-open');
        })
        .on('open', function () {
            this.panel.addEventListener('click', close);
        })
        .on('beforeclose', function () {
            this.panel.classList.remove('panel-open');
            this.panel.removeEventListener('click', close);
        });

    slideout.on('translatestart', function () {
        $('body').addClass('on');
    });

    slideout.on('close', function () {
        $('body').removeClass('on');
    });

    $('#menu ul li a:not(.lng-switcher)').on('click', function (event) {
        slideout.close();
    });

// Якорь
    $(document).ready(function () {
        $("#link, #link-1").on("click", "a", function (event) {
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;
            $('body,html').animate({scrollTop: top}, 1000);
        });
    });

// select
    $('.js-submit-on-change').change(function (event) {
        var $target = $(this);
        $target.closest('form').submit();
    });

    var milestone = moment.tz('2018-02-17 19:00', 'UTC');

    $('.js-countdown').countdown(milestone.toDate(), function (event) {
        $(this).text(event.strftime('%D : %H : %M : %S'))
    });

// Сварачивающиеся блоки
    $(document).ready(function () {
        $('.faq__block .name').hide();
        $('.faq__block a').on('click', function () {
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

    var detectInUse = function() {
       var $input = $(this);

       if ($input.val()) {
           $input.addClass('in-use');
       } else {
           $input.removeClass('in-use');
       }
    };

    var $input =
        $('input[type=text], input[type=email], input[type=tel], input[type=url], input[type=number]');

    $input.each(function(index, inputEl) {
        detectInUse.call(inputEl);
    });

    $input.blur(detectInUse);
})();