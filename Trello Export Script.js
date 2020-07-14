function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
    var menuEntries = [ {name: "Update from Trello", functionName: "main"},];
    ss.addMenu("Trello", menuEntries);
  
  }
  
  // trello variables
  var api_key = "da9e24e6c264d018d88de3a8fdcebc39";
  var api_token = "7729155c2aa23dd9fccff52b11e6c0fe45a14da770235b63feff189a7efc309d";
  var board_id = "5ee11d28264db54eb686be2c";
  var url = "https://api.trello.com/1/";
  
  
  var key_and_token = "key="+api_key+"&token="+api_token;
  
  
  //called by google docs apps
  function main() {
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test").clear();
    ss.appendRow(["Date", "Task", "Who", "List", "Link"]);
    var response = UrlFetchApp.fetch(url + "boards/" + board_id + "/lists?cards=all&" + key_and_token);
    var lists = JSON.parse((response.getContentText()));
    Logger.log(lists);
  
    for (var i=0; i < lists.length; i++) {
      var list = lists[i];
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
  
        var dato = carddetails[k].date;
        var fullname = carddetails[k].memberCreator.fullName;
        var name = card.name;
        var link = card.url;
        var listname = list.name;
  
        //var labelname = carddetails[k].labeldetails.name;
  
        Logger.log(name);
        Logger.log(dato);
        Logger.log(fullname);
        Logger.log(link);
        //Logger.log(labelname);
        Logger.log(listname);
      }
        ss.appendRow([dato, name, fullname, listname, link]);
  
     }                                      
    }
  }