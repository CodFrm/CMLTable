(function($) {
    var createCMLTable = function(tableJson) {
        var TableObject;
        var tableHtml = '<table class="cmltable">\n<tr>\n';
        var selectHtml = '<select class="cmltable-select">\n';
        var columns = tableJson.columns;
        for (var i = 0; i < columns.length; i++) {
            tableHtml += '<th>\n';
            if (columns[i].checkbox == true) {
                tableHtml += '<div class="cmltable-check cmltable-check-head"></div>\n';
            } else if (columns[i].field) {
                tableHtml += columns[i].title + '\n';
            }
            tableHtml += '</th>\n';
        }
        for (var i = 0; i < tableJson.action.length; i++) {
            selectHtml += ' <option value="' + tableJson.action[i].action + '">' + tableJson.action[i].title + '</option>\n';
        }

        tableHtml += '</tr>\n</table>\n'
        selectHtml += '</select>\n';
        $(this).html(selectHtml + '<button class="cmltable-btn cmltable-sublit">确定</button>\n' + '<div class="cmltable-search">\n<input type="text" class="cmltable-select cmltable-search-edit" />\n' + '\n<button class="cmltable-btn  cmltable-search-btn">搜索</button>\n</div>' + tableHtml);
        $(this).find('.cmltable-sublit').click(function(event) { //选择列表框确定
            for (var i = 0; i < tableJson.action.length; i++) {
                if (tableJson.action[i].action == $(this).prev().val()) {
                    tableJson.action[i].func(TableObject);
                    break;
                }
            }
        });
        $(this).find('.cmltable-check-head').click(function(event) { //全选
            headCheck = $(this).attr('check');
            TableObject.find('.cmltable-check').each(function(index, el) {
                if (index == 0) return 0;
                if (headCheck == 'true') {
                    $(this).text('');
                    $(this).attr('check', 'false');
                } else {
                    $(this).text('✔');
                    $(this).attr('check', 'true');
                }
            });

        });

        TableObject = $(this).children('.cmltable');
        /**
         * 获取选中
         * @return {json} [选中项]
         */
        TableObject.getSelect = function() {
            var check = {};
            var i = 0;
            $(this).find('.cmltable-check').each(function(index, el) {
                if ($(this).attr('check') == 'true') {
                    check['id[' + i++ + ']'] = $(this).attr('cml-value');
                }
            });
            return check;
        };
        /**
         * 刷新
         * @return {null}
         */
        TableObject.refresh = function() {
            TableObject.find("tr:not(:first)").remove();
            jQuery.ajax({ //读取内容
                url: tableJson.url,
                success: function(data) {
                    var jsonData = $.parseJSON(data);
                    for (var n = 0; n < jsonData.rows.length; n++) {
                        var newRow = "<tr>";
                        for (var i = 0; i < columns.length; i++) {
                            newRow += "<td>";
                            if (columns[i].checkbox == true) {
                                newRow += '<div class="cmltable-check" cml-value="' + jsonData.rows[n][tableJson.keyID] + '"></div>\n';
                            } else if (columns[i].field) {
                                newRow += jsonData.rows[n][columns[i].field] + '\n';
                            }
                            newRow += "</td>\n";
                        }
                        newRow += "</tr>\n"
                        TableObject.find('tr:last').after(newRow);
                    }
                }
            });
        };
        TableObject.refresh();
        return TableObject;
    };
    $.fn.createCMLTable = createCMLTable;
})(jQuery);



jQuery(document).ready(function($) {
    $(document).on( 'click','.cmltable-check',function(event) {
        if ($(this).attr('check') == 'true') {
            $(this).text('');
            $(this).attr('check', 'false');
        } else {
            $(this).text('✔');
            $(this).attr('check', 'true');
        }
    });
});
