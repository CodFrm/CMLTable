(function($) {
    var createCMLTable = function(tableJson) {
        var TableObject;
        var tableHtml = '<table class="cmltable">\n<tr>\n';
        var selectHtml='<select class="cmltable-select">\n';
        var columns = tableJson.columns;
        for (var i = 0; i < columns.length; i++) {
            tableHtml += '<th>\n';
            if (columns[i].checkbox == true) {
                tableHtml += '<div class="cmltable-check cmltable-check-head" id="cmltable-check-' + i + '"></div>\n';
            } else if (columns[i].field) {
                tableHtml += columns[i].title+'\n';
            }
            tableHtml += '</th>\n';
        }
        for(var i=0;i<tableJson.action.length;i++){
        	selectHtml+=' <option value="'+tableJson.action[i].action+'">'+tableJson.action[i].title+'</option>\n';
        }
        jQuery.ajax({
            url: tableJson.url,
            success: function(data) {
                var jsonData = $.parseJSON(data);
                for (var n = 0; n < jsonData.rows.length; n++) {
                    var newRow = "<tr>";
                    for (var i = 0; i < columns.length; i++) {
                        newRow += "<td>";
                        if (columns[i].checkbox == true) {
                            newRow += '<div class="cmltable-check cmltable-check-' + i + '"></div>\n';
                        } else if (columns[i].field) {
                            newRow += jsonData.rows[n][columns[i].field]+'\n';
                        }
                        newRow += "</td>\n";
                    }
                    newRow += "</tr>\n"
                    TableObject.find('tr:last').after(newRow);
                }
            }
        });
        tableHtml += '</tr>\n</table>\n'
        selectHtml+='</select>\n';
        $(this).html(selectHtml+'<button class="cmltable-btn cmltable-sublit">确定</button>\n' + '<div class="cmltable-search">\n<input type="text" class="cmltable-select cmltable-search-edit" />\n' + '\n<button class="cmltable-btn  cmltable-search-btn">搜索</button>\n</div>' + tableHtml);
        $(this).find('.cmltable-sublit').click(function(event) {

        });
        $(this).find('.cmltable-check-head').click(function(event) {
            headCheck = $(this);
            TableObject.find('.' + $(this).attr('id')).each(function(index, el) {
                if (headCheck.attr('check') == 'true') {
                    $(this).text('');
                    $(this).attr('check', 'false');
                } else {
                    $(this).text('✔');
                    $(this).attr('check', 'true');
                }
            });

        });
        TableObject = $(this).children('.cmltable');
        return TableObject;
    };

    $.fn.createCMLTable = createCMLTable;
})(jQuery);


jQuery(document).ready(function($) {
    $('.cmltable-check').click(function(event) {
        if ($(this).attr('check') == 'true') {
            $(this).text('');
            $(this).attr('check', 'false');
        } else {
            $(this).text('✔');
            $(this).attr('check', 'true');

        }
    });
});
