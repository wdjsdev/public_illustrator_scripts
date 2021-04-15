/*
	Script Name: resize with variable data
	Author: William Dowling
	Paypal: paypal.me/illustratordev

	Description: Given a csv file, find and
		resize any objects in the document
		matching the name in the first column
		of the csv.

		Sample of expected CSV formatting:
			Name,Width,Height
			myItem1,95,85
			Second Item,120,45
			Other Item Name,50,50

*/

#target Illustrator

function resizeWithVariableData()
{
	var doc = app.activeDocument;
	var layers = doc.layers;
	


	var csvFile = File("~/Desktop/my_csv.csv");
	csvFile.open("r");
	var csvContents = csvFile.read();
	csvFile.close();

	

	var rows = csvContents.split("\n");
	var splitRow,curRect;
	for(var x=1;x<rows.length;x++)
	{
		splitRow = rows[x].split(",");
		try
		{
			curRect = doc.pageItems[splitRow[0]];
			curRect.width = splitRow[1];
			curRect.height = splitRow[2];
		}
		catch(e)
		{
			alert("Failed to find a pageItem called: " + splitRow[0]);
		}
	}
}
resizeWithVariableData();