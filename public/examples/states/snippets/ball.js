// default speed
$('.ball').spiritAnimateTo('one');

// custom speed
$('.ball').spiritAnimateTo('one', 0.5);

// override tween property scale
$('.ball').spiritAnimateTo('one', 0.5, {scale: 3});

// or animate directly (stateless)
$('.ball').spiritAnimateTo(0.5, {
	x: 200,
	alpha: 0.5,
	scale: 3
});
