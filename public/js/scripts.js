// IIFE
(function(){

  // shorthand for $(document).ready
  $(function(){
    
    var $table = $("#statsTable"),
      stats = null,
      dinoMap = {},
      selected = null;

    //populate information
    $.getJSON( "/stats", function( data ) {
      stats = data.sort(function(a, b){
        return a.dino > b.dino;
      });
      var items = [];
      $.each( stats, function( key, val ) {
        dinoMap[val.dino] = val;
        items.push( "<option id='" + key + "' value='" + val.dino + "'>" + val.dino + "</option>" );
      });
      var $select = $( "<select/>", {
        "id": "dinoDropdown",
        html: items.join( "" )
      });
      $select.prependTo( "#dropdownCont" );
      $select.change(renderStats);
      
      $("#calculate").click(calculateAll);
      
    });
    
    var renderStats = function renderStats(){
      var dinoSelection = $('#dinoDropdown').find(":selected").text();
      var items = [];
      $.each(stats, function(key, val) {
        if (val.dino == dinoSelection){
          selected = val.dino;
          items.push(val.health, val.stamina, val.weight, val.damage, val.speed);
          var $healthRow = $($table.find("tr.data")[0]);
          var $healthOutput = $($healthRow.find("td")[3]);
          $healthOutput.html(items[0]);

          var $staminaRow = $($table.find("tr.data")[1]);
          var $staminaOutput = $($staminaRow.find("td")[3]);
          $staminaOutput.html(items[1]);

          var $weightRow = $($table.find("tr.data")[2]);
          var $weightOutput = $($weightRow.find("td")[3]);
          $weightOutput.html(items[2]);

          var $damageRow = $($table.find("tr.data")[3]);
          var $damageOutput = $($damageRow.find("td")[3]);
          $damageOutput.html(items[3]);

          var $speedRow = $($table.find("tr.data")[4]);
          var $speedOutput = $($speedRow.find("td")[3]);
          $speedOutput.html(items[4]);
        }
      });      
    };

    var calculate = function calculate(row){
      console.log("Calculating selected dino", selected);
      var dino = dinoMap[selected];
      
      if(!dino)
        return alert("Invalid dino selected");
      
      var $row = $($table.find("tr.data")[row]);
      var key = $row.find("td").first().text().toLowerCase();
      
      var $baseInput = $($row.find("td")[1]);
      var input = $baseInput.find("input").first().val();
      
      if(typeof input === "undefined")
        return;
      
      var output = (parseFloat(input) * parseFloat(dino[key]));
      
      if(isNaN(output))
        return alert("Invalid number in " + key + " input.");
      
      output = output.toFixed(1);
      
      var $baseOutput = $($row.find("td")[4]);
      $baseOutput.html(output);
      
      var $lvlInput = $($row.find("td")[2]);
      var lvl = $lvlInput.find("input").first().val();
      
      if(typeof lvl === "undefined")
        return;
      
      var maxStats = lvl * output;
        var input = parseInt(input);
      var maxStats = (maxStats + input);
      var $statsOutput = $($row.find("td")[5]);
      $statsOutput.html((maxStats).toFixed(1));
    };
   
    var calculateAll = function calculateAll(){
      $table.find("tr.data").each(function(idx){
        calculate(idx);
      });
    };

  });
  
})();
