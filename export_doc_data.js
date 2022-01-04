#target Illustrator
function container()
{

    function getCSVtext(rows) {
        var text = "";
        for (var i = 0; i < rows.length; i+=1) {
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
        return [item.name,width,height];
    }

    function writeCsvData(data)
    {
        //write the csv data to the file
        var file = File("~/Desktop/temp/data.csv");
        file.open("w");
        file.write(data.join("\n"));
        file.close();
    }




    //function calls
    
    if(!app.documents.length) 
    {
        alert("please open a document and try again.");
        return;
    }
    var selections = app.activeDocument.selection;

    if(!selections.length)
    {
        alert("Please make a selection and try again.");
        return;
    }

    // HANDLING HEADER ROW FOR CSV OUTPUT
    var rows = [["NAME","WIDTH","HEIGHT","LOCATION"]];

    //populate the rows array with the data
    for (var i=0; i<selections.length; i++){
        rows.push(getItemWidthHeight(selections[i]));
    }

    //display the data to the user and ask if they want to write it to a file
    if(confirm("Do you want to write this data?:\n" + getCSVtext(rows)))
    {
        writeCsvData(rows);
    }

}
container();