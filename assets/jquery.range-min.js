! function (t, i, s, o) {
  "use strict";
  var e = function () {
    return this.init.apply(this, arguments)
  };
  e.prototype = {
    defaults: {
      onstatechange: function () {},
      ondragend: function () {},
      onbarclicked: function () {},
      isRange: !1,
      showLabels: !0,
      showScale: !0,
      step: 1,
      format: "%s",
      theme: "theme-green",
      width: 300,
      disable: !1,
      snap: !1
    },
    template: '<div class="slider-container">\t\t\t<div class="back-bar"><div class="selected-bar"></div><div class="pointer low"></div><div class="pointer high"></div></div><div class="scale fl f-jcsb"></div><div class="fl range-val"><div class="pointer-label low mr10">123456</div> - <div class="pointer-label high ml10">456789</div></div>\t\t</div>',
    init: function (i, s) {
      this.options = t.extend({}, this.defaults, s), this.inputNode = t(i), this.options.value = this.inputNode.val() || (this.options.isRange ? this.options.from + "," + this.options.from : "" + this.options.from), this.domNode = t(this.template), this.domNode.addClass(this.options.theme), this.inputNode.after(this.domNode), this.domNode.on("change", this.onChange), this.pointers = t(".pointer", this.domNode), this.lowPointer = this.pointers.first(), this.highPointer = this.pointers.last(), this.labels = t(".pointer-label", this.domNode), this.lowLabel = this.labels.first(), this.highLabel = this.labels.last(), this.scale = t(".scale", this.domNode), this.bar = t(".selected-bar", this.domNode), this.clickableBar = this.domNode.find(".clickable-dummy"), this.interval = this.options.to - this.options.from, this.render()
    },
    render: function () {
      0 !== this.inputNode.width() || this.options.width ? (this.options.width = this.options.width || this.inputNode.width(), this.domNode.width(this.options.width), this.inputNode.hide(), this.isSingle() && (this.lowPointer.hide(), this.lowLabel.hide()), this.options.showLabels || this.labels.hide(), this.attachEvents(), this.options.showScale && this.renderScale(), this.setValue(this.options.value)) : console.log("jRange : no width found, returning")
    },
    isSingle: function () {
      return "number" == typeof this.options.value || -1 === this.options.value.indexOf(",") && !this.options.isRange
    },
    attachEvents: function () {
      this.clickableBar.click(t.proxy(this.barClicked, this)), this.pointers.on("mousedown touchstart", t.proxy(this.onDragStart, this)), this.pointers.bind("dragstart", function (t) {
        t.preventDefault()
      })
    },
    onDragStart: function (i) {
      if (!(this.options.disable || "mousedown" === i.type && 1 !== i.which)) {
        i.stopPropagation(), i.preventDefault();
        var o = t(i.target);
        this.pointers.removeClass("last-active"), o.addClass("focused last-active"), this[(o.hasClass("low") ? "low" : "high") + "Label"].addClass("focused"), t(s).on("mousemove.slider touchmove.slider", t.proxy(this.onDrag, this, o)), t(s).on("mouseup.slider touchend.slider touchcancel.slider", t.proxy(this.onDragEnd, this))
      }
    },
    onDrag: function (t, i) {
      i.stopPropagation(), i.preventDefault(), i.originalEvent.touches && i.originalEvent.touches.length ? i = i.originalEvent.touches[0] : i.originalEvent.changedTouches && i.originalEvent.changedTouches.length && (i = i.originalEvent.changedTouches[0]);
      var s = i.clientX - this.domNode.offset().left;
      this.domNode.trigger("change", [this, t, s])
    },
    onDragEnd: function (i) {
      this.pointers.removeClass("focused").trigger("rangeslideend"), this.labels.removeClass("focused"), t(s).off(".slider"), this.options.ondragend.call(this, this.options.value)
    },
    barClicked: function (t) {
      if (!this.options.disable) {
        var i = t.pageX - this.clickableBar.offset().left;
        if (this.isSingle()) this.setPosition(this.pointers.last(), i, !0, !0);
        else {
          var s, o = Math.abs(parseFloat(this.pointers.first().css("left"), 10)),
            e = this.pointers.first().width() / 2,
            n = Math.abs(parseFloat(this.pointers.last().css("left"), 10)),
            a = this.pointers.first().width() / 2,
            h = Math.abs(o - i + e),
            l = Math.abs(n - i + a);
          s = h == l ? i < o ? this.pointers.first() : this.pointers.last() : h < l ? this.pointers.first() : this.pointers.last(), this.setPosition(s, i, !0, !0)
        }
        this.options.onbarclicked.call(this, this.options.value)
      }
    },
    onChange: function (t, i, s, o) {
      var e, n;
      e = 0, n = i.domNode.width(), i.isSingle() || (e = s.hasClass("high") ? parseFloat(i.lowPointer.css("left")) + i.lowPointer.width() / 2 : 0, n = s.hasClass("low") ? parseFloat(i.highPointer.css("left")) + i.highPointer.width() / 2 : i.domNode.width());
      var a = Math.min(Math.max(o, e), n);
      i.setPosition(s, a, !0)
    },
    setPosition: function (t, i, s, o) {
      var e, n = parseFloat(this.lowPointer.css("left")),
        a = parseFloat(this.highPointer.css("left")) || 0,
        h = this.highPointer.width() / 2;
      if (s || (i = this.prcToPx(i)), this.options.snap) {
        var l = this.correctPositionForSnap(i);
        if (-1 === l) return;
        i = l
      }
      t[0] === this.highPointer[0] ? a = Math.round(i - h) : n = Math.round(i - h), t[o ? "animate" : "css"]({
        left: Math.round(i - h)
      }), this.isSingle() ? e = 0 : e = n + h;
      var r = Math.round(a + h - e);
      this.bar[o ? "animate" : "css"]({
        width: Math.abs(r),
        left: r > 0 ? e : e + r
      }), this.showPointerValue(t, i, o), this.isReadonly()
    },
    correctPositionForSnap: function (t) {
      var i = this.positionToValue(t) - this.options.from,
        s = this.options.width / (this.interval / this.options.step),
        o = i / this.options.step * s;
      return t <= o + s / 2 && t >= o - s / 2 ? o : -1
    },
    setValue: function (t) {
      var i = t.toString().split(",");
      i[0] = Math.min(Math.max(i[0], this.options.from), this.options.to) + "", i.length > 1 && (i[1] = Math.min(Math.max(i[1], this.options.from), this.options.to) + ""), this.options.value = t;
      var s = this.valuesToPrc(2 === i.length ? i : [0, i[0]]);
      this.isSingle() ? this.setPosition(this.highPointer, s[1]) : (this.setPosition(this.lowPointer, s[0]), this.setPosition(this.highPointer, s[1]))
    },
    renderScale: function () {
      for (var t = this.options.scale || [this.options.from, this.options.to], i = (Math.round(100 / (t.length - 1) * 10), ""), s = 0; s < t.length; s++) i += "<span>" + ("|" != t[s] ? "<ins>" + t[s] + "</ins>" : "") + "</span>";
      this.scale.html(i)
    },
    getBarWidth: function () {
      var t = this.options.value.split(",");
      return t.length > 1 ? parseFloat(t[1]) - parseFloat(t[0]) : parseFloat(t[0])
    },
    showPointerValue: function (i, s, o) {
      var e, n = t(".pointer-label", this.domNode)[i.hasClass("low") ? "first" : "last"](),
        a = this.positionToValue(s);
      if (t.isFunction(this.options.format)) {
        var h = this.isSingle() ? void 0 : i.hasClass("low") ? "low" : "high";
        e = this.options.format(a, h)
      } else e = this.options.format.replace("%s", a);
      var l = n.html(e).width(),
        r = s - l / 2;
      r = Math.min(Math.max(r, 0), this.options.width - l), n[o ? "animate" : "css"]({
        left: r
      }), this.setInputValue(i, a)
    },
    valuesToPrc: function (t) {
      return [100 * (parseFloat(t[0]) - parseFloat(this.options.from)) / this.interval, 100 * (parseFloat(t[1]) - parseFloat(this.options.from)) / this.interval]
    },
    prcToPx: function (t) {
      return this.domNode.width() * t / 100
    },
    isDecimal: function () {
      return -1 !== (this.options.value + this.options.from + this.options.to).indexOf(".")
    },
    positionToValue: function (t) {
      var i = t / this.domNode.width() * this.interval;
      if (i = parseFloat(i, 10) + parseFloat(this.options.from, 10), this.isDecimal()) {
        var s = Math.round(Math.round(i / this.options.step) * this.options.step * 100) / 100;
        if (0 !== s)
          for (-1 === (s = "" + s).indexOf(".") && (s += "."); s.length - s.indexOf(".") < 3;) s += "0";
        else s = "0.00";
        return s
      }
      return Math.round(i / this.options.step) * this.options.step
    },
    setInputValue: function (t, i) {
      if (this.isSingle()) this.options.value = i.toString();
      else {
        var s = this.options.value.split(",");
        t.hasClass("low") ? this.options.value = i + "," + s[1] : this.options.value = s[0] + "," + i
      }
      this.inputNode.val() !== this.options.value && (this.inputNode.val(this.options.value).trigger("change"), this.options.onstatechange.call(this, this.options.value))
    },
    getValue: function () {
      return this.options.value
    },
    getOptions: function () {
      return this.options
    },
    getRange: function () {
      return this.options.from + "," + this.options.to
    },
    isReadonly: function () {
      this.domNode.toggleClass("slider-readonly", this.options.disable)
    },
    disable: function () {
      this.options.disable = !0, this.isReadonly()
    },
    enable: function () {
      this.options.disable = !1, this.isReadonly()
    },
    toggleDisable: function () {
      this.options.disable = !this.options.disable, this.isReadonly()
    },
    updateRange: function (t, i) {
      var s = t.toString().split(",");
      this.interval = parseInt(s[1]) - parseInt(s[0]), i ? this.setValue(i) : this.setValue(this.getValue())
    }
  };
  t.fn.jRange = function (s) {
    var o, n = arguments;
    return this.each(function () {
      var a = t(this),
        h = t.data(this, "plugin_jRange"),
        l = "object" == typeof s && s;
      h || (a.data("plugin_jRange", h = new e(this, l)), t(i).resize(function () {
        var t = h.domNode.parent().width();
        h.options.width = t, h.render(), h.setValue(h.getValue())
      })), "string" == typeof s && (o = h[s].apply(h, Array.prototype.slice.call(n, 1)))
    }), o || this
  }
}(jQuery, window, document);
