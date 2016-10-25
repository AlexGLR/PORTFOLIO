(function($) {
    // Calling of the navigation plugin;
    $('.home__menu a').pageNav({
        'active_item': 'menu__active'
    });
    // Carosel settings;
    $('.owl-carousel').owlCarousel({
        loop: true,
        items: 1,
        autoplay: true,
        autoplayTimeout: 5000
    });
    /*calling of lightbox plugin */
    $('a[data-rel^=lightcase]').lightcase();
    // Accordion settings;
    var allPanels = $('.news__accordion > .news__accordion__text').hide();
    var orange = $('.accordion__title > a');

    $('.news__accordion > .accordion__title > a').click(function() {
        $this = $(this);
        $target = $this.parent().next();

        if (!$target.hasClass('active')) {
            orange.removeClass('toggle');
            allPanels.removeClass('active').slideUp();
            $target.addClass('active').slideDown();
            $this.addClass('toggle');

        }

        return false;
    });

})(jQuery);