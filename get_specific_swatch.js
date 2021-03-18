//function for getting a swatch from the document
//by name, or creating the swatch if it doesn't
//already exist.
//
//this is intended to replace the native
//Document.swatches.getByName() function
//which causes a runtime error if you try
//to find a swatch that doesn't exist.
//
//this function should give you the swatch you want
//either way.
//
//In my own workflow, I have a color database attached
//to this function so that I needn't input colorType
//and colorValue each time i use it. I just input the
//name of the swatch I want, and if it needs to be created
//the function accesses the given json "database" (db)
//and inputs the appropriate values if the database
//indeed contained an entry for the given name.


/*
arguments:
	name: String
		represents the name of the swatch you want to find/create
	[colorType]: String, optional
		represents the color type you want to use
		current supported options are "CMYK" and "RGB"
	[colorValue]: Object, optional
		represents the color values of the swatch
		eg.
			{
				"cyan": 12,
				"magenta": 30,
				"yellow": 84,
				"black": 5
			}
	[tint]: Number
		Number between 0 and 100 representing the tint of the swatch
		Don't know if it has to be an int.. I've never tried a float
	[db]: Object, optional
		In the event the swatch doesn't exist and a new one needs to
		be created, you can pass in a JSON object to automatically pull
		the info you need for the given swatch. example formatting:
			{
				"My Swatch":{"cyan": 12,"magenta": 30,"yellow": 84,"black": 5},
				"Special Red":{"cyan": 12,"magenta": 30,"yellow": 84,"black": 5}
			}
*/

function makeNewSpotColor(name,colorType,colorValue,tint,db)
{
	var doc = app.activeDocument;
	var swatches = doc.swatches;
	
	//pseudo function overloading.
	//if colorType or colorValue are undefined
	//set them to some default value
	if(!colorType)
	{
		//default colorType cmyk
		//just swap the comment on these statements
		//to use RGB as default
		
		colorType = "CMYK"
		// colorType = "RGB"
	}
	if(!colorValue)
	{
		if(db && db[name])
		{
			//if there's a database and a matching
			//entry, use it
			colorValue = db[name];
		}
		else
		{
			//set the default color value
			colorValue =
			{
				"cyan": 12,
				"magenta": 30,
				"yellow": 84,
				"black": 5
			}	
		}
		
	}



	//either get a swatch matching the name given
	//or create a new swatch with the given parameters
	var newSpotSwatch;
	try
	{
		newSpotSwatch = swatches[name];
		if(tint)
		{
			//if a tint value was given, update the tint of the swatch
			newSpotSwatch.color.tint = tint;
		}
	}
	catch(e)
	{
		//there was no swatch in the document matching "name"
		//create a new spot swatch with the given parameters
		var newColor = (colorType === "CMYK") ? new CMYKColor() : new RGBColor();
		for(var color in colorValue)
		{
			newColor[color] = colorValue[color];
		}

		var newSpot = doc.spots.add();
		newSpot.name = name;
		newSpot.color = newColor;
		newSpot.colorType = ColorModel.SPOT;

		newSpotSwatch = new SpotColor();
		newSpotSwatch.spot = newSpot;
		newSpotSwatch = swatches[name];
		if(tint)
		{
			newSpotSwatch.tint = tint;
		}
	}
	return newSpotSwatch;
}