


//ko.validation.configure({
//    registerExtenders: true,
//    messagesOnModified: true,
//    insertMessages: true,
//    parseInputAttributes: true,
//    messageTemplate: null
//});


//sorting and filtering related functions used in view model
ConstructServerSortFilterString = function (currentfiltercolumn, currentfiltervalue, currentsortcolumn, currentsortorder) {
    var sortfilterstring = "";
    var filterstring = "";
    var sortstring = "";
    var tmpcurrentfiltercolumn = ko.toJS(currentfiltercolumn);
    var tmpcurrentfiltervalue = trim(ko.toJS(currentfiltervalue).replace("'", "''"));
    var tmpcurrentsortcolumn = ko.toJS(currentsortcolumn);
    var tmpcurrentsortorder = ko.toJS(currentsortorder);

    if (tmpcurrentfiltercolumn != "-- Select --") {
        sortfilterstring = ConstructServerFilterString(tmpcurrentfiltercolumn, tmpcurrentfiltervalue);
    }
    if (tmpcurrentsortcolumn != "") {
        sortstring = ConstructServerSortString(tmpcurrentsortcolumn, tmpcurrentsortorder);
    }

    if (sortstring != "") {

        if (sortfilterstring == "") {
            sortfilterstring = sortstring;
        }
        else {
            sortfilterstring = sortfilterstring + "&" + sortstring;
        }
    }

    return sortfilterstring;
}
var ConstructServerFilterString = function (currentfiltercolumn, currentfiltervalue) {
    var col = "";
    var coltype = "";
    var filterstring = "";
    var arrfiltercolumnsplit = new Array();
    if (currentfiltercolumn != null && currentfiltercolumn != "") {
        var arrfiltercolumnsplit = currentfiltercolumn.split("@@@");
        if (arrfiltercolumnsplit.length > 0) {
            col = arrfiltercolumnsplit[0];
            if (arrfiltercolumnsplit.length > 1) {
                coltype = arrfiltercolumnsplit[1];
            }
        }
    }

    if (coltype == "string") {
        filterstring = "$filter=substringof('" + currentfiltervalue + "'," + col + ")";
    } else {
        filterstring = "$filter=" + col + "%20eq%20" + currentfiltervalue;
    }
    return filterstring;
}
var ConstructServerSortString = function (sortcolumn, sortorder) {

    var sortstring = "";

    if (sortcolumn != "") {
        sortstring = "$orderby=" + sortcolumn + "%20" + sortorder;
    }
    return sortstring;
}
//following two function modify only if option button name changes in the view

var DeselectOptionButton = function () {
    var selectedoption
    if ($('input:radio[name=tblItemSelect]:checked').length > 0) {
        selectedoption = $('input:radio[name=tblItemSelect]:checked')[0]
        var parentTr = $(selectedoption).closest('tr');
        //parentTr.css('background-color', '');
        ApplyRowItemSiblingsColor(parentTr);
        selectedoption.checked = false;
    }
}
var SelectIdentifiedOptionButton = function (idx) {
    var selectedoption
    if ($('input:radio[name=tblItemSelect]').length > idx) {
        selectedoption = $('input:radio[name=tblItemSelect]')[idx]
        var parentTr = $(selectedoption).closest('tr');

        ApplyRowItemSiblingsColor(parentTr.siblings());
        ApplyRowItemColor(parentTr);
        selectedoption.checked = true;
    }
}

//reuse this viewmodel or copy and enhance for any other functionalities
function AppViewModel(controllername, iscollectioneditable) {
    
    var self = this;
    self.webappname = webappname;
   

    if (iscollectioneditable != null && iscollectioneditable==true)
        self.iscollectioneditable = true;
    else
        self.iscollectioneditable = false;
    
    self.items = ko.mapping.fromJS([]);
   
    self.selecteditem = ko.observableArray();
   
    self.selectedvaldiationitem = ko.validatedObservable();
    self.selecteditemoriginal = null; //only applicable for large collection edtiting
    if (self.iscollectioneditable)
        self.selectededitableitem = ko.observable(new Item());
    else
        self.selectededitableitem = ko.observable(new Item()).extend({ editable: true });
   
    self.currentsortcolumn = ko.observable(""); //this attribute is applicable only if server sorting function is used in the corresponding .chtml other this is not in use
    self.currentsortorder = ko.observable("asc");
    self.currentfiltercolumnoptions = new Filtercolumnoptions();
    self.currentfiltercolumn = ko.observable("-- Select --");
    self.currentfiltervalue = ko.observable("");
    self.comboboxes = new ComboBoxOptions();
    self.currentview = "";
    self.parentheaderitemid = "";
    self.parentheaderitemgroupname = "";
    self.parentheaderdetails = ko.mapping.fromJS([]);
    self.ispopurequiredforedit = true;
    self.errors = new Array();
   

  

    //self.dropdownText = ko.computed(function () {
    //    return $("#selFilter option[value='" + ko.toJS(self.currentfiltercolumn()) + "']").text();
    //});

    //self.isSaveVisible = ko.dependentObservable(function () {
    //    return self.selectededitableitem.hasChanges() ? true : false;
    //});

    self.setParentHeaderGroupDetails = function (headergroupname, headerfilterid) {        
        self.parentheaderitemid=headerfilterid;
        self.parentheaderitemgroupname=headergroupname;
    }
    self.setItemForProcessing = function (item) { // will set it for validation and editable while open the popup for view/edit and new

        SetItemValdiationRules(item);
        self.selecteditem.removeAll();
        self.selecteditem.push(item);
        self.selectedvaldiationitem = ko.validatedObservable(item)
        self.selectededitableitem = item;
        if (!self.iscollectioneditable)
            ko.editable(self.selectededitableitem,true);
        self.resetHeaderValuesForEventTemplate(item);
    }

    self.setSelectedItemForProcessing = function (item, idx) { // will set it for validation and editable while open the popup for view/edit and new
        SetItemValdiationRules(item);
        self.selecteditem.removeAll();
        self.selecteditem.push(item);
        self.selectedvaldiationitem = ko.validatedObservable(item)
        self.selectededitableitem = item;
        if (!self.iscollectioneditable)
            ko.editable(self.selectededitableitem,true);
        SelectIdentifiedOptionButton(idx);
        self.resetHeaderValuesForEventTemplate(item);
    }

    self.selectItemDetails = function (item, event) {
        self.setItemForProcessing(item);
        selectedoption = event.srcElement;
        var parentTr = $(selectedoption).closest('tr');
        ApplyRowItemSiblingsColor(parentTr.siblings());
        ApplyRowItemColor(parentTr);
        selectedoption.checked = true;
       
    }

    //used in the addnew button click in the item list
    self.addNewItemDetails = function () {
        DeselectOptionButton();
        var item = new Item(null);
        self.setItemForProcessing(item);
        if (!self.iscollectioneditable)
            self.selectededitableitem.beginEdit();
        OpenAddEditWindow();
    }

    ////used in the view/edit button click in the item list
    self.editItemDetails = function () {
        if (self.items().length == 0) {
            self.selecteditem.removeAll();
        }
        if (self.selecteditem() != null && self.selecteditem().length > 0 && GetSelectedItemId(self.selecteditem()[0]) > 0) {
            if (!self.iscollectioneditable)
                self.selectededitableitem.beginEdit();
            OpenAddEditWindow();
        }
        else {
            alert("Please select an item from the list to continue..!!");
            if (self.items().length > 0)
                self.setSelectedItemForProcessing(self.items()[0], 0);
        }
    }
    
    self.ConstructLookupFilterString = function (lookupgroups) {
        var strRet = "";
        var strFilter = "LookupGroup%20eq%20'@@@@Param'";
        $.each(lookupgroups, function (idx, lookup) {
            if (idx == 0)
                strRet = "?$filter=" + strFilter.replace("@@@@Param", lookup);
            else
                strRet = strRet + "%20or%20" + strFilter.replace("@@@@Param", lookup);
        })
        
        return strRet;
    }

    self.ConstructHeaderFilterString = function () {
     
        var strRet = "?$filter=ItemGroup%20eq%20'" + self.parentheaderitemgroupname + "'%20and%20ID%20eq%20" + self.parentheaderitemid + "&$orderby=Seq%20asc";
      
        return strRet;
    }

    self.selectItemById = function (id) {
        var item = null;
        if (id > 0)
            var itm = FindItemById(self.items(), id);

        if (itm != null) {
            count = jQuery.inArray(itm, self.items());

            if (count <= 0) {
                count = 0;
                self.setSelectedItemForProcessing(self.items()[count], count);
                self.resetHeaderValuesForEventTemplate(self.items()[count])
            }
            else {
                self.setSelectedItemForProcessing(itm, count);
                self.resetHeaderValuesForEventTemplate(itm)
            }
        }
        else {
            self.setSelectedItemForProcessing(self.items()[0], 0);
            self.resetHeaderValuesForEventTemplate(self.items()[0])
        }

    }

    self.resetHeaderValuesForEventTemplate = function (itm) {
        if (self.currentview == "eventtemplate") {
            self.parentheaderitemid = itm.EventTypeId;
            self.parentheaderitemgroupname = "EventType";
            
            self.parentheaderdetails.removeAll();
            self.parentheaderdetails.push(new CustomHeaderItem(1,itm.EventTypeId, self.parentheaderitemgroupname, "Event Type Id", itm.EventTypeId));
            self.parentheaderdetails.push(new CustomHeaderItem(2,itm.EventTypeId, self.parentheaderitemgroupname, "Event Type Name", itm.EventTypeName));
        }
    }

    // register this first, this will load item data on the page load   
    self.loadHeaderItems = function () {
        if (self.currentview == "eventtemplate") {
            return;
        }
        var strfilterstring = self.ConstructHeaderFilterString(self.comboboxes.requiredlookupgroups);
        StartLoading();
        $.ajax({
            url: self.webappname + '/api/eventtemplateheader' + strfilterstring,
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (returnitems) {
                self.parentheaderdetails.removeAll();
                ko.mapping.fromJS(returnitems, self.parentheaderdetails);
                
                EndLoading();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Header data load error - ' + textStatus);
                EndLoading();
            }
        });
    }

    // register this first, this will load item data on the page load   
    self.loadRequiredLookups = function () {
        var strfilterstring = self.ConstructLookupFilterString(self.comboboxes.requiredlookupgroups);
        StartLoading();
        $.ajax({
            url: self.webappname + '/api/lookup' + strfilterstring,
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (returnitems) {
                self.comboboxes.setComboBoxCollections(returnitems);
                self.comboboxes.IsLookupLoaded = true;
                EndLoading();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('Combox data load error - ' + textStatus);                
                EndLoading();
            }
        });
    }
    // register this first, this will load item data on the page load   
    self.loadAllItems = function () {
        StartLoading();
       
        alert('vinodo-9');
        //if (self.parentheaderitemgroupname != null && self.parentheaderitemgroupname != "" && self.parentheaderdetails.length <= 0){
        //     self.loadHeaderItems();
        //}

        //if (self.comboboxes.requiredlookupgroups.length > 0 && self.comboboxes.IsLookupLoaded == false) {
        //    self.loadRequiredLookups();
        //}
        alert(self.webappname + '/api/' + controllername);
        $.ajax({
            crossDomain: true,
            url: self.webappname + '/api/' + controllername,
            type: 'GET',
            async: true,
            dataType: 'json',
            beforeSend: function (xhr) {
                //var token = window.btoa(user + ':' + pass);
                //xhr.setRequestHeader('Authorization', 'Basic ' + token);
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            },

            success: function (returnitems) {
                alert('return success');
                self.items.removeAll();
               
                ko.mapping.fromJS(returnitems, self.items);
                //resetTableStyle();
                var itmid = GetNavigatedItemId();
               
                if (self.items().length > 0)
                    self.selectItemById(itmid);

                //if (self.items().length > 0)
                    //self.setSelectedItemForProcessing(self.items()[0], 0);
                
                alert('success end');
                EndLoading();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('error - vinod');

                alert('error - ' + XMLHttpRequest.responseText)
                alert(textStatus);
                alert(errorThrown);;
               // resetTableStyle();
                EndLoading();
            },
            complete: function () {
                alert('This is completed');
            }


        });
    }

    self.loadItemById = function (id) {
        StartLoading();
        if (self.parentheaderitemgroupname != null && self.parentheaderitemgroupname != "" && self.parentheaderdetails.length <= 0) {
            self.loadHeaderItems();
        }

        if (self.comboboxes.requiredlookupgroups.length > 0 && self.comboboxes.IsLookupLoaded == false) {
            self.loadRequiredLookups();
        }
        $.ajax({
            url: self.webappname + '/api/' + controllername + '/'+ id,
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (returnitem) {
                self.selecteditemoriginal = returnitem;
                self.items.removeAll();
                var arritem = new Array();
                arritem.push(returnitem);
                ko.mapping.fromJS(arritem, self.items);

                self.setSelectedItemForProcessing(self.items()[0], 0);
                if (!self.iscollectioneditable)
                    self.selectededitableitem.beginEdit();
                EndLoading();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert('error - ' + XMLHttpRequest.responseText);            
                EndLoading();
            }
        });
    }

    self.saveItem = function () {       
        //self.selectedvaldiationitem.errors.showAllMessages();
        //isValidationSuccess = ko.observable(self.selectedvaldiationitem.isValid);
        var errors = ko.toJS(ko.validation.group(self.selectedvaldiationitem, { deep: true }));
        var isinvalid = (
             (errors.length > 0 && errors.length == 1 && errors[0] != null)
             || errors.length > 1
        )

        if (isinvalid) {
            alert('Please fix the validation issues to continue with save!!');
            return false;
        }
        if (!self.iscollectioneditable) {
            if (self.selectededitableitem.hasChanges() == false) {
                alert("No changes made!!");
                return false;
            }
        }
        else {
            var a = JSON.stringify(ko.toJS(self.selecteditem()[0])).replace(',"errors":[]', "");
            var b = JSON.stringify(self.selecteditemoriginal);
            if (a == b) {
                alert("No changes made!!");
                return false;
            }

        }
        
        var item = ko.toJSON(self.selecteditem()[0]);
        var id = GetSelectedItemId(self.selecteditem()[0]);


        if (id == 0) {
            self.createItem(id, item);
        }
        else {          
           self.updateItem(id, item);
        }

    }

    self.createItem = function (id, selitem) {
        StartLoading();

        var jqxhr = $.ajax({
            type: 'PUT',
            async: true,
            url: self.webappname + "/api/" + controllername + "/0",
            contentType: 'application/json; charset=utf-8',
            data: selitem,
            dataType: "json",
            success: function (newselitem) {            
                ReassignItemvalues(self.selecteditem()[0], newselitem);
                if (!self.iscollectioneditable)
                    self.selectededitableitem.commit();
                self.items.unshift(self.selecteditem()[0]);
               
                
                if (self.items().length > 0)
                    self.setSelectedItemForProcessing(self.items()[0], 0);
                var window1 = $("#view-edit-popup").data("kendoWindow");
                window1.close();

                EndLoading();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (!self.iscollectioneditable)
                    self.selectededitableitem.rollback();
                alert("This action failed, contact administrator (" + errorThrown + ")");
                self.loadAllItems();
                EndLoading();
            }
        });



    };

    self.updateItem = function (id, selitem) {
        StartLoading();
       
        var jqxhr = $.ajax({
            type: 'PUT',
            async: true,
            url: self.webappname + "/api/" + controllername + "/" + id,
            contentType: 'application/json; charset=utf-8',
            data: selitem,
            dataType: "json",
            success: function (item) {
                if ( self.iscollectioneditable )                   
                    self.selecteditemoriginal = item;

                
                if (!self.iscollectioneditable) {
                    ReassignItemvalues(self.selecteditem()[0], item);
                    self.selectededitableitem.commit();
                    self.selectededitableitem.beginEdit();
                }
                else {

                    self.items.removeAll();
                    self.selecteditem.removeAll();
                    self.selectedvaldiationitem = ko.validatedObservable();
                    self.selectededitableitem = ko.observable();
                    var arritem = new Array();
                    arritem.push(self.selecteditemoriginal);
                    ko.mapping.fromJS(arritem, self.items);
                    self.setSelectedItemForProcessing(self.items()[0], 0);                  
                }
                if (self.ispopurequiredforedit) {
                    var window1 = $("#view-edit-popup").data("kendoWindow");
                    window1.close();
                }
                EndLoading();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (!self.iscollectioneditable)
                    self.selectededitableitem.rollback();
                else {

                    self.items.removeAll();
                    self.selecteditem.removeAll();
                    self.selectedvaldiationitem = ko.validatedObservable();
                    self.selectededitableitem = ko.observable();
                    var arritem = new Array();
                    arritem.push(self.selecteditemoriginal);
                    ko.mapping.fromJS(arritem, self.items);
                    self.setSelectedItemForProcessing(self.items()[0], 0);
                }

               
                alert("This action failed, contact administrator (" + errorThrown + ")");
                if (self.ispopurequiredforedit != null && self.ispopurequiredforedit == false) {
                    if (!self.iscollectioneditable)
                        self.selectededitableitem.beginEdit();
                }
               
                //self.loadAllItems();
                EndLoading();
            }
        });
    }

    self.cancelandCloseItem = function () {
        if (!self.iscollectioneditable)
            self.selectededitableitem.rollback();
        else {
           
            self.items.removeAll();
            self.selecteditem.removeAll();
            self.selectedvaldiationitem = ko.validatedObservable();
            self.selectededitableitem = ko.observable();
            var arritem = new Array();
            arritem.push(self.selecteditemoriginal);
            ko.mapping.fromJS(arritem, self.items);
            self.setSelectedItemForProcessing(self.items()[0], 0);
            return true;
        }

        

        if (self.ispopurequiredforedit != null && self.ispopurequiredforedit == false) {           
            self.selectededitableitem.beginEdit();
            return true;
        }
       
        if ((self.selecteditem().length > 0)) {
            if (GetSelectedItemId(self.selecteditem()[0]) == 0) {

                if (self.items().length > 0)
                    self.setSelectedItemForProcessing(self.items()[0], 0);
            }
        }
        var window1 = $("#view-edit-popup").data("kendoWindow");
        window1.close();
    }

    self.sortItemsFromServer = function (sortcolumn) { // this is not used in EPNET implementations as we are sorting locally
        self.currentsortcolumn = ko.observable(sortcolumn);
        if (ko.toJS(self.currentsortorder) == "asc") {
            self.currentsortorder = ko.observable("desc");
        }
        else {
            self.currentsortorder = ko.observable("asc");
        }
        self.sortFilterFromServerAndloadAllItems();
    }
    // used to sort and filter the itemlist
    self.sortFilterFromServerAndloadAllItems = function () {// sort not using, but filter is using in epnet and is taken care from the server
        StartLoading();
        if (self.parentheaderitemgroupname != null && self.parentheaderitemgroupname != "" && self.parentheaderdetails.length <= 0) {
            self.loadHeaderItems();
        }
        if (self.comboboxes.requiredlookupgroups.length > 0 && self.comboboxes.IsLookupLoaded == false) {
            self.loadRequiredLookups();
        }
        var sortfilterstring = self.constructSortFilterString();
        $.ajax({
            url: self.webappname + '/api/' + controllername + '?' + sortfilterstring,
            type: 'GET',
            async: true,
            dataType: 'json',
            success: function (returnitems) {
                self.items.removeAll();
                ko.mapping.fromJS(returnitems, self.items);
               // resetTableStyle();
                var itmid = GetNavigatedItemId();
                if (self.items().length > 0)
                    self.selectItemById(itmid);
                //if (self.items().length > 0)
                //    self.setSelectedItemForProcessing(self.items()[0], 0);
                EndLoading();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                self.items.removeAll();
               // resetTableStyle();

                alert('Type mis-match, try with a matching type value!!');
                EndLoading();
            }
        });
    }

    self.constructSortFilterString = function () {
        var sortfilterstring = "";
        sortfilterstring = ConstructServerSortFilterString(self.currentfiltercolumn, self.currentfiltervalue, self.currentsortcolumn, self.currentsortorder);
        return sortfilterstring;

    }

    self.sortItemsInLocal = function (columnname, columntype) {
        StartLoading();
       
        var IsDescending = false;
        if (ko.toJS(self.currentsortorder) == "asc") {
            self.currentsortorder = ko.observable("desc")
            IsDescending = true;
        }
        else {
            self.currentsortorder = ko.observable("asc")
            IsDescending = false;
        }
        var tmpitems = ko.toJS(self.items());

        SortItemsLocal(tmpitems, IsDescending, columnname, columntype);
        self.items.removeAll();
        ko.mapping.fromJS(tmpitems, self.items);
       // resetTableStyle();
        if (self.items().length > 0)
            self.setSelectedItemForProcessing(self.items()[0], 0);
        EndLoading();
       
    }

    self.navigateToURL = function (url, id, parentid1, parentid2, parentid3, parentid4, parentid5) {
        var appnameurl = "";
        if (self.webappname == "") {
            appnameurl = "http://" + window.location.host;
        }
        else {
            appnameurl = self.webappname;
        }
        var toUrl = appnameurl + "/Home/" + url;
        if (self.items().length == 0) {
            self.selecteditem.removeAll();
        }
        if (self.selecteditem() != null && self.selecteditem().length > 0 && GetSelectedItemId(self.selecteditem()[0]) > 0) {

            //NavigateToURL(ko.toJS(self.selectededitableitem), toUrl)
            var IsParent1revised = false;
            if (id!=null)
                toUrl = toUrl + "?id=" + id;
            if (id != null && parentid1 == null) {
                toUrl = toUrl + "&parentid1=" + GetSelectedItemId(self.selecteditem()[0]);
                IsParent1revised=true;
            }
           
            if (IsParent1revised)
            {
                parentid1=GetSelectedItemId(self.selecteditem()[0]);;
            }
            else
            {
                if (id != null && parentid1 != null) {
                    toUrl = toUrl + "&parentid1=" + parentid1;
                }
            }

            if (IsParent1revised && self.currentview == "eventtemplate") {

                if (id != null && parentid1 != null && parentid2 != null)
                    var tmpeventtypeid = 0;
                    if (ko.toJS(self.selectededitableitem).EventTypeId != null)
                        tmpeventtypeid = ko.toJS(self.selectededitableitem).EventTypeId;
                    if (id != null && parentid1 != null && parentid2 != null)
                        toUrl = toUrl + "&parentid2=" + tmpeventtypeid;
            }
            else {
                if (id != null && parentid1 != null && parentid2 != null)
                    toUrl = toUrl + "&parentid2=" + parentid2;
            }
        


            //if (id!=null && parentid1 != null && parentid2 != null)
            //    toUrl = toUrl + "&parentid2=" + parentid2;
            if (id!=null && parentid1 != null && parentid2 != null && parentid3 != null)
                toUrl = toUrl + "&parentid3=" + parentid3;
            if (id!=null && parentid1 != null && parentid2 != null && parentid3 != null && parentid4 != null)
                toUrl = toUrl + "&parentid4=" + parentid4;
            if (id!=null && parentid1 != null && parentid2 != null && parentid3 != null && parentid4 != null && parentid5 != null)
                toUrl = toUrl + "&parentid5=" + parentid5;
            window.navigate(toUrl);
        }
        else {
            alert("Please select an item from the list to continue..!!");
            if (self.items().length > 0)
                self.setSelectedItemForProcessing(self.items()[0], 0);
        }

    }

    self.navigateFromBreadcrumbToParent = function (url, id, parentid1, parentid2, parentid3, parentid4, parentid5) {
        var appnameurl = "";
        if (self.webappname == "") {
            appnameurl = "http://" + window.location.host;
        }
        else {
            appnameurl = self.webappname;
        }
        var toUrl = appnameurl + "/Home/" + url;
       

        

        if (self.currentview == "eventtemplate") {
            var tmpeventtypeid = 0;
            if (ko.toJS(self.selectededitableitem).EventTypeId != null)
                tmpeventtypeid = ko.toJS(self.selectededitableitem).EventTypeId;
            if (id != null)
                toUrl = toUrl + "?id=" + tmpeventtypeid;
        }
        else {
            if (id != null)
                toUrl = toUrl + "?id=" + id;
        }

        if (id != null && parentid1 != null)
            toUrl = toUrl + "&parentid1=" + parentid1;

        if (id!=null && parentid1 != null && parentid2!=null)
            toUrl = toUrl + "&parentid2=" + parentid2;
        if (id!=null && parentid1 != null &&  parentid2 != null)
            toUrl = toUrl + "&parentid2=" + parentid2;
        if (id!=null && parentid1 != null  && parentid2 != null && parentid3 != null)
            toUrl = toUrl + "&parentid3=" + parentid3;
        if (id!=null && parentid1 != null && parentid2 != null && parentid3 != null && parentid4 != null)
            toUrl = toUrl + "&parentid4=" + parentid4;
        if (id!=null && parentid1 != null  && parentid2 != null && parentid3 != null && parentid4 != null && parentid5 != null)
            toUrl = toUrl + "&parentid5=" + parentid5;

        window.navigate(toUrl);
        
    }

   

    self.selectPreviousNextItem = function (isprevious) {
        var count = 0;
        if (self.items().length > 0) {
            count = jQuery.inArray(self.selecteditem()[0], self.items());
            if (isprevious) {
                count = count - 1;
                if (count <= 0) {
                    count = 0;
                }
                self.selectededitableitem.rollback();
                self.setSelectedItemForProcessing(self.items()[count], count);
                self.selectededitableitem.beginEdit();
            }
            else {//next
                count = count + 1;
                if (count >= self.items().length) {
                    count = self.items().length - 1;
                }
                self.selectededitableitem.rollback();
                self.setSelectedItemForProcessing(self.items()[count], count);
                self.selectededitableitem.beginEdit();
            }
        }
    }

   

}
