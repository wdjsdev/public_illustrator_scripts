/*

    Script Name: Swatch Group From CSV
    Author: William Dowling
    Email: illustrator.dev.pro@gmail.com

    If this is useful to you and you'd like to say thanks
        by buying me some coffee:
    Paypal: paypal.me/illustratordev
    
    Description:
        prompt user to select a csv file
        parse csv file and create a new
        swatch group for every valid row of the csv.
        Currently only handles RGB colors, but could be
        easily adapted to work with any color type.
    Instructions:
        Open a blank document
        Run Script
        Select CSV file
        Tada. a new swatch group is created containing each
            swatch in the csv file.
        If you want to export this as a swatch library,
            remove all of the default colors leaving only
            the new swatch group. In the top right corner of
            the swatches panel click the menu button, then select
            "Save Swatch Library As ASE".

*/

#target Illustrator
function createSwatchGroupFromCSV() {
    var valid = true; //running flag validation. if this is ever false, exit
    var docRef = app.activeDocument;
    var swatches = docRef.swatches;
    var swatchGroups = docRef.swatchGroups;
    var destSwatchGroup; //this is the swatch group that will be created
    var csvFileRegex = /.csv$/i;
    var csvRows; //array of all rows in csv file


    //function definitions

    //send message to user
    function saySomething(msg) {
        //no need to check the operating system here
        //alerts work the same on windows and mac
        alert("Script message:\n" + msg);
    }

    function getCSV() {
        var userSelection;

        userSelection = File.openDialog("Select a CSV File", function (f) {
            return f instanceof Folder || csvFileRegex.test(f);
        })

        if (!userSelection) {
            saySomething("No CSV file selected. Aborting.");
            valid = false;
        }
        return userSelection;
    }

    function readCSV() {
        //open the csv file to read it's contents
        //if the contents is an empty string, alert and exit
        //else, split by \n and set the resulting array to csvRows
        csvFile.open("r");
        var csvContents = csvFile.read();
        csvFile.close();

        if (csvContents === "") {
            saySomething("CSV file is blank.");
            valid = false;
            return;
        }

        csvRows = csvContents.replace(/["']/g,"").split("\n");
    }

    function processCSV() {
        destSwatchGroup = swatchGroups.add();
        destSwatchGroup.name = csvFile.name;

        //loop the csvRows array
        var curRow;
        for (var r = 1, len = csvRows.length; r < len && valid; r++) {
            curRow = csvRows[r];
            processRow(curRow);
        }

    }

    function processRow(row) {
        if (row === "" ){
            //nothing to see here.. just move on
            return;
        }

        var columns = row.indexOf(",")>-1 ? row.split(",") : row.split(";");

        var props =
        {
            name: columns[0],
            r: columns[1],
            g: columns[2],
            b: columns[3]
        }
        createSwatch(props);
    }

    function createSwatch(props) {
        var rgbColor = new RGBColor();
        rgbColor.red = props.r;
        rgbColor.green = props.g;
        rgbColor.blue = props.b;

        var newSwatch = swatches.add();
        newSwatch.name = props.name;
        newSwatch.color = rgbColor;

        destSwatchGroup.addSwatch(newSwatch);
    }

    if (valid) {
        var csvFile = getCSV();
    }

    if (valid) {
        readCSV();
    }

    if (valid) {
        processCSV();
    }

    if (valid) {
        saySomething("Success!");
    }

}
createSwatchGroupFromCSV();