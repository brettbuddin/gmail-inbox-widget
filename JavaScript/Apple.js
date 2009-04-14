/*

Copyright _ 2005, Apple Computer, Inc.  All rights reserved.
NOTE:  Use of this source code is subject to the terms of the Software
License Agreement for Mac OS X, which accompanies the code.  Your use
of this source code signifies your agreement to such license terms and
conditions.  Except as expressly granted in the Software License Agreement
for Mac OS X, no other copyright, patent, or other intellectual property
license or right is granted, either expressly or by implication, by Apple.

*/

var flipShown = false;
var animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, timer:null};
function mousemove (event)
{
    if (!flipShown) 
    {
        if (animation.timer != null) 
        {
            clearInterval (animation.timer);
            animation.timer  = null;
        }
                
        var starttime = (new Date).getTime() - 13;
                
        animation.duration = 500;
        animation.starttime = starttime;
        animation.firstElement = document.getElementById ('flip');
        animation.timer = setInterval ('animate();', 13);
        animation.from = animation.now;
        animation.to = 0.5;
        animate();
        flipShown = true;
    }
}
function mouseexit (event)
{
    if (flipShown) 
    {
        if (animation.timer != null) 
        {
            clearInterval (animation.timer);
            animation.timer  = null;
        }
                
        var starttime = (new Date).getTime() - 13;
                
        animation.duration = 500;
        animation.starttime = starttime;
        animation.firstElement = document.getElementById ('flip');
        animation.timer = setInterval ('animate();', 13);
        animation.from = animation.now;
        animation.to = 0.0;
        animate();
        flipShown = false;
    }
}
function enterflip(event)
{
	document.getElementById('fliprollie').style.display = 'block';
}

function exitflip(event)
{
	document.getElementById('fliprollie').style.display = 'none';
}
function animate()
{
    var T;
    var ease;
    var time = (new Date).getTime();
                
        
    T = limit_3(time-animation.starttime, 0, animation.duration);
        
    if (T >= animation.duration) 
    {
        clearInterval (animation.timer);
        animation.timer = null;
        animation.now = animation.to;
    }
    else
    {
        ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
        animation.now = computeNextFloat (animation.from, animation.to, ease);
    }
        
    animation.firstElement.style.opacity = animation.now;
}
function limit_3 (a, b, c)
{
    return a < b ? b : (a > c ? c : a);
}
function computeNextFloat (from, to, ease)
{
    return from + (to - from) * ease;
}