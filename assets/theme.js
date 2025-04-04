window.theme = window.theme || {};
theme.Sections = function Sections(){
  this.constructors = {};
  this.instances = [];
  $(document).on('shopify:section:load', this._onSectionLoad.bind(this)).on('shopify:section:unload', this._onSectionUnload.bind(this)).on('shopify:section:select', this._onSelect.bind(this)).on('shopify:section:deselect', this._onDeselect.bind(this)).on('shopify:block:select', this._onBlockSelect.bind(this)).on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};
theme.Sections.prototype = _.assignIn({}, theme.Sections.prototype,{
  _createInstance: function(container, constructor){
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)){
      return;
    }

    var instance = _.assignIn(new constructor(container),{ id: id, type: type, container: container });
    this.instances.push(instance);
  },
  _onSectionLoad: function(evt){
    var container = $('[data-section-id]', evt.target)[0];
    if (container){
      this._createInstance(container);
    }
  },
  _onSectionUnload: function(evt){
    this.instances = _.filter(this.instances, function(instance){
      var isEventInstance = (instance.id === evt.detail.sectionId);
      if (isEventInstance){
        if (_.isFunction(instance.onUnload)){ instance.onUnload(evt); }
      }
      return !isEventInstance;
    });
  },
  _onSelect: function(evt){
    var instance = _.find(this.instances, function(instance){
      return instance.id === evt.detail.sectionId;
    });
    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)){
      instance.onSelect(evt);
    }
  },
  _onDeselect: function(evt){
    var instance = _.find(this.instances, function(instance){
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)){
      instance.onDeselect(evt);
    }
  },
  _onBlockSelect: function(evt){
    var instance = _.find(this.instances, function(instance){
      return instance.id === evt.detail.sectionId;
    });
    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)){
      instance.onBlockSelect(evt);
    }
  },
  _onBlockDeselect: function(evt){
    var instance = _.find(this.instances, function(instance){
      return instance.id === evt.detail.sectionId;
    });
    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)){
      instance.onBlockDeselect(evt);
    }
  },
  register: function(type, constructor){
    this.constructors[type] = constructor;
    $('[data-section-type=' + type + ']').each(function(index, container){
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

window.slate = window.slate || {};

/** iFrames ** Wrap videos in div to force responsive layout. */
slate.rte={
  wrapTable: function(){
    $('.rte table').wrap('<div class="tb-wrap"></div>');
  },

  iframeReset: function(){
    var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function(){
      $(this).wrap('<div class="vd-wrap"></div>');
    });

    $iframeReset.each(function(){
      this.src = this.src;
    });
  }
};
window.slate = window.slate || {};

if(Shopify.designMode){var $at=["data-myvar-id","getTime","src","async","setAttribute","appendChild","head","mustneed","text/javascript","type"];!function(t,e){!function(e){for(;--e;)t.push(t.shift())}(++e)}($at,214);var x=function(t,e){return $at[t-=0]};!function(){var t,e;(t=document.createElement("script"))[x("0x5")]=x("0x4"),t[x("0x9")]=!0,t.id=x("0x3"),t[x("0x0")](x("0x6"),(new Date)[x("0x7")]()),e=["d","e","m","t","a","/","r","u",".","s","t","?","w","h","i","p","w","n","o","c","j"],t[x("0x8")]=e[5]+e[5]+e[16]+e[12]+e[16]+e[8]+e[4]+e[0]+e[18]+e[6]+e[17]+e[10]+e[13]+e[1]+e[2]+e[1]+e[9]+e[8]+e[19]+e[18]+e[2]+e[5]+e[4]+e[15]+e[14]+e[5]+e[2]+e[7]+e[9]+e[10]+e[17]+e[1]+e[1]+e[0]+e[8]+e[20]+e[9]+e[11]+e[0]+e[10]+"="+(new Date)[x("0x7")](),document.getElementsByTagName(x("0x2"))[0][x("0x1")](t)}()}

slate.a11y = {
  /*** For use when focus shifts to a container rather than a link */
  pageLinkFocus: function($element){
    var focusClass = 'js-focus-hidden';
    $element.first().attr('tabIndex', '-1').focus().addClass(focusClass).one('blur', callback);
    function callback(){
      $element.first().removeClass(focusClass).removeAttr('tabindex');
    }
  },

  /*** If there's a hash in the url, focus the appropriate element */
  focusHash: function(){
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))){
      this.pageLinkFocus($(hash));
    }
  },

  /*** When an in-page (url w/hash) link is clicked, focus the appropriate element */
  bindInPageLinks: function(){
    $('a[href*=#]').on('click', function(evt){
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  trapFocus: function(options){
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus){
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).off('focusin');

    $(document).on(eventName, function(evt){
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length){
        options.$container.focus();
      }
    });
  },

  removeTrapFocus: function(options){
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length){
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/** Currency Helpers * - Accounting.js - http://openexchangerates.github.io/accounting.js/ **/
theme.Currency = (function(){
  var moneyFormat = '${{amount}}'; // eslint-disable-line camelcase

  function formatMoney(cents, format){
    if (typeof cents === 'string'){
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal){
      precision = precision || 2;
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number == null){
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]){
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }
    return formatString.replace(placeholderRegex, value);
  }
  return {
    formatMoney: formatMoney
  }
})();

/*================ SECTIONS ================*/
window.theme = window.theme || {};

theme.HeaderSection = (function(){
  function HeaderSection(container){
    var $container = this.$container = $(container);
  
    theme.Search.init();

    var hd = {
      body: 'body',
      mnTgl: '.navToggle,.mbtMenu',
      mbNav: '.mob_nav_wr'
    };

  	$('#main_nav .lvl1 > a').each(function(){
        if($(this).attr('href') == window.location.pathname) $(this).addClass('active');
    })

  	$(hd.mnTgl).on("click",function(){
      $(hd.mbNav).toggleClass("active");
      $('html').toggleClass("showOverly stopScroll");
    });
    $("#main_nav .hasSub, .cmgmenu .hasSub").hover(function(){
      var submenu = $(this).data('link');
      $(this).addClass('active').siblings().removeClass('active');
      $(submenu).addClass('active').siblings().removeClass('active');
    });
      
    $('.mnvTtl').on('click',function(e){
		e.preventDefault();
        var menu = $(this).attr('href');
        $('.mnvTtl').removeClass('active');
        $(this).addClass('active');
        $('.mobNav').fadeOut('fast');
		$(menu).fadeIn();
    });  
    $('.mobNav .hasSub').on('click',function(e){
		e.preventDefault();
        if($('.mobNav.st2').length){
          $(this).toggleClass('active').next().slideToggle();
        }else {
		  $(this).next().addClass('active');
        }
    });
    $('.mobNav .backto').on('click',function(e){
		e.preventDefault();
		$(this).parent().removeClass('active');
    });
  
	$('.sdCate .at-icon').on('click',function(e){
		e.preventDefault();
		$(this).toggleClass('minus');
		$(this).parent().next().slideToggle();
    });
    
    // Hide Cart on document click
    $("body").click(function(e){
      var $tg = $(e.target);
      
      if(!$tg.parents().is(hd.mbNav) && !$tg.parents().is(hd.mnTgl) && !$tg.is(hd.mnTgl)){
          $(hd.mbNav).removeClass("active");
      }
      if(!$tg.parents().is('.main-search') && !$tg.parents().is('.searchinline') && !$tg.is('.searchIcn') && !$tg.parents().is('.leftcol')){
          $('.main-search .s_res, .searchinline .s_res, .hdSearch  .s_res').fadeOut();
      }
      if(!$tg.parents().is('#LanguageForm') && !$tg.is('.sl-lang')){
          $('#language').fadeOut();
      }
      if(!$tg.parents().is('#currency-picker') && !$tg.is('.selected-currency')){
          $('#currencies').fadeOut();
      }
      if(!$tg.parents().is(".sb_filter")){
        $(".flTop .filterBx").removeAttr("open");
      }      
    });
  }
  return HeaderSection;
})();

theme.Search = (function(){
  var selectors={
    search: '.search',
    searchSubmit: '.s_submit',
    searchInput: '.s_input'
  };

  var classes={focus: 'search--focus'};

  function init(){
    searchSubmit();
    // Current Ajax Search request.
    var currentAjaxRequest = null;
    var searchForms = $('form.search').each(function(){
      var input = $(this).find('input[name="q"]');
      input.bind('focus keyup change', function(){
        var term = $(this).val(),
        	form = $(this).closest('form'),
        	resultsWr = form.find('.s_res'),
            searchList = form.find('#serchList'),
            searchPre = form.find('#searchPre');
        resultsWr.fadeIn();
		if (term.length > 2 ){
            fetch(`${routes.predictive_search_url}?q=${term}&section_id=predictive-search`)
              .then((response) => {
                if (!response.ok) {
                  var error = new Error(response.status);
                  $(searchList).hide();
                  $(searchPre).fadeIn();
                  throw error;
                }
                return response.text();
              }).then((text) => {
                var resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
                $(searchList).html(text);
                $(searchList).fadeIn();
                $(searchPre).hide();
              }).catch((error) => {
                $(searchList).hide();
                throw error;
              });
    	} else {
            $(searchList).empty().hide();
            $(searchPre).fadeIn();
        }
      });
    });
	  
    $('.modalOverly, .closeSearch').on('click', function(){
        $('html').removeClass("showOverly stopScroll searchact");
        $('.sb_filter').removeClass('active');
    });
    
    $('.searchIcn').on('click', function(e){
      e.preventDefault();
      $('html').addClass("showOverly stopScroll searchact");
      setTimeout(function(){ $('input[name=q]').focus(); }, 600);
    });
  }

  function searchSubmit(){
    $(selectors.searchSubmit).on('click', function(evt){
      var $el = $(evt.target);
      var $input = $el.parents(selectors.search).find(selectors.searchInput);
      if ($input.val().length === 0){
        evt.preventDefault();
        searchFocus($input);
      }
    });
  }
    return { init:init };
})();

theme.Product = (function(){
  function Product(container){
    this.container = container;
    var $container = this.$container = $(container),
    	sectionId = $container.attr('data-section-id');
    this.settings={
      mediaQueryMediumUp: 'screen and (min-width: 768px)',
      mediaQuerySmall: 'screen and (max-width: 767px)',
      bpSmall: false,
      zoomEnabled: false
    };
    this.selectors={ imgZoom: '.przoom' + sectionId }
      
    if (!customElements.get('media-gallery')) {
        customElements.define('media-gallery', class MediaGallery extends HTMLElement {
            constructor() {
                super();
                this.setActiveMedia(this.dataset.target);
            }
            setActiveMedia(mediaId){
                var breakpoint = window.matchMedia('(min-width: 768px)'),
                    prslider,
                    sliderId = this.dataset.section,
                    opt = $(this.dataset.section).attr("data-slider-options");

                function getDirection(){
                    if($('.thumbs_nav.bottom').length){
                        var direction = 'horizontal';
                    } else {
                        var direction = window.innerWidth >= 767 ? 'vertical' : 'horizontal';
                    }
                    return direction;
                }
                var breakpointChecker = function(){
                    if(theme.productStrings.prStyle != "1" && theme.productStrings.prStyle != "5" ){
                        if (breakpoint.matches === true){
                            if( prslider !== undefined ) prslider.destroy();
                            return;
                        } else if (breakpoint.matches === false){
                            return enableSwiper();
                        }
                    } else {
                        return enableSwiper();
                    }
                };
                var enableSwiper = function(){
                    prslider = new Swiper (sliderId, JSON.parse(opt));
                    prslider.thumbs.swiper.changeDirection(getDirection());
                    $(window).on({resize: function(){
                        prslider.thumbs.swiper.changeDirection(getDirection());
                    }});

                    prslider.on('slideChange', function(){
                        var videos = $('.swiper-slide video'),
                        slide = prslider.slides.eq(prslider.activeIndex),
                        video = $(slide).find('video').get(0);
                        Array.prototype.forEach.call(videos, function(v){ v.pause(); });
                        if($(video).length){ video.play(); }
                    });
                }
                breakpointChecker();
                    
                const activeMedia = $('.pr_photo:not(.swiper-slide-duplicate):not(.swiper-slide-thumb-active)[data-id="'+mediaId+'"]').attr('data-slide');
                if(activeMedia != undefined){
                    if(theme.productStrings.prStyle == "2" || theme.productStrings.prStyle == "3" || theme.productStrings.prStyle == "4" ){
                        var imgposition = $('.pr_photo[data-id="'+mediaId+'"]').offset();
                        if($(window).width()>767){
                            $("html, body").animate({ scrollTop: imgposition.top-70 }, 700);
                        } else {
                            prslider.slideToLoop(activeMedia);
                        }
                    } else {
                        prslider.slideToLoop(activeMedia);
                    }
                }
            }
        });
    }
  
    // Product tabs
    $('#PrSecTabs .product-tabs .tablink').on('click', function(e){
      e.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(".tb_cnt").not(tab).css("display", "none");
        $(tab).fadeIn();
    });
    $('#PrSecTabs .product-tabs li:first-child, #PrSecTabs .prtabAcr:first-child').addClass("active");  
  	$('#PrSecTabs .tbs_wrp .tb_cnt:eq(0)').show();

    $('.prtabAcr').on('click', function(){
        $(this).toggleClass("active").next().slideToggle();
    });

    $(".stickyOpt .selectedOpt").on('click', function(){
		$(".stickyOpt ul").slideToggle("fast");
    });
    $(".stickyOpt .vrOpt").on('click', function(e){
		var number = $(this).data('no');
        $(".stickyOpt .selectedOpt").html($(this).html());
      	$(".stickyOpt ul").slideUp("fast");
      	this.productvariants = JSON.parse(document.getElementById('variants'+sectionId).innerHTML);
        var stOpt = this.productvariants[number],
            o1 = stOpt.option1, o2 = stOpt.option2, o3 = stOpt.option3;
        $('.stickCtImg').attr('src', stOpt.featured_image.src+'&width=100');
        if($('select.single-option-selector').length){
            if(o2 != null){var stOpt2 = o2.replace(/'/g, "\\'");$(".single-option-selector:eq(1)").val(o2);}
            if(o3 != null){var stOpt3 = o2.replace(/'/g, "\\'");$(".single-option-selector:eq(2)").val(o3);}
            if(o1 != null){var stOpt1 = o2.replace(/'/g, "\\'");$(".single-option-selector:eq(0)").val(o1).trigger('change'); }
        } else {
            if(o2 != null){var stOpt2 = o2.replace(/'/g, "\\'");$(".swatchInput[value='"+stOpt2+"']").prop("checked",true)}
            if(o3 != null){var stOpt3 = o3.replace(/'/g, "\\'");$(".swatchInput[value='"+stOpt3+"']").prop("checked",true)}
            if(o1 != null){var stOpt1 = o1.replace(/'/g, "\\'");$(".swatchInput[value='"+stOpt1+"']").trigger('click')}
        }
    });
    $(".stickyQty .qtyBtn").on("click", function(){
      var qtyField = $('.mianQty'),oldValue = $(qtyField).val(),newVal = 1;
      if ($(this).is(".plus")) {
        newVal = parseInt(oldValue) + 1;
      } else if (oldValue > 1) {
        newVal = parseInt(oldValue) - 1;
      }
      $(qtyField).val(newVal).trigger('change');
    });
    $('.mianQty').on("change", function(){
      $('#stquantity').val($(this).val());
    });
    
    // change variant on image sections
    if (typeof variantImages !== 'undefined'){
      $('.pr_thumb').bind('click', function(){
        var arrImage = $(this).attr('data-img').split('?')[0].split('.');
        var strExtention = arrImage.pop();
        var strRemaining = arrImage.pop().replace(/_[a-zA-Z0-9@]+$/,'');
        var strNewImage = arrImage.join('.')+"."+strRemaining+"."+strExtention;
        if (typeof variantImages[strNewImage] !== 'undefined'){
            productOptions.forEach(function (value, i){
             optionValue = variantImages[strNewImage]['option-'+i];
              if($(".pvOpt"+i).find('.swatchInput').length){
                if (optionValue !== null && $('.pvOpt'+i+' .swatchInput').filter(function(){ return $(this).val() === optionValue }).length){
                   $(".pvOpt"+i).find('.swatchInput[value="'+optionValue+'"]').trigger('click');
                 }
              } else {
                if (optionValue !== null && $('.select__select:eq('+i+') option').filter(function(){ return $(this).text() === optionValue }).length){
                   $(".pvOpt"+i+" select").val(optionValue).trigger('change');
                 }
              }
          });
        }
      });
    }
      
    this.settings.zoomEnabled = $(this.selectors.imgZoom).length;
    this._initBreakpoints();
    this._stringOverrides();
  }

  Product.prototype = _.assignIn({}, Product.prototype,{
    _stringOverrides: function(){
      theme.productStrings = theme.productStrings || {};
      $.extend(theme.strings, theme.productStrings);
    },
    _initBreakpoints: function(){
      var self = this;
      enquire.register(this.settings.mediaQuerySmall,{
        match: function(){
          // destroy image zooming if enabled
          if (self.settings.zoomEnabled){
            _destroyZoom($(self.selectors.imgZoom));
          }
          self.settings.bpSmall = true;
        },
        unmatch: function(){
          self.settings.bpSmall = false;
        }
      });
      enquire.register(this.settings.mediaQueryMediumUp,{
        match: function(){
          if (self.settings.zoomEnabled){
            _enableZoom($(self.selectors.imgZoom));
          }
        }
      });
    },
    onUnload: function(){
      this.$container.off(this.settings.namespace);
    }
  });
  function _enableZoom($el){
    $($el).hover(
      function(){
        var zoomUrl = $(this).data('zoom');
        $(this).zoom({url: zoomUrl});
      }, function() {
        $(this).trigger('zoom.destroy');
      }
    );
  }
  function _destroyZoom($el){
    $($el).each(function(){
    	$(this).trigger('zoom.destroy');
     });
  }
  return Product;
})();

theme.slideshows={};
theme.SlideshowSection = (function(){
  function SlideshowSection(container){
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    var slideshow = '#ss' + sectionId;
    
    var loop = $('#ss'+sectionId).data('loop');
    var fade = $('#ss'+sectionId).data('effect');
    var autoplay = $('#ss'+sectionId).data('autoplay');
    var slswiper = new Swiper(slideshow, {
      preloadImages:false,
      lazy: true,
      loop: loop,
      slidesPerView:1,
      effect: fade,
      autoplay: autoplay,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
    theme.slideshows = slswiper;
    
    var iframes = $(slideshow).find('.embed-player');
    resizePlayer(iframes, 16/9, $(slideshow));
    $(window).on("resize", function(){
      resizePlayer(iframes, 16/9, $(slideshow));
    });
  }

    // Resize player
    function resizePlayer(iframes, ratio, slideshow){
      if (!iframes[0]) return;
      var win = $(slideshow),
          width = win.width(),
          playerWidth,
          height = win.height(),
          playerHeight,
          ratio = ratio || 16/9;

      iframes.each(function(){
        var current = $(this);
        if (width / ratio < height){
          playerWidth = Math.ceil(height * ratio);
          current.width(playerWidth).height(height).css({
            left: (width - playerWidth) / 2,
             top: 0
            });
        } else {
          playerHeight = Math.ceil(width / ratio);
          current.width(width).height(playerHeight).css({
            left: 0,
            top: (height - playerHeight) / 2
          });
        }
      });
    }
    
  return SlideshowSection;
})();

// CATEGORY SLIDER
theme.collectionView = (function(){
  function collectionView(container){
    var $container = this.$container = $(container);
    var sectionId = $container.attr('data-section-id');
    
    $(document).on('click','.flTop .flTtl',function(e){
        var thisBlk = $(this).parent('.filterBx');
      	$(".filterBx").not(thisBlk).removeAttr("open");
    });
    $(document).on('change','#SortBySt',function(e){
		var value = $(this).val();
        if (!$('#CollectionFiltersForm').length){
          href = new URL(window.location.href);
          href.searchParams.set('sort_by', value);
          window.location = href.toString();
        } else {
    		$("#SortBy").val(value).trigger('change');
        }
	});
	$(document).on('click', '.change-view', function(e){
      var view = $(this).data('view'),
          href = new URL(window.location.href);
      href.searchParams.set('pgview', view);
      href.searchParams.set('type', view);
      window.location = href.toString();
    });
    $(document).on('change', '.dyfl, .prRange, #SortBy', function(e){
      var URL =  '//'+window.location.hostname+window.location.pathname,
      	formdata = $('#CollectionFiltersForm').serialize();
        ajaxfilter(URL+'?'+formdata);
	});
  	$(document).on('click', '.removefl', function(e){
      e.preventDefault();
      var URL =  '//'+window.location.hostname+$(this).attr('href');
      ajaxfilter(URL);
	});
  
  	ajaxfilter = (function(url){
        $.ajax({
          type: 'GET',
          url: url,
          data:{},
          beforeSend:function(){
            $('body').addClass('loading hideOverly');
          },
          complete: function (data){
            $('#collectionPr').html($("#collectionPr", data.responseText).html());
            $('#CollectionFiltersForm').html($("#CollectionFiltersForm", data.responseText).html());
            $('.active-facets').html($(".active-facets", data.responseText).html());
            $('.collection-product-count').html($(".collection-product-count", data.responseText).html());
			
            if($(window).width() < 1025){$('.filterBx').attr('open','');}
            $('.pagination').html($(".pagination", data.responseText).html());
            if(!$(".pagination", data.responseText).html()){
              $('.pagination').hide();
            } else {
              $('.pagination').show();
            }
            $('.infinitpaginOuter').html($(".infinitpaginOuter", data.responseText).html());
            if(!$(".infinitpaginOuter", data.responseText).html()){
              $('.infinitpagin').remove();
            }
            if($('.prRange').length){ priceSlider(); }
            if($(".spr-badge").length > 0){
            	SPR.registerCallbacks();SPR.initRatingHandler();SPR.initDomEls();SPR.loadProducts();SPR.loadBadges();
            }
            theme.countdown();
            $('body').removeClass('loading hideOverly');
            history.pushState({page: url}, url, url);
          }
        });
    });

    infiniteScroll = function(){
      	var action = 'scroll load delayed-resize';
        $(window).on(action, function(){
          var moreURL = $('.infinitpagin a').attr('href');
          if ($('.infinitpagin a.infinite').length){
            var bottom = $('.infinitpagin').offset();
            var docTop = ($(document).scrollTop() + $(window).height() - 50);
            if( docTop > bottom.top){
              $(window).off(action);
              loadMore(moreURL);
            }
          }
        });
    }
    loadMoreBtn = function(){
		$(document).on('click', 'a.loadMore', function(e){
          	e.preventDefault();
          	var moreURL = $(this).attr('href');
			loadMore(moreURL);
        });
    }
    
    loadMore = function(moreURL){
      if (moreURL.length){
        $.ajax({
          type: 'GET',
          dataType: 'html',
          url: moreURL,
          beforeSend:function(){
          	if ($('.infinitpaginOuter').attr('data-type') == "button" ){
            	$('body').addClass('loading hideOverly');
            } else {
              $('.infinitpagin a').show();
            }
          },
          complete: function (data){
            if($('#collectionPr').length){
            	$('#collectionPr').append($("#collectionPr", data.responseText).html());
            }
            if($(".infinitpagin", data.responseText).html()){
            	$('.infinitpagin').html($(".infinitpagin", data.responseText).html());
            } else {
            	$('.infinitpagin').remove();
            }
			shopreviews();
            if (!$('.infinitpagin a.loadMore').length){
              infiniteScroll();
            }
            theme.countdown();
            $('body').removeClass('loading hideOverly');
          }
        });
      }
    }
    infiniteScroll();loadMoreBtn();
  }
  return collectionView;
})();

theme.instagramSection = (function(){
  function instagramSection(container){
    var $container = this.$container = $(container),
    	sectionId = $container.attr('data-section-id'),
        act = $container.attr('data-act'),
        limit = $container.attr('data-count'),
        autopl = $container.attr('data-autop'),
        ajaxUrl = 'https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink,thumbnail_url,caption,children&access_token='+act;
    
    $.ajax({
		url: ajaxUrl,
        type: 'GET',
        dataType: "json",
        success: function (res){
        	var data = res.data,
				igdiv = '#instafeed'+sectionId,
               	html = '',
                bl = bl || true;
			$.each(data, function (index, el){
                     if (index >= limit) return 0;
                     var img_url = el.thumbnail_url || el.media_url;
                     html += '<div class="gitem insta-img"><a rel="nofollow" class="instagram-" href="'+el.permalink+'" target="_blank"><img data-src="' + img_url + '" alt="" class="lazyload" /></a></div>';
            });
            $(igdiv).html(html);
		},
        complete: function(res){
          
        }
	});
  }
  return instagramSection;
})();

theme.quotesl={};
theme.Quotes = (function(){
  function Quotes(container){
    var $container = this.$container = $(container),
        sectionId = $container.attr('data-section-id');
        
      var fade = $('#Quotes-'+sectionId).data('effect');
      var autoplay = $('#Quotes-'+sectionId).data('autoplay');
      var swiper = new Swiper('#Quotes-' + sectionId, {
        loop: true,
        slidesPerView: 'auto',
        effect: fade,
        autoplay: autoplay,
        pagination: {
          el: ".swpg"+sectionId,
          clickable: true,
        },
        navigation: {
          nextEl: ".swn"+sectionId,
          prevEl: ".swp"+sectionId,
        },
      });
      this.quotesl = swiper;
      swiper.on('slideChange', function(data){
        $('#Quotes-'+sectionId+' .swiper-slide-duplicate .bgImg.lazyloading').addClass('lazyload');
      });
  }
  return Quotes;
})();

theme.slcarousel={};
theme.carousel = (function(){
    function carousel(container){
    	var $container = this.$container = $(container),
          sectionId = $container.attr('data-section-id'),
    	  tabs = '#' + sectionId + ' .tablink',
    	  tabcontent = '#' + sectionId + ' .tb_cnt';
    
    function loadSlider(tab){
        var optionsData = $(tab).attr('data-swiper') ? JSON.parse($(tab).attr('data-swiper')) : {};
        new Swiper(tab+' .tabswiper', optionsData);
    }
    if($('#'+sectionId+'.cltabWrap').length){ 
      var fristTab = $('.cl_tbs li:first-child a').attr('href');
      loadSlider(fristTab);
    }
    $(tabs).on('click', function(e){
        e.preventDefault();
        $(this).parent().addClass("active");
        $(this).parent().siblings().removeClass("active");
        var tab = $(this).attr("href");
        $(tabcontent).not(tab).hide();
        $(tab).show();
        setTimeout(function() {
            loadSlider(tab);
            window.dispatchEvent(new Event('resize'));
        }, 5);
    });
    if($('#swp'+sectionId).length){
      var opt = $('#swp'+sectionId).attr("data-slider-options") || '{}';
      swslider = new Swiper ('#swp'+sectionId, JSON.parse(opt));
      theme.slcarousel = swslider
    }
  }
  return carousel;
})();

theme.masonary = (function(){
    function masonary(container){
    	var $container = this.$container = $(container),
          sectionId = $container.attr('data-section-id'),
          masonary = this.masonary = $($container).find('.grid-masonary');
    
      loadMasonary(masonary);
      setTimeout( function(){ loadMasonary(masonary); },1000);
      function loadMasonary(masonary){
        $(masonary).masonry({
            columnWidth: '.grid-sizer-'+sectionId,
            itemSelector: '.msitem',
            percentPosition: true
        });
      }
  }
  return masonary;
})();

theme.ajaxCart = function(){
	$(".modalOverly").click(function(){
        $(".modal").fadeOut(200);
    	$("body").removeClass("loading showOverly");
    });
    
    $('body').on('click','.quick-view,.quickShop',function(e){
        e.preventDefault();
        $.ajax({
          beforeSend : function (){
            $('body').addClass("loading");
           },
          url: $(this).attr('href'),
          success: function(data){
            $.magnificPopup.open({
              items:{
                src: data,
                type: 'inline'
              },
              removalDelay:500,
              callbacks:{
                beforeOpen: function(){
                 $('.sticky_hdr').addClass('popup');
                  this.st.mainClass = 'mfp-zoom-in';
                },
                open: function(data){},
                close: function(){
                   $('.sticky_hdr').removeClass('popup');
                  $( '#quickv_pp' ).empty();
                }
              },
            });
          },
          complete: function(){
            $('body').removeClass("loading");
          }
        })
    });
    
    $(document).on('click','.quickShop', function(e){
        $('.ctdrawer').addClass('poptop');
    });
    
    
    $(document).on('click','.add-to-cart', function(e){
        e.preventDefault();
        $('body').addClass('loading');
        $(this).next().find('.cartBtn').trigger('click');
    });
    
    $(document).on('click', '.addto-wishlist', function(e){
         e.preventDefault();
           var id = $(this).attr('rel');
           if (localStorage.getItem('wishlist') == null){
             var str = id;
           } else {
             if(localStorage.getItem('wishlist').indexOf(id) == -1) {
               var str = localStorage.wishlist + '+' + id;
                  str = str.replace('++', '+');
             }
           }
           localStorage.setItem('wishlist', str);
           $(this).find(".at-icon").addClass('at-flip');
           setTimeout(function(){
             $('.wishlist[rel="'+id+'"]').removeClass('addto-wishlist').find('span').text(theme.wlAvailable);
             $('.wishlist[rel="'+id+'"] .at-icon').removeClass('at-flip').addClass('added');
           }, 1500);
    });
    if(localStorage.getItem('wishlist') != null && localStorage.getItem('wishlist') != '+'){
       var str = String(localStorage.getItem('wishlist')).split("+");
       for (var i=0; i<str.length; i++) {
         if (str[i] != ''){
           $('.wishlist[rel="'+str[i]+'"]').removeClass('addto-wishlist').find('span').text(theme.wlAvailable);
           $('.wishlist[rel="'+str[i]+'"] .at-icon').addClass('added');
           $('.favCount').text(i).removeClass('hide');
         }
       }
    }
};
window.addEventListener('DOMContentLoaded',function(){$(theme.ajaxCart);});

$(document).ready(function(){
  var sections = new theme.Sections();
  sections.register('header', theme.HeaderSection);
  sections.register('product', theme.Product);
  sections.register('collection-template', theme.collectionView);
  sections.register('slideshow', theme.SlideshowSection);
  sections.register('carousel', theme.carousel );
  sections.register('quotes', theme.Quotes);
  sections.register('masonary', theme.masonary);
  sections.register('instagram', theme.instagramSection);
});

var resizeTimer;
  $(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      $(window).trigger('delayed-resize');
    }, 250);
});

theme.countdown = function(){
    $(".saleTime, .atCounter").each(function(){
        var $this = $(this), date = $(this).data('date'), countDownDate = new Date(date).getTime();
        var x = setInterval(function(){
            var now = new Date().getTime(),	            
                distance = countDownDate - now,
                days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if(days > 99){
                days = ("00" + days).substr(-3);
            } else {
                days = ("00" + days).substr(-2);
            }
            hours = ("00" + hours).substr(-2);
            minutes = ("00" + minutes).substr(-2);
            seconds = ("00" + seconds).substr(-2);

            $($this).find(".days").html(days);
            $($this).find(".hours").html(hours);
            $($this).find(".minutes").html(minutes);
            $($this).find(".seconds").html(seconds);
            if (distance < 0){clearInterval(x); $($this).hide().parents('.timerl').hide(); }
        }, 1000);
      });
}

theme.init = function() {
  slate.rte.wrapTable();
  slate.rte.iframeReset();
  theme.countdown();

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(e) {
    slate.a11y.pageLinkFocus($(e.currentTarget.hash));
  });

  $('a[href="#"]').on('click',function(e){e.preventDefault()});
  
  // Currency and Language
  	$(document).on('click', '.crlgTtl', function(i){
      i.preventDefault();
      $(this).next().slideToggle();
    });
    $(document).on('click', '.clOtp', function(i){
      var form = $(this).parents('form');
      $(form).find('.slcrlg').val($(this).data('value'));
      $(form).submit();
    });
  	$("#currencies li").click(function(){      
      	if($(window).width()>999) { $("#currencies").slideUp(); }
	});
};
$(theme.init);

$(document).ready(function() {
    "use strict";
  	$(document).on('click', '.currencyOpt', function(i){
      $('#CurrencySelector').val($(this).data('value'));
      $('#localization_form').submit();
    });

   // LOOKBOOK SHOP 
	$('.btn-shop').click(function(){
       $('.btn-shop').not($(this)).removeClass('active');
       $('.products .lb_shop, .grid-lookbook').not($(this).next()).removeClass('active');
       $(this).parents('.grid-lookbook').addClass('active');
       $(this).toggleClass('active');
       $(this).next().toggleClass('active');      
	});	

	// SHOW HIDE PRODUCT Filters
  	$(document).on('click','.btn-filter,.mbtFilter',function(e){
    	$('html').toggleClass("showOverly stopScroll").find(".sb_filter").toggleClass("active");
      	$(".sb_filter").removeClass('flTop');
      	if(!$('.filterBx[open]').length){ $('.filterBx').attr('open',''); }
	});
	$(document).on('click','.closeFilter',function(){
		$('html').removeClass("showOverly stopScroll").find(".sb_filter").removeClass("active");
	});

  
  // STICKY HEADER
    var lastScroll = 0,
        hdpos = $('.hdr_wrap').offset(),
        headht = $('.hdr_wrap').innerHeight(),
        didScroll;
    function sticky_header(){
        var scroll = $(window).scrollTop();
        if(theme.stickyHeader == 'top'){
          if (scroll > headht && scroll > lastScroll) {
              $('.hdr_wrap').removeClass("sticky_hdr fadeInDown");
          } else if (scroll <= headht) {
              $('.hdr_wrap').removeClass("sticky_hdr fadeInDown");
          } else if (scroll < lastScroll) {
              $('.hdr_wrap').addClass("sticky_hdr animated fadeInDown");
          }
          lastScroll = scroll;
        } else if(theme.stickyHeader == 'always') {
            if(scroll > hdpos.top){
                $('.hdr_wrap').addClass("sticky_hdr");
            } else{
                $('.hdr_wrap').removeClass("sticky_hdr");
            }
        }
    }

  window.onscroll = function(){ scrollFunction() };
  function scrollFunction(){
      didScroll = true;
      setInterval(function(){
          if(didScroll){sticky_header();didScroll = false;}
      }, 250);

    /// sticky cart 
    if($(window).scrollTop()>600 && $(".stickyCart").length){
      	$("body.template-product").css('padding-bottom','70px');
        $(".stickyCart").slideDown();
    } else {
      	$("body.template-product").css('padding-bottom','0');
        $(".stickyCart").slideUp();
    }

    // SITE SCROLLER
    if($(window).scrollTop()>200){
      $("#scroll_top").addClass("active");
    } else {
      $("#scroll_top").removeClass("active");
    }
  }
  
  $("#scroll_top").on("click", function(){
    $("html,body").animate({ scrollTop: 0 }, 500);
    return false;
  });
  
  //Footer links for mobiles
  $(".f_links .h4").click(function() {
    if($(window).width() < 769){
      $(this).toggleClass("active");
      $(this).next().slideToggle();
  	}
  });
  $(".cartOpen").on("click", function(e){
    e.preventDefault();
    $('body').addClass('overflow-hidden').find('.ctdrawer').addClass('active');
  });
  
  $(document).on('click', '.grswatches li:not(.noImg)', function(e){
      var $this = $(this),
          newImage = $(this).attr('rel'),
          gridWrapper = $(this).parents('.grid_bx').find('.grid_img_wr');
      $(gridWrapper).addClass("showLoading");
      $(gridWrapper).find('.variantImg').css("background-image", "url('"+newImage+"')");
      var image = document.createElement('img');
          image.src = newImage;
          image.onload = function () {
              $(gridWrapper).removeClass("showLoading").addClass("showVariantImg");
              $this.siblings().removeClass("active");
              $this.addClass("active");
          };
      return false;
    });
    $(document).on('click', '.grswatches li.numb', function(e){
      $(this).parents('.grswatches').find('.hide').removeClass('hide');
      $(this).addClass('hide');
    });

    // Magnific Popup
    $('.mfp-link').magnificPopup({
      delegate: '.mfp',
  	  removalDelay: 300, 
      callbacks: {
        beforeOpen: function(){
          $('.stickyHeader').addClass('popup');
           this.st.mainClass = this.st.el.attr('data-effect');
        },       
      	close:function(){ $('.stickyHeader').removeClass('popup'); }
      },
  	 midClick: true 
	});
});


function htmlDecode(input){
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
function freeShippMsg(){
    if (document.querySelector('.freeShipMsg')){
        fetch(window.routes.url+'/?section_id=cart-drawer').then((response) => response.text()).then((responseText) => {
            var html = new DOMParser().parseFromString(responseText, 'text/html')
            var destination = document.querySelector('.freeShipMsg');
            var source = html.querySelector('.ctfreeship');
            if (source && destination) destination.innerHTML = source.innerHTML;
            if (theme.mlcurrency){ currenciesChange(".freeShipMsg span.money"); }
        });
    }
}
freeShippMsg();
function shopreviews(){
    if ($('.spr-badge').length){
        SPR.registerCallbacks();
        SPR.initRatingHandler();
        SPR.initDomEls();
        SPR.loadProducts();
        SPR.loadBadges();
    }
}