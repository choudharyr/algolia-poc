(function () {
    var placesAutocomplete = places({
        container: document.querySelector('#form-address'),
        type: 'address',
        templates: {
            value: function (suggestion) {
                return suggestion.name;
            }
        }
    });
    placesAutocomplete.on('change', function resultSelected(e) {
        console.log(e);
        document.querySelector('#form-address2').value = e.suggestion.administrative || '';
        document.querySelector('#form-city').value = e.suggestion.city || '';
        document.querySelector('#form-zip').value = e.suggestion.postcode || '';
        document.querySelector('#form-country').value = e.suggestion.country || '';
    });
})();