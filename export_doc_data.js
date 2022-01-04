/*
    
    In reference to this thread on the Adobe Illustrator forum:
        https://community.adobe.com/t5/illustrator-discussions/looking-for-a-way-to-export-object-shape-or-artboard-size-data-to-a-csv-or-similar-file/td-p/12596046

    Edited, refactored, and finished by:
        William Dowling
        github.com/wdjsdev
        illustrator.dev.pro@gmail.com

    Was this helpful? Would you like to say thanks by buying me a cup of coffee?
        paypal.me/illustratordev

*/


# target Illustrator

function container()
{

    function getCSVtext(rows)
    {
        var text = "";
        for (var i = 0; i < rows.length; i += 1)
        {
            text += rows[i].join(",") + "\r\n";
        }
        return text;
    }

    function ptToInch(pt)
    {
        //convert points to inches
        return pt * .01389;
    }

    function roundTo8th(num)
    {
        //round the given number to the nearest 1/8"
        return Math.ceil((num.toFixed(3)) * 8) / 8;
    }

    function getItemWidthHeight(item)
    {
        var width = roundTo8th(ptToInch(item.width));
        var height = roundTo8th(ptToInch(item.height));
        return [item.name, width, height];
    }

    function getArtboardInfo(artboard)
    {
        var rect = artboard.artboardRect;
        var x = rect[0];
        var y = rect[1];
        var width = roundTo8th(ptToInch(rect[2] - rect[0]));
        var height = roundTo8th(ptToInch(rect[1] - rect[3]));
        return [artboard.name, x, y, width, height];
    }

    function writeCsvData(data,destFolderPath)
    {
        //write the csv data to the file
        var file = File(destFolderPath);
        file.open("w");
        file.write(data.join("\n"));
        file.close();
    }







    //    
    //error handling
    //

    if (!app.documents.length)
    {
        alert("please open a document and try again.");
        return;
    }
    
    var selections = app.activeDocument.selection;
    if (!selections.length)
    {
        alert("Please make a selection and try again.");
        return;
    }




    //absolute path to data file.
    //this file does not need to exist prior to running the script 
    var csvFilePath = "~/Desktop/data.csv"



    //
    //function calls
    //

    //
    //if you want to get selected object data use this.
    //
    //
    // HANDLING HEADER ROW FOR SELECTED OBJECT DATA
    var rows = [
        ["NAME", "WIDTH", "HEIGHT", "LOCATION"]
    ];

    //populate the rows array with the data from the selected objects
    for (var i = 0; i < selections.length; i++)
    {
        rows.push(getItemWidthHeight(selections[i]));
    }



    // //
    // //If you want to get artboard data,
    // //uncomment this section and comment out the section above.
    // //
    // //
    // // HANDLING HEADER ROW FOR ARTBOARD DATA
    // var rows = [["NAME","POS-X","POS-Y","WIDTH","HEIGHT","LOCATION"]];
    // for (var i = 0, ab; i < app.activeDocument.artboards.length; i++)
    // {
    //     ab = app.activeDocument.artboards[i];
    //     rows.push(getArtboardInfo(ab));
    // }



    //display the data to the user and ask if they want to write it to a file
    if (confirm("Do you want to write this data?:\n" + getCSVtext(rows)))
    {
        writeCsvData(rows);
    }

}
container();