theme.SlideshowSection.prototype = _.assignIn({}, theme.SlideshowSection.prototype,{
  onUnload: function(){
    delete theme.slideshows[this.slideshow];
  },
  onBlockSelect: function(evt){
    var $slide = $('#' + evt.detail.blockId).index();
    if(theme.slideshows != ''){
        theme.slideshows.slideTo($slide);
        theme.slideshows.autoplay.stop();
    }
  },
  onBlockDeselect: function(){
    if(theme.slideshows != ''){
        theme.slideshows.autoplay.start();
    }
  }
});

theme.Quotes.prototype = _.assignIn({}, theme.Quotes.prototype,{
  onUnload: function(){
    delete theme.quotesl[this.quotesl];
  },
  onSelect: function(evt){
    var $slide = $('#' + evt.detail.blockId).index();
    this.quotesl.slideTo($slide);
  },
  onBlockSelect: function(evt){
    var $slide = $('#' + evt.detail.blockId).index();
    if(this.quotesl != ''){
        this.quotesl.slideTo($slide);
    }
  },
  onBlockDeselect: function(evt){
  }
});
theme.Product.prototype = _.assignIn({}, theme.Product.prototype,{
  onUnload: function(evt){
    productMedia(evt.detail.sectionId)
  },
  onSectionLoad: function(evt){
      productMedia(evt.detail.sectionId)
  },
  onSelect: function(evt){
    productMedia(evt.detail.sectionId)
  },
  onBlockSelect: function(evt){
    if (theme.mlcurrency){ currenciesChange(".priceSingle span.money"); }
  },
  onBlockDeselect:function(){
    if (theme.mlcurrency){ currenciesChange(".priceSingle span.money"); }
  }
});
function productMedia(mediaId){
    const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${mediaId}"]`),
          crmedia = $(mediaGalleries).data('targt');
    mediaGalleries.forEach((mediaGallery) =>
      mediaGallery.setActiveMedia(crmedia)
    );
};
theme.carousel.prototype = _.assignIn({}, theme.carousel.prototype,{
  onUnload: function(){
    
  },
  onSectionLoad: function(evt) {
  },
  onSelect: function(evt){
      var $slide = $('#' + evt.detail.blockId).index();
      if($('#'+evt.detail.blockId).length)theme.slcarousel.slideTo($slide);
      
      if(evt.detail.sectionId == 'exit-intent-popup'){
          $('.exitprPopup').addClass('actSec');
      }
  },
  onDeselect: function(evt){
    $('#shopify-section-'+evt.detail.sectionId).removeClass('actSec');
  },
  onBlockSelect: function(evt){
    var $slide = $('#' + evt.detail.blockId).index();
    theme.slcarousel.slideTo($slide);
  },
  onBlockDeselect: function(){

  }
});

theme.productTabs = (function(){
    function productTabs(container){
    	var $container = this.$container = $(container),
          sectionId = $container.attr('data-section-id');
    $('#PrSecTabs .product-tabs li:first-child').addClass("active");  
	$('#PrSecTabs .tbs_wrp .tb_cnt:first-child').show();      
  }
  return productTabs;
})();

$(document).ready(function(){
  var sections = new theme.Sections();
  sections.register('productTabs', theme.productTabs);
});

theme.HeaderSection.prototype = _.assignIn({}, theme.HeaderSection.prototype,{
  onUnload: function(){
    
  },
  onBlockSelect: function(evt){
    console.log(evt.detail.blockId);
    $('#mm'+evt.detail.blockId).addClass('active');
  },
  onBlockDeselect: function(){
    $('#mm'+evt.detail.blockId).removeClass('active');
  }
});