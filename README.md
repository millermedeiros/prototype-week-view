# prototype for gaia calendar week view v2.1

this is just a prototype, coded really fast to test performance and viability.

the main goal for the prototype is to test the drag performance on week view,
but I also decided to use [Vue.js](http://vuejs.org/) to see how much it would
simplify the process and if performance is good enough. I ended up using the
live binding to do some *bad things*, but it was a good stress test as well.

I tried many different markup structures, some of them caused weird glitches
and *checker boarding*, maybe I'll push other branches for you guys to try out.
The best performance is using `position:sticky` instead of the JavaScript drag,
but it introduces some challenges, specially since we have the *overscrolling*
and momentum... it is not so easy to snap the position and it looks weird when
it happens on the `touchend` or if we poll for the `scrollLeft` until it's
close to stopping or user does multiple consecutive swipes.. not sure if we
have any other settings for APZ; would be great if we had more control over the
scroll behavior, so we could disable the momentum and *overscrolling* of
a single axis/element.

PS: the events are *loaded* asynchronously to simulate the behavior when
reading expanding events inside a range (we have plans to make most operations
async in the future). I added a random delay between 100-1000ms to each day
event *expansion*.

PPS: performance on Flame is *good enough*, but on Hamachi it feels kinda slow.

related bugs:

 - [Bug 1023662 - User story: Show 5 day week view](https://bugzilla.mozilla.org/show_bug.cgi?id=1023662)
 - [Bug 1027726 - Clean up calendar app view code with reactive view abstractions](https://bugzilla.mozilla.org/show_bug.cgi?id=1027726)

