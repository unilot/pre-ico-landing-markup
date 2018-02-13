(function () {
    var form2Data = function ($form) {
        var result = {};

        $.map($form.serializeArray(), function (n, i) {
            result[n['name']] = n['value'];
        });

        return result;
    };

    var onlineFormProcessor = function ($forms, formSettings) {
        var _formProcessor = this;
        var defaultSettings = {
            beforeSend: function ($form, jqXHR, settings) {
                this.hideAlert($form);
            },
            fail: function ($form, jqXHR, textStatus, errorThrown) {
                var message = jqXHR.responseText;

                try {
                    message = JSON.parse(jqXHR.responseText);

                    if (message.hasOwnProperty('detail')) {
                        message = message.detail;
                    }

                    if (jqXHR.status === 400) {
                        return true;
                    }
                } catch (e) {/*Do nothing*/
                }


                if (message && message.length > 384) {
                    message = message.substr(0, 384) + '...';
                }

                this.showAlertMessage($form, 'danger', message);

                return true;
            },
            valid: function ($form) {
                if ($form.data('url')) {
                    window.location.replace($form.data('url'))
                } else {
                    this.showAlertMessage($form, 'success', $form.data('success-message'));
                }
            },
            badRequest: function ($form, jqXHR, textStatus, errorThrown) {
                //Do nothing
            }
        };

        var formFinalSettings = $.extend(defaultSettings, formSettings);

        $forms.each(function (index, formElement) {
            var $_singleForm = $(formElement);

            $_singleForm.validator({
                focus: !$_singleForm.hasClass('js-form-no-focus'),
                custom: {
                    wallet: function ($input) {
                        if ($input.val().length > 0 && !(new Web3()).isAddress($input.val())) {
                            var error = config.messages.errors.validation.invalidWallet;

                            if ($input.data('wallet-error')) {
                                error = $input.data('wallet-error');
                            } else if ($input.data('error')) {
                                error = $input.data('error');
                            }

                            return error;
                        }
                    },
                    online: function ($input) {
                        var url = $input.data('online');
                        var $form = $input.closest('form');
                        var validator = $form.data('bs.validator');
                        var data = {};

                        if ($input.val().trim().length === 0) {
                            return false;
                        }

                        data[$input.attr('name')] = $input.val();

                        //TODO a lot of code duplication. This part should probably be refactored
                        if (validator && ($input.data('bs.validator.errors') || []).length === 0) {
                            $.ajax({
                                url: url,
                                dataType: 'json',
                                method: 'OPTIONS',
                                xhrFields: {
                                    withCredentials: true
                                },
                                headers: {
                                    'X-CSRFToken': Cookies.get('csrftoken')
                                },
                                success: function () {

                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    var error = config.messages.errors.validation.requestFailed;

                                    $input.data('bs.validator.errors', [error]);
                                    validator.showErrors($input);
                                }
                            });
                        }
                    },
                    phone: function ($input) {
                        var phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
                        var $form = $input.closest('form');
                        var validator = $form.data('bs.validator');

                        try {
                            var phone = phoneUtil.parse('+' + $input.val().replace(/^\D+/g, ''));

                            if (!phoneUtil.isValidNumber(phone)) {
                                throw new Error();
                            }

                        } catch (exception) {
                            return $input.data('error');
                        }
                    }
                }
            }).on('submit', function (event) {
                if (event.isDefaultPrevented()) {
                    return false;
                }

                var _self = this;
                var $form = $(_self);
                var hasOverlay = false;
                var $overlayedBlock = null;
                var $overlay = null;

                if (( $overlayedBlock = $form.hasClass('has-overlay') )) {
                    hasOverlay = true;
                } else if (( $overlayedBlock = $form.closest('.has-overlay') ).length > 0) {
                    hasOverlay = true;
                }

                $overlay = $('.overlay', $overlayedBlock);

                if (hasOverlay) {
                    $overlay.removeClass('hidden');
                }

                var data = form2Data($form);
                event.preventDefault();

                var postRequest = function () {
                    $.ajax({
                        url: $form.prop('action'),
                        dataType: 'json',
                        data: data,
                        method: $form.attr('method'),
                        xhrFields: {
                            withCredentials: true
                        },
                        headers: {
                            'X-CSRFToken': Cookies.get('csrftoken')
                        },
                        statusCode: {
                            403: function (jqXHR, testStatus, errorThrown) {
                                window.location.reload();
                            },
                            400: function (jqXHR, textStatus, errorThrown) {
                                try {
                                    $.each(JSON.parse(jqXHR.responseText), function (fieldName, errors) {
                                        var $input = $('[name="' + fieldName + '"]', $form);

                                        $input.data('bs.validator.errors', errors);
                                        $form.data('bs.validator').showErrors($input);
                                    });

                                    formFinalSettings.badRequest($form, jqXHR, textStatus, errorThrown);
                                } catch (e) {
                                    formFinalSettings.fail.call(_formProcessor, $form, jqXHR, textStatus, errorThrown);
                                }

                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            formFinalSettings.fail.call(_formProcessor, $form, jqXHR, textStatus, errorThrown);
                        },
                        complete: function () {
                            if (hasOverlay) {
                                $overlay.addClass('hidden');
                            }
                        },
                        success: function () {
                            formFinalSettings.valid.call(_formProcessor, $form);
                        }
                    });
                };

                console.log($form, $form.hasClass('js-no-option-request'));

                if ($form.hasClass('js-no-option-request')) {
                    postRequest();
                } else {
                    $.ajax({
                        url: $form.prop('action'),
                        dataType: 'json',
                        method: 'OPTIONS',
                        xhrFields: {
                            withCredentials: true
                        },
                        headers: {
                            'X-CSRFToken': Cookies.get('csrftoken')
                        },
                        success: function () {
                            postRequest();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            if (hasOverlay) {
                                $overlay.addClass('hidden');
                            }

                            formFinalSettings.fail.call(_formProcessor, $form, jqXHR, textStatus, errorThrown);
                        },
                        beforeSend: function (jqXHR, settings) {
                            formFinalSettings.beforeSend.call(_formProcessor, $form, jqXHR, settings)
                        }
                    });
                }

                return false;
            });
        });
    };

    onlineFormProcessor.prototype.showAlertMessage = function ($form, type, message) {
        var $alert = $('.js-form-alert', $form);

        $alert.removeClass('hidden');

        if (type !== 'success') $alert.removeClass('alert-success');
        if (type !== 'warning') $alert.removeClass('alert-warning');
        if (type !== 'danger') $alert.removeClass('alert-danger');

        $alert.addClass('alert-' + type);

        $alert.text(message);
    };

    onlineFormProcessor.prototype.hideAlert = function ($form) {
        var $alert = $('.js-form-alert', $form);

        $alert.removeClass('alert-success');
        $alert.removeClass('alert-warning');
        $alert.removeClass('alert-danger');
        $alert.addClass('hidden');
        $alert.text('');
    };

    var $forms = $('form.js-generic-form');
    var $exitIntentForm = $('#bio_ep form');

    new onlineFormProcessor($forms);
    new onlineFormProcessor($exitIntentForm, {
        valid: function ($form) {
            this.showAlertMessage($form, 'success', $form.data('success-message'));

            setTimeout(function () {
                bioEp.hidePopup()
            }, 5000);
        }
    });
})();