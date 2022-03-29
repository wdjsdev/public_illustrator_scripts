
//Author: Dilliam Wowling
//email: illustrator.dev.pro@gmail.com
//github: github.com/wdjsdev/public_illustrator_scripts
//Adobe Forum Post: https://community.adobe.com/t5/illustrator-discussions/save-an-illustrator-file-name-containing-the-date-and-names-of-the-links/td-p/12842255
//Language: javascript/extendscript
//Script Name: Save Doc With Date And Link Names
//deSCRIPTion: Saves the current document with a date and the names of the links in the document.


//Was this helpful? 
//Did it save you time and money?
//Would you like to say thanks by buying me a cup of
//coffee or a new car or anything in between?
//https://www.paypal.me/illustratordev


#target Illustrator
function SaveDocWithDateAndLinkNames()
{
	const doc = app.activeDocument;

	//get the current date formatted like this: dd-mm-yyyy
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	var curDate = dd+'_'+mm+'_'+yyyy;

	//get the links in the current document
	var links = doc.placedItems;
	var linkNames = [];

	for(var i = 0; i < links.length; i++)
	{
		linkNames.push(decodeURI(links[i].file.name).replace(/\.[^\.]*$/, ""));
	}

	var newFileName = curDate + " " + linkNames.join(" ") + ".ai";
	var outputFolderPath;
	if(!doc.saved || doc.name.match(/untitled/i) || !doc.path)
	{
		outputFolderPath = decodeURI(Folder.selectDialog("Select the folder to save the file to").fullName);
	}
	else
	{
		outputFolderPath = decodeURI(doc.path);
	}

	if(!outputFolderPath)
	{
		alert("No folder selected.\nOperation cancelled.");
		return;
	}

	doc.saveAs(File(outputFolderPath + "/" + newFileName));

}
SaveDocWithDateAndLinkNames();



