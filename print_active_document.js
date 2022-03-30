//Author: Dilliam Wowling
//email: illustrator.dev.pro@gmail.com
//github: github.com/wdjsdev/public_illustrator_scripts
//Adobe Forum Post: https://community.adobe.com/t5/illustrator-discussions/print-document-without-click-quot-print-quot-from-window/td-p/12051975
//Language: javascript/extendscript
//Script Name: Print Document
//deSCRIPTion: Sets up print options and prints the active document with no dialogs.


//Was this helpful? 
//Did it save you time and money?
//Would you like to say thanks by buying me a cup of
//coffee or a new car or anything in between?
//https://www.paypal.me/illustratordev


#target Illustrator

function PrintDocument()
{
	//set the name of the printer
	const nameOfPrinter = "Xerox Phaser 3020";

	if(!app.documents.length)
	{
		alert("Please open a document before running this script.");
		return;
	}

	const doc = app.activeDocument;

	//verify that the desired printer is in the printerList
	var pl = app.printerList;
	try
	{
		myPrinter = pl[nameOfPrinter];
	}
	catch(e)
	{
		alert("Failed to find a printer named " + nameOfPrinter);
		return;
	}

	//set up print options
	var	printOptions = new PrintOptions(),
		printCoordinateOptions = new PrintCoordinateOptions();
	
	printOptions.printerName = nameOfPrinter;
	printCoordinateOptions.fitToPage = true;
	printOptions.printCoordinateOptions = printCoordinateOptions;

	//print the document
	doc.print(printOptions);


}
PrintDocument();



