function swatchesFromCsvWithHex()
{
	//If you read this from top to bottom, it should hopefully explain everything as it happens
	//this is intended more as a presentation and an educational tool than a comprehensive
	//tool for performing this task quickly and efficiently.

	//example CSV file

	//		swatch name,hex value
	//		mySwatch1,#123456
	//		mySwatch2,#987654





	//get the data file

	//you could hard code a path to the file like this
	// var myCsvFile = File("~/Desktop/temp/hex_to_rgb/test.csv");

	//or use a dialog so the user can select a file
	var myCsvFile = File.openDialog("Select a CSV File");

	//check to see if no file was selected
	if(!myCsvFile)
	{
		//the user cancelled the dialog.
		//exit the script
		return;
	}


	//open and read the contents of the data file
	//save the contents into the variable colorData
	myCsvFile.open("r");
	var colorData = myCsvFile.read();
	myCsvFile.close();


	//now, use javascript's String.split() method to convert
	//"colorData" from a regular string into an array of lines
	//we want split to look for any "\n" or newline characters
	//as that will indicate when we've reached the next color/row
	var lines = colorData.split("\n");

	//at this point lines will look something like this:
	// [
	//		"swatch name,hex value",
	//		"mySwatch1,#123456",
	//		"mySwatch2,#987654"
	// ]


	//so now we want to loop the lines array and create
	//a new swatch for each line.
	//we will initialize c to 1 so that we don't create 
	//a swatch for the title row
	for(var c=1;c<lines.length;c++)
	{
		//wait what's going on down here?! what is "createNewSwatch(lines[c])"???
		//keep reading. we're going to define this function below
		//for now, see that we're passing in the current line
		//to the createNewSwatch function. inside that function,
		//we'll parse the data to make the swatch
		createNewSwatch(lines[c]);
	}


	//this function will create a new swatch
	//with the name and color value dictated by
	//the argument "data"
	function createNewSwatch(data)
	{
		//split data by comma to get an array that holds
		//the name and color value, like this:
		// ["mySwatch1","#123456"]
		data = data.split(",");

		//set the swatch name to a variable
		var swatchName = data[0];
		//set the swatch hex value to a variable
		var hexValue = data[1];

		//ok we're making great progress here. Now we need to
		//convert our hex value to RGB so that we can create our swatch
		//since illustrator doesn't support hex swatches.
		//lets convert our hexValue to RGB
		var rgbValue = hexToRgb(hexValue);

		//now we have an rgb value like this:
		//rgbValue = {r:50,g:100,b:255}

		//so we can use this nice little object to create our new swatch.
		var newSwatch = app.activeDocument.swatches.add();
		newSwatch.name = swatchName; //set the name of the swatch

		//now let's create a new rgb color so we can assign it to newSwatch
		var newColor = new RGBColor();

		//now we can set the rgb values of newColor
		//with our rgbValue object like this:
		newColor.r = rgbValue.r;
		newColor.g = rgbValue.g;
		newColor.b = rgbValue.b;

		//now assign newColor as the color for newSwatch
		newSwatch.color = newColor;

		//and that's it. we're done creating this swatch. on to the next one
	}


	//i stole this function from here:
	//https://www.w3docs.com/snippets/javascript/how-to-convert-rgb-to-hex-and-vice-versa.html
	function hexToRgb(hex) {
	  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16)
	  } : null;
	}
}

swatchesFromCsvWithHex();