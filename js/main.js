// Global parameters
window.params = {
  widthFull: 750,
  maxRowHeight: 0,
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};

function Main() {

  // Modules initialization
  var maxRowHeight = new MaxHeight($('.cross-row'));


  // polyfills
  window.viewportUnitsBuggyfill.init();

  // add conditional classes
  if (params.isIOS) $('html').addClass('-ios');
  if (params.isMobile) $('html').addClass('-mobile');

}

$(function(){
  Main();
});

$(window).on('load', function(){
  setTimeout(function(){
    $(window).trigger('resize');
  }, 500);
});

// Áðàóçåð Internet Explorer?
$(function(){
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      var v = parseFloat( RegExp.$1 );
      $('html').addClass("ie");
      $('html').addClass("ie"+v);
    }
  } else if (navigator.appName == 'Netscape') {
    var ua = navigator.userAgent;
    var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      var v = parseFloat( RegExp.$1 );
      $('html').addClass("ie");
      $('html').addClass("ie"+v);
    }
  }
});



/*
#############################
#   Main JS for ____________   #
#############################
*/

jQuery(document).ready(function($) {
    $(function() {
    $( "#tabs" ).tabs({
      activate: function( event, ui ) {
        console.log(event);
        ui.newPanel.find('.slider').get(0).slick.setPosition();
      }
    });
  });

  $('.slider').slick();


/*-----------------------------------------------------------------*/  
  $('.magnific').magnificPopup({
    type: 'inline',

    fixedContentPos: false,
    fixedBgPos: true,

    overflowY: 'auto',
    modal: false,

    closeBtnInside: true,
    preloader: false,
    
    midClick: true,
    removalDelay: 300,
    mainClass: 'my-mfp-slide-bottom'
  });

  
  $('.popup-youtube').magnificPopup({
    type: 'iframe',
    mainClass: 'my-mfp-slide-bottom',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });



  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });

/*----------------form submiting -----------------*/ 
  $("form").submit(function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: $(this).attr('action'),
      data: $(this).serialize(),
      success: function(result){
        if (result.status == 'ok') {
          $('#open-thanks').click();
          console.log('ok|||' + result.status)
        } else if (result.status == 'error'){
          $('#error-button').click();
          console.log('error|||' + result.status)
        }
        
        $('form').each(function(){
          $(this)[0].reset();
        });
      },
      error: function(result) {
        console.log(result)
        $('#error-button').click();
      }
    });
    return false;
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


  function googleMap_initialize() {

      var mapCenterCoord = new google.maps.LatLng(55.692014, 37.896432);
      var mapMarkerCoord = new google.maps.LatLng(55.692014, 37.896432);

      var mapOptions = {
        center: mapCenterCoord,
        zoom: 16,
        //draggable: false,
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      var markerImage = new google.maps.MarkerImage('images/green-marker.svg');
      var marker = new google.maps.Marker({
        icon: markerImage,
        position: mapMarkerCoord, 
        map: map,
        title:"Siberian Wild Apps"
      });
      $(window).resize(function (){
        map.setCenter(mapCenterCoord);
      });
  };
  googleMap_initialize();

});




