$(document).ready(function(){

	// ON MOBILE MENU
	$('nav ul.pull-menu').click(function(e){
		e.preventDefault();
		$('nav ul.floleft, nav ul.floright').stop().slideToggle();
	});

	// MODAL ON EVERY PAGE
	$('.md-trigger').click(function(e){
		e.preventDefault();
	});
	$('.md-close').click(function(e){
		e.preventDefault();
		$(this).closest('div.md-modal').removeClass('md-show');
	});
	$('.md-replace').click(function(e){
		e.preventDefault();
		$(this).closest('div.md-modal').removeClass('md-show');	
	});

	// HELP
	$('body').on('click', '.help .category ul li', function(e){
		e.preventDefault();
		var self = $(this);
		var content_selector = $('#'+self.attr('data-id'));

		$('.help .content').stop().fadeOut(200);
		$('.help .content').promise().done(function(){
			$('.help .content ul li div.description').hide();
			content_selector.stop().fadeIn(200);
		});
	});

	$('body').on('click', '.help span.title', function(e){
		e.preventDefault();
		var self = $(this);
		self.closest('li').find('div.description').stop().slideToggle();
	});

	// PRODUCT DETAIL
	$('body').on('click', '.gallery-image-detail > .item-wrapper > ul li', function(){
		var self = $(this);
		var image = self.children('img').clone().removeAttr('width').removeAttr('height');

		$('.gallery-image-detail > .preview-image-holder').empty().append(image);
	});

	$('body').on('click', '#btnLogin', function(e){
		e.preventDefault();
		var self = $(this);
		var form = self.closest('form').serializeToJSON();
		var rules = [
			{
				selector_name : 'txtLoginEmail',
				rules : [
					{ 'required' : true },
					{ 'email' : true },	
				]
			},
			{
				selector_name : 'txtLoginPassword',
				rules : [
					{ 'required' : true },
				]
			},
		];
		var valid = $.validate(form, rules);
	});

	// CONTACT
	$('body').on('click', '#btnSendContactUs', function(e){
		e.preventDefault();
		var self = $(this);
		var form = self.closest('form').serializeToJSON();
		var rules = [
			{
				selector_name : 'txtSenderName',
				rules : [
					{
						'required' : true,
						'message' : 'Nama harus diisi'
					},
					{
						'minLength' : 10,
					},
					{
						'alphanumeric' : true,
					},				
				]
			},
			{
				selector_name : 'txtSenderEmail',
				rules : [
					{
						'required' : true,
						'message' : 'Email harus diisi'
					},
					{
						'email' : true,
					},
				]
			},
			{
				selector_name : 'txtMessage',
				rules : [
					{
						'required' : true,
						'message' : 'Pesan harus diisi'
					},
				]
			},
		];
		var valid = $.validate(form, rules);
	});
});

$.validate = function( obj, rules ) {
	rules = (typeof rules === "undefined" || rules === null) ? 'default' : rules;
	var result = [];
	var valid = false;

	if( $.isArray(rules) ) {

		for( key in rules ) {
			var rule = rules[key];
			var selector_name = rule.selector_name;
			var label = $('label[for='+selector_name+']').text();
			var sub_rules = rule.rules;

			for( subkey in sub_rules ){
				var sub_rule = sub_rules[subkey];
				var arr_result = $.validateRule(selector_name, label, sub_rule);
				if( arr_result['status'] == 'error' ){
					break;
				}
			}
			result.push(arr_result);
		}

		valid = $.validateForm(result);

	} else if( rules == 'default' ) {
		
		Object.keys(obj).forEach(function (key) {
			var val = obj[key];
			var label = $('label[for='+key+']').text();
			var res = {
				'name' : key,
				'label' : label,
			};
			if( val != '' ) {
				res['status'] = 'success';
			} else {
				res['status'] = 'error';
				res['message'] = res['label'] + ' harap diisi';
			}
			result.push(res);
		});

		valid = $.validateForm(result);
	}

	return valid;
}

$.validateRule = function( selector_name, label, rule ) {
	var result = {
		'name' : selector_name,
		'label' : label,
		'status' : 'success'
	};

	var regexAlnum = /^[a-z0-9 ]+$/i;
	var regexAlphabet = /^[a-zA-Z ]+$/;
	var regexNumeric = /^\d+$/;
	var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var value = $.getValueFromElement( $('[name='+selector_name+']') );

	if( rule.hasOwnProperty('required') && rule['required'] == true && ( value == '' || typeof value == 'undefined') ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' harap diisi';
		}
	} else if( rule.hasOwnProperty('minLength') && value.length < rule['minLength'] ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' minimal ' + rule['minLength'] + ' karakter';
		}
	} else if( rule.hasOwnProperty('maxLength') && value.length > rule['maxLength'] ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' maksimal ' + rule['maxLength'] + ' karakter';
		}
	} else if( rule.hasOwnProperty('alphanumeric') && rule['alphanumeric'] == true && !regexAlnum.test(value) ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' hanya boleh huruf dan angka';
		}
	} else if( rule.hasOwnProperty('alphabet') && rule['alphabet'] == true && !regexAlphabet.test(value) ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' hanya boleh huruf';
		}
	} else if( rule.hasOwnProperty('numeric') && rule['numeric'] == true && !regexNumeric.test(value) ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' hanya boleh angka';
		}
	} else if( rule.hasOwnProperty('email') && rule['email'] == true && !regexEmail.test(value) ) {
		result['status'] = 'error';
		if( rule.hasOwnProperty('message') ) {
			result['message'] = rule['message'];
		} else {
			result['message'] = label + ' tidak valid';
		}
	}
 
	return result;
};

$.getValueFromElement = function( selector ) {
	var type = selector.attr('type');
	var result = false;

	if( type == 'text' || type == 'password' || type == 'textarea' || type == 'number' ) {
		result = selector.val();
	} else if( type == 'radio' || type == 'checkbox' ) {
		result = selector.filter(':checked').val();
	}

	return result;
}

$.validateForm = function( result ) {
	var flag_valid = 1;
	if( result.length ) {
		for( key in result ) {
			var cur = result[key];
			var name = cur['name'];
			var selector_error = $('<span class="error" validate='+name+'></span>');
			
			if( cur['status'] == 'error' ) {
				flag_valid-=2;
				selector_error.text(cur['message']);
				if( $('span.error[validate='+name+']').length ) {
					$('span.error[validate='+name+']').text(selector_error.text());
				} else {
					$('[name='+name+']').closest('div').append(selector_error);
				}
				$('span.error[validate='+name+']').show().css('display', 'block');
			} else {
				$('span.error[validate='+name+']').attr('class', 'green').text('Accepted').delay(1500).hide().promise().done(function(){
					$(this).remove();
				});
			}
		}
	}

	return ( flag_valid > 0 );
}

jQuery.fn.serializeToJSON = function(options) {

    options = jQuery.extend({}, options);
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push":     /^$/,
            "fixed":    /^\d+$/,
            "named":    /^[a-zA-Z0-9_]+$/
        };

    this.build = function(base, key, value){
        base[key] = value;
        return base;
    };

    this.push_counter = function(key){
        if(push_counters[key] === undefined){
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    jQuery.each(jQuery(this).serializeArray(), function(){
        // skip invalid keys
        if(!patterns.validate.test(this.name)){
            return;
        }

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while((k = keys.pop()) !== undefined){

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if(k.match(patterns.push)){
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if(k.match(patterns.fixed)){
                merge = self.build([], k, merge);
            }

            // named
            else if(k.match(patterns.named)){
                merge = self.build({}, k, merge);
            }
        }

        json = jQuery.extend(true, json, merge);
    });
    return json;
}