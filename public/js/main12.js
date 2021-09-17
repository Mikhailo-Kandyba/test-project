
$(document).ready(function () {
	var w = $(window).outerWidth();
	var h = $(window).outerHeight();
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
	function isIE() {
		ua = navigator.userAgent;
		var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
		return is_ie;
	}
	if (isIE()) {
		$('body').addClass('ie');
	}
	if (isMobile.any()) {
		$('body').addClass('touch');
	}

	let lang = $('#lang').val();
	if (lang == '') {
		lang = "ru";
	}
	let city_id = $('#city_id').val();
	let city_url = $('#city_url').val();
	if (city_id == '') {
		//Киев по умолчанию
		city_id = "29586";
	}
	if (city_url == '') {
		//Киев по умолчанию
		city_url = "kyiv";
	}

	let domain = 'https://www.country.ua';

	//Запрос города
	function get_city(city) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_select_main_region',
				all: 1,
				lang: lang,
				city: city
			}
		});
	}

	//Запрос типа недвижимости
	function get_type(city_id, action_type, lang, main) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_get_object_type',
				city_id: city_id,
				action_type: action_type,
				lang: lang,
				main: main
			}
		});
	}

	//Запрос типа локации
	function get_location_type(city_id, in_base, limit, a_type, o_type, lang, type) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_get_location',
				type: type,
				city_id: city_id,
				a_type: a_type,
				o_type: o_type,
				limit: 0,
				lang: lang
			}
		});
	}

	//Запрос локации
	function get_locations(city_id, in_base, limit, a_type, o_type, lang, name) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_get_location',
				city_id: city_id,
				in_base: in_base,
				a_type: a_type,
				o_type: o_type,
				limit: limit,
				lang: lang,
				name: name
			}
		});
	}

	//Отправка формы "Нужна помощь в подборе лучших предложений?"
	function send_subscribe(form) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_zayavka',
				name: form.find('.name__value').val(),
				phone: form.find('.phone__value').val(),
				lang: lang
			}
		});
	}
	//Отправка формы "Обратная связь"
	function send_ask(form) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'c4_contactSend',
				url: form.find('.url__value').val(),
				id: form.find('.id__value').val(),
				message: form.find('.message__value').val(),
				email: form.find('.email__value').val(),
				name: form.find('.name__value').val(),
				phone: form.find('.phone__value').val(),
				lang: lang
			}
		});
	}
	//Отправка формы "Отправить жалобу"
	function send_report(form) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'c4_sendJaloba',
				user_id: form.find('.user__value').val(),
				url: form.find('.url__value').val(),
				id: form.find('.id__value').val(),
				problem: form.find('.form__option.active').find('input').val(),
				text: form.find('.message__value').val(),
				email: form.find('.email__value').val(),
				name: form.find('.name__value').val(),
				phone: form.find('.phone__value').val(),
				lang: lang
			}
		});
	}

	//В избранное
	function set_favorite(id) {
		let f_count = parseInt($('.top-header__favorite span').text());
		$.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_note',
				id: id
			}
		}).done(function () {

		});
		if (!f_count) {
			$('.top-header__favorite,.body-header__favorite').append('<span></span>');
			f_count = 0;
		}
		f_count++;
		$('.top-header__favorite span,.body-header__favorite span').text(f_count);
	}

	//Отмена избранное
	function not_favorite(id) {
		let f_count = parseInt($('.top-header__favorite span').text());
		$.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_unnote',
				id: id
			}
		}).done(function () {

		});
		if (!f_count) {
			$('.top-header__favorite,.body-header__favorite').append('<span></span>');
			f_count = 0;
		}
		if (f_count > 0) {
			f_count--;
		}
		$('.top-header__favorite span,.body-header__favorite span').text(f_count);
		if (f_count == 0) {
			$('.top-header__favorite span,.body-header__favorite span').remove();
		}
	}


	//Показать номер
	function set_showphone(id) {
		$.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_clickphone',
				id: id
			}
		}).done(function () {

		});
	}


	//Формы авторизации

	// SMS
	function send_sms(form) {
		let phone = clear_phone(form.find('.js-sms_phone').val());
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_sms_login',
				sms_phone: phone,
				lang: lang
			}
		});
	}
	// SMS code
	function send_code(form) {
		let phone = clear_phone(form.parents('.js-auth').find('.js-sms_phone').val());
		let code = form.find('.js-sms_code').val();
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_sent_login_code',
				code: code,
				sms_phone: phone,
				lang: lang
			}
		});
	}
	// Login by email
	function send_loginbyemail(form) {
		let login = clear_phone(form.find('.js-email_value').val());
		let pass = form.find('.js-email_pass').val();
		let remember = form.find('.js-email_remember').prop('checked');
		if (remember == true) {
			remember = 1;
		} else {
			remember = 0;
		}
		return $.ajax({
			url: domain + '/forms.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'c4_login_pass',
				login: login,
				pass: pass,
				remember: remember,
				lang: lang
			}
		});
	}

	// Lost
	function send_lost(form) {
		let rem_data = clear_phone(form.find('.input').val());
		return $.ajax({
			url: domain + '/forms.php',
			type: 'GET',
			dataType: 'json',
			data: {
				a: 'c4_rempass',
				rem_data: rem_data,
				lang: lang
			}
		});
	}

	// check_in_base
	function check_in_base(type, val) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'get',
			dataType: 'json',
			data: {
				a: type,
				email: val,
				phone: val,
				lang: lang
			}
		});
	}

	// confirm email
	function confirm_email(el) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'get',
			dataType: 'json',
			data: {
				a: 'c4_ConfirmEmail',
				lang: lang
			}
		});
	}
	// confirm phone
	function confirm_phone(el) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'get',
			dataType: 'json',
			data: {
				a: 'c4_ConfirmPhone',
				lang: lang
			}
		});
	}

	function send_confirm_sms(code) {
		return $.ajax({
			url: domain + '/forms.php',
			type: 'get',
			dataType: 'json',
			data: {
				a: 'c4_ConfirmCode',
				code: code,
				lang: lang
			}
		});
	}


	// account
	function send_account(form) {
		let up_user_type = form.find('*[name="up_user_type"]').val();
		let fn_fio = form.find('*[name="fn_fio"]').val();
		let fn_agency_name = form.find('*[name="fn_agency_name"]').val();
		let fn_email = form.find('*[name="fn_email"]').val();
		let show_email = 0;
		if (form.find('*[name="show_email"]').prop('checked') == true) {
			show_email = 1;
		}
		let mailer = 0;
		if (form.find('*[name="mailer"]').prop('checked') == true) {
			mailer = 1;
		}
		let fn_phone = clear_phone(form.find('*[name="fn_phone"]').val());
		let fn_phone2 = clear_phone(form.find('*[name="fn_phone2"]').val());
		let fn_phone3 = clear_phone(form.find('*[name="fn_phone3"]').val());
		let fn_viber = clear_phone(form.find('*[name="fn_viber"]').val());
		let fn_www = form.find('*[name="fn_www"]').val();
		let fn_about = form.find('*[name="fn_about"]').val();
		let fn_obl = form.find('*[name="fn_obl"]').val();
		/*
		let spec = [];
		for (let index = 0; index < 7; index++) {
			if (form.find('*[name="spec[' + index + ']"]').prop('checked') == true) {
				spec[index] = 1;
			} else {
				spec[index] = 0;
			}
		}
		*/
		let noindex = 0;
		if (form.find('*[name="noindex"]').prop('checked') == true) {
			noindex = 1;
		}
		let is_normalizeimg = 0;
		if (form.find('*[name="is_normalizeimg"]').prop('checked') == true) {
			is_normalizeimg = 1;
		}
		let comp_email = form.find('*[name="comp_email"]').val();

		return $.ajax({
			url: domain + '/forms_data.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'UserProfile',
				up_user_type: up_user_type,
				fn_fio: fn_fio,
				fn_agency_name: fn_agency_name,
				fn_email: fn_email,
				show_email: show_email,
				mailer: mailer,
				fn_phone: fn_phone,
				fn_phone2: fn_phone2,
				fn_phone3: fn_phone3,
				fn_viber: fn_viber,
				fn_www: fn_www,
				fn_about: fn_about,
				fn_obl: fn_obl,
				//spec: spec,
				noindex: noindex,
				is_normalizeimg: is_normalizeimg,
				comp_email: comp_email,
				lang: lang
			}
		});
	}

	// account xml
	function send_account_xml(form) {
		//ruslans
		//let p_is_fid;
		//if (form.find('*[name="p_is_fid"]').prop('checked') == true) {
		//	p_is_fid = 1;
		//}
		let p_fid = form.find('*[name="p_fid"]').val();
		let p_contact_in_fid = form.find('*[name="p_contact_in_fid"]').val();
		let p_is_fid = form.find('*[name="p_is_fid"]').val();
		return $.ajax({
			url: domain + '/forms_data.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'UserXML',
				p_is_fid: p_is_fid,
				p_fid: p_fid,
				p_contact_in_fid: p_contact_in_fid,
				lang: lang
			}
		});
	}

	// upload photo
	function upload_photo(formdata) {
		return $.ajax({
			url: domain + '/forms_files.php?a=SaveAvatar',
			type: 'POST',
			dataType: 'json',
			data: formdata,
			processData: false,
			contentType: false,
			lang: lang
		});
	}

	// save edit photo
	function save_photo(form) {
		let img = $('#target').attr('src');
		let x1 = $('#x1').val();
		let x2 = $('#x2').val();
		let y1 = $('#y1').val();
		let y2 = $('#y2').val();
		return $.ajax({
			url: domain + '/forms_files.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'Crop_av',
				img: img,
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2
			},
			lang: lang
		});
	}

	// Reg
	function send_reg(form) {
		let name = form.find('.js-reg_name').val();
		let email = form.find('.js-reg_email').val();
		let phone = clear_phone(form.find('.js-reg_phone').val());
		let pass = form.find('.js-reg_pass').val();
		let news = form.find('.js-reg_news').prop('checked');
		if (news == true) {
			news = 1;
		} else {
			news = 0;
		}
		return $.ajax({
			url: domain + '/forms.php',
			type: 'POST',
			dataType: 'json',
			data: {
				a: 'c4_registerUser',
				name: name,
				email: email,
				pass: pass,
				phone: phone,
				news: news,
				lang: lang
			}
		});
	}

	$(window).scroll(function (event) {
		let w = $(window).outerWidth();
		let h = $(window).outerHeight();
		var scr = $(this).scrollTop();
		sectors(scr);

		if ($('.__fix-block').length > 0 && w > 992) {
			fix_block(scr);
		} else {
			$('.__fix-item').css({
				position: 'relative',
				top: 0,
				width: 'auto',
				bottom: 'auto',
				left: 0
			});
		}
		if ($('.fixed-footer').length > 0 && w < 768) {
			if (scr >= ($('.wrapper').outerHeight() - h - $('.fixed-footer').outerHeight())) {
				$('.fixed-footer').addClass('hide');
			} else {
				$('.fixed-footer').removeClass('hide');
			}
		}
	});
	setTimeout(function () {
		sectors($(this).scrollTop());
	}, 100);

	function fix_block(scr) {
		let h_head = $('header').outerHeight();
		$.each($('.__fix-block'), function (index, val) {
			let block = $(this);
			let item = block.find('.__fix-item');
			if (item.outerHeight() < h - (h_head + 30)) {
				if (scr > block.offset().top - (h_head + 15)) {
					item.addClass('fix').css({
						position: 'fixed',
						bottom: 'auto',
						top: 15 + h_head,
						width: block.outerWidth(),
						left: block.offset().left
					});
				} else {
					gotoRelative(item);
				}
				if (scr > (block.outerHeight() + block.offset().top) - (item.outerHeight() + (h_head + 15))) {
					block.css({ position: 'relative' });
					item.removeClass('fix').css({
						position: 'absolute',
						top: 'auto',
						bottom: 0,
						left: 0
					});
				}
			} else {
				gotoRelative(item);
			}
		});
		function gotoRelative(item) {
			item.removeClass('fix').css({
				position: 'relative',
				top: 0,
				width: 'auto',
				bottom: 'auto',
				left: 0
			});
		}
	}
	function sectors(scr) {
		var headerheight = 80;
		if (w < 768) { headerheight = 50; }
		if (scr > 0) {
			$('header').addClass('s');
		} else {
			$('header').removeClass('s');
		}
		if (scr > h) {
			$('#up').fadeIn(300);
		} else {
			$('#up').fadeOut(300);
		}
		$.each($('.sector'), function (index, val) {
			var th = $(this).outerHeight();
			var tot = $(this).offset().top;
			if (scr > tot - h / 1.5 && scr < tot + th) {
				$(this).addClass('active');
			} else {
				$(this).removeClass('active');
			}
			if (scr > tot - h && scr < tot + th) {
				$(this).addClass('view');
			} else {
				$(this).removeClass('view');
			}
		});
		$.each($('.lz').not('.load'), function (index, val) {
			var tot = $(this).offset().top;
			var img = $(this).data('image');
			var video = $(this).data('video');
			if (scr > tot - h) {
				if (img != '' && img != null) {
					$(this).html('<img src="' + img + '" alt="" />');
					ibg();
				}
				if (video != '' && video != null) {
					$(this).html('<video loop autoplay playsinline muted src="' + video + '"></video>');
				}
				$(this).addClass('load');
				$(this).parents('.slick-slider').slick('setPosition');
			}
		});
	}

	//ФИЛЬТР
	let filter = $('.filter');
	if (filter.length > 0) {
		$('#filter_city').val(city_id);
		$('#filter_lang').val(lang);

		//Верстка
		$('.select-filter__title').click(function (event) {
			if ($(this).parents('.filter__search').length == 0 && !$(this).hasClass('select-filter__title_input')) {
				$('.select-filter').not($(this).parent()).removeClass('active');
				$(this).parent().toggleClass('active');
				$(this).parents('.select-filter').find('.scr').getNiceScroll().resize();
			}
		});
		$.each($('._label'), function (index, val) {
			$(this).after('<div class="select-filter__label">' + $(this).data('value') + '</div>');
		});
		$.each($('.range-filter'), function (index, val) {
			let item = $(this).parents('.select-filter');
			let title = item.find('.select-filter__title');
			let from = $(this).find('.range-filter__column').eq(0).find('input');
			let to = $(this).find('.range-filter__column').eq(1).find('input');
			let ed = item.data('ed');
			let name = item.data('name');
			let label = title.data('value');
			if (ed == null) {
				if ($('#filter_type_id').val() == 4) {
					ed = item.data('ed-2');
				} else {
					ed = item.data('ed-1');
				}
			}
			from.keyup(function (event) {
				if (from.val() != '') {
					title.text(from.data('value') + ' ' + from.val());
					if (to.val() != "" && to.val() != to.data('value')) {
						title.text(title.text() + ' ' + to.data('value') + ' ' + to.val() + ' ' + ed);
					} else {
						title.text(title.text() + ' ' + ed);
					}
					item.addClass('focus');
				} else {
					if (to.val() != "" && to.val() != to.data('value')) {
						title.text(to.data('value') + ' ' + to.val() + ' ' + ed);
					} else {
						item.removeClass('focus');
						title.text(title.data('value'));
					}
				}
				add_range(label, '', name, title.text());
			});
			to.keyup(function (event) {
				if (to.val() != '') {
					title.text(to.data('value') + ' ' + to.val());
					if (from.val() != "" && from.val() != from.data('value')) {
						title.text(from.data('value') + ' ' + from.val() + ' ' + title.text() + ' ' + ed);
					} else {
						title.text(title.text() + ' ' + ed);
					}
					item.addClass('focus');
				} else {
					if (from.val() != "" && from.val() != from.data('value')) {
						title.text(from.data('value') + ' ' + from.val());
					} else {
						item.removeClass('focus');
						title.text(title.data('value'));
					}
				}
				add_range(label, '', name, title.text());
			});
		});
		function add_range(label, id, type, t) {
			$('.selected-filter__column[data-type="' + type + '"]').remove();
			$('#filter_' + type + '_id').val('');
			$('#filter_' + type + '_url').val('');
			if (t != '' && t != label) {
				if (label != '' && label != null) {
					t = label + ': ' + t;
				}
				$('.selected-filter__row').append('<div data-type="' + type + '" data-id="' + id + '" class="selected-filter__column"><div class="selected-filter__item"><span>' + t + '</span></div></div>');
				$('.selected-filter').addClass('active');
			}
		}
		function currency(n) {
			let currency_value = $('.price-filter').data('currency');
			let currency = $('#filter_price_currency').val();
			$.each($('.price-filter .price-filter__list>li'), function (index, val) {
				let v = $(this).data('value-' + n);
				if (v != null) {
					if (currency == 'usd') {
						$(this).attr('data-id', v / currency_value);
						$(this).text(v / currency_value + '$');
					} else {
						$(this).attr('data-id', v);
						$(this).text(v + 'грн');
					}
				}
			});
		}

		$('.currency-price-filter__option').click(function (event) {
			let title = $(this).parents('.select-filter').find('.select-filter__title');
			$('.currency-price-filter__option').removeClass('active');
			$(this).addClass('active');
			$('#filter_price_currency').val($(this).data('value'));
			title.parents('.select-filter').removeClass('focus');
			title.text(title.data('value'));
			$('#filter_price_to').val('').blur();
			$('#filter_price_from').val('').blur();

			currency($('#filter_action_id').val());

		});
		$('#filter_price_from').keyup(function (event) {
			let title = $(this).parents('.select-filter').find('.select-filter__title');
			let currency = $('#filter_price_currency').val();
			if (currency == 'usd') {
				currency = '$';
			} else {
				currency = 'грн';
			}
			if ($(this).val() != '') {
				title.text($(this).data('value') + ' ' + $(this).val());
				if ($('#filter_price_to').val() != "" && $('#filter_price_to').val() != $('#filter_price_to').data('value')) {
					title.text(title.text() + ' ' + $('#filter_price_to').data('value') + ' ' + $('#filter_price_to').val());
				}
				title.parents('.select-filter').addClass('focus');
				title.text(title.text() + currency);
			} else {
				if ($('#filter_price_to').val() != "" && $('#filter_price_to').val() != $('#filter_price_to').data('value')) {
					title.text($('#filter_price_to').data('value') + ' ' + $('#filter_price_to').val());
				} else {
					title.parents('.select-filter').removeClass('focus');
					title.text(title.data('value'));
				}
			}
			$('#filter_price_id').val('');
			$('#filter_price_url').val('');
		});
		$('#filter_price_to').keyup(function (event) {
			let title = $(this).parents('.select-filter').find('.select-filter__title');
			let currency = $('#filter_price_currency').val();
			if (currency == 'usd') {
				currency = '$';
			} else {
				currency = 'грн';
			}
			if ($(this).val() != '') {
				title.text($(this).data('value') + ' ' + $(this).val());
				if ($('#filter_price_from').val() != "" && $('#filter_price_from').val() != $('#filter_price_from').data('value')) {
					title.text($('#filter_price_from').data('value') + ' ' + $('#filter_price_from').val() + ' ' + title.text());
				}
				title.parents('.select-filter').addClass('focus');
				title.text(title.text() + currency);
			} else {
				if ($('#filter_price_from').val() != "" && $('#filter_price_from').val() != $('#filter_price_from').data('value')) {
					title.text($('#filter_price_from').data('value') + ' ' + $('#filter_price_from').val());
				} else {
					title.parents('.select-filter').removeClass('focus');
					title.text(title.data('value'));
				}
			}
			$('#filter_price_id').val('');
			$('#filter_price_url').val('');
		});

		$('.group-filter__option').click(function (event) {
			let block = $(this).parents('.group-filter');
			let block_type = block.data('type');
			block.find('.group-filter__option').removeClass('active');
			$(this).addClass('active');
			$('#filter_' + block_type + '_id').val($(this).data('id'));
			$('#filter_' + block_type + '_url').val($(this).data('url'));
		});
		$('.filter__open').click(function (event) {
			$(this).toggleClass('active');
			$('.filter__body').slideToggle(300);
		});
		$('.filter__more').click(function (event) {
			$(this).toggleClass('active');
			$('.filter__content').toggleClass('active');
			$('.filter__items').slideToggle(300);
		});

		$(document).on('click touchstart', function (e) {
			if (!$(e.target).is(".select-filter *")) {
				$('.select-filter').removeClass('active');
			};
		});

		$('._rayon_input').jcOnPageFilter({
			parentSectionClass: '_rayon_list',
			parentLookupClass: '_rayon_item',
			childBlockClass: '_rayon_item'
		});
		$('._metro_input').jcOnPageFilter({
			parentSectionClass: '_metro_list',
			parentLookupClass: '_metro_item',
			childBlockClass: '_metro_item'
		});
		$('.select-filter__input').keyup(function (event) {
			let item = $(this).parents('.select-filter');
			item.find('.select-filter__scroll').getNiceScroll().resize();
		});
		$('.select-filter__input').blur(function (event) {
			let item = $(this).parents('.select-filter');
			$(this).val($(this).data('value'));
			item.find('.select-filter__list').show();
		});

		$('.select-filter__close').click(function (event) {
			$(this).parents('.select-filter').removeClass('active');
		});

		$('.select-filter__title_input').click(function (event) {
			let item = $(this).parents('.select-filter');
			let input = item.find('.select-filter__input').focus();
			let name = $(this).parents('.select-filter').data('name');
			let action_type = $('#filter_action_id').val();
			let object_type = $('#filter_type_id').val();
			let n = name;

			$('.select-filter').not(item).removeClass('active');
			item.addClass('active');

			if (object_type == 1 && $('#filter_flat_type_id').val() != '') {
				object_type = $('#filter_flat_type_id').val();
			}
			if (name == 'rayon') {
				name = 'rayon,sub';
			}

			let fnc = get_location_type(city_id, 1, 0, action_type, object_type, lang, name);
			filter.addClass('load');
			fnc.done(function (data) {
				filter_set_location_type(data, item, n);
			});
			filter.removeClass('load');
		});

		function filter_set_location_type(data, item, type_name) {
			$.each(data, function (index, val) {
				let location_type = data[index]['block_name'];
				let location_items = data[index]['locations'];
				let block = item.find('.select-filter__sector_' + location_type);
				let list_block = block.find('.select-filter__list');

				console.log(location_type);

				if (location_items) {
					block.show();
				} else {
					block.hide();
				}

				list_block.html('');
				$.each(location_items, function (index, val) {
					let cls = '';
					let id = location_items[index]['id'];
					let url = location_items[index]['url'];
					let name = location_items[index]['name']
					if (!url) { url = id }
					if ($('.selected-filter__column[data-id="' + id + '"][data-type="' + location_type + '"]').length > 0) { cls = 'active'; }
					list_block.append('<li class="_' + type_name + '_item ' + cls + '" data-type="' + location_type + '" data-id="' + id + '" data-url="' + url + '">' + name + '</li>');
				});
			});
			multi_filter(item.find('li.active'), name);
			item.find('.scr').getNiceScroll().resize();
		}

		function add_selected(label, id, type, t, url) {
			if (label != '' && label != null) {
				t = label + ': ' + t;
			}
			$('.selected-filter__row').append('<div data-url="' + url + '" data-type="' + type + '" data-id="' + id + '" class="selected-filter__column"><div class="selected-filter__item"><span>' + t + '</span></div></div>');
			$('.selected-filter').addClass('active');

			load_selected();
		}
		function remove_selected(el) {
			let id = el.parent().data('id');
			let type = el.parent().data('type');
			$('*[data-id="' + id + '"][data-type="' + type + '"]').removeClass('active').find('input').prop('checked', false);

			if ($('.select-filter[data-name="' + type + '"]').find('.range-filter').length > 0) {
				$('.select-filter[data-name="' + type + '"]').find('.range-filter input').val('').blur();
			}


			$('.select-filter[data-name="' + type + '"]').removeClass('focus').find('.select-filter__title').text($('.select-filter[data-name="' + type + '"]').find('.select-filter__title').attr('data-value'));
			$('#filter_' + type + '_id').val('');
			$('#filter_' + type + '_url').val('');

			let item = $('*[data-id="' + id + '"][data-type="' + type + '"]').parents('.select-filter');
			$.each(item, function (index, val) {
				let el = $(this).find('li.active');
				let name = $(this).data('name');
				multi_filter(el, name);
			});

			if (type == 'phone') {
				$('#filter_phone').val('').blur();
			}

			el.parent().remove();

			load_selected();

			if ($('.selected-filter__column').length == 0) {
				$('.selected-filter').removeClass('active');
			}
		}

		$(document).on('click', '.selected-filter__item', function (e) {
			remove_selected($(this));
		});

		function multi_filter(el, name) {
			let multi_id = [];
			let multi_type = [];
			let multi_url = [];
			let multi_text = [];
			$.each(el, function (index, val) {
				multi_id.push($(this).data('id'));
				multi_url.push($(this).data('url'));
				multi_type.push($(this).data('type'));
				multi_text.push($(this).text());
			});
			$('#filter_' + name + '_id').val(multi_id);
			$('#filter_' + name + '_url').val(multi_url);
			if ($('#filter_' + name + '_type').length > 0) {
				$('#filter_' + name + '_type').val(multi_type);
			}
		}

		function load_selected() {
			$('#filter_location_id').val('');
			$('#filter_location_type').val('');
			$('#filter_location_url').val('');
			if ($('.selected-filter__column').length > 0) {
				let selected_id_location = [];
				let selected_type_location = [];
				let selected_url_location = [];
				let selected_id_metro = [];
				let selected_type_metro = [];
				let selected_url_metro = [];
				let selected_id_rayon = [];
				let selected_type_rayon = [];
				let selected_url_rayon = [];
				let selected_id_sub = [];
				let selected_type_sub = [];
				let selected_url_sub = [];
				$.each($('.selected-filter__column'), function (indexInArray, valueOfElement) {
					let id = $(this).data('id');
					let type = $(this).data('type');
					let url = $(this).data('url');
					if (type == 'metro' || type == 'rayon' || type == 'sub' || type == 'street' || type == 'area' || type == 'region') {
						selected_id_location.push(id);
						selected_type_location.push(type);
						selected_url_location.push(url);
					}
					if (type == 'metro') {
						selected_id_metro.push(id);
						selected_type_metro.push(type);
						selected_url_metro.push(url);
					} else if (type == 'rayon') {
						selected_id_rayon.push(id);
						selected_type_rayon.push(type);
						selected_url_rayon.push(url);
					} else if (type == 'sub') {
						selected_id_sub.push(id);
						selected_type_sub.push(type);
						selected_url_sub.push(url);
					} else {
						$('#filter_' + type + '_id').val(id);
						$('.select-filter[data-name="' + type + '"]').addClass('focus');
					}
					if (type == 'size_1') {
						if ($('#filter_type_id').val() == 4) {
							size(2, 1);
						} else {
							size(1, 1);
						}
					}
				});
				$('#filter_location_id').val(selected_id_location);
				$('#filter_location_url').val(selected_url_location);
				$('#filter_location_type').val(selected_type_location);
				$('#filter_rayon_id').val(selected_id_rayon);
				$('#filter_rayon_url').val(selected_url_rayon);
				$('#filter_sub_id').val(selected_id_sub);
				$('#filter_sub_url').val(selected_url_sub);
				$('#filter_metro_id').val(selected_id_metro);
				$('#filter_metro_url').val(selected_url_metro);
			}
		}
		load_selected();

		$(document).on('click', '.select-filter__list>li,.price-filter__list>li,.select-filter__subtitle_active', function (e) {
			let item = $(this).parents('.select-filter');
			let name = item.data('name');
			let value = $(this).text();
			let id = $(this).data('id');
			let url = $(this).data('url');
			let type = $(this).data('type');
			if ($(this).parent().hasClass('_rooms')) {
				let rooms_id = [];
				let rooms_url = [];
				let rooms_text = [];
				let n = 0;
				$(this).toggleClass('active');
				$.each($(this).parent().find('li.active'), function (index, val) {
					rooms_text.push($(this).text());
					rooms_id.push($(this).data('id'));
					rooms_url.push($(this).data('url'));
				});
				$('#filter_rooms_id').val(rooms_id);
				$('#filter_rooms_url').val(rooms_url);

				if ($(this).parent().find('li.active').length > 0) {
					if (rooms_id != 100) {
						$(this).parents('.select-filter').find('.select-filter__title').text($(this).parents('.select-filter').find('.select-filter__title').data('value') + ': ' + rooms_text);
					} else {
						$(this).parents('.select-filter').find('.select-filter__title').text(rooms_text);
					}
				} else {
					$(this).parents('.select-filter').find('.select-filter__title').text($(this).parents('.select-filter').find('.select-filter__title').data('value'));
				}
			} else if ($(this).parent().hasClass('_multi-filter')) {
				$(this).toggleClass('active');
				multi_filter($(this).parents('.select-filter').find('li.active[data-type="' + type + '"]'), type);
				if (name == 'location') {
					multi_filter($(this).parents('.select-filter').find('li.active'), name);
				}
			} else {
				$('#filter_' + name + '_id').val(id);
				$('#filter_' + name + '_url').val(url);

				if (type != '' && type != null) {
					$('#filter_' + name + '_type').val(type);
				}

				if (item.find('.select-filter__title input').length > 0) {
					item.find('.select-filter__title input').val(value);
				} else {
					item.addClass('focus');
					item.find('.select-filter__title').addClass('focus').removeClass('ed').text(value);
					if (id != 1) {
						item.find('.select-filter__title').addClass('ed');
					}
				}
				item.removeClass('active');
			}
			if ($(this).parents('.price-filter').length > 0) {
				$('#filter_price_to').val('').blur();
				$('#filter_price_from').val('').blur();
			}
			if ($(this).parents('._option').length > 0) {
				$('#filter_' + name + '_to').val('').blur();
				$('#filter_' + name + '_from').val('').blur();
			}

			if (name == 'action') {
				let title = $('.price-filter').parents('.select-filter').find('.select-filter__title');
				if ($('#filter_action_id').val() != 1) {
					$('.currency-price-filter__option').removeClass('active').eq(1).addClass('active');
					$('#filter_price_currency').val('uah');
				} else {
					$('.currency-price-filter__option').removeClass('active').eq(0).addClass('active');
					$('#filter_price_currency').val('usd');
				}
				currency($('#filter_action_id').val());

				title.text(title.data('value'));
				$('.price-filter').parents('.select-filter').removeClass('focus');
				$('#filter_price_to').val('').blur();
				$('#filter_price_from').val('').blur();
				$('#filter_price_id').val('');
				$('#filter_price_url').val('');

				let fnc = get_type(city_id, id, lang, 0);
				filter.addClass('load');
				fnc.done(function (data) {
					filter_set_type(data);
				});
			} else if (name == 'type') {
				if ($('#filter_type_id').val() == 1) {
					$('.filter__column_flat-type').show();
					$('.filter__column_flat-type .group-filter__option').removeClass('active');
					$('.filter__column_flat-type .group-filter__column').eq(1).find('.group-filter__option').addClass('active');
					$('#filter_flat_type_id,#filter_flat_type_url').val('');
					$('.filter__column_flat-type input').prop('disabled', false);
				} else {
					$('.filter__column_flat-type').hide();
					$('.filter__column_flat-type input').prop('disabled', true);
				}
				if ($('#filter_type_id').val() == 4) {
					size(2);
				} else {
					size(1);
				}
				filter_check_form();
			} else if (name == 'rooms') {
				filter_check_form();
			}
			return false;
		});

		function filter_set_type(data) {
			let title = $('.select-filter_type .select-filter__title');
			let live_column = $('.select-filter_type .select-filter__column').eq(0).find('.select-filter__list');
			let commerce_column = $('.select-filter_type .select-filter__column').eq(1).find('.select-filter__list');
			let list;
			let c = 0;

			live_column.html('');
			commerce_column.html('');

			$('#filter_type_id').val(data[0]['object_type_id']);
			$('#filter_type_url').val(data[0]['object_type_url']);
			title.text(data[0]['object_type_name']);

			$.each(data, function (index, val) {
				if (data[index]['object_type_rub'] == 'live') {
					list = live_column;
				} else {
					c++;
					list = commerce_column;
				}
				list.append('<li data-id="' + data[index]['object_type_id'] + '" data-url="' + data[index]['object_type_url'] + '">' + data[index]['object_type_name'] + '</li>');

				if (c == 0) {
					$('.select-filter_type .select-filter__column').eq(1).hide();
				} else {
					$('.select-filter_type .select-filter__column').eq(1).show();
				}
			});
			filter_check_form();
			filter.removeClass('load');
		}

		// Локация
		$(document).on('keyup click', '.search-filter__input', function (e) {
			let item = $(this).parents('.select-filter');
			let search_name = $.trim($(this).val());

			$('.select-filter').not(item).removeClass('active');
			if (search_name != '') {
				let action_type = $('#filter_action_id').val();
				let object_type = $('#filter_type_id').val();

				if (object_type == 1 && $('#filter_flat_type_id').val() != '') {
					object_type = $('#filter_flat_type_id').val();
				}
				let fnc = get_locations(city_id, 1, 1, action_type, object_type, lang, search_name);
				filter.addClass('load');
				fnc.done(function (data) {
					filter_set_location(data, item);
				});
			} else {
				$('.filter__search').removeClass('active');
				$('.filter__search .select-filter__sector').hide();
			}
			filter.removeClass('load');
		});
		$(document).on('blur', '.search-filter__input', function (e) {
			let item = $(this).parents('.select-filter');
			$(this).parent().removeClass('focus');
			$(this).removeClass('focus').val($(this).data('value'));
			item.find('.select-filter__list').show();
		});

		function filter_set_location(data, item) {
			let c = 0;
			$.each(data, function (index, val) {
				let location_type = data[index]['block_name'];
				let location_items = data[index]['locations'];
				let block = item.find('.select-filter__sector_' + location_type);
				let list_block = block.find('.select-filter__list');

				if (location_items) {
					c++;
					block.show();
				} else {
					block.hide();
				}

				list_block.html('');
				$.each(location_items, function (index, val) {
					let cls = '';
					let id = location_items[index]['id'];
					let url = location_items[index]['url'];
					let name = location_items[index]['name']
					if (!url) { url = id }
					if ($('.selected-filter__column[data-id="' + id + '"][data-type="' + location_type + '"]').length > 0) { cls = 'active'; }
					list_block.append('<li class="' + cls + '" data-type="' + location_type + '" data-id="' + id + '" data-url="' + url + '">' + name + '</li>');
				});
			});

			multi_filter($('.filter__search li.active'), 'location');
			load_selected();

			if (c > 0) {
				$('.filter__search').addClass('active');
			} else {
				$('.filter__search').removeClass('active');
			}
			$('.filter__search').find('.scr').getNiceScroll().resize();
		}

		$(document).on('click', '.options-filter__item,._multi-filter>li', function (e) {
			let t = $(this).text();
			let id = $(this).data('id');
			let url = $(this).data('url');
			let type = $(this).data('type');
			if ($(this).hasClass('active')) {
				add_selected('', id, type, t, url);
			} else {
				remove_selected($('.selected-filter__column[data-id="' + id + '"][data-type="' + type + '"]').find('.selected-filter__item'));
			}
		});
		$(document).on('click', '._option .select-filter__list>li', function (e) {
			let item = $(this).parents('.select-filter');
			let label = item.find('.select-filter__title').data('value');
			let t = $(this).text();
			let id = $(this).data('id');
			let url = $(this).data('url');
			let type = item.data('name');
			if ($('.selected-filter__column[data-type="' + type + '"]').length > 0) {
				$('.selected-filter__column[data-type="' + type + '"]').remove();
			}
			add_selected(label, id, type, t, url);
		});

		function filter_check_form() {
			if ($('#filter_type_id').val() == 1 || $('#filter_type_id').val() == 2) {
				$('._group').show();
				$('._group input').prop('disabled', false);
			} else {
				$('._group').hide();
				$('._group input').prop('disabled', true);
			}
		}
		currency(1);

		function size(n, t) {
			$('._size .select-filter__title').text($('._size .select-filter__title').data('value'));
			$('._size .select-filter__list>li i').remove();
			if (t != 1) {
				$('._size').removeClass('focus');
				$('._size .select-filter__title').removeClass('focus');
				$('.selected-filter__column[data-type="size_1"]').remove();
				$('#filter_size_1_id').val('');
			}
			$.each($('._size .select-filter__list>li'), function (index, val) {
				let ed = $(this).parents('.select-filter').data('ed-' + n);
				if ($(this).data('id') != null && $(this).data('id') != '') {
					$(this).html($(this).text() + ' <i>' + ed + '</i>');
				}
			});
		}
		filter_check_form();

		function get_options_values() {
			let n = 0;
			$.each($('.filter__items input'), function (index, val) {
				if ($(this).prop('disabled') == false) {
					if ($(this).val() != '' && $(this).val() != $(this).data('value') && $(this).attr('type') != 'checkbox') {
						n++;
					}
					if ($(this).prop('checked') == true) {
						n++;
					}
				}
			});
			return n;
		}
		function get_location_values() {
			let n = 0;
			if ($('#filter_metro_id').val() != '' || $('#filter_rayon_id').val() != '' || $('#filter_location_id').val() != '') {
				n++;
			}
			return n;
		}
		function get_price_values() {
			let n = 0;
			if (
				$('#filter_price_id').val() != ''
				|| ($('#filter_price_from').val() != '' && $('#filter_price_from').val() != $('#filter_price_from').data('value'))
				|| ($('#filter_price_to').val() != '' && $('#filter_price_to').val() != $('#filter_price_to').data('value'))
			) {
				n++;
			}
			return n;
		}

		// Отправка формы
		$('.filter__btn').click(function (event) {
			//city_url
			//city_id
			let way = 0;
			let url = domain + '/';
			let price_array;
			let price = '';
			let form_tag = $(this).parents('form');
			let form = {
				action_id: $('#filter_action_id').val(),
				action_url: $('#filter_action_url').val(),
				type_id: $('#filter_type_id').val(),
				type_url: $('#filter_type_url').val(),
				flat_type_id: $('#filter_flat_type_id').val(),
				flat_type_url: $('#filter_flat_type_url').val(),
				rooms_id: $('#filter_rooms_id').val(),
				rooms_url: $('#filter_rooms_url').val(),
				price_id: $('#filter_price_id').val(),
				price_url: $('#filter_price_url').val(),
				price_from: $('#filter_price_from').val(),
				price_to: $('#filter_price_to').val(),
				currency: $('#filter_price_currency').val(),
				metro_id: $('#filter_metro_id').val(),
				metro_url: $('#filter_metro_url').val(),
				rayon_id: $('#filter_rayon_id').val(),
				rayon_url: $('#filter_rayon_url').val(),
				location_id: $('#filter_location_id').val(),
				location_url: $('#filter_location_url').val(),
				location_type: $('#filter_location_type').val(),
				object_id: $('#filter_object_id').val(),
				phone: $('#filter_phone').val(),
				time_id: $('#filter_time_id').val(),
				time_url: $('#filter_time_url').val(),
				size_1_id: $('#filter_size_1_id').val(),
				size_1_url: $('#filter_size_1_url').val(),
				size_1_from: $('#filter_size_1_from').val(),
				size_1_to: $('#filter_size_1_to').val(),
				size_2_id: $('#filter_size_2_id').val(),
				size_2_url: $('#filter_size_2_url').val(),
				size_2_from: $('#filter_size_2_from').val(),
				size_2_to: $('#filter_size_2_to').val(),
				size_3_id: $('#filter_size_2_id').val(),
				size_3_url: $('#filter_size_2_url').val(),
				size_3_from: $('#filter_size_3_from').val(),
				size_3_to: $('#filter_size_3_to').val(),
				floor_id: $('#filter_floor_id').val(),
				floor_url: $('#filter_floor_url').val(),
				floor_from: $('#filter_floor_from').val(),
				floor_to: $('#filter_floor_to').val(),
				floors_id: $('#filter_floors_id').val(),
				floors_url: $('#filter_floors_url').val(),
				floors_from: $('#filter_floors_from').val(),
				floors_to: $('#filter_floors_to').val(),
				furniture: $('#filter_furniture').val(),
				internet: $('#filter_internet').val(),
				washer: $('#filter_washer').val(),
				photo: $('#filter_photo').val()
			}


			let rooms_id = form['rooms_id'].split(',');
			let metro_id = form['metro_id'].split(',');
			let rayon_id = form['rayon_id'].split(',');
			let location_id = form['location_id'].split(',');

			if (lang == 'ua') {
				url = url + 'ua/';
			}

			if (form['currency'] == 'usd') {
				price_array = [25000, 27000, 30000, 40000, 50000];
			} else {
				price_array = [7000, 8000, 9000, 10000];
			}
			if (form['price_id'] != '') {
				price = form['price_id'];
			} else if ((form['price_from'] != '' && form['price_from'] != $('#filter_price_from').data('value')) && form['price_to'] == $('#filter_price_to').data('value')) {
				price = form['price_from'];
			} else if ((form['price_to'] != '' && form['price_to'] != $('#filter_price_to').data('value')) && form['price_from'] == $('#filter_price_from').data('value')) {
				price = form['price_to'];
			}

			if (form['flat_type_id'] != '' && $('#filter_flat_type_id').prop('disabled') == false) {
				form['type_id'] = form['flat_type_id'];
				form['type_url'] = form['flat_type_url'];
			}

            //alert(JSON.stringify(form));

			//V1
			if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['flat_type_id'] != 200
				&& form['rooms_id'] == ''
				&& get_location_values() == 0
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'];
				if (city_id != 29586) {
					url = url + '/' + city_url;
				}
				//V2
			} else if (
				form['action_id'] != ''
				&& (form['type_id'] == 1 || form['type_id'] == 3)
				&& form['flat_type_id'] != 200
				&& rooms_id.length == 1
				&& get_location_values() == 0
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'];
				if (city_id != 29586) {
					url = url + '/' + city_url;
				}
				//V3
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['flat_type_id'] != 200
				&& form['rooms_id'] == ''
				&& (metro_id.length == 1 && (form['location_id'] == '' || form['location_id'] == form['metro_id']))
				&& form['rayon_id'] == ''
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/m-' + form['metro_url'];
				//V4
			} else if (
				form['action_id'] != ''
				&& (form['type_id'] == 1 || form['type_id'] == 3)
				&& form['flat_type_id'] != 200
				&& rooms_id.length == 1
				&& (metro_id.length == 1 && (form['location_id'] == '' || form['location_id'] == form['metro_id']))
				&& form['rayon_id'] == ''
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/m-' + form['metro_url'];
				//V5
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['flat_type_id'] != 200
				&& form['rooms_id'] == ''
				&& form['metro_id'] == ''
				&& (rayon_id.length == 1 && (form['location_id'] == '' || form['location_id'] == form['rayon_id']))
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/rayon-' + form['rayon_url'];
				//V6
			} else if (
				form['action_id'] != ''
				&& (form['type_id'] == 1 || form['type_id'] == 3)
				&& form['flat_type_id'] != 200
				&& rooms_id.length == 1
				&& form['metro_id'] == ''
				&& (rayon_id.length == 1 && (form['location_id'] == '' || form['location_id'] == form['rayon_id']))
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/rayon-' + form['rayon_url'];
				//V7
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['flat_type_id'] != 200
				&& form['rooms_id'] == ''
				&& form['metro_id'] == ''
				&& form['rayon_id'] == ''
				&& (location_id.length == 1 && form['location_type'] == 'sub')
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/sub-' + form['location_url'];
				//V8
			} else if (
				form['action_id'] != ''
				&& (form['type_id'] == 1 || form['type_id'] == 3)
				&& form['flat_type_id'] != 200
				&& rooms_id.length == 1
				&& form['metro_id'] == ''
				&& form['rayon_id'] == ''
				&& (location_id.length == 1 && form['location_type'] == 'sub')
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/sub-' + form['location_url'];
				//V9
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['flat_type_id'] != 200
				&& form['rooms_id'] == ''
				&& form['metro_id'] == ''
				&& form['rayon_id'] == ''
				&& (location_id.length == 1 && form['location_type'] == 'street')
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/street-' + form['location_url'];
				//V10
			} else if (
				form['action_id'] != ''
				&& (form['type_id'] == 1 || form['type_id'] == 3)
				&& form['flat_type_id'] != 200
				&& rooms_id.length == 1
				&& form['metro_id'] == ''
				&& form['rayon_id'] == ''
				&& (location_id.length == 1 && form['location_type'] == 'street')
				&& get_price_values() == 0
				&& get_options_values() == 0
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/street-' + form['location_url'];
				//V11
			} else if (
				form['action_id'] == 1
				&& form['type_id'] == 1
				&& form['rooms_id'] == ''
				&& get_location_values() == 0
				&& price_array.indexOf(parseInt(price)) != -1
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/price-' + price + 'usd';
				//V12
			} else if (
				form['action_id'] == 2
				&& form['type_id'] == 1
				&& form['rooms_id'] == ''
				&& get_location_values() == 0
				&& price_array.indexOf(parseInt(price)) != -1
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/price-' + price + 'grn';
			} else {
				way++;
				form_tag.attr('action', domain + '/list/');
			}

			if (way == 0) {
				url = url + '.html';
				window.location.href = url;
				return false;
			}
		});
	}

	// Dynamic Adapt v.1
	// HTML data-move="where(uniq class name),position(digi),when(breakpoint)"
	// e.x. data-move="item,2,992"
	// Andrikanych Yevhen 2020
	let move_array = [];
	let move_objects = document.querySelectorAll('[data-move]');
	if (move_objects.length > 0) {
		for (let index = 0; index < move_objects.length; index++) {
			let el = move_objects[index];
			let data_move = el.getAttribute('data-move');
			if (data_move != '' || data_move != null) {
				el.setAttribute('data-move-index', index);
				move_array[index] = {
					'parent': el.parentNode,
					"index": index_in_parent(el)
				};
			}
		}
	}
	function dynamic_adapt() {
		let w = document.querySelector('body').offsetWidth;
		if (move_objects.length > 0) {
			for (let index = 0; index < move_objects.length; index++) {
				let el = move_objects[index];
				let data_move = el.getAttribute('data-move');
				if (data_move != '' || data_move != null) {
					let data_array = data_move.split(',');
					let data_parent = document.querySelector('.' + data_array[0]);
					let data_index = data_array[1];
					let data_bp = data_array[2];
					if (w < data_bp) {
						if (!el.classList.contains('js-move_done_' + data_bp)) {
							if (data_index > 0) {
								//insertAfter
								let actual_index = index_of_elements(data_parent)[data_index];
								data_parent.insertBefore(el, data_parent.childNodes[actual_index]);
							} else {
								data_parent.insertBefore(el, data_parent.firstChild);
							}
							el.classList.add('js-move_done_' + data_bp);
						}
					} else {
						if (el.classList.contains('js-move_done_' + data_bp)) {
							dynamic_adaptive_back(el);
							el.classList.remove('js-move_done_' + data_bp);
						}
					}
				}
			}
		}
	}
	function dynamic_adaptive_back(el) {
		let index_original = el.getAttribute('data-move-index');
		let move_place = move_array[index_original];
		let parent_place = move_place['parent'];
		let index_place = move_place['index'];
		if (index_place > 0) {
			//insertAfter
			let actual_index = index_of_elements(parent_place)[index_place];
			parent_place.insertBefore(el, parent_place.childNodes[actual_index]);
		} else {
			parent_place.insertBefore(el, parent_place.firstChild);
		}

		popupClose();
	}
	function index_in_parent(node) {
		let children = node.parentNode.childNodes;
		let num = 0;
		for (let i = 0; i < children.length; i++) {
			if (children[i] == node) return num;
			if (children[i].nodeType == 1) num++;
		}
		return -1;
	}
	function index_of_elements(parent) {
		let children = [];
		for (let i = 0; i < parent.childNodes.length; i++) {
			if (parent.childNodes[i].nodeType == 1 && parent.childNodes[i].getAttribute('data-move') == null) {
				children.push(i);
			}
		}
		return children;
	}
	window.addEventListener('resize', function (event) {
		dynamic_adapt();
	});
	dynamic_adapt();

	//ПОИСК НА ГЛАВНОЙ

	let main_search = $('.main-search');
	if (main_search.length > 0) {
		//Верстка
		$('.item-main-search__title').click(function (event) {
			if ($(this).parents('.item-main-search_location').length == 0) {
				$('.item-main-search').not($(this).parent()).removeClass('active');
				$(this).parent().toggleClass('active');
			}
		});
		$('.price-main-search__option').click(function (event) {
			$('.price-main-search__option').removeClass('active');
			$(this).addClass('active');
			$('#mainsearchform_currency').val($(this).data('value'));
			currency($('#mainsearchform_action_id').val());
			$('#mainsearchform_price').val('').blur();
			$('.price-main-search').removeClass('focus');
		});
		$('.main-search__open').click(function (event) {
			$(this).toggleClass('active');
			$('.main-search__content').slideToggle(300);
		});

		function currency(n) {
			let currency_value = $('.price-main-search').data('currency');
			let currency = $('#mainsearchform_currency').val();
			$.each($('.price-main-search__list>li'), function (index, val) {
				let v = $(this).data('value-' + n);
				if (v != null) {
					if (currency == 'usd') {
						$(this).attr('data-id', v / currency_value);
						$(this).text(v / currency_value + '$');
					} else {
						$(this).attr('data-id', v);
						$(this).text(v + 'грн');
					}
				}
			});
		}
		currency(1);

		$('.price-main-search__list>li').click(function (event) {
			$(this).parents('.price-main-search').removeClass('active');
			$('.price-main-search__input').addClass('focus');
			$('#mainsearchform_price').val($(this).attr('data-id'));
			$('.price-main-search').addClass('focus');
		});
		$('.price-main-search__input').click(function (event) {
			$(this).parents('.price-main-search').addClass('active');
		});
		$('#mainsearchform_price').change(function (event) {
			if ($(this).val() != '' && $(this).val() != $(this).data('value')) {
				$('.price-main-search').addClass('focus');
			} else {
				$('.price-main-search').removeClass('focus');
			}
		});

		$(document).on('click', '.item-main-search__list>li,.item-main-search__label_active', function (e) {
			let item = $(this).parents('.item-main-search');
			let title = item.find('.item-main-search__title').data('value');
			let name = item.data('name');
			let value = $(this).text();
			let id = $(this).data('id');
			let url = $(this).data('url');
			let type = $(this).data('type');

			$('#mainsearchform_' + name + '_id').val(id);
			$('#mainsearchform_' + name + '_url').val(url);

			if (type != '' && type != null) {
				$('#mainsearchform_' + name + '_type').val(type);
			}

			if (item.find('.item-main-search__title input').length > 0) {
				item.find('.item-main-search__title input').val(value);
			} else {
				if (title != '' && title != null) {
					item.find('.item-main-search__title').text(title + ': ' + value);
				} else {
					item.find('.item-main-search__title').text(value);
				}
			}

			item.removeClass('active');

			if (name == 'action') {
				if ($('#mainsearchform_action_id').val() != 1) {
					$('.price-main-search__option').removeClass('active').eq(1).addClass('active');
					$('#mainsearchform_currency').val('uah');
				} else {
					$('.price-main-search__option').removeClass('active').eq(0).addClass('active');
					$('#mainsearchform_currency').val('usd');
				}
				currency($('#mainsearchform_action_id').val());

				let fnc = get_type(city_id, id, lang, 1);
				main_search.addClass('load');
				fnc.done(function (data) {
					set_type(data);
				});
			} else if (name == 'type') {
				check_form();
			} else if (name == 'rooms') {
				check_form();
			}
			return false;
		});

		function set_type(data) {
			let title = $('.item-main-search_type .item-main-search__title');
			let live_column = $('.item-main-search_type .item-main-search__column').eq(0).find('.item-main-search__list');
			let commerce_column = $('.item-main-search_type .item-main-search__column').eq(1).find('.item-main-search__list');
			let list;
			let c = 0;

			live_column.html('');
			commerce_column.html('');

			$('#mainsearchform_type_id').val(data[0]['object_type_id']);
			$('#mainsearchform_type_url').val(data[0]['object_type_url']);
			title.text(data[0]['object_type_name']);

			$.each(data, function (index, val) {
				if (data[index]['object_type_rub'] == 'live') {
					list = live_column;
				} else {
					c++;
					list = commerce_column;
				}
				list.append('<li data-id="' + data[index]['object_type_id'] + '" data-url="' + data[index]['object_type_url'] + '">' + data[index]['object_type_name'] + '</li>');

				if (c == 0) {
					$('.item-main-search_type .item-main-search__column').eq(1).hide();
				} else {
					$('.item-main-search_type .item-main-search__column').eq(1).show();
				}
			});
			check_form();
			main_search.removeClass('load');
		}

		function check_form() {
			$.each($('.item-main-search'), function (index, val) {
				let v = $(this).find('input').val();
				let t = $(this).find('.item-main-search__title');
				if (v != '' && v != null) {
					t.addClass('focus');
				}
			});
			if ($('#mainsearchform_type_id').val() == 1 || $('#mainsearchform_type_id').val() == 3) {
				$('.main-search__column_rooms').show();
				$('.main-search__column_rooms input').prop('disabled', false);
			} else {
				$('.main-search__column_rooms').hide();
				$('.main-search__column_rooms input').prop('disabled', true);
			}
		}
		check_form();

		$(document).on('click touchstart', function (e) {
			if (!$(e.target).is(".item-main-search *")) {
				$('.item-main-search').removeClass('active');
			};
			if (!$(e.target).is(".price-main-search *")) {
				$('.price-main-search').removeClass('active');
			};
		});

		// Локация
		$(document).on('keyup click', '#mainsearchform_location', function (e) {
			let search_name = $.trim($(this).val());
			if (search_name != '') {
				let action_type = $('#mainsearchform_action').val();
				let object_type = $('#mainsearchform_type').val();
				let fnc = get_locations(city_id, 1, 1, action_type, object_type, lang, search_name);
				main_search.addClass('load');
				fnc.done(function (data) {
					set_location(data);
				});
			} else {
				$('.item-main-search_location').removeClass('active');
				$('.item-main-search_location .item-main-search__sector').hide();
			}
			main_search.removeClass('load');
		});
		function set_location(data) {
			let c = 0;
			$.each(data, function (index, val) {
				let location_type = data[index]['block_name'];
				let location_items = data[index]['locations'];
				let block = $('.item-main-search__sector_' + location_type);
				let list_block = block.find('.item-main-search__list');

				if (location_items) {
					c++;
					block.show();
				} else {
					block.hide();
				}

				list_block.html('');
				$.each(location_items, function (index, val) {
					let id = location_items[index]['id'];
					let url = location_items[index]['url'];
					let name = location_items[index]['name']
					if (!url) { url = id }
					list_block.append('<li data-type="' + location_type + '" data-id="' + id + '" data-url="' + url + '">' + name + '</li>');
				});
			});

			if (c > 0) {
				$('.item-main-search_location').addClass('active');
			} else {
				$('.item-main-search_location').removeClass('active');
			}
			$('.item-main-search_location').find('.scr').getNiceScroll().resize();
		}

		// Отправка формы
		$('.main-search__btn').click(function (event) {
			//city_url
			//city_id
			let way = 0;
			let url = domain + '/';
			let price_array;
			let form_tag = $(this).parents('form');
			let form = {
				action_id: $('#mainsearchform_action_id').val(),
				action_url: $('#mainsearchform_action_url').val(),
				type_id: $('#mainsearchform_type_id').val(),
				type_url: $('#mainsearchform_type_url').val(),
				rooms_id: $('#mainsearchform_rooms_id').val(),
				rooms_url: $('#mainsearchform_rooms_url').val(),
				location: $('#mainsearchform_location').val(),
				location_id: $('#mainsearchform_location_id').val(),
				location_type: $('#mainsearchform_location_type').val(),
				location_url: $('#mainsearchform_location_url').val(),
				price: $('#mainsearchform_price').val(),
				currency: $('#mainsearchform_currency').val()
			}

			if (lang == 'ua') {
				url = url + 'ua/';
			}

			if (form['currency'] == 'usd') {
				price_array = [25000, 27000, 30000, 40000, 50000];
			} else {
				price_array = [7000, 8000, 9000, 10000];
			}

			//V1
			if (form['action_id'] != '' && form['type_id'] != '' && form['rooms_id'] == '' && form['location_id'] == '' && (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))) {
				url = url + form['action_url'] + '/' + form['type_url'];
				if (city_id != 29586) {
					url = url + '/' + city_url;
				}
				//V2
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] != ''
				&& form['location_id'] == ''
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'];
				if (city_id != 29586) {
					url = url + '/' + city_url;
				}
				//V3
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] == ''
				&& form['location_type'] == 'metro'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/m-' + form['location_url'];
				//V4
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] != ''
				&& form['location_type'] == 'metro'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/m-' + form['location_url'];
				//V5
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] == ''
				&& form['location_type'] == 'rayon'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/rayon-' + form['location_url'];
				//V6
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] != ''
				&& form['location_type'] == 'rayon'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/rayon-' + form['location_url'];
				//V7
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] == ''
				&& form['location_type'] == 'sub'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/sub-' + form['location_url'];
				//V8
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] != ''
				&& form['location_type'] == 'sub'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/sub-' + form['location_url'];
				//V9
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] == ''
				&& form['location_type'] == 'street'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/street-' + form['location_url'];
				//V9
			} else if (
				form['action_id'] != ''
				&& form['type_id'] != ''
				&& form['rooms_id'] != ''
				&& form['location_type'] == 'street'
				&& (form['price'] == '' || form['price'] == $('#mainsearchform_price').data('value'))
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + form['rooms_url'] + '/' + city_url + '/street-' + form['location_url'];
				//V10
			} else if (
				form['action_id'] == 1
				&& form['type_id'] == 1
				&& form['rooms_id'] == ''
				&& form['location_id'] == ''
				&& price_array.indexOf(parseInt(form['price'])) != -1
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/price-' + form['price'] + 'usd';
				//V11
			} else if (
				form['action_id'] == 2
				&& form['type_id'] == 1
				&& form['rooms_id'] == ''
				&& form['location_id'] == ''
				&& price_array.indexOf(parseInt(form['price'])) != -1
			) {
				url = url + form['action_url'] + '/' + form['type_url'] + '/' + city_url + '/price-' + form['price'] + 'grn';
			} else {
				way++;
				form_tag.attr('action', domain + '/list/');
			}

			if (way == 0) {
				url = url + '.html';
				//console.log(url);
				window.location.href = url;
				return false;
			}
		});
	}
	//Adaptive functions
	$(window).resize(function (event) {
		adaptive_function();
	});
	function adaptive_header(w, h) {
		let langHeader = $('.lang-header');
		var headerBody = $('.menu__body');
		if (w < 767) {
			if (!langHeader.hasClass('done')) {
				langHeader.addClass('done').prependTo($('.menu__sector').eq(0));
			}
		} else {
			if (langHeader.hasClass('done')) {
				langHeader.removeClass('done').appendTo($('.top-header__column').last());
			}
		}
	}
	function adaptive_mainpage(w, h) {
		if (w > 1212) {
			$('.main-search__content').removeClass('done');
			$('.main-search__content').show();
		} else {
			if (!$('.main-search__content').hasClass('done')) {
				$('.main-search__content').addClass('done').hide();
			}
		}
	}
	function adaptive_object(w, h) {
		if (w < 992) {
			if (!$('.text-object__show').hasClass('open')) {
				$('.text-object__show').removeClass('active');
				$('.text-object__body').hide();
			}

			if (!$('.module-side-object__main').hasClass('done')) {
				$('.module-side-object__main').addClass('done').insertAfter($('.body-object__text'));
			}

			if (!$('.side-object').hasClass('done')) {
				$('.side-object').addClass('done').insertAfter($('.object__section_body'));
			}
			if ($('.__fix-item.fix').length > 0) {
				$('.__fix-item.fix').removeClass('fix').css({
					position: 'relative',
					top: 0,
					width: 'auto',
					bottom: 'auto',
					left: 0
				});
			}
		} else {
			$('.text-object__show').removeClass('open');

			if ($('.module-side-object__main').hasClass('done')) {
				$('.module-side-object__main').removeClass('done').prependTo($('.module-side-object'));
			}
			if ($('.side-object').hasClass('done')) {
				$('.side-object').removeClass('done').prependTo($('.object__side'));
			}
		}
		if ($('.__fix-item.fix').length > 0) {
			$.each($('.__fix-block'), function (index, val) {
				let block = $(this);
				let item = block.find('.__fix-item');
				item.addClass('fix').css({
					left: block.offset().left
				})
			});
		}
	}
	function adaptive_filter(w, h) {
		if (w < 768) {
			if (!$('.filter').hasClass('done')) {
				$('.filter').addClass('done').insertAfter($('.breadcrumbs'));
			}
			if (!$('.filter__open').hasClass('active')) {
				$('.filter__body').hide();
			}
		} else {
			if ($('.filter').hasClass('done')) {
				$('.filter').removeClass('done').insertBefore($('.breadcrumbs'));
			}
			$('.filter__body').show();
		}
	}

	function adaptive_function() {
		var w = $(window).outerWidth();
		var h = $(window).outerHeight();
		adaptive_header(w, h);
		if ($('.main-search').length > 0) {
			adaptive_mainpage(w, h);
		}
		if ($('.object').length > 0) {
			adaptive_object(w, h);
		}
		if ($('.filter').length > 0) {
			adaptive_filter(w, h);
		}
	}
	adaptive_function();
	//SLIDERS
	if ($('.maintypes__slider').length > 0) {
		$('.maintypes__slider').slick({
			//autoplay: true,
			//infinite: false,
			dots: false,
			arrows: true,
			accessibility: false,
			slidesToShow: 5,
			autoplaySpeed: 3000,
			//asNavFor:'',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 1170,
				settings: {
					slidesToShow: 4
				}
			}, {
				breakpoint: 992,
				settings: {
					slidesToShow: 3
				}
			}, {
				breakpoint: 768,
				settings: {
					slidesToShow: 2
				}
			}, {
				breakpoint: 480,
				settings: {
					slidesToShow: 1
				}
			}]
		});
	}
	if ($('.other-objects__slider').length > 0) {
		let slider = $('.other-objects__slider');
		slider.slick({
			//autoplay: true,
			//infinite: false,
			dots: true,
			arrows: true,
			accessibility: false,
			slidesToShow: 3,
			autoplaySpeed: 3000,
			//asNavFor:'',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 992,
				settings: {
					slidesToShow: 2
				}
			}, {
				breakpoint: 650,
				settings: {
					slidesToShow: 1
				}
			}]
		});
		slick_options(slider);
		slider.on('breakpoint', function (event, slick, breakpoint) {
			slick_options(slider);
		});
		function slick_options(slider) {
			if (slider.find('.slick-dots li').length == 1) {
				slider.find('.slick-dots').hide();
			} else {
				slider.find('.slick-dots').show();
			}
			slick_fix(slider);
		}
	}
	if ($('.reviews-object__items').length > 0) {
		let slider = $('.reviews-object__items');
		function reviews_object() {
			slider.slick({
				dots: true,
				arrows: false,
				accessibility: false,
				slidesToShow: 1,
				autoplaySpeed: 3000,
				//asNavFor:'',
				//appendDots:
				//appendArrows:$('.mainslider-arrows .container'),
				nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
				prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
				responsive: [{
					breakpoint: 9999,
					settings: 'unslick'
				}, {
					breakpoint: 768,
					settings: {

					}
				}]
			});
		}
		reviews_object();
		$(window).resize(function (event) {
			var w = $(this).outerWidth();
			if (w < 768 && !slider.hasClass('slick-initialized')) {
				reviews_object();
			}
		});
	}
	if ($('.slider-images-object').length > 0) {
		$('.slider-images-object').slick({
			//autoplay: true,
			infinite: true,
			fade: true,
			arrows: true,
			dots: true,
			accessibility: false,
			slidesToShow: 1,
			autoplaySpeed: 3000,
			asNavFor: '.sub-slider-images-object',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {
					arrows: true,
					dots: true
				}
			}]
		});
		$('.slider-images-object').on('lazyLoaded', function (event, slick, direction) {
			ibg();
		});
		$.each($('.slider-images-object .slider-images-object__slide'), function (index, val) {
			let im = $(this).find('img').data('lazy');
			if (im == '' || im == null) {
				im = $(this).find('img').attr('src');
			}
			//$('.sub-slider-images-object').append('<div class="sub-slider-images-object__slide"><div class="sub-slider-images-object__image ibg"><img data-lazy="' + im + '" src="#" alt=""></div></div>');
		});
		$('.sub-slider-images-object').slick({
			//autoplay: true,
			infinite: true,
			fade: false,
			dots: false,
			arrows: true,
			accessibility: false,
			slidesToShow: 4,
			autoplaySpeed: 3000,
			asNavFor: '.slider-images-object',
			//asNavFor:'',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					arrows: false,
					centerMode: true
				}
			}]
		});
		$('.sub-slider-images-object').on('lazyLoaded', function (event, slick, direction) {
			ibg();
		});
		$(document).on('click', '.sub-slider-images-object__slide', function (e) {
			$('.slider-images-object').slick('goTo', $(this).data('slick-index'));
		});
		//.sub-slider-images-object__slide
	}

	function gallery(slider, index) {
		let c = 0;
		$.each(slider.find('.slick-slide>a'), function (index, val) {
			let im = $(this).data('image');
			$('.gallery__slider').append('<div class="gallery__slide"><div class="gallery__image"><img src="' + im + '" alt=""></div></div>');
			$('.gallery__subslider').append('<div class="gallery__subslide"><div class="gallery__subimage ibg"><img src="' + im + '" alt=""></div></div>');
			c++;
			ibg();
		});
		$('.gallery__slider').slick({
			//autoplay: true,
			infinite: true,
			fade: true,
			arrows: true,
			dots: true,
			//adaptiveHeight:true,
			accessibility: false,
			slidesToShow: 1,
			autoplaySpeed: 3000,
			asNavFor: '.gallery__subslider',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {

				}
			}]
		});
		$('.gallery__subslider').slick({
			//autoplay: true,
			infinite: true,
			fade: false,
			dots: false,
			arrows: false,
			accessibility: false,
			slidesToShow: 1,
			variableWidth: true,
			autoplaySpeed: 3000,
			asNavFor: '.gallery__slider',
			//appendDots:
			//appendArrows:$('.mainslider-arrows .container'),
			nextArrow: '<button type="button" class="slick-next ic-arrow"></button>',
			prevArrow: '<button type="button" class="slick-prev ic-arrow"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {

				}
			}]
		});

		$('.gallery__counter span').eq(1).text(c);
		$('.gallery__slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			let n = nextSlide + 1;
			$('.gallery__counter span').eq(0).text(n);
		});
		$(document).on('click', '.gallery__subslide', function (e) {
			$('.gallery__slider').slick('goTo', $(this).data('slick-index'));
		});

		$('.gallery__slider').slick('goTo', index);
	}

	function slick_fix(slider) {
		var sltoshow = slider.get(0).slick.options.slidesToShow;
		var all = slider.find('.slick-slide').length;
		var allactive = slider.find('.slick-slide').not('.slick-cloned').length;
		slider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			if (nextSlide == 0) {
				var ind = all - allactive;
				if (sltoshow == 1) {
					slider.find('.slick-slide').eq(ind).addClass('active');
				} else {
					sliderfix(slider, ind);
				}
			}
			if (nextSlide == allactive - 1) {
				if (sltoshow == 1) {
					slider.find('.slick-slide').eq(0).addClass('active');
				} else {
					sliderfix(slider, sltoshow - 1);
				}
			}
			//DIRECTION
			if (currentSlide === 0 && nextSlide === slick.$slides.length - 1) {
				direction = 'prev';
			} else if (nextSlide > currentSlide || (currentSlide === (slick.$slides.length - 1) && nextSlide === 0)) {
				direction = 'next';
			} else {
				direction = 'prev';
			}
			//console.log(direction);
		});
		slider.on('afterChange', function (event, slick, currentSlide) {
			slider.find('.slick-slide').removeClass('active');
		});
		function sliderfix(slider, v) {
			for (var i = 0; i < sltoshow; i++) {
				var n = v + i;
				slider.find('.slick-slide').eq(n).addClass('active');
			}
		}
	}
	//FORMS
	function forms() {
		//SELECT
		if ($('select').length > 0) {
			function selectscrolloptions() {
				var scs = 100;
				var mss = 50;
				if (isMobile.any()) {
					scs = 10;
					mss = 1;
				}
				var opt = {
					cursorcolor: "#2078e5",
					cursorwidth: "6px",
					background: "",
					autohidemode: false,
					bouncescroll: false,
					cursorborderradius: "0px",
					scrollspeed: scs,
					mousescrollstep: mss,
					directionlockdeadzone: 0,
					cursorborder: "0px solid #fff",
				};
				return opt;
			}

			function select() {
				$.each($('select'), function (index, val) {
					var ind = index;
					$(this).hide();
					if ($(this).parent('.select-block').length == 0) {
						$(this).wrap("<div class='select-block " + $(this).attr('class') + "-select-block'></div>");
					} else {
						$(this).parent('.select-block').find('.select').remove();
					}
					var cl = '';
					var milti = '';
					var check = '';
					var sblock = $(this).parent('.select-block');
					var soptions = "<div class='select-options'><div class='select-options-scroll'><div class='select-options-list'>";
					if ($(this).attr('multiple') == 'multiple') {
						milti = 'multiple';
						check = 'check';
					}
					$.each($(this).find('option'), function (index, val) {
						if ($(this).attr('value') != '') {
							if ($(this).attr('class') != '' && $(this).attr('class') != null) {
								cl = $(this).attr('class');
							}
							soptions = soptions + "<div data-value='" + $(this).attr('value') + "' class='select-options__value_" + ind + " select-options__value value_" + $(this).val() + " " + cl + " " + check + "'>" + $(this).html() + "</div>";
						} else if ($(this).parent().attr('data-label') == 'on') {
							if (sblock.find('.select__label').length == 0) {
								sblock.prepend('<div class="select__label">' + $(this).html() + '</div>');
							}
						}
					});
					soptions = soptions + "</div></div></div>";
					if ($(this).attr('data-type') == 'search') {
						sblock.append("<div data-type='search' class='select_" + ind + " select" + " " + $(this).attr('class') + "__select " + milti + "'>" +
							"<div class='select-title'>" +
							"<div class='select-title__arrow ion-ios-arrow-down'></div>" +
							"<input data-value='" + $(this).find('option[selected="selected"]').html() + "' class='select-title__value value_" + $(this).find('option[selected="selected"]').val() + "' />" +
							"</div>" +
							soptions +
							"</div>");
						$('.select_' + ind).find('input.select-title__value').jcOnPageFilter({
							parentSectionClass: 'select-options_' + ind,
							parentLookupClass: 'select-options__value_' + ind,
							childBlockClass: 'select-options__value_' + ind
						});
					} else {
						sblock.append("<div class='select_" + ind + " select" + " " + $(this).attr('class') + "__select " + milti + "'>" +
							"<div class='select-title'>" +
							"<div class='select-title__arrow ion-ios-arrow-down'></div>" +
							"<div class='select-title__value value_" + $(this).find('option[selected="selected"]').val() + "'>" + $(this).find('option[selected="selected"]').html() + "</div>" +
							"</div>" +
							soptions +
							"</div>");
					}
					if ($(this).find('option[selected="selected"]').val() != '') {
						sblock.find('.select').addClass('focus');
					}
					if ($(this).attr('data-req') == 'on') {
						$(this).addClass('req');
					}
					$(".select_" + ind + " .select-options-scroll").niceScroll('.select-options-list', selectscrolloptions());
				});
			}
			select();

			$('body').on('keyup', 'input.select-title__value', function () {
				$('.select').not($(this).parents('.select')).removeClass('active').find('.select-options').slideUp(50);
				$(this).parents('.select').addClass('active');
				$(this).parents('.select').find('.select-options').slideDown(100, function () {
					$(this).find(".select-options-scroll").getNiceScroll().resize();
				});
				$(this).parents('.select-block').find('select').val('');
			});
			$('body').on('click', '.select-title', function () {
				let select = $(this).parents('.select');
				select.not($(this).parents('.select')).removeClass('active').find('.select-options').slideUp(50);
				select.toggleClass('active');
				select.find('.select-options').slideToggle(100, function () {
					$(this).find(".select-options-scroll").getNiceScroll().resize();
				});

				var input = $(this).parent().find('select');
				removeError(input);

				if (select.attr('data-type') == 'search') {
					if (!select.hasClass('active')) {
						searchselectreset();
					}
					select.find('.select-options__value').show();
				}

				var cl = $.trim(select.find('.select-title__value').attr('class').replace('select-title__value', ''));
				select.find('.select-options__value').show().removeClass('hide').removeClass('last');
				if (cl != '') {
					select.find('.select-options__value.' + cl).hide().addClass('hide');
				}
				if (select.find('.select-options__value').last().hasClass('hide')) {
					select.find('.select-options__value').last().prev().addClass('last');
				}
			});
			/*
			$('body').on('click', '.select', function () {
				if (!$(this).hasClass('disabled')) {
					$('.select').not(this).removeClass('active').find('.select-options').slideUp(50);
					$(this).toggleClass('active');
					$(this).find('.select-options').slideToggle(100, function () {
						$(this).find(".select-options-scroll").getNiceScroll().resize();
					});

					var input = $(this).parent().find('select');
					removeError(input);

					if ($(this).attr('data-type') == 'search') {
						if (!$(this).hasClass('active')) {
							searchselectreset();
						}
						$(this).find('.select-options__value').show();
					}

					var cl = $.trim($(this).find('.select-title__value').attr('class').replace('select-title__value', ''));
					$(this).find('.select-options__value').show().removeClass('hide').removeClass('last');
					if (cl != '') {
						$(this).find('.select-options__value.' + cl).hide().addClass('hide');
					}
					if ($(this).find('.select-options__value').last().hasClass('hide')) {
						$(this).find('.select-options__value').last().prev().addClass('last');
					}

				}
			});
			*/
			$('body').on('click', '.select-options__value', function () {
				if ($(this).parents('.select').hasClass('multiple')) {
					if ($(this).hasClass('active')) {
						if ($(this).parents('.select').find('.select-title__value span').length > 0) {
							$(this).parents('.select').find('.select-title__value').append('<span data-value="' + $(this).data('value') + '">, ' + $(this).html() + '</span>');
						} else {
							$(this).parents('.select').find('.select-title__value').data('label', $(this).parents('.select').find('.select-title__value').html());
							$(this).parents('.select').find('.select-title__value').html('<span data-value="' + $(this).data('value') + '">' + $(this).html() + '</span>');
						}
						$(this).parents('.select-block').find('select').find('option').eq($(this).index() + 1).prop('selected', true);
						$(this).parents('.select').addClass('focus');
					} else {
						$(this).parents('.select').find('.select-title__value').find('span[data-value="' + $(this).data('value') + '"]').remove();
						if ($(this).parents('.select').find('.select-title__value span').length == 0) {
							$(this).parents('.select').find('.select-title__value').html($(this).parents('.select').find('.select-title__value').data('label'));
							$(this).parents('.select').removeClass('focus');
						}
						$(this).parents('.select-block').find('select').find('option').eq($(this).index() + 1).prop('selected', false);
					}
					return false;
				}

				if ($(this).parents('.select').attr('data-type') == 'search') {
					$(this).parents('.select').find('.select-title__value').val($(this).html());
					$(this).parents('.select').find('.select-title__value').attr('data-value', $(this).html());
				} else {
					$(this).parents('.select').find('.select-title__value').attr('class', 'select-title__value value_' + $(this).data('value'));
					$(this).parents('.select').find('.select-title__value').html($(this).html());

				}

				$(this).parents('.select-block').find('select').find('option').removeAttr("selected");
				if ($.trim($(this).data('value')) != '') {
					$(this).parents('.select-block').find('select').val($(this).data('value'));
					$(this).parents('.select-block').find('select').find('option[value="' + $(this).data('value') + '"]').attr('selected', 'selected');
				} else {
					$(this).parents('.select-block').find('select').val($(this).html());
					$(this).parents('.select-block').find('select').find('option[value="' + $(this).html() + '"]').attr('selected', 'selected');
				}


				if ($(this).parents('.select-block').find('select').val() != '') {
					$(this).parents('.select-block').find('.select').addClass('focus');
				} else {
					$(this).parents('.select-block').find('.select').removeClass('focus');

					$(this).parents('.select-block').find('.select').removeClass('err');
					$(this).parents('.select-block').parent().removeClass('err');
					$(this).parents('.select-block').removeClass('err').find('.form__error').remove();
				}
				if (!$(this).parents('.select').data('tags') != "") {
					if ($(this).parents('.form-tags').find('.form-tags__item[data-value="' + $(this).data('value') + '"]').length == 0) {
						$(this).parents('.form-tags').find('.form-tags-items').append('<a data-value="' + $(this).data('value') + '" href="" class="form-tags__item">' + $(this).html() + '<span class="fa fa-times"></span></a>');
					}
				}
				$(this).parents('.select-block').find('select').change();

				if ($(this).parents('.select-block').find('select').data('update') == 'on') {
					select();
				}

				$(this).parents('.select').toggleClass('active');
				$(this).parents('.select').find('.select-options').slideToggle(100, function () {
					$(this).parents('.select').find(".select-options-scroll").getNiceScroll().resize();
				});
			});
			$(document).on('click touchstart', function (e) {
				if (!$(e.target).is(".select *") && !$(e.target).is(".select") && !$(e.target).is(".nicescroll-rails,.nicescroll-rails*")) {
					$('.select').removeClass('active');
					$('.select-options').slideUp(50, function () { });
					searchselectreset();
				};
			});
			$(document).on('keydown', function (e) {
				if (e.which == 27) {
					$('.select').removeClass('active');
					$('.select-options').slideUp(50, function () { });
					searchselectreset();
				}
			});
		}
		//FIELDS
		$('input,textarea').focus(function () {
			if ($(this).val() == $(this).attr('data-value')) {
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				if ($(this).attr('data-type') == 'pass') {
					$(this).attr('type', 'password');
				};
				$(this).val('');
			};
			removeError($(this));
		});
		$('input[data-value], textarea[data-value]').each(function () {
			if (this.value == '' || this.value == $(this).attr('data-value')) {
				if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
					$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
				} else {
					this.value = $(this).attr('data-value');
				}
			}
			if (this.value != $(this).attr('data-value') && this.value != '') {
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
					$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
				}
			}

			$(this).click(function () {
				if (this.value == $(this).attr('data-value')) {
					if ($(this).attr('data-type') == 'pass') {
						$(this).attr('type', 'password');
					};
					this.value = '';
				};
			});
			$(this).blur(function () {
				if (this.value == '') {
					if (!$(this).hasClass('l')) {
						this.value = $(this).attr('data-value');
					}
					$(this).removeClass('focus');
					$(this).parent().removeClass('focus');
					if ($(this).attr('data-type') == 'pass') {
						$(this).attr('type', 'text');
					};
				};
				if ($(this).hasClass('vn')) {
					formValidate($(this));
				}
			});
		});
		$('.form-input__viewpass').click(function (event) {
			if ($(this).hasClass('active')) {
				$(this).parent().find('input').attr('type', 'password');
			} else {
				$(this).parent().find('input').attr('type', 'text');
			}
			$(this).toggleClass('active');
		});

		//$('textarea').autogrow({vertical: true, horizontal: false});

		//MASKS//
		//'+7(999) 999 9999'
		//'+38(999) 999 9999'
		//'+375(99)999-99-99'
		//'a{3,1000}' только буквы минимум 3
		//'9{3,1000}' только цифры минимум 3
		$.each($('input.phone'), function (index, val) {
			$(this).attr('type', 'tel');
			$(this).focus(function () {
				$(this).inputmask('+38(099) 999 99 99', {
					clearIncomplete: true,
					//removeMaskOnSubmit: true,
					clearMaskOnLostFocus: true,
					"onincomplete": function () { maskclear($(this)); }
				});
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
		});
		$('input.phone').focusout(function (event) {
			maskclear($(this));
		});

		$.each($('input.site'), function (index, val) {
			$(this).focus(function () {
				$(this).inputmask('http://*{0,100000}', {
					clearIncomplete: true,
					//removeMaskOnSubmit: true,
					clearMaskOnLostFocus: true,
					"onincomplete": function () { maskclear($(this)); }
				});
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
		});
		$('input.site').focusout(function (event) {
			maskclear($(this));
		});

		$.each($('input.phone_submit'), function (index, val) {
			$(this).attr('type', 'tel');
			$(this).focus(function () {
				$(this).inputmask('+38(099) 999 99 99', {
					clearIncomplete: true,
					//removeMaskOnSubmit: true,
					clearMaskOnLostFocus: true,
					"oncomplete": function () {
						$(this).parents('form').submit();
					},
					"onincomplete": function () { maskclear($(this)); }
				});
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
		});

		$('input.phone_submit').focusout(function (event) {
			maskclear($(this));
		});

		$.each($('input.smscode'), function (index, val) {
			$(this).focus(function () {
				$(this).inputmask('99-99', {
					clearIncomplete: true,
					placeholder: "",
					clearMaskOnLostFocus: true,
					"oncomplete": function () {
						$(this).parents('form').submit();
					},
					"onincomplete": function () { maskclear($(this)); }
				});
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
		});
		$('input.smscode').focusout(function (event) {
			maskclear($(this));
		});

		$.each($('input.num'), function (index, val) {
			$(this).focus(function () {
				$(this).inputmask('9{1,1000}', { clearIncomplete: true, placeholder: "", clearMaskOnLostFocus: true, "onincomplete": function () { maskclear($(this)); } });
				$(this).addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
		});
		$('input.num').focusout(function (event) {
			maskclear($(this));
		});

		$.each($('input.date'), function (index, val) {
			$(this).focus(function () {
				$(this).inputmask('dd.mm.yyyy', {
					clearIncomplete: true,
					placeholder: "_",
					//yearrange:{'minyear':n-40,'maxyear':n},
					clearMaskOnLostFocus: true,
					"onincomplete": function () { maskclear($(this)); },
					"oncomplete": function () {
						$(this).datepicker("setDate", $(this).val());
					}
				});
				$(this).addClass('focus');
				$(this).parents('.form-column').addClass('focus');
				$(this).parent().addClass('focus');
				$(this).parent().removeClass('err');
				$(this).removeClass('err');
			});
			$(this).focusout(function (event) {
				maskclear($(this));
			});
			$(this).datepicker({
				dateFormat: "dd.mm.yy",
				//yearRange: "1915:2015",
				//defaultDate: '-18Y', 
				//inDate: '-85Y', 
				//maxDate: "0Y",
				beforeShow: function (event) {
					$('.ui-datepicker').show();
				},
				onSelect: function (event) {
					if ($(this).val() != $(this).attr('data-value') && $(this).val() != '') {
						$(this).addClass('focus');
						$(this).parent().addClass('focus');
						if ($(this).hasClass('l') && $(this).parent().find('.form__label').length == 0) {
							$(this).parent().append('<div class="form__label">' + $(this).attr('data-value') + '</div>');
						}
					}
				}
			});
		});

		//CHECK
		$.each($('.check'), function (index, val) {
			if ($(this).find('input').prop('checked') == true) {
				$(this).addClass('active');
			}
		});
		$('body').off('click', '.check', function (event) { });
		$('body').on('click', '.check', function (event) {
			if (!$(this).hasClass('disable')) {
				var target = $(event.target);
				if (!target.is("a")) {
					$(this).toggleClass('active');
					if ($(this).hasClass('active')) {
						$(this).find('input').prop('checked', true);
					} else {
						$(this).find('input').prop('checked', false);
					}
				}
			}
		});

		//OPTION
		$.each($('.option.active'), function (index, val) {
			$(this).find('input').prop('checked', true);
		});
		$('.option').click(function (event) {
			if (!$(this).hasClass('disable')) {
				var target = $(event.target);
				if (!target.is("a")) {
					if ($(this).hasClass('active') && $(this).hasClass('order')) {
						$(this).toggleClass('orderactive');
					}
					$(this).parents('.options').find('.option').removeClass('active');
					$(this).toggleClass('active');
					$(this).children('input').prop('checked', true);
				}
			}
		});
		//RATING
		$('.rating.edit .star').hover(function () {
			var block = $(this).parents('.rating');
			block.find('.rating__activeline').css({ width: '0%' });
			var ind = $(this).index() + 1;
			var linew = ind / block.find('.star').length * 100;
			setrating(block, linew);
		}, function () {
			var block = $(this).parents('.rating');
			block.find('.star').removeClass('active');
			var ind = block.find('input').val();
			var linew = ind / block.find('.star').length * 100;
			setrating(block, linew);
		});
		$('.rating.edit .star').click(function (event) {
			var block = $(this).parents('.rating');
			var re = $(this).index() + 1;
			block.find('input').val(re);
			var linew = re / block.find('.star').length * 100;
			setrating(block, linew);
		});
		$.each($('.rating'), function (index, val) {
			var ind = $(this).find('input').val();
			var linew = ind / $(this).parent().find('.star').length * 100;
			setrating($(this), linew);
		});
		function setrating(th, val) {
			th.find('.rating__activeline').css({ width: val + '%' });
		}
		//QUANTITY
		$('.quantity__btn').click(function (event) {
			var n = parseInt($(this).parent().find('.quantity__input').val());
			if ($(this).hasClass('dwn')) {
				n = n - 1;
				if (n < 1) { n = 1; }
			} else {
				n = n + 1;
			}
			$(this).parent().find('.quantity__input').val(n);
			return false;
		});
		//RANGE
		if ($("#range").length > 0) {
			$("#range").slider({
				range: true,
				min: 0,
				max: 5000,
				values: [0, 5000],
				slide: function (event, ui) {
					$('#rangefrom').val(ui.values[0]);
					$('#rangeto').val(ui.values[1]);
					$(this).find('.ui-slider-handle').eq(0).html('<span>' + ui.values[0] + '</span>');
					$(this).find('.ui-slider-handle').eq(1).html('<span>' + ui.values[1] + '</span>');
				},
				change: function (event, ui) {
					if (ui.values[0] != $("#range").slider("option", "min") || ui.values[1] != $("#range").slider("option", "max")) {
						$('#range').addClass('act');
					} else {
						$('#range').removeClass('act');
					}
				}
			});
			$('#rangefrom').val($("#range").slider("values", 0));
			$('#rangeto').val($("#range").slider("values", 1));

			$("#range").find('.ui-slider-handle').eq(0).html('<span>' + $("#range").slider("option", "min") + '</span>');
			$("#range").find('.ui-slider-handle').eq(1).html('<span>' + $("#range").slider("option", "max") + '</span>');

			$("#rangefrom").bind("change", function () {
				if ($(this).val() * 1 > $("#range").slider("option", "max") * 1) {
					$(this).val($("#range").slider("option", "max"));
				}
				if ($(this).val() * 1 < $("#range").slider("option", "min") * 1) {
					$(this).val($("#range").slider("option", "min"));
				}
				$("#range").slider("values", 0, $(this).val());
			});
			$("#rangeto").bind("change", function () {
				if ($(this).val() * 1 > $("#range").slider("option", "max") * 1) {
					$(this).val($("#range").slider("option", "max"));
				}
				if ($(this).val() * 1 < $("#range").slider("option", "min") * 1) {
					$(this).val($("#range").slider("option", "min"));
				}
				$("#range").slider("values", 1, $(this).val());
			});
			$("#range").find('.ui-slider-handle').eq(0).addClass('left');
			$("#range").find('.ui-slider-handle').eq(1).addClass('right');
		}
		//ADDFILES
		$('.form-addfile__input').change(function (e) {
			if ($(this).val() != '') {
				var ts = $(this);
				ts.parents('.form-addfile').find('ul.form-addfile-list').html('');
				$.each(e.target.files, function (index, val) {
					if (ts.parents('.form-addfile').find('ul.form-addfile-list>li:contains("' + e.target.files[index].name + '")').length == 0) {
						ts.parents('.form-addfile').find('ul.form-addfile-list').append('<li>' + e.target.files[index].name + '</li>');
					}
				});
			}
		});
	}
	forms();

	function digi(str) {
		var r = str.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
		return r;
	}

	$('.check_in_base').blur(function (event) {
		let fn;
		let form = $(this).parents('form');
		let btn = form.find('button[type="submit"]');
		let input = $(this);
		if (!$(this).hasClass('err') && $(this).val() != '' && $(this).val() != $(this).data('value')) {
			btn.prop('disabled', true);
			if ($(this).hasClass('email')) {
				fn = check_in_base('c4_checkEmail', $(this).val());
			}
			if ($(this).hasClass('phone')) {
				fn = check_in_base('c4_checkPhone', $(this).val());
			}
			fn.done(function (data) {
				if (data['status'] == 'done') { }
				if (data['status'] == 'error') {
					addError(input, data['message']);
				}
				btn.prop('disabled', false);
			});
			fn.fail(function (data) {
				btn.prop('disabled', false);
			});
		}
	});


	function clearForm(form) {
		$.each(form.find('input'), function (index, val) {
			$(this).val('');
			$(this).blur();
		});
	}

	//VALIDATE FORMS
	$('form').submit(function () {
		let er = 0;
		let form = $(this);
		let btn = $(this).find('button[type="submit"]');
		let ms = form.data('ms');

		$.each(form.find('input'), function (index, val) {
			if ($(this).data('value') == $(this).val()) {
				$(this).val('');
			}
		});

		$.each(form.find('.req'), function (index, val) {
			if ($(this).prop('disabled') == false) {
				er += formValidate($(this));
			}
		});
		if (form.hasClass('_form-add')) {
			er += form_add_validate();
		}
		if (er == 0) {
			btn.prop('disabled', true);
			removeFormError(form);

			if (form.hasClass('__form')) {
				let fn;
				let status = 'done';
				if (form.hasClass('__form-subscribe')) {
					fn = send_subscribe(form);
				}
				if (form.hasClass('__form-ask')) {
					fn = send_ask(form);
				}
				if (form.hasClass('__form-report')) {
					fn = send_report(form);
				}
				form.addClass('loading');
				fn.done(function (data) {
					if (data['status'] == status) {
						showMessage(data['message']);
						showMessageByClass('ms_message');
					} else {
						showMessage(data['message']);
						showMessageByClass('ms_message');
					}
					btn.prop('disabled', false);
					form.removeClass('loading');
				});
				fn.fail(function () {
					showMessage('Ошибка');
					showMessageByClass('ms_message');
				});
				return false;
			}
			if (form.hasClass('__form-account')) {
				let fn = send_account(form);
				form.addClass('loading');
				fn.done(function (data) {
					console.log(data);
					if (data['status'] == 'ok') {
						showMessage(data['message']);
						showMessageByClass('ms_message');
					}
					if (data['status'] == 'error') {
						$.each(data['errors'], function (index, val) {
							if (data['errors'][index]['errdiv'] == 'form') {
								addFormError(form, data['errors'][index]['mess']);
							}
							addError(form.find('input[name="' + data['errors'][index]['errdiv'] + '"]'), data['errors'][index]['mess']);
						});
						$('body,html').animate({ scrollTop: $('.err').offset().top - ($('.header__top').outerHeight() + 30) }, 300);
					}
					form.removeClass('loading');
					btn.prop('disabled', false);
				});
				fn.fail(function (data) {
					btn.prop('disabled', false);
				});
				return false;
			}
			if (form.hasClass('__form-account-xml')) {
				let fn = send_account_xml(form);
				form.addClass('loading');
				fn.done(function (data) {
					if (data['status'] == 'ok') {
						showMessage(data['message']);
						showMessageByClass('ms_message');
					}
					if (data['status'] == 'error') {
						addFormError(form, data['error']);
					}
					form.removeClass('loading');
					btn.prop('disabled', false);
				});
				fn.fail(function (data) {
					btn.prop('disabled', false);
				});
				return false;
			}
			if (form.hasClass('_form-confirm-sms')) {
				let code = form.find('input');
				let fn = send_confirm_sms(code.val());
				form.addClass('loading');
				fn.done(function (data) {
					if (data['status'] == 'confirm') {
						popupClose();
						$('._confirm-block_phone').find('.table-data__status').html('<div class="table-data__ok"></div>');
						$('.phone_confirm').prop('disabled', true);
					}
					if (data['status'] == 'error') {
						addError(code, data['message']);
					}
					btn.prop('disabled', false);
				});
				fn.fail(function (data) {
					btn.prop('disabled', false);
				});
				return false;
			}
			if (form.hasClass('js-authform')) {
				let fn;
				let phone = form.parents('.js-auth').find('.js-sms_phone');
				let code = form.find('.js-sms_code');
				let email = form.find('.js-email_value');
				if (form.hasClass('js-authform_sms')) {
					fn = send_sms(form);
					fn.done(function (data) {
						if (data['status'] == 'ok') {
							$('.js-authform').hide();
							$('.js-authform.js-authform_smscode').show();
						}
						if (data['status'] == 'error' || data['status'] == 'no_send') {
							addError(phone, data['message']);
						}
						btn.prop('disabled', false);
					});
					fn.fail(function (data) {
						btn.prop('disabled', false);
					});
				}
				if (form.hasClass('js-authform_smscode')) {
					fn = send_code(form);
					fn.done(function (data) {
						if (data['status'] == 'reg' || data['status'] == 'login') {
							window.location.href = domain + '/user/realt.php';
						}
						if (data['status'] == 'error') {
							addError(code, data['message']);
						}
						if (data['status'] == 'timeout') {
							phone.attr('data-error', data['message']);
							addError(phone);
							$('.js-authform').hide();
							$('.js-authform.js-authform_sms').show();
						}
						btn.prop('disabled', false);
					});
					fn.fail(function (data) {
						btn.prop('disabled', false);
					});
				}
				if (form.hasClass('js-authform_email')) {
					fn = send_loginbyemail(form);
					fn.done(function (data) {
						if (data['status'] == 'done') {
							window.location.href = domain + '/user/realt.php';
						}
						if (data['status'] == 'error') {
							addError(email, data['message']);
						}
						btn.prop('disabled', false);
					});
					fn.fail(function (data) {
						btn.prop('disabled', false);
					});
				}
				if (form.hasClass('js-authform_lost')) {
					let input = form.find('.input');
					fn = send_lost(form);
					fn.done(function (data) {
						if (data['status'] == 'done') {
							form.find('.form__message').text(data['message']);
						}
						if (data['status'] == 'error') {
							addError(input, data['message']);
						}
						btn.prop('disabled', false);
					});
					fn.fail(function (data) {
						btn.prop('disabled', false);
					});
				}
				if (form.hasClass('salivon')) {
                    var urladd = '';
                    if (lang == 'ua') {
                        urladd = 'ua/';
                    }
					form.attr('action', domain + '/' + urladd + 'user/liqpay.php?a=reklama');
				}
				if (form.hasClass('js-authform_reg')) {
					fn = send_reg(form);
					fn.done(function (data) {
						if (data['status'] == 'done') {
							window.location.href = domain + '/user/realt.php';
						}
						if (data['status'] == 'error') {
							$.each(data['message'], function (index, val) {
								addError(form.find('.js-reg_' + data['message'][index]['errdiv']), data['message'][index]['mess']);
							});
						}
						btn.prop('disabled', false);
					});
					fn.fail(function (data) {
						btn.prop('disabled', false);
					});
				}
				return false;
			}
			if (form.hasClass('salivon')) {
                var urladd = '';
                if (lang == 'ua') {
                    urladd = 'ua/';
                }
                form.attr('action', domain + '/' + urladd + 'user/liqpay.php?a=reklama');
				//form.attr('action', domain + '/pay.php?a=reklama');
			}
			if (form.hasClass('_form-add')) {
				form_add_send();
				btn.prop('disabled', false);
				return false;
			}
			if (ms != null && ms != '') {
				showMessageByClass(ms);
				return false;
			}
		} else {
			$('body,html').animate({ scrollTop: $('.err').offset().top - ($('.header__top').outerHeight() + 30) }, 300);
			return false;
		}
	});
	function formValidate(input) {
		var er = 0;
		var form = input.parents('form');
		if (input.attr('name') == 'email' || input.hasClass('email')) {
			if (input.val() != input.attr('data-value')) {
				var em = input.val().replace(" ", "");
				input.val(em);
			}
			if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.val())) || input.val() == input.attr('data-value')) {
				er++;
				addError(input);
			} else {
				removeError(input);
			}
		} else {
			if (input.val() == '' || input.val() == input.attr('data-value')) {
				er++;
				addError(input);
			} else {
				removeError(input);
			}
		}
		if (input.attr('type') == 'checkbox') {
			if (input.prop('checked') == true) {
				input.removeClass('err').parent().removeClass('err');
			} else {
				er++;
				input.addClass('err').parent().addClass('err');
			}
		}
		if (input.hasClass('phone')) {
			let codes = ['050', '066', '095', '099', '067', '096', '097', '098', '068', '063', '073', '093', '094', '091', '039', '092', '978', '071', '072'];
			let input_code = input.val();
			input_code = input_code[4] + input_code[5] + input_code[6];
			if (codes.indexOf(input_code) == -1) {
				er++;
				addError(input);
			}
		}
		if (input.hasClass('name')) {
			if (!(/^[А-Яа-яa-zA-Z-]+( [А-Яа-яa-zA-Z-]+)$/.test(input.val()))) {
				er++;
				addError(input);
			}
		}
		if (input.hasClass('pass-2')) {
			if (form.find('.pass-1').val() != form.find('.pass-2').val()) {
				addError(input);
			} else {
				removeError(input);
			}
		}
		return er;
	}
	function formLoad() {
		$('.popup').hide();
		$('.popup-message-body').hide();
		$('.popup-message .popup-body').append('<div class="popup-loading"><div class="popup-loading__title">Идет загрузка...</div><div class="popup-loading__icon"></div></div>');
		$('.popup-message').addClass('active').fadeIn(300);
	}
	function showMessageByClass(ms) {
		$('.popup').hide();
		popupOpen('message.' + ms, '');
	}
	function showMessage(html) {
		$('.popup-message__text').html(html);
	}
	function clearForm(form) {
		$.each(form.find('.input'), function (index, val) {
			$(this).removeClass('focus').val($(this).data('value'));
			$(this).parent().removeClass('focus');
			if ($(this).hasClass('phone')) {
				maskclear($(this));
			}
		});
	}
	function addError(input, er) {
		let error = input.attr('data-error');
		if (er != '' && er != null) {
			error = er;
		}
		input.addClass('err');
		input.parent().addClass('err');
		input.parent().find('.form__error').remove();
		if (input.hasClass('email')) {
			if (input.val() == '' || input.val() == input.attr('data-value')) {

			} else {

			}
			if (error != null) {
				input.parent().append('<div class="form__error">' + error + '</div>');
			}
		} else {
			if (input.data('error') != null && input.parent().find('.form__error').length == 0) {
				input.parent().append('<div class="form__error">' + error + '</div>');
			}
		}
		if (input.parents('.select-block').length > 0) {
			input.parents('.select-block').parent().addClass('err');
			input.parents('.select-block').find('.select').addClass('err');
		}
	}
	function addErrorByName(form, input__name, error_text) {
		var input = form.find('[name="' + input__name + '"]');
		input.attr('data-error', error_text);
		addError(input);
	}
	function addFormError(form, error_text) {
		form.find('.form__generalerror').show().html(error_text);
	}
	function removeFormError(form) {
		form.find('.form__generalerror').hide().html('');
	}
	function removeError(input) {
		input.removeClass('err');
		input.parent().removeClass('err');
		input.parent().find('.form__error').remove();

		if (input.parents('.select-block').length > 0) {
			input.parents('.select-block').parent().removeClass('err');
			input.parents('.select-block').find('.select').removeClass('err');
			//.removeClass('active');
			//input.parents('.select-block').find('.select-options').hide();
		}
	}
	function removeFormErrors(form) {
		form.find('.err').removeClass('err');
		form.find('.form__error').remove();
	}
	function maskclear(n) {
		if (n.val() == "") {
			n.inputmask('remove');
			if (!n.hasClass('l')) {
				n.val(n.attr('data-value'));
			}
			n.removeClass('focus');
			n.parent().removeClass('focus');
		}
	}
	function searchselectreset() {
		$.each($('.select[data-type="search"]'), function (index, val) {
			var block = $(this).parent();
			var select = $(this).parent().find('select');
			if ($(this).find('.select-options__value:visible').length == 1) {
				$(this).addClass('focus');
				$(this).parents('.select-block').find('select').val($('.select-options__value:visible').data('value'));
				$(this).find('.select-title__value').val($('.select-options__value:visible').html());
				$(this).find('.select-title__value').attr('data-value', $('.select-options__value:visible').html());
			} else if (select.val() == '') {
				$(this).removeClass('focus');
				block.find('input.select-title__value').val(select.find('option[selected="selected"]').html());
				block.find('input.select-title__value').attr('data-value', select.find('option[selected="selected"]').html());
			}
		});
	}
	function clear_phone(n) {
		let phone = n.replace('+38', '');
		phone = phone.replace('(', '');
		phone = phone.replace(')', '');
		phone = phone.replace(' ', '');
		phone = phone.replace(' ', '');
		phone = phone.replace(' ', '');
		return phone;
	}
	let form_add = document.querySelector('._form-add');
	if (form_add) {
		form_add.querySelector('input[name="city_id"]').setAttribute('value', city_id);
		form_add.querySelector('input[name="city_url"]').setAttribute('value', city_url);
		form_add.querySelector('input[name="lang"]').setAttribute('value', lang);

		init__form();
		obj_type();

		$.each($('.table-data__option'), function (indexInArray, valueOfElement) {
			if ($(this).find('input').prop('checked') == true) {
				$(this).addClass('active');
			}
		});
		$('.table-data__option').click(function (param) {
			$(this).parents('.table-data__options').find('.table-data__option').removeClass('active');
			$(this).parents('.table-data__options').find('input').removeAttr('checked');
			$(this).addClass('active').find('input').attr('checked', 'checked');

			let v_value = $(this).find('input').val();
			let v_name = $(this).find('input').attr('name');

			if (v_name == 'fn_action' || v_name == 'fn_type') {
				init__form(1);
			}
		});

		let object_type = document.querySelectorAll('.table-data__object-type .option');
		for (let index = 0; index < object_type.length; index++) {
			const el = object_type[index];
			el.addEventListener('click', function (param) {
				obj_type();
			});
		}


		function init__form(n) {
			let fn_action = document.querySelector('input[name="fn_action"][checked]').getAttribute('value');
			let fn_type = document.querySelector('input[name="fn_type"][checked]').getAttribute('value');

			let type_block = document.querySelectorAll('.table-data__line_type');
			let object_type = document.querySelectorAll('.table-data__object-type .option');

			ex_bl('none');

			if (n == 1) {
				hide(object_type);
				for (let index = 0; index < object_type.length; index++) {
					const el = object_type[index];
					el.classList.remove('active');
					el.querySelector('input').removeAttribute('checked');
				}
			}
			if (fn_action == 2) {
				let for_rent = document.querySelectorAll('.table-data__object-type .option_rent');

				show(for_rent);
				show(type_block);

			} else if (fn_action == 1) {

				show(object_type);
				show(type_block);

			} else if (fn_action == 3) {
				let for_day = document.querySelectorAll('.table-data__object-type .option_day');

				show(for_day);

				hide(type_block);
				document.querySelector('.table-data__object-type .options__column_1').style.display = "block";
				document.querySelector('.table-data__object-type .options__column_2').style.display = "block";
			}
			if (fn_action != 3) {
				if (fn_type == 1) {
					document.querySelector('.table-data__object-type .options__column_1').style.display = "block";
					document.querySelector('.table-data__object-type .options__column_2').style.display = "none";
				} else {
					document.querySelector('.table-data__object-type .options__column_1').style.display = "none";
					document.querySelector('.table-data__object-type .options__column_2').style.display = "block";
				}
			}

			let all_units = document.querySelectorAll('.table-data__line_hide');
			hide(all_units);

			for (let index = 0; index < all_units.length; index++) {
				const all_unit = all_units[index];
				all_unit.querySelector('input').disabled = true;
			}

			req_blocks(form_add.querySelector('input[name="up_id_city"]').value);

			let rayon_block = document.querySelector('.table-data__line_rayon');
			let rayon_inp = document.querySelector('input[name="fn_district"]');
			let rayon_id = document.querySelector('input[name="up_id_district"]');
			if (rayon_id.value == 0) {
				rayon_inp.disabled = true;
				rayon_id.disabled = true;
				rayon_block.style.display = "none";
			}
			let subrayon_block = document.querySelector('.table-data__line_subrayon');
			let subrayon_inp = document.querySelector('input[name="fn_microdistrict"]');
			let subrayon_id = document.querySelector('input[name="up_id_microdistrict"]');
			if (subrayon_id.value == 0) {
				subrayon_inp.disabled = true;
				subrayon_id.disabled = true;
				subrayon_block.style.display = "none";
			}
			let metro_block = document.querySelector('.table-data__line_metro');
			let metro_id = document.querySelector('input[name="up_id_metro"]');
			if (metro_id.value == 0) {
				metro_block.style.display = "none";
			}
		}

		function req_blocks(c_id) {
			let rayon = document.querySelector('.table-data__row_rayon');
			rayon.querySelector('.table-data__label span').style.display = "none";
			rayon.querySelector('input').classList.remove('req');

			let subrayon = document.querySelector('.table-data__row_subrayon');
			subrayon.querySelector('.table-data__label span').style.display = "none";
			subrayon.querySelector('input').classList.remove('req');

			let street = document.querySelector('.table-data__row_street');
			street.querySelector('.table-data__label span').style.display = "none";
			street.querySelector('input').classList.remove('req');

			let house = document.querySelector('.table-data__row_house');
			house.querySelector('.table-data__label span').style.display = "none";
			house.querySelector('input').classList.remove('req');

			if (
				c_id == '29586' ||
				c_id == '29585' ||
				c_id == '29588' ||
				c_id == '29587'
			) {
				street.querySelector('.table-data__label span').style.display = 'inline-block';
				street.querySelector('input').classList.add('req');
				house.querySelector('.table-data__label span').style.display = 'inline-block';
				house.querySelector('input').classList.add('req');
				rayon.querySelector('.table-data__label span').style.display = 'inline-block';
				rayon.querySelector('input').classList.add('req');
				subrayon.querySelector('.table-data__label span').style.display = 'inline-block';
				subrayon.querySelector('input').classList.add('req');
			}
		}

		function ex_bl(action) {
			let ex_bl = document.querySelector('.add__block_ex');
			let ex_bl_inputs = ex_bl.querySelectorAll('input');
			if (action == 'none') {
				ex_bl.style.display = "none";
				for (let index = 0; index < ex_bl_inputs.length; index++) {
					const ex_bl_input = ex_bl_inputs[index];
					ex_bl_input.disabled = true;
				}
			} else {
				ex_bl.style.display = "block";
				for (let index = 0; index < ex_bl_inputs.length; index++) {
					const ex_bl_input = ex_bl_inputs[index];
					ex_bl_input.disabled = false;
				}
			}
		}

		// Работа отображения блоков в зависимости от типа 
		function obj_type() {
			let fn_action = document.querySelector('input[name="fn_action"][checked]').getAttribute('value');
			let object_type = document.querySelector('.table-data__object-type');
			let object_type_active = document.querySelector('.table-data__object-type .option.active');
			if (object_type_active) {
				let object_type_value = object_type_active.querySelector('input').getAttribute('value');

				let all_units = document.querySelectorAll('.table-data__line_hide');
				hide(all_units);

				for (let index = 0; index < all_units.length; index++) {
					const all_unit = all_units[index];
					all_unit.querySelector('input').setAttribute('disabled', 'disabled');
				}

				let area_ed = document.querySelectorAll('.area-ed');
				for (let index = 0; index < area_ed.length; index++) {
					const el = area_ed[index];
					el.classList.remove('active');
				}

				let more_info = document.querySelector('.add__block_more');
				more_info.style.display = "none";

				let more_info_inputs = more_info.querySelectorAll('input');
				for (let index = 0; index < more_info_inputs.length; index++) {
					const more_info_input = more_info_inputs[index];
					more_info_input.disabled = true;
				}

				let more_info_block = document.querySelectorAll('.more-add__block');
				more_info_block[0].style.display = "block";
				more_info_block[1].style.display = "none";


				let zkname = document.querySelector('.table-data__line_zkname'); // 1,3
				let area_life = document.querySelector('.table-data__line_area-life');// 1,2,3
				let area_kitchen = document.querySelector('.table-data__line_area-kitchen');// 1,2,3
				let area_garden = document.querySelector('.table-data__line_area-garden');// 2
				let area_rooms = document.querySelector('.table-data__line_rooms');// 1,2,3,9
				let area_rooms_deal = document.querySelector('.table-data__line_rooms-deal');// 9
				let area_floor = document.querySelector('.table-data__line_floor');// 1,3,9
				let area_floors = document.querySelector('.table-data__line_floors');// 1,2,3,9

				let area_rooms_label = area_rooms.querySelectorAll('.table-data__label');
				area_rooms_label[0].style.display = 'block';
				area_rooms_label[1].style.display = 'none';

				zkname.querySelector('.table-data__label span').style.display = 'none';
				zkname.querySelector('input').classList.remove('req');
				area_floors.querySelector('.table-data__label span').style.display = 'none';
				area_floors.querySelector('input').classList.remove('req');

				ex_bl('none');

				if (object_type_value == 1) {
					zkname.style.display = 'block';
					zkname.querySelector('input').removeAttribute('disabled');
					area_life.style.display = 'block';
					area_life.querySelector('input').removeAttribute('disabled');
					area_kitchen.style.display = 'block';
					area_kitchen.querySelector('input').removeAttribute('disabled');
					area_rooms.style.display = 'block';
					area_rooms.querySelector('input').removeAttribute('disabled');
					area_floor.style.display = 'block';
					area_floor.querySelector('input').removeAttribute('disabled');
					area_floors.style.display = 'block';
					area_floors.querySelector('input').removeAttribute('disabled');

					if (fn_action == 1 || fn_action == 2) {
						ex_bl('block');
					}


					area_floors.querySelector('.table-data__label span').style.display = 'inline-block';
					area_floors.querySelector('input').classList.add('req');

					more_info.style.display = "block";
					more_info_block[0].style.display = "block";
					more_info_block[1].style.display = "none";

					more_info_inputs = more_info_block[0].querySelectorAll('input');

					for (let index = 0; index < more_info_inputs.length; index++) {
						const more_info_input = more_info_inputs[index];
						more_info_input.disabled = false;
					}
				}
				if (object_type_value == 2) {
					area_life.style.display = 'block';
					area_life.querySelector('input').removeAttribute('disabled');
					area_kitchen.style.display = 'block';
					area_kitchen.querySelector('input').removeAttribute('disabled');
					area_garden.style.display = 'block';
					area_garden.querySelector('input').removeAttribute('disabled');
					area_rooms.style.display = 'block';
					area_rooms.querySelector('input').removeAttribute('disabled');
					area_floors.style.display = 'block';
					area_floors.querySelector('input').removeAttribute('disabled');

					more_info.style.display = "block";
					more_info_block[0].style.display = "none";
					more_info_block[1].style.display = "block";

					if (fn_action == 1 || fn_action == 2) {
						ex_bl('block');
					}

					more_info_inputs = more_info_block[1].querySelectorAll('input');

					for (let index = 0; index < more_info_inputs.length; index++) {
						const more_info_input = more_info_inputs[index];
						more_info_input.disabled = false;
					}

				}
				if (object_type_value == 3) {
					zkname.style.display = 'block';
					zkname.querySelector('input').removeAttribute('disabled');
					zkname.querySelector('.table-data__label span').style.display = 'inline-block';
					zkname.querySelector('input').classList.add('req');

					area_floors.querySelector('.table-data__label span').style.display = 'inline-block';
					area_floors.querySelector('input').classList.add('req');

					area_life.style.display = 'block';
					area_life.querySelector('input').removeAttribute('disabled');
					area_kitchen.style.display = 'block';
					area_kitchen.querySelector('input').removeAttribute('disabled');
					area_rooms.style.display = 'block';
					area_rooms.querySelector('input').removeAttribute('disabled');
					area_floor.style.display = 'block';
					area_floor.querySelector('input').removeAttribute('disabled');
					area_floors.style.display = 'block';
					area_floors.querySelector('input').removeAttribute('disabled');

					more_info.style.display = "block";
					more_info_block[0].style.display = "block";
					more_info_block[1].style.display = "none";

					if (fn_action == 1 || fn_action == 2) {
						ex_bl('block');
					}

					more_info_inputs = more_info_block[0].querySelectorAll('input');

					for (let index = 0; index < more_info_inputs.length; index++) {
						const more_info_input = more_info_inputs[index];
						more_info_input.disabled = false;
					}
				}
				if (object_type_value == 4) {
					for (let index = 0; index < area_ed.length; index++) {
						const el = area_ed[index];
						el.classList.add('active');
					}
				}
				if (object_type_value == 9) {
					area_rooms.style.display = 'block';
					area_rooms.querySelector('input').removeAttribute('disabled');
					area_rooms_deal.style.display = 'block';
					area_rooms_deal.querySelector('input').removeAttribute('disabled');
					area_floor.style.display = 'block';
					area_floor.querySelector('input').removeAttribute('disabled');
					area_floors.style.display = 'block';
					area_floors.querySelector('input').removeAttribute('disabled');

					area_rooms_label[0].style.display = 'none';
					area_rooms_label[1].style.display = 'block';

					more_info.style.display = "block";
					more_info_block[0].style.display = "block";
					more_info_block[1].style.display = "none";

					more_info_inputs = more_info_block[0].querySelectorAll('input');

					for (let index = 0; index < more_info_inputs.length; index++) {
						const more_info_input = more_info_inputs[index];
						more_info_input.disabled = true;
					}
				}

				let object_type_error = object_type.querySelector('.options__error');
				if (object_type_error) {
					object_type_error.remove();
				}
			}
		}
		//==================================================
		let inp = document.querySelectorAll('.table-data__input input');
		for (let index = 0; index < inp.length; index++) {
			const el = inp[index];
			el.addEventListener('click', open_list);
		}
		function open_list(e) {
			let list = e.target.parentNode.querySelector('.table-data__list');
			if (list) {
				let list_ul = list.querySelector('.table-data__ul');
				if (list_ul.innerHTML != '') {
					list.classList.add('active');
				}
			}
		}
		let fn_street = document.querySelector('input[name="fn_street"]');
		fn_street.addEventListener('keyup', street);
		function street(e) {
			let up_id_city = form_add.querySelector('input[name="up_id_city"]');
			if (up_id_city.value == '29586' || up_id_city.value == '29588' || up_id_city.value == '29587' || up_id_city.value == '29585') {
				let el = e.target;
				let val_id = e.target.parentNode.nextElementSibling;
				let list = e.target.nextElementSibling;
				let scr = list.querySelector('.table-data__scroll');
				let list_ul = list.querySelector('.table-data__ul');
				let val = el.value;
				val_id.value = "0";
				if (val.length > 0) {
					let url = domain + "/forms.php?a=c4_street&name=" + val + "&up_id_city=" + up_id_city.value + "&lang=" + lang;
					let request = new XMLHttpRequest();
					request.responseType = "json";
					request.open("GET", url, true);
					request.addEventListener("readystatechange", function () {
						if (request.readyState === 4 && request.status === 200) {
							let obj = request.response;
							console.log(obj);
							if (obj) {
								list_ul.innerHTML = '';
								list.classList.add('active');
								for (let index = 0; index < obj.length; index++) {
									const item = obj[index];
									list_ul.insertAdjacentHTML('afterbegin', '<li data-id="' + item['s_id'] + '">' + item['s_name'] + '</li>');
								}
								$(e.target).next().children().getNiceScroll().resize();
								location_link();
							} else {
								list.classList.remove('active');
							}
						}
					});
					request.send();
				} else {
					list.classList.remove('active');
				}
			}
		}

		// Name ZK
		let fn_jk_name = document.querySelector('input[name="fn_jk_name"]');
		fn_jk_name.addEventListener('keyup', jk_name);
		function jk_name(e) {
			let el = e.target;
			let val_id = e.target.parentNode.nextElementSibling;
			let list = e.target.nextElementSibling;
			let scr = list.querySelector('.table-data__scroll');
			let list_ul = list.querySelector('.table-data__ul');
			let val = el.value;
			val_id.value = "0";
			if (val.length > 0) {
				let url = domain + "/forms.php?a=c4_jk&name=" + val + "&lang=" + lang;
				let request = new XMLHttpRequest();
				request.responseType = "json";
				request.open("GET", url, true);
				request.addEventListener("readystatechange", function () {
					if (request.readyState === 4 && request.status === 200) {
						let obj = request.response;
						if (obj) {
							list_ul.innerHTML = '';
							list.classList.add('active');
							for (let index = 0; index < obj.length; index++) {
								const item = obj[index];
								list_ul.insertAdjacentHTML('afterbegin', '<li data-id="' + item['jk_id'] + '">' + item['jk_name'] + '</li>');
							}
							$(e.target).next().children().getNiceScroll().resize();
							location_link();
						} else {
							list.classList.remove('active');
						}
					}
				});
				request.send();
			} else {
				list.classList.remove('active');
			}
		}
		// Location
		let fn_city = document.querySelector('input[name="fn_city"]');
		fn_city.addEventListener('keyup', add_city);
		function add_city(e) {
			let el = e.target;
			let val_id = e.target.parentNode.nextElementSibling;
			let list = e.target.nextElementSibling;
			let scr = list.querySelector('.table-data__scroll');
			let list_ul = list.querySelector('.table-data__ul');
			let val = el.value;
			let obl = document.querySelector('input[name="obl_id"]').value;
			if (val_id) {
				val_id.value = "0";
			}
			if (val.length > 0) {
				let url = domain + "/forms.php?a=c4_get_city&city=" + val + "&all=1&obl_id=" + obl + "&lang=" + lang;
				let request = new XMLHttpRequest();
				request.responseType = "json";
				request.open("GET", url, true);
				request.addEventListener("readystatechange", function () {
					if (request.readyState === 4 && request.status === 200) {
						let obj = request.response;
						if (obj) {
							list_ul.innerHTML = '';
							list.classList.add('active');
							for (let index = 0; index < obj.length; index++) {
								let item = obj[index];
								let region = '';
								if (item['region_name']) {
									region = '<span>' + item['region_name'] + '</span>';
								}
								list_ul.insertAdjacentHTML('beforeend', '<li data-id="' + item['city_id'] + '">' + item['city_name'] + region + '</li>');
							}
							$(e.target).next().children().getNiceScroll().resize();
							location_link();
							add_location();
						} else {
							list.classList.remove('active');
						}
					}
				});
				request.send();
			} else {
				list.classList.remove('active');
			}
		}
		function add_location() {

            //ruslans edit
            let tt1 = document.querySelector('.table-data__row_street');
            let tt2 = tt1.querySelector('.table-data__ul');
            tt2.innerHTML = '';

			let url;
			if (
				form_add.querySelector('input[name="up_id_city"]').value == '29586' ||
				form_add.querySelector('input[name="up_id_city"]').value == '29588' ||
				form_add.querySelector('input[name="up_id_city"]').value == '29587'
			) {
				url = domain + "/forms.php?a=c4_get_location&city_id=" + form_add.querySelector('input[name="up_id_city"]').value + "&limit=0&type=rayon,sub,metro&in_base=0&lang=" + lang;
			} else {
				url = domain + "/forms.php?a=c4_get_location&city_id=" + form_add.querySelector('input[name="up_id_city"]').value + "&limit=0&type=rayon,sub&in_base=0&lang=" + lang;
			}
			let request = new XMLHttpRequest();
			request.responseType = "json";
			request.open("GET", url, true);
			request.addEventListener("readystatechange", function () {
				if (request.readyState === 4 && request.status === 200) {
					let obj = request.response;
					if (obj) {
						for (let index = 0; index < obj.length; index++) {
							const el = obj[index];
							if (el['block_name'] == 'rayon') {
								if (el['locations']) {
									add_rayon(el['locations']);
								} else {
									let rayon_block = document.querySelector('.table-data__line_rayon');
									let rayon_inp = document.querySelector('input[name="fn_district"]');
									let rayon_id = document.querySelector('input[name="up_id_district"]');
									rayon_inp.disabled = true;
									rayon_id.disabled = true;
									rayon_block.style.display = "none";
								}
							}
							if (el['block_name'] == 'sub') {
								if (el['locations']) {
									add_subrayon(el['locations']);
								} else {
									let subrayon_block = document.querySelector('.table-data__line_subrayon');
									let subrayon_inp = document.querySelector('input[name="fn_microdistrict"]');
									let subrayon_id = document.querySelector('input[name="up_id_microdistrict"]');
									subrayon_inp.disabled = true;
									subrayon_id.disabled = true;
									subrayon_block.style.display = "none";
								}
							}
							if (el['block_name'] == 'metro') {
								if (el['locations']) {
									add_metro(el['locations']);
								} else {
									let metro_block = document.querySelector('.table-data__line_metro');
									let metro_id = document.querySelector('input[name="up_id_metro"]');
									metro_id.disabled = true;
									metro_block.style.display = "none";
								}
							} else {
								let metro_block = document.querySelector('.table-data__line_metro');
								let metro_id = document.querySelector('input[name="up_id_metro"]');
								metro_id.disabled = true;
								metro_block.style.display = "none";
							}
						}
					} else {

					}
				}
			});
			request.send();
		}

        //ruslans edit
        if (form_add.querySelector('input[name="up_id_city"]').value > 0) {
           add_location();
        }

		function search_ul(el) {

			let ul = el.parentNode.querySelector('.table-data__ul')
			let li = ul.querySelectorAll('li');
			let filter = el.value.toUpperCase();

			for (i = 0; i < li.length; i++) {
				txtValue = li[i].textContent || li[i].innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					li[i].style.display = "";
				} else {
					li[i].style.display = "none";
				}
			}
			$('.table-data__scroll').getNiceScroll().resize();
		}
		function add_rayon(array) {
			let rayon_block = document.querySelector('.table-data__line_rayon');
			let rayon_inp = document.querySelector('input[name="fn_district"]');
			let rayon_id = document.querySelector('input[name="up_id_district"]');
			rayon_id.disabled = false;
			rayon_inp.disabled = false;
			rayon_block.style.display = "block";

			let list = rayon_block.querySelector('.table-data__list');
			add_data(list, array);
			$('.table-data__line_rayon .table-data__scroll').getNiceScroll().resize();

			rayon_inp.addEventListener('keyup', function () {
				rayon_id.value = 0;
				search_ul(rayon_inp);
			});
		}
		function add_subrayon(array) {
			let subrayon_block = document.querySelector('.table-data__line_subrayon');
			let subrayon_inp = document.querySelector('input[name="fn_microdistrict"]');
			let subrayon_id = document.querySelector('input[name="up_id_microdistrict"]');
			subrayon_id.disabled = false;
			subrayon_inp.disabled = false;
			subrayon_block.style.display = "block";

			let list = subrayon_block.querySelector('.table-data__list');
			add_data(list, array);
			$('.table-data__line_subrayon .table-data__scroll').getNiceScroll().resize();

			subrayon_inp.addEventListener('keyup', function () {
				subrayon_id.value = 0;
				search_ul(subrayon_inp);
			});
		}
		function add_metro(array) {
			let metro_block = document.querySelector('.table-data__line_metro');
			let metro_inp = document.querySelector('input[name="fn_metro"]');
			let metro_id = document.querySelector('input[name="up_id_metro"]');
			metro_block.style.display = "block";

			let list = metro_block.querySelector('.table-data__list');
			add_data(list, array);
			$('.table-data__line_metro .table-data__scroll').getNiceScroll().resize();

			metro_inp.addEventListener('keyup', function () {
				metro_id.value = 0;
				search_ul(metro_inp);
			});
		}
		function add_data(list, array) {
			let list_ul = list.querySelector('.table-data__ul');

			list_ul.innerHTML = '';
			//list.classList.add('active');
			for (let index = 0; index < array.length; index++) {
				const item = array[index];
				list_ul.insertAdjacentHTML('beforeend', '<li data-id="' + item['id'] + '">' + item['name'] + '</li>');
			}
			location_link();
		}
		//==================================================
		let location_items = document.querySelectorAll('.table-data__ul>li');
		if (location_items) {
			location_link();
		}
		function location_link() {
			let location_items = document.querySelectorAll('.table-data__ul>li');
			for (let index = 0; index < location_items.length; index++) {
				const location_item = location_items[index];
				location_item.addEventListener('click', location_click);
			}
			function location_click(e) {
				let el = e.target;
				let id = el.getAttribute('data-id');
				let reg = el.querySelector('span');
				if (reg) {
					reg.remove();
				}
				let txt = el.innerHTML;
				let list = el.parentNode.parentNode.parentNode;
				let inp = list.previousElementSibling;
				let val_id = list.parentNode.nextElementSibling;
				if (inp) {
					inp.value = txt;
				}
				if (val_id) {
					val_id.value = id;
				}
				if (inp) {
					inp.classList.add('focus');
				}
				list.classList.remove('active');

				if (inp.classList.contains('city')) {
					req_blocks(id);
					add_location();
				}
			}
		}
		document.documentElement.addEventListener("click", function (e) {
			let list = document.querySelectorAll('.table-data__list');
			if (getParents(e.target, 'table-data__input').length == 0 && list) {
				for (let index = 0; index < list.length; index++) {
					list[index].classList.remove('active');
				}
			}
		});
		//==================================================

		// Exclusive
		let options_ex = document.querySelectorAll('.table-data__option_ex');
		if (!options_ex[1].classList.contains('active')) {
			ex_hide();
		}
		for (let index = 0; index < options_ex.length; index++) {
			const option_ex = options_ex[index];
			option_ex.addEventListener('click', function () {
				if (option_ex.querySelector('input').value == 1) {
					ex_hide();
				} else {
					ex_show();
				}
			})
		}
		function ex_hide() {
			let ex_block = document.querySelector('.ex-block');
			let ex_block_inputs = ex_block.querySelectorAll('input');

			for (let index = 0; index < ex_block_inputs.length; index++) {
				const ex_block_input = ex_block_inputs[index];
				ex_block_input.disabled = true;
			}
			ex_block.style.display = "none";
		}
		function ex_show() {
			let ex_block = document.querySelector('.ex-block');
			let ex_block_inputs = ex_block.querySelectorAll('input');

			for (let index = 0; index < ex_block_inputs.length; index++) {
				const ex_block_input = ex_block_inputs[index];
				ex_block_input.disabled = false;
			}
			ex_block.style.display = "block";
		}
		let ex_block = document.querySelector('.ex-block')
		let ex_block_files = ex_block.querySelector('input[name="files"]');
		let ex_block_btn = ex_block.querySelector('.table-data__btn');
		let ex_block_error = ex_block_files.getAttribute('data-error');
		let ex_block_errorlist = ex_block.querySelector('.ex-errors');
		let ex_block_mess = ex_block_files.getAttribute('data-message');
		let ex_block_label = ex_block_files.getAttribute('data-label');
		let ex_block_list = document.querySelector('.ex-files');
		ex_block_files.addEventListener('change', function () {
			if (!ex_block_btn.classList.contains('load')) {
				if (ex_block_files.value != '') {
					ex_block_errorlist.innerHTML = '';
					let ex_block_readyfiles = document.querySelector('.ex-files__num');
					let ex_block_readyfiles_l = parseInt(ex_block_readyfiles.innerHTML);
					if (ex_block_files.files.length + ex_block_readyfiles_l > 5) {
						ex_block_list.classList.add('active');
						let item = document.createElement('div');
						item.classList.add('ex-files__error');
						item.innerHTML = ex_block_error;
						ex_block_errorlist.append(item);
						ex_block_errorlist.classList.add('active');
					} else {
						ex_block_btn.classList.add('load');
						let id = form_add.querySelector('input[name="id"]').value;
						let lang = form_add.querySelector('input[name="lang"]').value;
						let url = domain + "/forms_files.php?a=SaveEx&id=" + id + "&lang=" + lang;
						let json = true;

						let formData = new FormData();
						formData.append('files[0]', ex_block_files.files[0]);
						formData.append('files[1]', ex_block_files.files[1]);
						formData.append('files[2]', ex_block_files.files[2]);
						formData.append('files[3]', ex_block_files.files[3]);
						formData.append('files[4]', ex_block_files.files[4]);

						let request = new XMLHttpRequest();

						if (json == true) {
							request.responseType = "json";
						}
						request.open("POST", url, true);

						request.addEventListener("readystatechange", function () {
							if (request.readyState === 4 && request.status === 200) {
								let obj = request.response;
								if (obj) {
									if (obj.files) {
										//ex_block_list.innerHTML = '';
										for (let index = 0; index < obj.files.length; index++) {
											const file = obj.files[index];
											let item_input = document.createElement('input');
											item_input.setAttribute('type', 'hidden');
											item_input.setAttribute('name', 'ex[]');
											item_input.setAttribute('value', file);
											ex_block_list.previousElementSibling.append(item_input);
											ex_block_list.classList.add('active');
										}
										let files_total = ex_block_readyfiles_l + obj.files.length;
										ex_block_readyfiles.innerHTML = files_total;

										if (files_total == 5) {
											ex_block_btn.style.display = 'none';
										}
									}
									if (obj.errors) {
										for (let index = 0; index < obj.errors.length; index++) {
											let er = obj.errors[index];
											let item = document.createElement('div');
											item.classList.add('ex-files__error');
											item.innerHTML = er;
											ex_block_errorlist.append(item);
											ex_block_errorlist.classList.add('active');
										}
									}
								}
								ex_block_btn.classList.remove('load');

								// Clean files
								ex_block_files.value = '';
							}
						});
						request.send(formData);
					}
				}
			}
		});

		//Images
		let images_add = document.querySelector('._add-photos');
		let photo_block = document.querySelector('.add-photo');
		let a_ph = document.querySelector('._a_ph');
		let list = document.querySelector('.list-add-photo');
		let errors = document.querySelector('.add-photo__errors');
		images_add.addEventListener('change', function () {
			if (!photo_block.classList.contains('load')) {
				if (images_add.value != '') {
					photo_block.classList.add('load');
					let id = form_add.querySelector('input[name="id"]').value;
					let lang = form_add.querySelector('input[name="lang"]').value;
					let url = domain + "/forms_files.php?a=SaveImg&id=" + id + "&lang=" + lang;

					let formData = new FormData();
					for (let index = 0; index < images_add.files.length; index++) {
						const image = images_add.files[index];
						formData.append('files[' + index + ']', image);
					}
					let request = new XMLHttpRequest();

					request.responseType = "json";
					request.open("POST", url, true);

					request.addEventListener("readystatechange", function () {
						if (request.readyState === 4 && request.status === 200) {
							errors.innerHTML = '';
							let obj = request.response;
							if (obj) {
								if (obj.files) {
									for (let index = 0; index < obj.files.length; index++) {
										let id = obj.files[index]['id'];
										let file = obj.files[index]['name'];

										list.insertAdjacentHTML('beforeend',
											'<div class="list-add-photo__column">' +
											'<div class="list-add-photo__item">' +
											'<input data-id="' + id + '" type="hidden" value="' + file + '" name="proc_imgs[' + id + ']">' +
											'<div class="list-add-photo__content">' +
											'<a href="' + file + '" target="_blank" class="list-add-photo__zoom"></a>' +
											'<div class="list-add-photo__delete"></div>' +
											'<div class="list-add-photo__main"></div>' +
											'<div class="list-add-photo__rotate"></div>' +
											'</div>' +
											'<div class= "list-add-photo__image ibg"><img src="' + file + '" alt=""></div> ' +
											'</div>' +
											'</div>');
									}
									list.append(a_ph);

									image_actions();

									let photo_item = document.querySelectorAll('.list-add-photo__item')[0];
									photo_item_input = photo_item.querySelector('input');
									photo_item_input.setAttribute('data-id', '0');
									photo_item_input.setAttribute('name', 'proc_imgs[0]');

								}
								if (obj.errors) {
									for (let index = 0; index < obj.errors.length; index++) {
										let er = obj.errors[index];
										errors.insertAdjacentHTML('beforeend', '<p>' + er + '</p>');
									}
								}
							}
							photo_block.classList.remove('load');

							is_images();
						}
					});
					request.send(formData);
				}
			}
		});
		function is_images() {
			let photo_block = document.querySelector('.add-photo');
			let photo__item = document.querySelectorAll('.list-add-photo__item');
			if (photo__item.length > 0) {
				image_actions();
				photo_block.classList.add('active');
			} else {
				photo_block.classList.remove('active');
			}
		}
		is_images();

		function image_rotate(el) {
			let id = form_add.querySelector('input[name="id"]').value;
			let lang = form_add.querySelector('input[name="lang"]').value;
			errors.innerHTML = '';
			let request = new XMLHttpRequest();
			let block = el.target.closest('.list-add-photo__item');
			let inp = block.querySelector('input');
			let image = block.querySelector('img');
			let file = inp.value;
			let photo_id = inp.getAttribute('data-id');
			let url = domain + "/forms_files.php?a=rotateRight&photo_id=" + photo_id + "&file=" + file + "&id=" + id + "&lang=" + lang;
			request.responseType = "json";
			request.open("GET", url, true);
			request.addEventListener("readystatechange", function () {
				if (request.readyState === 4 && request.status === 200) {
					let obj = request.response;
					if (obj) {
						if (obj.status == 'ok') {
							image.setAttribute('src', obj.file);
							inp.value = obj.file;
						} else {
							errors.innerHTML = obj.message;
						}
					}
				}
			});
			request.send();
		}
		function image_del(el) {
			let id = form_add.querySelector('input[name="id"]').value;
			let lang = form_add.querySelector('input[name="lang"]').value;
			errors.innerHTML = '';
			let request = new XMLHttpRequest();
			let block = el.target.closest('.list-add-photo__column');
			let inp = block.querySelector('input');
			let image = block.querySelector('img');
			let photo_id = inp.getAttribute('data-id');
			let url = domain + "/forms_files.php?a=deletePhoto&photo_id=" + photo_id + "&id=" + id + "&lang=" + lang;
			request.responseType = "json";
			request.open("GET", url, true);

			request.addEventListener("readystatechange", function () {
				if (request.readyState === 4 && request.status === 200) {
					let obj = request.response;
					if (obj) {
						if (obj.status == 'ok') {
							block.remove();

							if (photo_id == 0) {
								let next = document.querySelectorAll('.list-add-photo__item')[0];
								if (next) {
									let inp = next.querySelector('input');
									inp.setAttribute('data-id', '0');
									inp.setAttribute('name', 'proc_imgs[0]');
								}
							}
							is_images();
						} else {
							errors.innerHTML = obj.message;
						}
					}
				}
			});
			request.send();
		}
		function image_main(el) {
			let id = form_add.querySelector('input[name="id"]').value;
			let lang = form_add.querySelector('input[name="lang"]').value;
			errors.innerHTML = '';
			let request = new XMLHttpRequest();
			let block = el.target.closest('.list-add-photo__item');
			let inp = block.querySelector('input');
			let image = block.querySelector('img');
			let photo_id = inp.getAttribute('data-id');
			let url = domain + "/forms_files.php?a=setMain&photo_id=" + photo_id + "&id=" + id + "&lang=" + lang;
			request.responseType = "json";
			request.open("GET", url, true);

			request.addEventListener("readystatechange", function () {
				if (request.readyState === 4 && request.status === 200) {
					let obj = request.response;
					if (obj) {
						if (obj.status == 'ok') {
							let first = document.querySelectorAll('.list-add-photo__item')[0];
							let first_inp = first.querySelector('input');
							let first_image = first.querySelector('img');

							let new_inp = inp.value;
							let new_image = image.src;

							inp.value = first_inp.value;
							image.src = first_image.src;

							first_inp.value = new_inp;
							first_image.src = new_image;

						} else {
							errors.innerHTML = obj.message;
						}
					}
				}
			});
			request.send();
		}
		function image_actions(params) {
			let id = form_add.querySelector('input[name="id"]').value;
			let lang = form_add.querySelector('input[name="lang"]').value;
			//let zoom = document.querySelectorAll('.list-add-photo__zoom');
			let del = document.querySelectorAll('.list-add-photo__delete');
			let main = document.querySelectorAll('.list-add-photo__main');
			let rotate = document.querySelectorAll('.list-add-photo__rotate');

			if (rotate) {
				for (let index = 0; index < rotate.length; index++) {
					const el = rotate[index];
					el.removeEventListener('click', image_rotate);
					el.addEventListener('click', image_rotate);
				}
			}
			if (del) {
				for (let index = 0; index < del.length; index++) {
					const el = del[index];
					el.removeEventListener('click', image_del);
					el.addEventListener('click', image_del);
				}
			}
			if (main) {
				for (let index = 0; index < main.length; index++) {
					const el = main[index];
					el.removeEventListener('click', image_main);
					el.addEventListener('click', image_main);
				}
			}
		}
		// Validate & Send
		function form_add_validate() {
			let error = 0;

			// Тип объекта
			let object_type = document.querySelector('.table-data__object-type');
			let object_type_active = object_type.querySelector('.option.active');
			let object_type_error = object_type.querySelector('.options__error');
			if (object_type_error) {
				object_type_error.remove();
			}
			if (!object_type_active) {
				let er = document.createElement('div');
				er.classList.add('options__error');
				object_type.prepend(er);
				let object_type_error = object_type.querySelector('.options__error');
				object_type_error.innerHTML = object_type.getAttribute('data-error');
				object_type.classList.add('err');
				error++;
			} else {
				object_type.classList.remove('err');
			}

			// Цена
			let fn_price = document.querySelector('input[name="fn_price"]');
			if (fn_price.value != '' && parseInt(fn_price.value) < 5 && fn_object_square.disabled == false) {
				let er = fn_price.getAttribute('data-custom-error');
				fn_price = $('input[name="fn_price"]');
				addError(fn_price, er);
				error++;
			}

			// Площади
			let reg = /^\d*([\.-]?\d+)*([\,-]?\d+)*$/;
			let fn_object_square = document.querySelector('input[name="fn_object_square"]');
			if (fn_object_square.value != '' && fn_object_square.disabled == false) {
				let er = '';
				if (!(reg.test(fn_object_square.value))) {
					er = fn_object_square.getAttribute('data-symbol-error');

					fn_object_square = $('input[name="fn_object_square"]');
					addError(fn_object_square, er);
					error++;

				} else if (parseInt(fn_object_square.value) > 100000) {
					er = fn_object_square.getAttribute('data-size-error');

					fn_object_square = $('input[name="fn_object_square"]');
					addError(fn_object_square, er);
					error++;
				}
			}

			let fn_object_square_g = document.querySelector('input[name="fn_object_square_g"]');
			if (fn_object_square_g.value != '' && fn_object_square_g.disabled == false) {
				let er = '';
				if (parseInt(fn_object_square_g.value) > parseInt(fn_object_square.value)) {
					er = fn_object_square_g.getAttribute('data-bigger-error');
					fn_object_square_g = $('input[name="fn_object_square_g"]');
					addError(fn_object_square_g, er);
					error++;
				} else if (!(reg.test(fn_object_square_g.value))) {
					er = fn_object_square_g.getAttribute('data-symbol-error');
					fn_object_square_g = $('input[name="fn_object_square_g"]');
					addError(fn_object_square_g, er);
					error++;
				} else if (parseInt(fn_object_square_g.value) > 5000) {
					er = fn_object_square_g.getAttribute('data-size-error');
					fn_object_square_g = $('input[name="fn_object_square_g"]');
					addError(fn_object_square_g, er);
					error++;
				}
			}

			let fn_object_square_k = document.querySelector('input[name="fn_object_square_k"]');
			if (fn_object_square_k.value != '' && fn_object_square_k.disabled == false) {
				let er = '';
				if (parseInt(fn_object_square_k.value) > parseInt(fn_object_square.value)) {
					er = fn_object_square_k.getAttribute('data-bigger-error');
					fn_object_square_k = $('input[name="fn_object_square_k"]');
					addError(fn_object_square_k, er);
					error++;
				} else if (!(reg.test(fn_object_square_k.value))) {
					er = fn_object_square_k.getAttribute('data-symbol-error');
					fn_object_square_k = $('input[name="fn_object_square_k"]');
					addError(fn_object_square_k, er);
					error++;
				} else if (parseInt(fn_object_square_k.value) > 1000) {
					er = fn_object_square_k.getAttribute('data-size-error');
					fn_object_square_k = $('input[name="fn_object_square_k"]');
					addError(fn_object_square_k, er);
					error++;
				}
			}

			let lot_area = document.querySelector('input[name="lot-area"]');
			if (lot_area.value != '' && lot_area.disabled == false) {
				let er = '';
				if (!(reg.test(lot_area.value))) {
					er = lot_area.getAttribute('data-symbol-error');
					lot_area = $('input[name="lot-area"]');
					addError(lot_area, er);
					error++;
				} else if (parseInt(lot_area.value) > 10000) {
					er = lot_area.getAttribute('data-size-error');
					lot_area = $('input[name="lot-area"]');
					addError(lot_area, er);
					error++;
				}
			}

			// Комнаты
			let fn_param_komnat = document.querySelector('input[name="fn_param_komnat"]');
			let fn_param_rent_komnat = document.querySelector('input[name="fn_param_rent_komnat"]');
			if (parseInt(fn_param_rent_komnat.value) > parseInt(fn_param_komnat.value) && fn_param_rent_komnat.disabled == false && fn_param_komnat.disabled == false) {
				let er = '';
				er = fn_param_rent_komnat.getAttribute('data-size-error');
				fn_param_rent_komnat = $('input[name="fn_param_rent_komnat"]');
				addError(fn_param_rent_komnat, er);
				error++;
			}

			// Этажи
			let fn_param_floor = document.querySelector('input[name="fn_param_floor"]');
			let fn_param_floors = document.querySelector('input[name="fn_param_floors"]');
			if (parseInt(fn_param_floor.value) > parseInt(fn_param_floors.value) && fn_param_floor.disabled == false && fn_param_floors.disabled == false) {
				let er = '';
				er = fn_param_floors.getAttribute('data-size-error');
				fn_param_floors = $('input[name="fn_param_floors"]');
				addError(fn_param_floors, er);
				error++;
			}

			// Описание
			let txt = document.querySelector('textarea[name="text"]');
			if (txt.value.length < 65) {
				let er = '';
				er = txt.getAttribute('data-size-error');
				txt = $('textarea[name="text"]');
				addError(txt, er);
				error++;
			}

			return error;
		}
		function form_add_send() {

			let id = form_add.querySelector('input[name="id"]').value;
			let lang = form_add.querySelector('input[name="lang"]').value;
			let url = domain + "/forms_data.php?a=SendObject&id=" + id + "&lang=" + lang;
			let btn = document.querySelector('button.table-data__btn');

			document.querySelector('._ex-files').disabled = true;
			document.querySelector('._add-photos').disabled = true;

			let formData = new FormData(form_add);

			btn.classList.add('load');
			btn.disabled = true;

			let request = new XMLHttpRequest();
			request.responseType = "json";
			request.open("POST", url, true);

			request.addEventListener("readystatechange", function () {
				if (request.readyState === 4 && request.status === 200) {
					let obj = request.response;
					if (obj) {
						if (obj.status) {
							if (obj.status == 'error') {
								for (let index = 0; index < obj.message.length; index++) {
									const error = obj.message[index];
									if (error['errdiv'] != 'form') {
										addError($('*[name="' + error['errdiv'] + '"]'), error['mess']);
									} else {
										// Общая ошибка формы
										form_add_err.querySelector('.add__error');
										form_add_err.innerHTML = error['mess'];
									}
								}
								if (form_add.querySelector('.err')) {
									window.scrollTo({
										top: form_add.querySelector('.err').offsetTop - document.querySelector('header.header').offsetHeight,
										behavior: 'smooth'
									});
								}
								btn.classList.remove('load');
								btn.disabled = false;
							}
						}
						if (obj.url) {
							window.location.href = domain + obj.url;
						}
					}
				}
			});
			request.send(formData);
		}
	}
	function hide(array) {
		for (let index = 0; index < array.length; index++) {
			const el = array[index];
			el.style.display = 'none';
		}
	}
	function show(array) {
		for (let index = 0; index < array.length; index++) {
			const el = array[index];
			el.style.display = 'block';
		}
	}



	var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };
	if (isMobile.any()) { }

	if (location.hash) {
		var hsh = location.hash.replace('#', '');
		if ($('.popup-' + hsh).length > 0) {
			if (!$('.popup-' + hsh).hasClass('gallery')) {
				popupOpen(hsh);
			}
		} else if ($('div.' + hsh).length > 0) {
			$('body,html').animate({ scrollTop: $('div.' + hsh).offset().top, }, 500, function () { });
		}
	}
	$('.wrapper').addClass('loaded');

	var act = "click";
	if (isMobile.iOS()) {
		var act = "touchstart";
	}

	let tabs = document.querySelectorAll("._tabs");
	for (let index = 0; index < tabs.length; index++) {
		let tab = tabs[index];
		let tabs_items = tab.querySelectorAll("._tabs-item");
		let tabs_blocks = tab.querySelectorAll("._tabs-block");
		for (let index = 0; index < tabs_items.length; index++) {
			let tabs_item = tabs_items[index];
			tabs_item.addEventListener("click", function (e) {
				for (let index = 0; index < tabs_items.length; index++) {
					let tabs_item = tabs_items[index];
					tabs_item.classList.remove('active');
				}
				for (let index = 0; index < tabs_blocks.length; index++) {
					let tabs_block = tabs_blocks[index];
					tabs_block.classList.remove('active');
				}
				tabs_item.classList.add('active');
				tabs_blocks[index].classList.add('active');
			});
		}
	}


	let iconMenu = document.querySelector(".icon-menu");
	let body = document.querySelector("body");
	let menuBody = document.querySelector(".menu__body");
	let headerBody = document.querySelector(".header__body");
	iconMenu.addEventListener("click", function (e) {
		iconMenu.classList.toggle("active");
		body.classList.toggle("lock");
		menuBody.classList.toggle("active");
		headerBody.classList.toggle("active");
	});
	let locationTitle = document.querySelector(".location-header__title");
	let locationHeader = document.querySelector(".location-header");
	if (locationHeader) {
		locationTitle.addEventListener("click", function (e) {
			locationHeader.classList.toggle("active");
		});
	}
	let currencyTitle = document.querySelector(".currency-header__title");
	let currencyHeader = document.querySelector(".currency-header");
	if (currencyHeader) {
		currencyTitle.addEventListener("click", function (e) {
			currencyHeader.classList.toggle("active");
		});
	}
	let addBtn = document.querySelector(".add-header__button");
	let addHeader = document.querySelector(".add-header");
	if (addBtn) {
		addBtn.addEventListener("click", function (e) {
			addHeader.classList.toggle("active");
		});
	}
	let citySearchTitle = document.querySelector(".city-search__value");
	let citySearch = document.querySelector(".city-search");
	if (citySearch) {
		citySearchTitle.addEventListener("click", function (e) {
			citySearch.classList.toggle("active");
		});
	}
	let edit_btn = document.querySelectorAll('.edit-item-catalog__btn');
	if (edit_btn) {

		//ruslans edit
		for (let index = 0; index < edit_btn.length; index++) {
			const el = edit_btn[index];
			el.addEventListener("click", function (e) {
				el.parentNode.classList.toggle('active');
			});
		}

	}

	let user_title = document.querySelector('.user-header__title');
	if (user_title) {
		user_title.addEventListener("click", function (e) {
			user_title.parentNode.classList.toggle('active');
		});
	}
	let mob_user_title = document.querySelector('.user-body-header__login');
	if (mob_user_title) {
		mob_user_title.addEventListener("click", function (e) {
			mob_user_title.parentNode.classList.toggle('active');
		});
	}

	let user__open = document.querySelector('.user__open');
	if (user__open) {
		user__open.addEventListener("click", function (e) {
			user__open.classList.toggle('active');
			document.querySelector('.user__body').classList.toggle('active');
		});
	}

	document.documentElement.addEventListener("click", function (e) {
		if (getParents(e.target, 'location-header').length == 0 && locationHeader) {
			locationHeader.classList.remove('active');
		}
		if (getParents(e.target, 'currency-header').length == 0 && currencyHeader) {
			currencyHeader.classList.remove('active');
		}
		if (getParents(e.target, 'add-header').length == 0 && addHeader) {
			addHeader.classList.remove('active');
		}
		if (getParents(e.target, 'city-search').length == 0 && citySearch) {
			citySearch.classList.remove('active');
		}
		if (getParents(e.target, 'user-header').length == 0 && user_title) {
			document.querySelector('.user-header').classList.remove('active');
		}
		if (getParents(e.target, 'user-body-header').length == 0 && mob_user_title) {
			document.querySelector('.user-body-header').classList.remove('active');
		}
		if (getParents(e.target, 'edit-item-catalog').length == 0 && edit_btn) {

			//ruslans edit
			for (let index = 0; index < document.querySelectorAll('.edit-item-catalog').length; index++) {
				const el = document.querySelectorAll('.edit-item-catalog')[index];
				el.classList.remove('active');
			}

		}
	});

	$('.menu__link_curr').click(function (event) {
		$('.menu__subitems').slideToggle(300);
		return false;
	});

	//MORETEXT
	function moretext() {
		if ($('.moretext').length > 0) {
			$.each($('.moretext'), function (index, val) {
				if ($(this).find('.moretext__text').outerHeight() > $(this).data('h')) {
					$(this).css('max-height', $(this).data('h')).removeClass('active');
					$(this).addClass('shadow');
					$(this).parent().find('.moretext__more').show().removeClass('active');
				} else {
					$(this).removeClass('shadow');
					$(this).parent().find('.moretext__more').hide();
				}
			});
		}
	}
	moretext();

	$('.moretext__more').click(function () {
		$(this).toggleClass('active');
		$(this).parent().find('.moretext').toggleClass('active');
		if ($(this).parent().find('.moretext').hasClass('active')) {
			$(this).parent().find('.moretext').animate({ maxHeight: $(this).parent().find('.moretext__text').outerHeight() }, 300);
		} else {
			$(this).parent().find('.moretext').animate({ maxHeight: $(this).parent().find('.moretext').data('h') }, 300);
		}
		return false;
	});

	if ($('.filter').length > 0) {
		$('.header__body').addClass('nosh');
	}

	$('._add-photo').change(function (e) {
		if ($(this).val() != '') {
			let formdata = new FormData();
			let file = $(this).prop('files')[0];
			let el = $(this);
			formdata.append("file", file);
			let fn = upload_photo(formdata);
			fn.done(function (data) {
				if (data['status'] == 'ok') {
					$('#target_source').remove();
					$('#image_place').html('<img id="target" src="' + data['file'] + '" alt="">');
					$('.popup-photo').append('<img style="position: fixed;opacity:0;visibility: hidden;" id="target_source" src="' + data['file'] + '" alt="">');
					$('.popup-photo').attr('data-el', el.parent().data('id'));
					popupOpen('photo', '');
					setTimeout(function () {
						$('#target').ready(function (e) {
							cropimage();
						});
					}, 500);
				}
				if (data['status'] == 'error') {
					showMessage(data['message']);
					showMessageByClass('ms_message');
				}
			});
			fn.fail(function (data) {
				showMessage('Ошибка');
				showMessageByClass('ms_message');
			});
		}
		return false;
	});

	$('.photo-editor__save').click(function (e) {
		let el = $('[data-id="' + $('.popup-photo').data('el') + '"]');
		el.addClass('active');
		let place = el.find('._add-photo-place');
		let fn = save_photo();
		$('#image_place').css('opacity', 0.3);
		fn.done(function (data) {
			if (data['status'] == 'ok') {
				place.html('<img src="' + data['file'] + '" alt="">');
				popupClose();
			} else {
				showMessage('Ошибка');
				showMessageByClass('ms_message');
			}
			$('#image_place').css('opacity', 1);
		});
		fn.fail(function (data) {
			showMessage('Ошибка');
			showMessageByClass('ms_message');
		});
		return false;
	});

	function cropimage() {
		let w = $('#target').width();
		let h = $('#target').height();

		let wi = w / 4;
		let hi = h / 4;
		let sel_w = w - wi;
		let sel_h = h - hi;

		$('#target').Jcrop({
			aspectRatio: 1 / 1,
			boxWidth: 400,
			setSelect: [wi, hi, sel_w, sel_h],
			onChange: showCoords,
			onSelect: showCoords
		});
	}
	function showCoords(c) {
		let w = $('#target').width();
		let s_w = $('#target_source').width();
		let kf = s_w / w;

		$('#x1').val(c.x * kf);
		$('#y1').val(c.y * kf);
		$('#x2').val(c.x2 * kf);
		$('#y2').val(c.y2 * kf);
	};

	// Confirm
	$(document).on('click', '._confirm-email', function (e) {
		let block = $(this).parents('._confirm-block');
		let el = $('#' + $(this).data('item'));
		formValidate(el);
		if (!el.hasClass('err') && el.val() != '' && el.val() != el.data('value')) {
			let fnc = confirm_email($('#' + $(this).data('item')));
			fnc.done(function (data) {
				console.log(data);
				block.find('.table-data__text').remove();
				block.append('<div class="table-data__text">' + data + '</div>');
			});
			fnc.fail(function (data) {
				showMessage('Ошибка');
				showMessageByClass('ms_message');
			});
		}
		return false;
	});
	$(document).on('click', '._confirm-phone', function (e) {
		let el = $('#' + $(this).data('item'));
		formValidate(el);
		let fn = check_in_base('c4_checkPhone', el.val());
		if (!el.hasClass('err') && el.val() != '' && el.val() != el.data('value')) {
			fn.done(function (data) {
				if (data['status'] == 'done') { }
				if (data['status'] == 'error') {
					addError(el, data['message']);
				}
				if (!el.hasClass('err') && el.val() != '' && el.val() != el.data('value')) {
					let fnc = confirm_phone(el);
					fnc.done(function (data) {
						$('._confirm-text').html(data);
					});
					popupOpen('sms', '');
				}
			});
			fn.fail(function (data) {
				showMessage('Ошибка');
				showMessageByClass('ms_message');
			});
		}
		return false;
	});

	$('#account_up_user_type').change(function (e) {
		let n = $(this).val();
		us_type(n);
	});

	function us_type(n) {
		if (n == '' || n == 1) {
			$('.table-data__section_1,.table-data__label_1').show();
			$('.table-data__section_2,.table-data__label_2').hide();
			$('.table-data__section_1,.table-data__label_1').find('input,select').prop('disabled', false);
			removeError($('.table-data__section_1,.table-data__label_1').find('input,select'));
			$('.table-data__section_2').find('input,select').prop('disabled', true);
		} else if (n == 2) {
			$('.table-data__label_2').hide();
			$('.table-data__section_1,.table-data__label_1').show();
			$('.table-data__section_2').show();

			removeError($('.table-data__section_1').find('input,select'));
			removeError($('.table-data__section_2').find('input,select'));
			$('.table-data__section_1').find('input,select').prop('disabled', false);
			$('.table-data__section_2').find('input,select').prop('disabled', false);
		} else {
			$('.table-data__section_1,.table-data__label_1').hide();
			$('.table-data__section_2,.table-data__label_2').show();
			$('.table-data__section_2,.table-data__label_2').find('input,select').prop('disabled', false);
			removeError($('.table-data__section_2,.table-data__label_2').find('input,select'));
			$('.table-data__section_1,.table-data__label_1').find('input,select').prop('disabled', true);
		}
	}

	let user_type = document.getElementById('account_up_user_type');
	if (user_type) {
		let n = user_type.value;
		us_type(n);
	}


	//В избранное
	$(document).on('click', '._add-favorite', function (e) {
		let id = $(this).data('id');
		if (!$(this).hasClass('active')) {
			set_favorite(id);
			$(this).addClass('active');
		} else {
			not_favorite(id);
			$(this).removeClass('active');
		}
		return false;
	});

	//Показать текст
	$('.text-object__show').click(function (event) {
		let w = $(window).outerWidth();
		$(this).toggleClass('active').parents('.text-object').find('.text-object__body').slideToggle(300);
		if (w < 992) {
			$(this).toggleClass('open');
		}
	});
	if ($('.text-object__show.active').length > 0) {
		$('.text-object__body').show();
	}

	$('.select-order__title').click(function (event) {
		$(this).parent().toggleClass('active');
	});
	//Клик вне области
	$(document).on('click touchstart', function (e) {
		if (!$(e.target).is(".select-order *")) {
			$('.select-order').removeClass('active');
		};
	});

	//Показать номер
	$('.__show-phone').click(function (event) {
		let id = $(this).data('id');
		$(this).toggleClass('active');
		$(this).prev().toggleClass('active');
		if ($(this).hasClass('active')) {
			set_showphone(id);
		}
		return false;
	});

	//Поиск города
	$(document).on('keyup', '.location__input', function (e) {
		let city = $(this).val();
		let el = $(this).parents('.location');
		let fnc = get_city(city);
		fnc.done(function (data) {
			city_result(data, el)
		});
	});
	//Вывод городов
	function city_result(data, el) {
		let list = el.find('.location__list');
		let city_name;
		list.html('');
		$.each(data, function (index, val) {
			city_name = data[index]['city_name'];
			region_name = data[index]['region_name'];
			if (region_name != null) {
				list.append('<li><a href="' + data[index]['url'] + '" class="location__link">' + city_name + '<span>' + region_name + '</span></a></li>');
			} else {
				list.append('<li><a href="' + data[index]['url'] + '" class="location__link">' + city_name + '</span></a></li>');
			}
		});
		el.find('.location__scroll').getNiceScroll().resize();
	}


	$('.js-goto').click(function (event) {
		let block = $(this).parents('.js-auth');
		block.find('.js-authform').hide();
		if ($(this).hasClass('js-goto_email')) {
			block.find('.js-authform.js-authform_email').show();
		}
		if ($(this).hasClass('js-goto_sms')) {
			block.find('.js-authform.js-authform_sms').show();
			block.find('.js-sms_code').val('').blur();
			removeError(block.find('.js-sms_code'));
		}
		if ($(this).hasClass('js-goto_lost')) {
			block.find('.js-authform.js-authform_lost').show();
		}
		return false;
	});


	// Покупка рекламы
	$('.tarifs-salivon__item.active input').prop('checked', true);
	$('.footer-tarifs-salivon__btn').click(function (param) {
		$(this).parents('.tarifs-salivon__row').find('.tarifs-salivon__item').removeClass('active').find('input').prop('checked', false);
		$(this).parents('.tarifs-salivon__item').addClass('active').find('input').prop('checked', true);
		let it = $('.tarifs-salivon__item').find('input:checked').val();

		if (it == 1) {
			$('#salivon_2').removeClass('active');
			$('#salivon_3').removeClass('active');
		} else if (it == 2) {
			$('#salivon_2').addClass('active');
			$('#salivon_3').removeClass('active');
		} else if (it == 3) {
			$('#salivon_2').addClass('active');
			$('#salivon_3').addClass('active');
		}

		salivon_date();
		salivon_calc(it);

		return false;
	});

	$('.item-сhosen-salivon').click(function (params) {
		let it = $('.tarifs-salivon__item').find('input:checked').val();
		if ($(this).index() != 0) {
			$(this).toggleClass('active');
		}
		salivon_calc(it);
		return false;
	});

	function salivon_date() {
		let it = $('.tarifs-salivon__item').find('input:checked').val();
		let = current_date = new Date();
		if (it == 1) {
			current_date.setDate(current_date.getDate() + 7);
		} else if (it == 2) {
			current_date.setDate(current_date.getDate() + 14);
		} else if (it == 3) {
			current_date.setDate(current_date.getDate() + 30);
		}

		var curr_date = current_date.getDate();
		var curr_month = current_date.getMonth() + 1;
		var curr_year = current_date.getFullYear();

		if (curr_date < 10) curr_date = '0' + curr_date;
		if (curr_month < 10) curr_month = '0' + curr_month;

		$('.item-сhosen-salivon__text small').html(curr_date + '.' + curr_month + '.' + curr_year);
	}
	salivon_date();

	function salivon_calc(it) {
		let cost;
		let cost_discont;
		let ups;
		let per;
		let sale = false;
		let top_price = $('#top_price').val();
		let autoup_price = $('#autoup_price').val();
		let main_price = $('#main_price').val();

		$('.item-сhosen-salivon__text span').hide();

		if (it == 1) {
			days = 7;
			ups = 1;
			$('.item-сhosen-salivon__text span').eq(0).show();
		} else if (it == 2) {
			days = 14;
			ups = 3;
			$('.item-сhosen-salivon__text span').eq(1).show();
		} else if (it == 3) {
			days = 30;
			ups = 5;
			$('.item-сhosen-salivon__text span').eq(2).show();
		}
		if (days == 7) {
			per = 1;
		} else if (days == 14) {
			per = 2;
		} else if (days == 30) {
			per = 4;
		}

		$('#ik_days').val(days);

		if (!$('#salivon_2').hasClass('active') && !$('#salivon_3').hasClass('active')) {
			cost = per * top_price;
			cost_discont = cost;
			$('#ik_main').val(0);
			$('#ik_autoup').val(0);
		} else {
			if ($('#salivon_2').hasClass('active') && $('#salivon_3').hasClass('active')) {
				cost = per * top_price + per * autoup_price * ups + per * main_price;
				cost_discont = Math.round(cost - (cost / 100 * 35));
				$('#ik_main').val(1);
				$('#ik_autoup').val(ups);
			} else if ($('#salivon_2').hasClass('active') && !$('#salivon_3').hasClass('active')) {
				cost = per * top_price + per * autoup_price * ups
				cost_discont = Math.round(cost - (cost / 100 * 8));
				$('#ik_autoup').val(ups);
				$('#ik_main').val(0);
			} else if (!$('#salivon_2').hasClass('active') && $('#salivon_3').hasClass('active')) {
				cost = per * top_price + per * main_price;
				cost_discont = Math.round(cost - (cost / 100 * 20));
				$('#ik_main').val(1);
				$('#ik_autoup').val(0);
			}
		}
		if (cost != cost_discont) {
			$('.salivon__sale').show().find('span').html(cost + ' грн');
			$('.salivon__total span').html(cost_discont + ' грн');
		} else {
			$('.salivon__total span').html(cost + ' грн');
			$('.salivon__sale').hide();
		}
		$('#ik_am').val(cost_discont);
	}



	//ZOOM
	/*
	if($('.gallery').length>0){
		baguetteBox.run('.gallery', {
			// Custom options
		});
	}
	*/

	//POPUP
	$('.pl').click(function (event) {
		var pl = $(this).attr('href').replace('#', '');
		var v = $(this).data('vid');
		if ($('.popup-' + pl).hasClass('gallery')) {
			let index = $(this).parent().data('slick-index');
			if ($('.gallery .slick-slider').length == 0) {
				let slider = $(this).parents('.slick-slider');
				gallery(slider, index);
			} else {
				$('.gallery__slider').slick('goTo', index);
				$('.gallery__slider').slick('setPosition');
			}
		}
		popupOpen(pl, v);
		return false;
	});
	function popupOpen(pl, v) {
		$('.popup').removeClass('active').hide();
		if (!$('.menu__body').hasClass('active')) {
			//$('body').data('scroll',$(window).scrollTop());
		}
		if (!isMobile.any()) {
			$('body').css({ paddingRight: $(window).outerWidth() - $('.wrapper').outerWidth() }).addClass('lock');
			$('.pdb').css({ paddingRight: $(window).outerWidth() - $('.wrapper').outerWidth() });
		} else {
			setTimeout(function () {
				$('body').addClass('lock');
			}, 300);
		}
		history.pushState('', '', '#' + pl);
		if (v != '' && v != null) {
			$('.popup-' + pl + ' .popup-video__value').html('<iframe src="https://www.youtube.com/embed/' + v + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>');
		}
		$('.popup-' + pl).fadeIn(300).delay(300).addClass('active');

		if ($('.popup-' + pl).find('.slick-slider').length > 0) {
			$('.popup-' + pl).find('.slick-slider').slick('setPosition');
		}
		$('.wrapper').addClass('blur');
	}
	function openPopupById(popup_id) {
		$('#' + popup_id).fadeIn(300).delay(300).addClass('active');
	}
	function popupClose() {
		$('.popup').removeClass('active').fadeOut(300);
		if (!$('.menu__body').hasClass('active')) {
			if (!isMobile.any()) {
				setTimeout(function () {
					$('body').css({ paddingRight: 0 });
					$('.pdb').css({ paddingRight: 0 });
				}, 200);
				setTimeout(function () {
					$('body').removeClass('lock');
					//$('body,html').scrollTop(parseInt($('body').data('scroll')));
				}, 200);
			} else {
				$('body').removeClass('lock');
				//$('body,html').scrollTop(parseInt($('body').data('scroll')));
			}
		}
		$('.wrapper').removeClass('blur');
		$('.popup-video__value').html('');

		history.pushState('', '', window.location.href.split('#')[0]);
	}
	$('.popup-close,.popup__close').click(function (event) {
		popupClose();
		return false;
	});
	$('.popup').click(function (e) {
		if (!$(e.target).is(".popup>.popup-table>.cell *") || $(e.target).is(".popup-close") || $(e.target).is(".popup__close")) {
			popupClose();
			return false;
		}
	});
	$(document).on('keydown', function (e) {
		if (e.which == 27) {
			popupClose();
		}
	});

	$('.goto').click(function () {
		var el = $(this).attr('href').replace('#', '');
		var offset = 0;
		$('body,html').animate({ scrollTop: $('.' + el).offset().top + offset }, 500, function () { });

		if ($('.menu__body').hasClass('active')) {
			$('.menu__body,.icon-menu').removeClass('active');
			$('body').removeClass('lock');
		}
		return false;
	});

	function ibg() {
		if (isIE()) {
			let ibg = document.querySelectorAll(".ibg");
			for (var i = 0; i < ibg.length; i++) {
				if (ibg[i].querySelector('img')) {
					ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
				}
			}
		}
	}
	//UP
	$(window).scroll(function () {
		var w = $(window).width();
		if ($(window).scrollTop() > 50) {
			$('#up').fadeIn(300);
		} else {
			$('#up').fadeOut(300);
		}
	});
	$('#up').click(function (event) {
		$('body,html').animate({ scrollTop: 0 }, 300);
	});

	$('body').on('click', '.tab__navitem', function (event) {
		var eq = $(this).index();
		if ($(this).hasClass('parent')) {
			var eq = $(this).parent().index();
		}
		if (!$(this).hasClass('active')) {
			$(this).closest('.tabs').find('.tab__navitem').removeClass('active');
			$(this).addClass('active');
			$(this).closest('.tabs').find('.tab__item').removeClass('active').eq(eq).addClass('active');
			if ($(this).closest('.tabs').find('.slick-slider').length > 0) {
				$(this).closest('.tabs').find('.slick-slider').slick('setPosition');
			}
		}
	});
	$.each($('.spoller.active'), function (index, val) {
		if (!isMobile.any()) {
			$(this).next().show();
		} else {
			if ($(this).hasClass('add__subtitle')) {
				$(this).removeClass('active');
			}
		}
	});
	$('body').on('click', '.spoller', function (event) {
		if ($(this).hasClass('mob') && !isMobile.any()) {
			return false;
		}

		if ($(this).parents('.one').length > 0) {
			$(this).parents('.one').find('.spoller').not($(this)).removeClass('active').next().slideUp(300);
			$(this).parents('.one').find('.spoller').not($(this)).parent().removeClass('active');
		}

		if ($(this).hasClass('closeall') && !$(this).hasClass('active')) {
			$.each($(this).closest('.spollers').find('.spoller'), function (index, val) {
				$(this).removeClass('active');
				$(this).next().slideUp(300);
			});
		}
		$(this).toggleClass('active').next().slideToggle(300, function (index, val) {
			if ($(this).parent().find('.slick-slider').length > 0) {
				$(this).parent().find('.slick-slider').slick('setPosition');
			}
		});
		return false;
	});


	function scrolloptions() {
		var scs = 100;
		var mss = 50;
		var bns = false;
		if (isMobile.any()) {
			scs = 10;
			mss = 1;
			bns = true;
		}
		var opt = {
			cursorcolor: "#118AD9",
			cursorwidth: "6px",
			background: "rgba(206, 206, 206, 0.56)",
			autohidemode: false,
			cursoropacitymax: 1,
			bouncescroll: bns,
			cursorborderradius: "0px",
			scrollspeed: scs,
			mousescrollstep: mss,
			directionlockdeadzone: 0,
			cursorborder: "0px solid #fff",
		};
		return opt;
	}
	function scroll(body, list) {
		body.niceScroll(list, scrolloptions());
	}
	//if(navigator.appVersion.indexOf("Mac")!=-1){
	//}else{
	if ($('.location__scroll').length > 0) {
		scroll($('.location__scroll'), '.location__list');
	}
	if ($('.scr').length > 0) {
		scroll($('.scr'), '.scr__list');
	}
	//}


	if ($('.t,.tip').length > 0) {
		tip();
	}
	function tip() {
		$('.t').webuiPopover({
			placement: 'left-bottom',
			trigger: 'hover',
			backdrop: false,
			//selector:true,
			animation: 'fade',
			dismissible: true,
			padding: false,
			//hideEmpty: true
			onShow: function ($element) { },
			onHide: function ($element) { },
		}).on('show.webui.popover hide.webui.popover', function (e) {
			$(this).toggleClass('active');
		});
		$('.tip').webuiPopover({
			placement: 'top',
			trigger: 'hover',
			backdrop: false,
			//selector:true,
			animation: 'fade',
			dismissible: true,
			padding: false,
			//hideEmpty: true
			onShow: function ($element) { },
			onHide: function ($element) { },
		}).on('show.webui.popover hide.webui.popover', function (e) {
			$(this).toggleClass('active');
		});
	}


	// Get Index
	function indexInParent(node) {
		var children = node.parentNode.childNodes;
		var num = 0;
		for (var i = 0; i < children.length; i++) {
			if (children[i] == node) return num;
			if (children[i].nodeType == 1) num++;
		}
		return -1;
	}

	//PARENTS
	let getParents = function (elem, className) {
		// Set up a parent array
		let parents = [];
		// Push each parent element to the array
		for (; elem && elem !== document; elem = elem.parentNode) {
			if (elem.classList.contains(className)) {
				parents.push(elem);
			}
		}
		// Return our parent array
		return parents;
	};
});
