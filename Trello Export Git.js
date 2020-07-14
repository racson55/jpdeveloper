//
// Based on Robert Gebhardt script (https://stackoverflow.com/users/4847886/robert-gebhardt)
//

// trello credentials
var api_key = "da9e24e6c264d018d88de3a8fdcebc39";
var api_token = "7729155c2aa23dd9fccff52b11e6c0fe45a14da770235b63feff189a7efc309d";
var board_id = "5ee11d28264db54eb686be2c";

// global variables
var url = "https://api.trello.com/1/";
var key_and_token = "key="+api_key+"&token="+api_token;

// called on sheet open - add menu option
function onOpen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [ {name: "Update from Trello", functionName: "main"},];
  ss.addMenu("Trello", menuEntries);
}

//called by google docs on the menu click
function main() {
//  var ss = SpreadsheetApp.getActiveSheet().clear();
  var ss = SpreadsheetApp.getActiveSheet();
//  ss.appendRow(["Quem", "Tarea", "Data"]);
  var response = UrlFetchApp.fetch(url + "boards/" + board_id + "/lists?cards=all&" + key_and_token);
  var lists = JSON.parse((response.getContentText()));
  Logger.log(lists);
             
  var str_lists = "";
  for (var i=0; i < lists.length; i++) {
     str_lists = str_lists + lists[i].name + "\r\n";
  }

  var ui = SpreadsheetApp.getUi();
  var result = ui.prompt(
      'Choose a Trello list',
      'Please inform the desired list name, or leave empty for all lists:\n\n' + str_lists + "\n",
      ui.ButtonSet.OK_CANCEL);
  var button = result.getSelectedButton();
  var selected_list = result.getResponseText();
  
  if (button == ui.Button.OK) {
    Logger.log(selected_list);

    for (var i=0; i < lists.length; i++) {
      var list = lists[i];
      Logger.log(list.name);
      if (selected_list == "" || selected_list == list.name) {
        //if(!list.closed) continue; //ignore open
        //Logger.log(list);
        
        var response = UrlFetchApp.fetch(url + "list/" + list.id + "/cards?" + key_and_token);
        var cards = JSON.parse(response.getContentText());
        if(!cards) continue;
        
        for (var j=0; j < cards.length; j++) {
          var card = cards[j];
          Logger.log(url + "cards/" + card.id + "/actions?" + key_and_token);
          var response = UrlFetchApp.fetch(url + "cards/" + card.id + "/?actions=all&" + key_and_token);
          var carddetails = JSON.parse(response.getContentText()).actions;
          if(!carddetails) continue;
          Logger.log(carddetails);
          
          for (var k=0; k < carddetails.length; k++) {
            var date = Utilities.formatDate(new Date(carddetails[k].date), 'America/Recife', 'dd/MM/yyyy');
         
            var due = card.due;
            if (due != null) 
              due = Utilities.formatDate(new Date(due), 'America/Recife', 'dd/MM/yyyy');
            var member_name = carddetails[k].memberCreator.fullName;
            var card_name = card.name;
            var card_desc = card.desc;
            var link = card.url;
            var list_name = list.name;
            
            //var labelname = carddetails[k].labeldetails.name;
            
            Logger.log(member_name);
            Logger.log(card_name);
            Logger.log(date);
            Logger.log(due);
            Logger.log(link);
            Logger.log(list_name);
          }
          ss.appendRow([member_name, card_name, date, due, , card_desc, list_name]);
        }
      }
    }
  }
}