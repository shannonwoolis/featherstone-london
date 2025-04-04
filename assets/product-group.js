if (!customElements.get('product-group')) {
  customElements.define('product-group', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('.grpVr').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cart = document.querySelector('cart-drawer');
      this.submitButton = this.querySelector('.product-form__submit');
      if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

      this.handleErrorMessage();

      this.submitButton.setAttribute('aria-disabled', true);
      this.submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
      }
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);

            const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
            if (!soldOutMessage) return;
            this.submitButton.setAttribute('aria-disabled', true);
            this.submitButton.querySelector('span').classList.add('hidden');
            soldOutMessage.classList.remove('hidden');
            this.error = true;
            return;
          } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
          }

          this.error = false;
          this.cart.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.submitButton.classList.remove('loading');
          if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
          if (!this.error) this.submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          freeShippMsg();
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.pform-error-wrap');
      if (!this.errorMessageWrapper) return;
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.pform-error-msg');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

ajaxFbt = function(){
    var tt_price = $('.gPrice'),
        price_old;

    $('.grpVr').off('mousedown click').on('mousedown click', function(e){
        /* Store the current value on focus and on change */
        var _this = $(this),
            optCked = _this.find('option:checked');
            price_old = optCked.data('price');
    }).on('change', function(e){
        var _this = $(this),
            fbtCol = _this.closest('.group-prod'),
            fbtPrice = fbtCol.find('.price'),
            optCked = _this.find('option:checked'),
            price = optCked.data('price'),
            img = optCked.data('img');

        if(img != undefined){$(fbtCol).find('.grid_img').css("background-image", "url(" + img + ")")}
        var b = price_old - price;
        fbtPrice.html(theme.Currency.formatMoney(price, theme.moneyFormat));
        tt_update(b,false);
    });
    function fbt_update(fbtVr,bl){
        var optCked = fbtVr.find('option:checked'),
            price = optCked.attr('data-price');
            tt_update(price,bl);
    };
    function tt_update(price,bl){
        if (bl) {
            var price = parseInt(tt_price.attr('data-pr')) + parseInt(price);
        } else {
            var price = parseInt(tt_price.attr('data-pr')) - parseInt(price);
        }
        tt_price.attr('data-pr',price);
        tt_price.html(theme.Currency.formatMoney(price, theme.moneyFormat));
    };
};
ajaxFbt();