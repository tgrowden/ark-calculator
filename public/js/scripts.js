// IIFE
(function(){

  // shorthand for $(document).ready
  $(function(){
    
    var $table = $("#statsTable");
    
    var multipliers = [
      0.27,
      0.1,
      0.04,
      0.1
    ];

    function selectionChange() {
      var dinoSelection = $('#dinoDropdown').find(":selected").text();
    }

    //populate information
    $.getJSON( "/stats", function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        items.push( "<option id='" + key + "' value='" + val.dino + "'>" + val.dino + "</option>" );
      });
      $( "<select/>", {
        "id": "dinoDropdown",
        "onchange": "selectionChange()",
        html: items.join( "" )
      }).prependTo( "#dropdownCont" );
    });

    var calculate = function calculate(row){

      var $row = $($table.find("tr.data")[row]);
      
      var $baseInput = $($row.find("td")[1]);
      var input = $baseInput.find("input").first().val();
      
      if(typeof input === "undefined")
        return;
      
      var output = (input * multipliers[row]).toFixed(1);
      
      var $baseOutput = $($row.find("td")[2]);
      $baseOutput.html(output);
      
      var $lvlInput = $($row.find("td")[3]);
      var lvl = $lvlInput.find("input").first().val();
      
      if(typeof lvl === "undefined")
        return;
      
      var maxStats = lvl * output;
        var input = parseInt(input);
      var maxStats = (maxStats + input);
      var $statsOutput = $($row.find("td")[4]);
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

/*
$.getJSON( "/stats", function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        var dino = val.dino;
        var health = val.health;
        var stamina = val.stamina;
        var weight = val.weight;
        var damage = val.damage;
        var speed = val.speed;
        var stats = [
          dino,
          health,
          stamina,
          weight,
          damage,
          speed
        ];
        var dinoSelection = $('#dinoDropdown').find(":selected").text();
        if(dinoSelection == stats.indexOf(dino)) {
          multipliers[0] = health;
          console.log("health = " + health);
        }
      });
      
    });
    */

