//knockout mapping js url
//http://nuget.org/packages/Knockout.Mapping
//jQuery.noConflict();
//alert(11);
//jQuery.support.cors = true;
//alert(11);//both these codes will support web api cross domain calls from any source
$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

//jQuery.support.cors = true;
//modify this for any deployment locations

var webappname = "http://tx047ltw8dev004.idea.com/EPMobile.XCom.Service";
//$("#loadwindow").kendoWindow({
//    async: true,
//    content: "Loading",
//    actions: ["Minimize", "Maximize"],
//    draggable: true,
//    modal: true,
//    title: "Please wait ..loading",
//    width: "200",
//    height: "100px",
//    visible: false
//});


if (String.prototype.trim != "function") {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

var loadCount = 0;
function StartLoading() {
   
   
    if (loadCount == 0) {
        $.mobile.showPageLoadingMsg();

    }
    loadCount = loadCount + 1;
   
}

function EndLoading() {
    
    
    loadCount = loadCount - 1;
    if (loadCount == 0) {
        $.mobile.hidePageLoadingMsg();

        
    }
    if (loadCount <= 0) {
        loadCount = 0;
    }
    
    //setScrollHeight();  
}


//$(window).resize(function () {
    
//    setScrollHeight();
//});

////applicable for all textarea controls
function textMaxLength(obj) {
    var mlength = obj.getAttribute ? parseInt(obj.getAttribute("maxlength")) : ""
    if (obj.getAttribute && obj.value.length > mlength)
        obj.value = obj.value.substring(0, mlength)
}

function setScrollHeight() {
    var ht = $(window).height() - (document.getElementById('main_r7').offsetTop + document.getElementById('mainfooter').offsetHeight);
    var htper = (ht * 100) / ($(window).height());
    htper = Math.round(htper);
    document.getElementById('itemcontainer_scroll').style.height = "" + htper + "%";
}



function getClassName(obj) {
    if (typeof obj === "undefined")
        return "undefined";
    if (obj === null) return "null";
    return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
}

function trim(s) {
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    s = s.replace(/\n /, "\n");
    return s;
}
// reusable sort functions, and sort by any field 
var sort_by = function (field, reverse, primer) {

    var key = function (x) { return primer ? primer(x[field]) : x[field] };

    return function (a, b) {
        var A = key(a), B = key(b);
        return ((A < B) ? -1 :
                ((A > B) ? +1 : 0)) * [-1, 1][+!!reverse];
    }
}

var SortItemsLocal = function (items, isDesc, field, filedtType) {
    ////this is for date
    //var tmpsortedlist = items.sort(sort_by("ModifiedDate", isDesc, function (a) { return a.toUpperCase() }));
    ////this is for int etc
    //var tmpsortedlist = items.sort(sort_by("price", isDesc, parseInt));
    switch (filedtType) {
        case "varchar":
        case "string":
            var tmpsortedlist = items.sort(sort_by(field, isDesc, function (a) { return a == null ? "" : a.toUpperCase() }));
            break;
        case "date":
        case "dattime":
            var tmpsortedlist = items.sort(sort_by(field, isDesc, function (a) { return a == null ? "" : a.toString() }));
            break;
        case "integer":
        case "int":
            var tmpsortedlist = items.sort(sort_by(field, isDesc, parseInt));
            break;
        case "boolean":
        case "bool":
            var tmpsortedlist = items.sort(sort_by(field, isDesc, function (a) { return a == null ? "" : a.toString() }));
            break;
        case "decimal":
        case "float":
            var tmpsortedlist = items.sort(sort_by(field, isDesc, parseFloat));
            break;

    }

}


var ApplyRowItemColor = function (item) {   
    item.css('background-color', '#CCFFCC');
}

var ApplyRowItemSiblingsColor = function (item) {
    item.css('background-color', '');
}





