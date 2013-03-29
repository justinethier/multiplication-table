/**
 * An Interactive Multiplication table
 * https://github.com/justinethier/multiplication-table
 *
 * Copyright (c) 2012 Justin Ethier <justin dot ethier at gmail dot com>
 *
 * This file contains code for the main page
 */

/**
 * Called on DOM ready to initialize everything
 */
jQuery(document).ready(function(){
    var $_GET = getQueryParams(document.location.search),
        offset = $_GET.offset,
        base = $_GET.base || 10;
    (new MulTable(offset, base));
});

/**
 * A utility function to extract GET parameter variables
 * http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery
 */
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
function MulTable(offset, base){
    var that = this;

    that.blinkingID = null;
    that.timer = null;
    that.render(parseInt(offset, 10), parseInt(base, 10));

    // Setup event handlers
    jQuery('#hide-all').click(function(){ that.adjustAll(false); });
    jQuery('#show-all').click(function(){ that.adjustAll(true); });
}

/**
 * Callback to show/hide all buttons
 */
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

/**
 * Show contents of a 'button'
 */
MulTable.prototype.showButton = function(jqButton){
    $('.ui-button-text', jqButton.parentNode).text(
        $('label', jqButton.parentNode).attr('value'));
}

/**
 * Hide contents of a 'button'
 */
MulTable.prototype.hideButton = function(jqButton){
    $('.ui-button-text', jqButton.parentNode).html(
        "&nbsp;");
}

/**
 * Render DOM for the multiplication table
 */
MulTable.prototype.render = function(offsetArg, base){
    var that = this, r, rv, row, c, cv, col, id, offset = offsetArg || 0,
        product, max = (base == 2 ? 11 : base + 1),
        cssClass = "col-1-" + (max);

    for (r=0; r < max; r++){
        row = $('<div class="grid grid-pad"></div>');
        for (c=0; c < max; c++){

            rv = r + offset;
            cv = c + offset;
            product = (rv * cv).toString(base).toUpperCase();

            if (r === 0 && c === 0){
                col = $('<div class="' + cssClass + '"><div class="content content-label" style="text-align: center;">X</div></div>');
            } else if (r === 0){
                col = $('<div class="' + cssClass + '"><div class="content content-label" style="text-align: center;">' + 
                    cv.toString(base).toUpperCase() + '</div></div>');
            } else if (c === 0){
                col = $('<div class="' + cssClass + '"><div class="content content-label" style="text-align: center;">' + 
                    rv.toString(base).toUpperCase() + '</div></div>');
            } else {
                col = $('<div class="' + cssClass + '"><div class="content content-square">' + 

                // (r * c)
                '<input type="checkbox" id="check_' + rv + '_' + cv + '" /><label style="width: 100%;" for="check_' + rv + '_' + cv + '" value="'+ (product) +'">&nbsp;</label>' +

                '</div></div>');
            }
            row.append(col);
        }
        $('#tbl').append(row);
    }

    $('#tbl').append($('<div> &nbsp; </div>'));
    for (r=0; r < max; r++){
        for (c=0; c < max; c++){
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

                   if (that.blinkingID != null &&
                       $(this).attr('id') == that.blinkingID){
                       that.blinkClear();
                   }
                });
            // FUTURE:
            // $('label', this.parentNode)
            //     .hover(function(){
            //         $(this.parentNode.parentNode)
            //             .prevAll('div > label')
            //             .addClass('ui-state-hover');
            //     });
        }
    }

// TODO: this is just for debugging, but need a way to init
//       test mode:
// that.blinkButton('check_1_2');
}

MulTable.prototype.blinkInit = function(id){ /* TODO */ }
MulTable.prototype.blinkNext = function(id){ /* TODO */ }

MulTable.prototype.blinkStart = function(id){
    var that = this, elm = jQuery('#' + id).parent();

    that.blinkClear();
    that.blinkingID = id;
    that.timer = setInterval(blink, 10);

    function blink() {
        elm.fadeOut(400, function() {
           elm.fadeIn(400);
        });
    }
}

MulTable.prototype.blinkStop = function(){
    var that = this;
    
    if(that.timer != null){
        clearInterval(that.timer);
        that.blinkingID = null; 
        that.timer = null;
    }
}

