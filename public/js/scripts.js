// IIFE
(function(){

  // shorthand for $(document).ready
  $(function(){
    
    var $table = $("#statsTable");
    
    /*var multipliers = [
      0.27,
      0.1,
      0.04,
      0.1
    ]; */
    var multipliers = [];

    //populate information
    $.getJSON( "/stats", function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        items.push( "<option id='" + key + "' value='" + val.dino + "'>" + val.dino + "</option>" );
      });
      $( "<select/>", {
        "id": "dinoDropdown",
        html: items.join( "" )
      }).prependTo( "#dropdownCont" );
    });


    var calculate = function calculate(row){
      var dinoSelection = $('#dinoDropdown').find(":selected").text();
      console.log(dinoSelection);

      $.getJSON( "/stats", function( data ) {
          var items = [];
          $.each( data, function( key, val ) {
            if (val.dino == dinoSelection){
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

            }
          });
        });


      var $row = $($table.find("tr.data")[row]);
      
      var $baseInput = $($row.find("td")[1]);
      var input = $baseInput.find("input").first().val();
      
      if(typeof input === "undefined")
        return;
      
      var output = (input * multipliers[row]).toFixed(1);
      
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

    $("#calculate").click(calculateAll);
 
  });
  
})();
