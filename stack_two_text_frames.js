/*
	Fuction name: stack_two_text_frames
	
	Function description: given two textFrames, align the second textFrame
		to the left edge of first textFrame, then place the second textFrame
		some value of points below the first textFrame. this is determined by
		the SPACING constant. Set this value to whatever you want. Remember that
		it's in points. so if you want 1" spacing, use 72pt.
	
	Author: William Dowling
	Buy the author some coffee: https://www.paypal.com/paypalme/illustratordev

	Forum discussion: https://community.adobe.com/t5/illustrator/illustrator-script-textframe-size-and-positioning/td-p/11939050

*/

function stackTwoTextFrames(frame1, frame2)
{
	const SPACING = 15;
	frame2.left = frame1.left;
	frame2.top = frame1.top - frame1.height - SPACING;
}
stackTwoTextFrames(app.activeDocument.textFrames[0],app.activeDocument.textFrames[1]);