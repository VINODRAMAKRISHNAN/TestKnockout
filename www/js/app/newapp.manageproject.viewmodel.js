


////validations: https://github.com/ericmbarnard/Knockout-Validation/wiki/Getting-Started
//http://jsfiddle.net/KHFn8/1185/
//editables: https://github.com/romanych/ko.editables

   
//Modifiy these function on the basis of requirments
var Item = function (item) {
    var self = this;

   

    self.ProjectId = ko.observable(0);
    self.TeamId = ko.observable(0);
    self.ProjectName = ko.observable("");
    self.ProjectTypeEnumId = ko.observable(0);
    self.ParentId = ko.observable(0);
    self.LGGCode = ko.observable("");
    self.EstTotalWells=ko.observable();
    self.PlayTypeEnumId = ko.observable(0);
    self.ProjectAccessTypeEnumId = ko.observable(0);
    self.ProjectNameChangeReason = ko.observable("");
    self.CreatedByUser = ko.observable();
    self.CreatedDate = ko.observable();
    self.ModifiedByUser = ko.observable();
    self.ModifiedDate = ko.observable();
}

//seperate the key with type of the column by "@@@"
//use string, integer, decimal,date,boolean -- will extend and abstract constructfilter methrod for more requirements
var Filtercolumnoptions = function () {
    var self = this;
    self.options = [

    { key: "-- Select --", val: "-- Select --" },
    { key: "EventTypeName@@@string", val: "Event Type Name" },
    { key: "DisplayReserveClassification@@@boolean", val: "Display Reserve Classification" },
    { key: "DisplayRegulatoryType@@@boolean", val: "Display RegulatoryType" },
    { key: "DisplayAutoJoin@@@boolean", val: "Display AutoJoin" },
    { key: "DefaultCirculationRequiredValue@@@boolean", val: "Default Circulation Required Value" },
    { key: "DisplayIsOperatedBySamson@@@boolean", val: "Display IsOperated BySamson" },
    { key: "IsActive@@@boolean", val: "Is Active" },
    { key: "Description@@@boolean", val: "Description" }
    ];
}
var ComboBoxOptions = function () {
    var self = this;
    
    // configure the lookup groups for each of the required comoboxes
    // if there is no combo box then use self.rquiredlookupgroups = [] as default
    self.requiredlookupgroups = [];

    ////SAMPLE IMPLEMENTATIONS
    //self.requiredlookupgroups = ["EventType", "EventRegulatoryType", "EventReserveClassification"];

    ////following variables need to be decalred with corresponding lookupgroup names if there is combobox in the VIEW
    //self.eventtypecollection = [];
    //self.regulatorytypecollection = []
    //self.reserveclassificationcollection = []

    ////copy and paste following funcction for each one of the combo box and modify required changes
    //self.setComboBoxCollections = function (lookupcollection) {
    //    self.eventtypecollection = ko.utils.arrayFilter(lookupcollection, function (lookup) {
    //        return lookup.LookupGroup == self.requiredlookupgroups[0];
    //    });

    //    self.regulatorytypecollection = ko.utils.arrayFilter(lookupcollection, function (lookup) {
    //        return lookup.LookupGroup == self.requiredlookupgroups[1];
    //    });
    //    self.reserveclassificationcollection = ko.utils.arrayFilter(lookupcollection, function (lookup) {
    //        return lookup.LookupGroup == self.requiredlookupgroups[2];
    //    });
    //}
}
var SetItemValdiationRules = function (project) { // will set it for validation rules for required attributes

        project.ProjectName.extend(
       {
           required: {
               message: "[* 'Project Name' is required!!]",
               params: true
           }
       }
    ).extend({ maxLength: 50 })
    ;
        project.LGGCode.extend({ maxLength: 10 });
}
var OpenAddEditWindow = function () {
    //var window1 = $("#view-edit-popup").kendoWindow({
    //    async: false,
    //    //actions: ["Minimize", "Maximize", "Close"],
    //    actions: ["Minimize", "Maximize"],
    //    draggable: true,
    //    modal: false,
    //    title: "Edit Event Type:",
    //    width: "55%",
    //    height: "600px",
    //    visible: false
    //}).data("kendoWindow");;

    ////var window = $("#view-edit-popup").data("kendoWindow")
    //window1.open();
    //window1.center();
    //$("#view-edit-popup").closest(".k-window").css({
    //    top: 50,
    //    left: 300,
    //    width: "55%",
    //    height: "600px"

    //});
    //$('#view-edit-popup').parent().addClass("editWindow");
    //$('#view-edit-popup').addClass("view-edit-popup-style-open");
    
    ////$('#view-edit-popup').parent().find('.k-window-actions').css('background', 'black');
    ////$('#view-edit-popup').parent().find('.k-window-actions,.k-link').css('background', 'black');
    ////$('#view-edit-popup').parent().find('.k-icon').css('background', 'white');
    ////$('#view-edit-popup').parent().find('.k-icon,.k-close').css('background', 'red');
    ////$('#view-edit-popup').parent().find('.k-window-actions').css('background', 'white');
    ////k - icon
}

var ReassignItemvalues = function (orginalitem, newitem)
{
    orginalitem.ProjectId(newitem.ProjectId);
    orginalitem.CreatedByUser(newitem.CreatedByUser);
    orginalitem.CreatedDate(newitem.CreatedDate);
    orginalitem.ModifiedByUser(newitem.ModifiedByUser);
    orginalitem.ModifiedDate(newitem.ModifiedDate);
}
var GetSelectedItemId = function (item) {
    if (item.ProjectId > -1)
        return item.ProjectId;
    else
        return ko.toJS(item.ProjectId);
}
var FindItemById = function (itemarray, id) {
    var itm = ko.utils.arrayFilter(itemarray, function (curitem) {
        return ko.toJS(curitem.ProjectId) == id;
    });

    if (itm != null && itm.length > 0)
        return (itm[0]);
    else
        return null;
   
}

//var NavigateToURL = function (item,url) {   
//    window.navigate(url + "?id=0&parentid1=" + item.EventTypeId);
//}
var GetNavigatedItemId = function () {
    //if (($("#EventTypeId").attr("value") != null) && ($("#EventTypeId").attr("value") != "")) {
    //    return $("#EventTypeId").attr("value");
    //}
    //else {
    //    return 0;
    //}
    return 1;
}


var viewModel = null;
$(document).bind('pageinit')
{
    //alert('doc iniit fired');
    // viewModel.page1ViewModel.loadAllItems(); // load data for first 
   
};

$(document).bind("mobileinit", function () {
    //alert('mobileinit fired');
});



$(document).bind('pageload')
{
    //alert('page load  fired');
};

$(document).ready(function () {
    //alert('doc ready fired');
    
});



var OnPageShow = function () {
    //alert('pageshow hit');
    if (viewModel == null) {
        viewModel = {
            page1ViewModel: new AppViewModel("project", null, null),
            page2ViewModel: new AppViewModel("project", null, '#listassets')
        };
    }
    ko.applyBindings(viewModel);
   
    if ((viewModel == null) || (viewModel != null && viewModel.page1ViewModel.items().length == 0)) {
        viewModel.page1ViewModel.loadAllItems();
    }
    else {
        //var tmpitems = ko.toJS(viewModel.page1ViewModel.items());
        //viewModel.page1ViewModel.items().removeAll();
        //ko.mapping.fromJS(tmpitems, viewModel.page1ViewModel.items());
        viewModel.page1ViewModel.loadAllItems();
    }
};

$(document).delegate('#searchassets', 'pageshow', OnPageShow);








