function NewDocLandscapeArtboard()
{
	const doc = app.documents.add();
	const ab = doc.artboards[0];
	var rect = ab.artboardRect;
	const w = rect[2]-rect[0];
	const h = rect[1] - rect[3];

	if(w < h)
	{
		ab.artboardRect = [rect[0],rect[1],rect[0] + h,rect[1] - w];
	}
}
NewDocLandscapeArtboard();