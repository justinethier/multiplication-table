/**
 * An Interactive Multiplication table
 * https://github.com/justinethier/multiplication-table
 *
 * Copyright (c) 2012 Justin Ethier <justin dot ethier at gmail dot com>
 *
 * This file contains code for the main page
 */

jQuery(document).ready(function(){
    var $_GET = getQueryParams(document.location.search),
        offset = $_GET.offset;
    (new MulTable(offset));
});

// A utility function to extract GET parameter variables
// http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

/**
 * An object to construct and work with the multiplication table
 */
function MulTable(offset){
    var that = this;

    that.render(parseInt(offset, 10));

    // Setup event handlers
    jQuery('#hide-all').click(function(){ that.adjustAll(false); });
    jQuery('#show-all').click(function(){ that.adjustAll(true); });
}

MulTable.prototype.adjustAll = function(value){
    var that = this;

    jQuery('input:checkbox', '#tbl').each(function(){
        jQuery(this).prop('checked', value)
                    .button('refresh');
        if (value){
            that.showButton(this);
        } else {
            that.hideButton(this);
        }
    });
}

MulTable.prototype.showButton = function(jqButton){
    $('.ui-button-text', jqButton.parentNode).text(
        $('label', jqButton.parentNode).attr('value'));
}

MulTable.prototype.hideButton = function(jqButton){
    $('.ui-button-text', jqButton.parentNode).html(
        "&nbsp;");
}

MulTable.prototype.render = function(offsetArg){
    var r, rv, row, c, cv, col, id, offset = offsetArg || 0;

    for (r=0; r < 11; r++){
        row = $('<div class="grid grid-pad"></div>');
        for (c=0; c < 11; c++){

            rv = r + offset;
            cv = c + offset;

            if (r === 0 && c === 0){
                col = $('<div class="col-1-11"><div class="content content-label" style="text-align: center;">X</div></div>');
            } else if (r === 0){
                col = $('<div class="col-1-11"><div class="content content-label" style="text-align: center;">' + 
                    cv + '</div></div>');
            } else if (c === 0){
                col = $('<div class="col-1-11"><div class="content content-label" style="text-align: center;">' + 
                    rv + '</div></div>');
            } else {
                col = $('<div class="col-1-11"><div class="content content-square">' + 

                // (r * c)
                '<input type="checkbox" id="check_' + rv + '_' + cv + '" /><label style="width: 100%;" for="check_' + rv + '_' + cv + '" value="'+ (rv * cv) +'">&nbsp;</label>' +

                '</div></div>');
            }
            row.append(col);
        }
        $('#tbl').append(row);
    }

    $('#tbl').append($('<div> &nbsp; </div>'));
    for (r=0; r < 11; r++){
        for (c=0; c < 11; c++){
            rv = r + offset;
            cv = c + offset;

            id = '#check_' + rv + '_' + cv;
            $(id)
                .button()
                .click(function(){
                   if ($(this).is(':checked')){
                       $('.ui-button-text', this.parentNode).text(
                           $('label', this.parentNode).attr('value'));
                   } else {
                       $('.ui-button-text', this.parentNode).html(
                           "&nbsp;");
                   }
                });
        }
    }
}
