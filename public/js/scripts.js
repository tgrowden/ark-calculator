// IIFE
(function(){

  // shorthand for $(document).ready
  $(function(){
    
    var $table = $("#statsTable"),
      stats = null,
      dinoMap = {},
      selected = null,
      lvlsApplied = [];
      totalLevels = 0;

    //populate information
    $.getJSON( "/stats", function( data ) {
      stats = data.sort(function(a, b){
        return a.dino > b.dino;
      });
      console.log("sorted", stats);
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

      //Sort list
      function sortlist(){
       var cl = document.getElementById('dinoDropdown');
       var clTexts = new Array();

       for(i = 2; i < cl.length; i++){
          clTexts[i-2] =
              cl.options[i].text.toUpperCase() + "," +
              cl.options[i].text + "," +
              cl.options[i].value + "," +
              cl.options[i].selected;
       }
       clTexts.sort();
       for(i = 2; i < cl.length; i++){
          var parts = clTexts[i-2].split(',');
          cl.options[i].text = parts[1];
          cl.options[i].value = parts[2];
          if(parts[3] == "true"){
              cl.options[i].selected = true;
          }else{
             cl.options[i].selected = false;
          }
       }
      }
      sortlist();
      // End Sort list
      $('#dinoDropdown')
         .prepend($("<option></option>")
         .attr("value","select")
         .text("--Select a Dino--"));
      $("select#dinoDropdown").val("select");

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

/*          var $speedRow = $($table.find("tr.data")[4]);
          var $speedOutput = $($speedRow.find("td")[3]);
          $speedOutput.html(items[4]); */
        }
      });      
    };

    var calculate = function calculate(row){
      console.log("Calculating selected dino", selected);
      var dino = dinoMap[selected];
      
      if(!dino)
        return alert("No dino selected");
      
      var $row = $($table.find("tr.data")[row]);
      var key = $row.find("td").first().text().toLowerCase();
      
      var $baseInput = $($row.find("td")[1]);
      var input = $baseInput.find("input").first().val();
      
      if(typeof input === "undefined")
        return;
      
      var output = (parseFloat(input) * parseFloat(dino[key]));
      
      if(isNaN(output))
        return;
      
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
      lvl = parseInt(lvl);
      lvlsApplied.push(lvl);


    };
   
    var calculateAll = function calculateAll(){
      $table.find("tr.data").each(function(idx){
        calculate(idx);

      });
      // Get total of max levels applied
      var total = 0;
      $.each(lvlsApplied,function() {
        total += this;
      });
      var $Row = $($table.find("tr.data")[4]);
      var $lvlTotal = $($Row.find("td")[2]);
      $lvlTotal.html((total));

      // Check is total applied is out of range based on limit
      var lvlLimit = document.getElementById('lvlLimit').value;
      if ( total > lvlLimit ){
        $('#statsTable tr:nth-child(5) > td:nth-child(3)').addClass('warning');

      } else{
        if ($('#statsTable tr:nth-child(5) > td:nth-child(3)').hasClass('warning')){
          $('#statsTable tr:nth-child(5) > td:nth-child(3)').removeClass('warning');
        }
      }


      // zero out values so calculations are correct, even if no page reload
      total = 0;
      lvlsApplied = [];
    };
    
  });
  
})();
