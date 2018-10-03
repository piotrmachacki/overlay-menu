(function($) {

	$(function() {
		
		var $hamburger = $('.hamburger');
		var $items = $('.menu-sidebar ul li.item');
		var $links = $items.find('a');
		var $bricks = $('.brick-wrap .brick');
		var $elements = $('.menu-content .element');
		var $bottomLink = $('.menu-bottom a');
		var $searchButton = $('.search-wrap > button');
		var $searchBox = $('.search-wrap form .form-group');

		$searchButton.on('click', function(e) {
			e.preventDefault();
			$searchBox.toggleClass('active');
		});

		$bottomLink.on('click', function(e) {
			e.preventDefault();
			$links.filter('[href="#contact"]').trigger('click');
		});

		$hamburger.on('click', function() {

			$hamburger.toggleClass('hamburger--squeeze js-hamburger is-active');
			$('#overlay-nav-container').toggleClass('active');
			
			if($hamburger.hasClass('is-active')) {
				if($items.length) {
					var i = 0;
					var animateElement = function(el) {
						i++;
						if(el.length) {
							setTimeout(function() {
								$(el).addClass('show');
								if($hamburger.hasClass('is-active')) animateElement($items.eq(i));
								if(i == ($items.length+1)) $items.eq(0).find('a').trigger('click');
							}, 200);
						}
					}
					animateElement($items.eq(i));
				}
			} else {
				$elements.removeClass('active');
				$links.removeClass('active');
				$bricks.removeClass('active');
				$items.removeClass('show');
			}

		});

		function attachClick(collection) {
			collection.on('click', function(e) {
				e.preventDefault();
				collection.removeClass('active');
				$(this).addClass('active');
				var id = $(this).attr('href');
				$elements.removeClass('active').filter(id).addClass('active');
			});
		}

		attachClick($links);
		attachClick($bricks);

	});

})(jQuery)