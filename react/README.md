# React.js prototype

giving Rect.js a try.. I tried to use the same data structure as the Vue
prototype just to confirm that React doesn't suffer from the same bottleneck.

The bottleneck on the Vue.js prototype was basically when we had to create
a new Day dynamically and pushed new objects into the Vue arrays. To make all
the properties observable Vue.js needs to set the `__proto__` of the objects
during initialization, which is a slow process, specially on mobile device like
the hamachi (clicking the "today" button was taking almost 1 second).

React works on a different way and bypasses this problem and also uses the
`[key]` properties to speed up the rendering.

I know I could change/optimize the whole process/data-structure but wanted to
get an idea of how hard would it be to convert same structure between both
frameworks.

In the end I might still try a other frameworks or maybe come up with my own
solution for the calendar app since I still think the hardest problem for us is
mapping the events/busytimes/calendars to the views, and these frameworks
doesn't really help in this process, in fact they make it a little bit harder
because they *enforce* a specific structure.

One problem that we have by using React is that the app startup performance
degraded A LOT. Maybe just because React contains 17K LOC by itself... Even if
we reduce the amount of requests it is still too slow..

**IMPORTANT:** behavior of this prototype is not 100% correct, but I coded it
in a few hours with the main goal of learning the basics of React.js and
testing the performance on this specific scenario and also to understand
pros/cons of react.
