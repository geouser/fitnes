/*
#############################
#   Main JS for ____________   #
#############################
*/

jQuery(document).ready(function($) {


/*-----------------------------------------------------------------*/  
  $('.magnific').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',
    modal: true,

    closeBtnInside: true,
    preloader: false,
    
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-slide-bottom'
  });

  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });


  function buildGallerySlider(){

    var windowWidth = $(window).width();
    var itemCount = Math.ceil(windowWidth/320);

    var requiredWidth = itemCount*320;
    //var galleryMargin = (requiredWidth - windowWidth)/2;
    var galleryMargin = requiredWidth - windowWidth;

    var galleryBlock = $('#photogallery .images');

    if (requiredWidth > windowWidth) {
      galleryBlock.css({'margin': '0 -'+galleryMargin+'px 0 0'});

      //var itemCountScroll = itemCount-1;
    var itemCountScroll = 1;
    
    } else {
      galleryBlock.css({'margin': '0'});

      var itemCountScroll = itemCount;
    }

    galleryConfig = {
      adaptiveHeight: true,
      autoplay: false,
      autoplaySpeed: 12000,
      arrows: false,
      dots: false,
      fade: false,
      infinite: true,
      initialSlide: 1,
      pauseOnHover: true,
      slide: '.col',
      slidesToShow: itemCount,
      slidesToScroll: itemCountScroll,
      speed: 1000,
      touchMove: true,
      useCSS: true
    };

    gallerySlider = $('#photogallery .images').slick(galleryConfig);
  

  var rNext = true;
  var rPrev = true; 

  $('.rNext').on({
    mouseenter: function(){
    rNext = true;
    fRepNext();
    },
    mouseleave: function(){
    rNext = false;
    }
  });

  $('.rPrev').on({
    mouseenter: function(){
    rPrev = true;
    fRepPrev();
    },
    mouseleave: function(){
    rPrev = false;
    }
  });

  function fRepNext(){
    $('#photogallery .images').slick("slickSetOption", "speed", "3000").slick("slickSetOption", "cssEase", "linear").slick("slickNext").slick("slickSetOption", "speed", "1000");
    if (rNext){
    setTimeout(fRepNext, 0);
    }
  }

  function fRepPrev(){
    $('#photogallery .images').slick("slickSetOption", "speed", "3000").slick("slickSetOption", "cssEase", "linear").slick("slickPrev").slick("slickSetOption", "speed", "1000");
    if (rPrev){
    setTimeout(fRepPrev, 0);
    }
  };


  $('#photogallery .images .col').magnificPopup({
       delegate: '.item',
       type: 'image',
       fixedContentPos: false,
       removalDelay: 300,
       mainClass: 'mfp-fade',
      gallery:{
        enabled:true
      }
    });
  
  };

  buildGallerySlider();

  $(window).resize(function(){
    gallerySlider.slick('unslick');
    buildGallerySlider();
  });


  $(function() {
    $( "#tabs" ).tabs();
  });

  $('.slider').slick();

});




