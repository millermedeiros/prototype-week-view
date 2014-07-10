# Vue.js prototype

trying Vue.js, performance is not as good as I expected... I really liked the
simplicity of the templates and the filters/binding is very easy to use but it
comes with a few drawbacks...

To make all the properties observable Vue.js needs to set the `__proto__` of
the objects during initialization, which is a slow process, specially on mobile
device like the hamachi (clicking the "today" button was taking almost
1 second).

The bottleneck is updating the `days` array and adding the events later to each
day also takes longer than what is considered acceptable. Updating the DOM
doesn't seen to take too long.


