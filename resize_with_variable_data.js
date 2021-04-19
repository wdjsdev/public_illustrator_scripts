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

	//function for finding a specific item inside a parent container
	//parent = container object
	//itemName = string
	//[crit] = string representing criteria for a match
		//"match" means the entire name must match exactly
		//"imatch" means name must match, but case doesn't matter
		//"any" means itemName must exist somewhere in curItem.name, case insensitive
	//return a single object or undefined
	//Note: it will only find the FIRST item that matches. if there are multiple
		//items with the same name, this function doesn't know about any subsequent matching items
	function findSpecificPageItem(parent,itemName,crit)
	{
		var result,curItem;
		if(parent.pageItems.length)
		{
			for(var x=0,len=parent.pageItems.length;x<len && !result;x++)
			{
				curItem = parent.pageItems[x];
				if(crit)
				{
					if(crit === "match" && curItem.name === itemName)
					{
						result = curItem;
					}
					else if(crit === "imatch" && curItem.name.toLowerCase() === itemName.toLowerCase())
					{
						result = curItem;
					}
					else if(crit === "any" && curItem.name.toLowerCase().indexOf(itemName.toLowerCase())>-1)
					{
						result = curItem;
					}
				}
				else if(curItem.name === itemName)
				{
					result = curItem;
				}
			}
		}
		
		return result;
	}

	function mmToPt(mm)
	{
		return mm * 2.834645669391;
	}




	var doc = app.activeDocument;
	var layers = doc.layers;
	

	//
	//hard coded csv file
	//
	//change this path to match the location of your csv
	// var pathToCSV = "/Users/tugberkdilbaz/Desktop/abc.csv"
	// var pathToCSV = "~/Desktop/test/abc.csv";
	// var csvFile = File(pathToCSV);


	//
	//prompt user for csv file
	//
	//defaults to last used folder
	var csvFile = File.openDialog("Select CSV File");

	// debugger;
	// return;

	if(csvFile && csvFile.exists)
	{
		csvFile.open("r");
		var csvContents = csvFile.read();
		csvFile.close();
	}
	else
	{
		alert("No CSV File found at " + pathToCSV);
		return;
	}

	if(!csvContents || csvContents === "" || (csvContents.indexOf(",")<0 && csvContents.indexof(";")<0))
	{
		alert("Invalid CSV formatting.");
		return;
	}


	

	var missingItems = [];

	var rows = csvContents.split("\n");
	var splitRow,curRect,curPos = [];
	for(var x=1;x<rows.length;x++)
	{
		splitRow = rows[x].split(",");
		curRect = findSpecificPageItem(doc,splitRow[0],"any");
		if(curRect)
		{
			curPos = [curRect.left,curRect.top - curRect.height];
			curRect.width = mmToPt(splitRow[1]);
			curRect.height = mmToPt(splitRow[2]);
			curRect.left = curPos[0];
			curRect.top = curPos[1] + curRect.height;
		}
		else
		{
			missingItems.push(splitRow[0]);
		}
	}

	if(missingItems.length)
	{
		alert("The following items were listed on the CSV, but were not found in the document:\n" + missingItems.join("\n"));
	}
}
resizeWithVariableData();