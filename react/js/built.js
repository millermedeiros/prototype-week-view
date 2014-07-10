/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */

/**

seedrandom.js
=============

Seeded random number generator for Javascript.

version 2.3.6<br>
Author: David Bau<br>
Date: 2014 May 14

Can be used as a plain script, a node.js module or an AMD module.

Script tag usage
----------------

<script src=//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.6/seedrandom.min.js>
</script>

// Sets Math.random to a PRNG initialized using the given explicit seed.
Math.seedrandom('hello.');
console.log(Math.random());          // Always 0.9282578795792454
console.log(Math.random());          // Always 0.3752569768646784

// Sets Math.random to an ARC4-based PRNG that is autoseeded using the
// current time, dom state, and other accumulated local entropy.
// The generated seed string is returned.
Math.seedrandom();
console.log(Math.random());          // Reasonably unpredictable.

// Seeds using the given explicit seed mixed with accumulated entropy.
Math.seedrandom('added entropy.', { entropy: true });
console.log(Math.random());          // As unpredictable as added entropy.

// Use "new" to create a local prng without altering Math.random.
var myrng = new Math.seedrandom('hello.');
console.log(myrng());                // Always 0.9282578795792454


Node.js usage
-------------

npm install seedrandom

// Local PRNG: does not affect Math.random.
var seedrandom = require('seedrandom');
var rng = seedrandom('hello.');
console.log(rng());                  // Always 0.9282578795792454

// Autoseeded ARC4-based PRNG.
rng = seedrandom();
console.log(rng());                  // Reasonably unpredictable.

// Global PRNG: set Math.random.
seedrandom('hello.', { global: true });
console.log(Math.random());          // Always 0.9282578795792454

// Mixing accumulated entropy.
rng = seedrandom('added entropy.', { entropy: true });
console.log(rng());                  // As unpredictable as added entropy.


Require.js usage
----------------

Similar to node.js usage:

bower install seedrandom

require(['seedrandom'], function(seedrandom) {
  var rng = seedrandom('hello.');
  console.log(rng());                  // Always 0.9282578795792454
});


Network seeding via a script tag
--------------------------------

<script src=//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.3.6/seedrandom.min.js>
</script>
<!-- Seeds using urandom bits from a server. -->
<script src=//jsonlib.appspot.com/urandom?callback=Math.seedrandom">
</script>

Examples of manipulating the seed for various purposes:

var seed = Math.seedrandom();        // Use prng with an automatic seed.
document.write(Math.random());       // Pretty much unpredictable x.

var rng = new Math.seedrandom(seed); // A new prng with the same seed.
document.write(rng());               // Repeat the 'unpredictable' x.

function reseed(event, count) {      // Define a custom entropy collector.
  var t = [];
  function w(e) {
    t.push([e.pageX, e.pageY, +new Date]);
    if (t.length < count) { return; }
    document.removeEventListener(event, w);
    Math.seedrandom(t, { entropy: true });
  }
  document.addEventListener(event, w);
}
reseed('mousemove', 100);            // Reseed after 100 mouse moves.

The "pass" option can be used to get both the prng and the seed.
The following returns both an autoseeded prng and the seed as an object,
without mutating Math.random:

var obj = Math.seedrandom(null, { pass: function(prng, seed) {
  return { random: prng, seed: seed };
}});


Version notes
-------------

The random number sequence is the same as version 1.0 for string seeds.
* Version 2.0 changed the sequence for non-string seeds.
* Version 2.1 speeds seeding and uses window.crypto to autoseed if present.
* Version 2.2 alters non-crypto autoseeding to sweep up entropy from plugins.
* Version 2.3 adds support for "new", module loading, and a null seed arg.
* Version 2.3.1 adds a build environment, module packaging, and tests.
* Version 2.3.4 fixes bugs on IE8, and switches to MIT license.
* Version 2.3.6 adds a readable options object argument.

The standard ARC4 key scheduler cycles short keys, which means that
seedrandom('ab') is equivalent to seedrandom('abab') and 'ababab'.
Therefore it is a good idea to add a terminator to avoid trivial
equivalences on short string seeds, e.g., Math.seedrandom(str + '\0').
Starting with version 2.0, a terminator is added automatically for
non-string seeds, so seeding with the number 111 is the same as seeding
with '111\0'.

When seedrandom() is called with zero args or a null seed, it uses a
seed drawn from the browser crypto object if present.  If there is no
crypto support, seedrandom() uses the current time, the native rng,
and a walk of several DOM objects to collect a few bits of entropy.

Each time the one- or two-argument forms of seedrandom are called,
entropy from the passed seed is accumulated in a pool to help generate
future seeds for the zero- and two-argument forms of seedrandom.

On speed - This javascript implementation of Math.random() is several
times slower than the built-in Math.random() because it is not native
code, but that is typically fast enough.  Some details (timings on
Chrome 25 on a 2010 vintage macbook):

* seeded Math.random()          - avg less than 0.0002 milliseconds per call
* seedrandom('explicit.')       - avg less than 0.2 milliseconds per call
* seedrandom('explicit.', true) - avg less than 0.2 milliseconds per call
* seedrandom() with crypto      - avg less than 0.2 milliseconds per call

Autoseeding without crypto is somewhat slower, about 20-30 milliseconds on
a 2012 windows 7 1.5ghz i5 laptop, as seen on Firefox 19, IE 10, and Opera.
Seeded rng calls themselves are fast across these browsers, with slowest
numbers on Opera at about 0.0005 ms per seeded Math.random().


LICENSE (MIT)
-------------

Copyright (c)2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule AutoFocusMixin
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CSSProperty
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CSSPropertyOperations
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ChangeEventPlugin
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ClientReactRootIndex
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule CompositionEventPlugin
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMChildrenOperations
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMProperty
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DOMPropertyOperations
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule Danger
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DefaultDOMPropertyConfig
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule DefaultEventPluginOrder
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EnterLeaveEventPlugin
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventConstants
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginHub
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginRegistry
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPluginUtils
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule EventPropagators
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ExecutionEnvironment
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule LinkedValueUtils
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule MobileSafariClickEventPlugin
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule PooledClass
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule React
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactBrowserComponentMixin
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactChildren
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactComponent
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactComponentBrowserEnvironment
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactCompositeComponent
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactContext
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactCurrentOwner
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOM
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMButton
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMComponent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMForm
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMIDOperations
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMImg
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMInput
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMOption
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMSelect
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMSelection
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDOMTextarea
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultBatchingStrategy
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultInjection
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultPerf
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactDefaultPerfAnalysis
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactErrorUtils
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventEmitter
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventEmitterMixin
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactEventTopLevelCallback
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInjection
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInputSelection
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactInstanceHandles
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMarkupChecksum
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMount
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMountReady
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMultiChild
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactMultiChildUpdateTypes
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactOwner
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTransferer
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypeLocationNames
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypeLocations
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPropTypes
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPutListenerQueue
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactReconcileTransaction
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactRootIndex
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @typechecks static-only
 * @providesModule ReactServerRendering
 */

/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactServerRenderingTransaction
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactTextComponent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactUpdates
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SelectEventPlugin
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ServerReactRootIndex
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SimpleEventPlugin
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticDragEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule Transaction
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ViewportMetrics
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule accumulate
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule adler32
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule containsNode
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createArrayFrom
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createFullPageComponent
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createObjectFrom
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyObject
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule escapeTextForBrowser
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule flattenChildren
 */

/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule focusNode
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule forEachAccumulated
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getEventKey
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getMarkupWrap
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getNodeForCharacterOffset
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getReactRootElementInContainer
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getTextContentAccessor
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getUnboundedScrollPosition
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule hyphenate
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule instantiateReactComponent
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isEventSupported
 */

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextInputElement
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextNode
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule joinClasses
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyOf
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule merge
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeHelpers
 *
 * requiresPolyfills: Array.isArray
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeInto
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mixInto
 */

/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule monitorCodeUse
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMap
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMapKeyVal
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule onlyChild
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule performanceNow
 * @typechecks static-only
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule shallowEqual
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule shouldUpdateReactComponent
 * @typechecks static-only
 */

/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule toArray
 * @typechecks
 */

/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule traverseAllChildren
 */

/**
 * Copyright 2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule warning
 */

/** @license
 * JS Signals <http://millermedeiros.github.com/js-signals/>
 * Released under the MIT license
 * Author: Miller Medeiros
 * Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
 */

var requirejs,require,define;(function(e){function h(e,t){return f.call(e,t)}function p(e,t){var n,r,i,s,o,a,f,l,h,p,d,v=t&&t.split("/"),m=u.map,g=m&&m["*"]||{};if(e&&e.charAt(0)===".")if(t){v=v.slice(0,v.length-1),e=e.split("/"),o=e.length-1,u.nodeIdCompat&&c.test(e[o])&&(e[o]=e[o].replace(c,"")),e=v.concat(e);for(h=0;h<e.length;h+=1){d=e[h];if(d===".")e.splice(h,1),h-=1;else if(d===".."){if(h===1&&(e[2]===".."||e[0]===".."))break;h>0&&(e.splice(h-1,2),h-=2)}}e=e.join("/")}else e.indexOf("./")===0&&(e=e.substring(2));if((v||g)&&m){n=e.split("/");for(h=n.length;h>0;h-=1){r=n.slice(0,h).join("/");if(v)for(p=v.length;p>0;p-=1){i=m[v.slice(0,p).join("/")];if(i){i=i[r];if(i){s=i,a=h;break}}}if(s)break;!f&&g&&g[r]&&(f=g[r],l=h)}!s&&f&&(s=f,a=l),s&&(n.splice(0,a,s),e=n.join("/"))}return e}function d(t,r){return function(){return n.apply(e,l.call(arguments,0).concat([t,r]))}}function v(e){return function(t){return p(t,e)}}function m(e){return function(t){s[e]=t}}function g(n){if(h(o,n)){var r=o[n];delete o[n],a[n]=!0,t.apply(e,r)}if(!h(s,n)&&!h(a,n))throw new Error("No "+n);return s[n]}function y(e){var t,n=e?e.indexOf("!"):-1;return n>-1&&(t=e.substring(0,n),e=e.substring(n+1,e.length)),[t,e]}function b(e){return function(){return u&&u.config&&u.config[e]||{}}}var t,n,r,i,s={},o={},u={},a={},f=Object.prototype.hasOwnProperty,l=[].slice,c=/\.js$/;r=function(e,t){var n,r=y(e),i=r[0];return e=r[1],i&&(i=p(i,t),n=g(i)),i?n&&n.normalize?e=n.normalize(e,v(t)):e=p(e,t):(e=p(e,t),r=y(e),i=r[0],e=r[1],i&&(n=g(i))),{f:i?i+"!"+e:e,n:e,pr:i,p:n}},i={require:function(e){return d(e)},exports:function(e){var t=s[e];return typeof t!="undefined"?t:s[e]={}},module:function(e){return{id:e,uri:"",exports:s[e],config:b(e)}}},t=function(t,n,u,f){var l,c,p,v,y,b=[],w=typeof u,E;f=f||t;if(w==="undefined"||w==="function"){n=!n.length&&u.length?["require","exports","module"]:n;for(y=0;y<n.length;y+=1){v=r(n[y],f),c=v.f;if(c==="require")b[y]=i.require(t);else if(c==="exports")b[y]=i.exports(t),E=!0;else if(c==="module")l=b[y]=i.module(t);else if(h(s,c)||h(o,c)||h(a,c))b[y]=g(c);else{if(!v.p)throw new Error(t+" missing "+c);v.p.load(v.n,d(f,!0),m(c),{}),b[y]=s[c]}}p=u?u.apply(s[t],b):undefined;if(t)if(l&&l.exports!==e&&l.exports!==s[t])s[t]=l.exports;else if(p!==e||!E)s[t]=p}else t&&(s[t]=u)},requirejs=require=n=function(s,o,a,f,l){if(typeof s=="string")return i[s]?i[s](o):g(r(s,o).f);if(!s.splice){u=s,u.deps&&n(u.deps,u.callback);if(!o)return;o.splice?(s=o,o=a,a=null):s=e}return o=o||function(){},typeof a=="function"&&(a=f,f=l),f?t(e,s,o,a):setTimeout(function(){t(e,s,o,a)},4),n},n.config=function(e){return n(e)},requirejs._defined=s,define=function(e,t,n){t.splice||(n=t,t=[]),!h(s,e)&&!h(o,e)&&(o[e]=[e,t,n])},define.amd={jQuery:!0}})(),define("almond",function(){}),define("mout/random/random",[],function(){function e(){return e.get()}return e.get=Math.random,e}),function(e,t,n,r,i,s,o,u,a){function d(e){var t,n=e.length,i=this,s=0,o=i.i=i.j=0,u=i.S=[];n||(e=[n++]);while(s<r)u[s]=s++;for(s=0;s<r;s++)u[s]=u[o=h&o+e[s%n]+(t=u[s])],u[o]=t;(i.g=function(e){var t,n=0,s=i.i,o=i.j,u=i.S;while(e--)t=u[s=h&s+1],n=n*r+u[h&(u[s]=u[o=h&o+t])+(u[o]=t)];return i.i=s,i.j=o,n})(r)}function v(e,t){var n=[],r=typeof e,i;if(t&&r=="object")for(i in e)try{n.push(v(e[i],t-1))}catch(s){}return n.length?n:r=="string"?e:e+"\0"}function m(e,t){var n=e+"",r,i=0;while(i<n.length)t[h&i]=h&(r^=t[h&i]*19)+n.charCodeAt(i++);return y(t)}function g(n){try{return e.crypto.getRandomValues(n=new Uint8Array(r)),y(n)}catch(i){return[+(new Date),e,(n=e.navigator)&&n.plugins,e.screen,y(t)]}}function y(e){return String.fromCharCode.apply(0,e)}var f=n.pow(r,i),l=n.pow(2,s),c=l*2,h=r-1,p=n["seed"+a]=function(e,s,o){var u=[];s=s==1?{entropy:!0}:s||{};var h=m(v(s.entropy?[e,y(t)]:e==null?g():e,3),u),p=new d(u);return m(y(p.S),t),(s.pass||o||function(e,t,r){return r?(n[a]=e,t):e})(function(){var e=p.g(i),t=f,n=0;while(e<l)e=(e+n)*r,t*=r,n=p.g(1);while(e>=c)e/=2,t/=2,n>>>=1;return(e+n)/t},h,"global"in s?s.global:this==n)};m(n[a](),t),o&&o.exports?o.exports=p:u&&u.amd&&u("seedrandom",[],function(){return p})}(this,[],Math,256,6,52,typeof module=="object"&&module,typeof define=="function"&&define,"random"),!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define("react",e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.React=e()}}(function(){var e,t,n;return function r(e,t,n){function i(o,u){if(!t[o]){if(!e[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(s)return s(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=t[o]={exports:{}};e[o][0].call(f.exports,function(t){var n=e[o][1][t];return i(n?n:t)},f,f.exports,r,e,t,n)}return t[o].exports}var s=typeof require=="function"&&require;for(var o=0;o<n.length;o++)i(n[o]);return i}({1:[function(e,t,n){var r=e("./focusNode"),i={componentDidMount:function(){this.props.autoFocus&&r(this.getDOMNode())}};t.exports=i},{"./focusNode":100}],2:[function(e,t,n){function i(e,t){return e+t.charAt(0).toUpperCase()+t.substring(1)}var r={columnCount:!0,fillOpacity:!0,flex:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},s=["Webkit","ms","Moz","O"];Object.keys(r).forEach(function(e){s.forEach(function(t){r[i(t,e)]=r[e]})});var o={background:{backgroundImage:!0,backgroundPosition:!0,backgroundRepeat:!0,backgroundColor:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0}},u={isUnitlessNumber:r,shorthandPropertyExpansions:o};t.exports=u},{}],3:[function(e,t,n){var r=e("./CSSProperty"),i=e("./dangerousStyleValue"),s=e("./escapeTextForBrowser"),o=e("./hyphenate"),u=e("./memoizeStringOnly"),a=u(function(e){return s(o(e))}),f={createMarkupForStyles:function(e){var t="";for(var n in e){if(!e.hasOwnProperty(n))continue;var r=e[n];r!=null&&(t+=a(n)+":",t+=i(n,r)+";")}return t||null},setValueForStyles:function(e,t){var n=e.style;for(var s in t){if(!t.hasOwnProperty(s))continue;var o=i(s,t[s]);if(o)n[s]=o;else{var u=r.shorthandPropertyExpansions[s];if(u)for(var a in u)n[a]="";else n[s]=""}}}};t.exports=f},{"./CSSProperty":2,"./dangerousStyleValue":95,"./escapeTextForBrowser":98,"./hyphenate":110,"./memoizeStringOnly":120}],4:[function(e,t,n){function y(e){return e.nodeName==="SELECT"||e.nodeName==="INPUT"&&e.type==="file"}function w(e){var t=a.getPooled(p.change,v,e);s.accumulateTwoPhaseDispatches(t),u.batchedUpdates(E,t)}function E(e){i.enqueueEvents(e),i.processEventQueue()}function S(e,t){d=e,v=t,d.attachEvent("onchange",w)}function x(){if(!d)return;d.detachEvent("onchange",w),d=null,v=null}function T(e,t,n){if(e===h.topChange)return n}function N(e,t,n){e===h.topFocus?(x(),S(t,n)):e===h.topBlur&&x()}function L(e,t){d=e,v=t,m=e.value,g=Object.getOwnPropertyDescriptor(e.constructor.prototype,"value"),Object.defineProperty(d,"value",k),d.attachEvent("onpropertychange",O)}function A(){if(!d)return;delete d.value,d.detachEvent("onpropertychange",O),d=null,v=null,m=null,g=null}function O(e){if(e.propertyName!=="value")return;var t=e.srcElement.value;if(t===m)return;m=t,w(e)}function M(e,t,n){if(e===h.topInput)return n}function _(e,t,n){e===h.topFocus?(A(),L(t,n)):e===h.topBlur&&A()}function D(e,t,n){if(e===h.topSelectionChange||e===h.topKeyUp||e===h.topKeyDown)if(d&&d.value!==m)return m=d.value,v}function P(e){return e.nodeName==="INPUT"&&(e.type==="checkbox"||e.type==="radio")}function H(e,t,n){if(e===h.topClick)return n}var r=e("./EventConstants"),i=e("./EventPluginHub"),s=e("./EventPropagators"),o=e("./ExecutionEnvironment"),u=e("./ReactUpdates"),a=e("./SyntheticEvent"),f=e("./isEventSupported"),l=e("./isTextInputElement"),c=e("./keyOf"),h=r.topLevelTypes,p={change:{phasedRegistrationNames:{bubbled:c({onChange:null}),captured:c({onChangeCapture:null})},dependencies:[h.topBlur,h.topChange,h.topClick,h.topFocus,h.topInput,h.topKeyDown,h.topKeyUp,h.topSelectionChange]}},d=null,v=null,m=null,g=null,b=!1;o.canUseDOM&&(b=f("change")&&(!("documentMode"in document)||document.documentMode>8));var C=!1;o.canUseDOM&&(C=f("input")&&(!("documentMode"in document)||document.documentMode>9));var k={get:function(){return g.get.call(this)},set:function(e){m=""+e,g.set.call(this,e)}},B={eventTypes:p,extractEvents:function(e,t,n,r){var i,o;y(t)?b?i=T:o=N:l(t)?C?i=M:(i=D,o=_):P(t)&&(i=H);if(i){var u=i(e,t,n);if(u){var f=a.getPooled(p.change,u,r);return s.accumulateTwoPhaseDispatches(f),f}}o&&o(e,t,n)}};t.exports=B},{"./EventConstants":14,"./EventPluginHub":16,"./EventPropagators":19,"./ExecutionEnvironment":20,"./ReactUpdates":71,"./SyntheticEvent":78,"./isEventSupported":113,"./isTextInputElement":115,"./keyOf":119}],5:[function(e,t,n){var r=0,i={createReactRootIndex:function(){return r++}};t.exports=i},{}],6:[function(e,t,n){function g(e){switch(e){case d.topCompositionStart:return m.compositionStart;case d.topCompositionEnd:return m.compositionEnd;case d.topCompositionUpdate:return m.compositionUpdate}}function y(e,t){return e===d.topKeyDown&&t.keyCode===c}function b(e,t){switch(e){case d.topKeyUp:return l.indexOf(t.keyCode)!==-1;case d.topKeyDown:return t.keyCode!==c;case d.topKeyPress:case d.topMouseDown:case d.topBlur:return!0;default:return!1}}function w(e){this.root=e,this.startSelection=o.getSelection(e),this.startValue=this.getText()}var r=e("./EventConstants"),i=e("./EventPropagators"),s=e("./ExecutionEnvironment"),o=e("./ReactInputSelection"),u=e("./SyntheticCompositionEvent"),a=e("./getTextContentAccessor"),f=e("./keyOf"),l=[9,13,27,32],c=229,h=s.canUseDOM&&"CompositionEvent"in window,p=!h||"documentMode"in document&&document.documentMode>8,d=r.topLevelTypes,v=null,m={compositionEnd:{phasedRegistrationNames:{bubbled:f({onCompositionEnd:null}),captured:f({onCompositionEndCapture:null})},dependencies:[d.topBlur,d.topCompositionEnd,d.topKeyDown,d.topKeyPress,d.topKeyUp,d.topMouseDown]},compositionStart:{phasedRegistrationNames:{bubbled:f({onCompositionStart:null}),captured:f({onCompositionStartCapture:null})},dependencies:[d.topBlur,d.topCompositionStart,d.topKeyDown,d.topKeyPress,d.topKeyUp,d.topMouseDown]},compositionUpdate:{phasedRegistrationNames:{bubbled:f({onCompositionUpdate:null}),captured:f({onCompositionUpdateCapture:null})},dependencies:[d.topBlur,d.topCompositionUpdate,d.topKeyDown,d.topKeyPress,d.topKeyUp,d.topMouseDown]}};w.prototype.getText=function(){return this.root.value||this.root[a()]},w.prototype.getData=function(){var e=this.getText(),t=this.startSelection.start,n=this.startValue.length-this.startSelection.end;return e.substr(t,e.length-n-t)};var E={eventTypes:m,extractEvents:function(e,t,n,r){var s,o;h?s=g(e):v?b(e,r)&&(s=m.compositionEnd):y(e,r)&&(s=m.compositionStart),p&&(!v&&s===m.compositionStart?v=new w(t):s===m.compositionEnd&&v&&(o=v.getData(),v=null));if(s){var a=u.getPooled(s,n,r);return o&&(a.data=o),i.accumulateTwoPhaseDispatches(a),a}}};t.exports=E},{"./EventConstants":14,"./EventPropagators":19,"./ExecutionEnvironment":20,"./ReactInputSelection":52,"./SyntheticCompositionEvent":76,"./getTextContentAccessor":108,"./keyOf":119}],7:[function(e,t,n){function u(e,t,n){var r=e.childNodes;if(r[n]===t)return;t.parentNode===e&&e.removeChild(t),n>=r.length?e.appendChild(t):e.insertBefore(t,r[n])}var r=e("./Danger"),i=e("./ReactMultiChildUpdateTypes"),s=e("./getTextContentAccessor"),o=s(),a;o==="textContent"?a=function(e,t){e.textContent=t}:a=function(e,t){while(e.firstChild)e.removeChild(e.firstChild);if(t){var n=e.ownerDocument||document;e.appendChild(n.createTextNode(t))}};var f={dangerouslyReplaceNodeWithMarkup:r.dangerouslyReplaceNodeWithMarkup,updateTextContent:a,processUpdates:function(e,t){var n,s=null,o=null;for(var f=0;n=e[f];f++)if(n.type===i.MOVE_EXISTING||n.type===i.REMOVE_NODE){var l=n.fromIndex,c=n.parentNode.childNodes[l],h=n.parentID;s=s||{},s[h]=s[h]||[],s[h][l]=c,o=o||[],o.push(c)}var p=r.dangerouslyRenderMarkup(t);if(o)for(var d=0;d<o.length;d++)o[d].parentNode.removeChild(o[d]);for(var v=0;n=e[v];v++)switch(n.type){case i.INSERT_MARKUP:u(n.parentNode,p[n.markupIndex],n.toIndex);break;case i.MOVE_EXISTING:u(n.parentNode,s[n.parentID][n.fromIndex],n.toIndex);break;case i.TEXT_CONTENT:a(n.parentNode,n.textContent);break;case i.REMOVE_NODE:}}};t.exports=f},{"./Danger":10,"./ReactMultiChildUpdateTypes":58,"./getTextContentAccessor":108}],8:[function(e,t,n){var r=e("./invariant"),i={MUST_USE_ATTRIBUTE:1,MUST_USE_PROPERTY:2,HAS_SIDE_EFFECTS:4,HAS_BOOLEAN_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:16,injectDOMPropertyConfig:function(e){var t=e.Properties||{},n=e.DOMAttributeNames||{},s=e.DOMPropertyNames||{},u=e.DOMMutationMethods||{};e.isCustomAttribute&&o._isCustomAttributeFunctions.push(e.isCustomAttribute);for(var a in t){r(!o.isStandardName[a],"injectDOMPropertyConfig(...): You're trying to inject DOM property '%s' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.",a),o.isStandardName[a]=!0;var f=a.toLowerCase();o.getPossibleStandardName[f]=a;var l=n[a];l&&(o.getPossibleStandardName[l]=a),o.getAttributeName[a]=l||f,o.getPropertyName[a]=s[a]||a;var c=u[a];c&&(o.getMutationMethod[a]=c);var h=t[a];o.mustUseAttribute[a]=h&i.MUST_USE_ATTRIBUTE,o.mustUseProperty[a]=h&i.MUST_USE_PROPERTY,o.hasSideEffects[a]=h&i.HAS_SIDE_EFFECTS,o.hasBooleanValue[a]=h&i.HAS_BOOLEAN_VALUE,o.hasPositiveNumericValue[a]=h&i.HAS_POSITIVE_NUMERIC_VALUE,r(!o.mustUseAttribute[a]||!o.mustUseProperty[a],"DOMProperty: Cannot require using both attribute and property: %s",a),r(o.mustUseProperty[a]||!o.hasSideEffects[a],"DOMProperty: Properties that have side effects must use property: %s",a),r(!o.hasBooleanValue[a]||!o.hasPositiveNumericValue[a],"DOMProperty: Cannot have both boolean and positive numeric value: %s",a)}}},s={},o={ID_ATTRIBUTE_NAME:"data-reactid",isStandardName:{},getPossibleStandardName:{},getAttributeName:{},getPropertyName:{},getMutationMethod:{},mustUseAttribute:{},mustUseProperty:{},hasSideEffects:{},hasBooleanValue:{},hasPositiveNumericValue:{},_isCustomAttributeFunctions:[],isCustomAttribute:function(e){for(var t=0;t<o._isCustomAttributeFunctions.length;t++){var n=o._isCustomAttributeFunctions[t];if(n(e))return!0}return!1},getDefaultValueForProperty:function(e,t){var n=s[e],r;return n||(s[e]=n={}),t in n||(r=document.createElement(e),n[t]=r[t]),n[t]},injection:i};t.exports=o},{"./invariant":112}],9:[function(e,t,n){function u(e,t){return t==null||r.hasBooleanValue[e]&&!t||r.hasPositiveNumericValue[e]&&(isNaN(t)||t<1)}var r=e("./DOMProperty"),i=e("./escapeTextForBrowser"),s=e("./memoizeStringOnly"),o=e("./warning"),a=s(function(e){return i(e)+'="'}),f={children:!0,dangerouslySetInnerHTML:!0,key:!0,ref:!0},l={},c=function(e){if(f[e]||l[e])return;l[e]=!0;var t=e.toLowerCase(),n=r.isCustomAttribute(t)?t:r.getPossibleStandardName[t];o(n==null,"Unknown DOM property "+e+". Did you mean "+n+"?")},h={createMarkupForID:function(e){return a(r.ID_ATTRIBUTE_NAME)+i(e)+'"'},createMarkupForProperty:function(e,t){if(r.isStandardName[e]){if(u(e,t))return"";var n=r.getAttributeName[e];return r.hasBooleanValue[e]?i(n):a(n)+i(t)+'"'}return r.isCustomAttribute(e)?t==null?"":a(e)+i(t)+'"':(c(e),null)},setValueForProperty:function(e,t,n){if(r.isStandardName[t]){var i=r.getMutationMethod[t];if(i)i(e,n);else if(u(t,n))this.deleteValueForProperty(e,t);else if(r.mustUseAttribute[t])e.setAttribute(r.getAttributeName[t],""+n);else{var s=r.getPropertyName[t];if(!r.hasSideEffects[t]||e[s]!==n)e[s]=n}}else r.isCustomAttribute(t)?n==null?e.removeAttribute(r.getAttributeName[t]):e.setAttribute(t,""+n):c(t)},deleteValueForProperty:function(e,t){if(r.isStandardName[t]){var n=r.getMutationMethod[t];if(n)n(e,undefined);else if(r.mustUseAttribute[t])e.removeAttribute(r.getAttributeName[t]);else{var i=r.getPropertyName[t],s=r.getDefaultValueForProperty(e.nodeName,i);if(!r.hasSideEffects[t]||e[i]!==s)e[i]=s}}else r.isCustomAttribute(t)?e.removeAttribute(t):c(t)}};t.exports=h},{"./DOMProperty":8,"./escapeTextForBrowser":98,"./memoizeStringOnly":120,"./warning":134}],10:[function(e,t,n){function l(e){return e.substring(1,e.indexOf(" "))}var r=e("./ExecutionEnvironment"),i=e("./createNodesFromMarkup"),s=e("./emptyFunction"),o=e("./getMarkupWrap"),u=e("./invariant"),a=/^(<[^ \/>]+)/,f="data-danger-index",c={dangerouslyRenderMarkup:function(e){u(r.canUseDOM,"dangerouslyRenderMarkup(...): Cannot render markup in a Worker thread. This is likely a bug in the framework. Please report immediately.");var t,n={};for(var c=0;c<e.length;c++)u(e[c],"dangerouslyRenderMarkup(...): Missing markup."),t=l(e[c]),t=o(t)?t:"*",n[t]=n[t]||[],n[t][c]=e[c];var h=[],p=0;for(t in n){if(!n.hasOwnProperty(t))continue;var d=n[t];for(var v in d)if(d.hasOwnProperty(v)){var m=d[v];d[v]=m.replace(a,"$1 "+f+'="'+v+'" ')}var g=i(d.join(""),s);for(c=0;c<g.length;++c){var y=g[c];y.hasAttribute&&y.hasAttribute(f)?(v=+y.getAttribute(f),y.removeAttribute(f),u(!h.hasOwnProperty(v),"Danger: Assigning to an already-occupied result index."),h[v]=y,p+=1):console.error("Danger: Discarding unexpected node:",y)}}return u(p===h.length,"Danger: Did not assign to every index of resultList."),u(h.length===e.length,"Danger: Expected markup to render %s nodes, but rendered %s.",e.length,h.length),h},dangerouslyReplaceNodeWithMarkup:function(e,t){u(r.canUseDOM,"dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a worker thread. This is likely a bug in the framework. Please report immediately."),u(t,"dangerouslyReplaceNodeWithMarkup(...): Missing markup."),u(e.tagName.toLowerCase()!=="html","dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the <html> node. This is because browser quirks make this unreliable and/or slow. If you want to render to the root you must use server rendering. See renderComponentToString().");var n=i(t,s)[0];e.parentNode.replaceChild(n,e)}};t.exports=c},{"./ExecutionEnvironment":20,"./createNodesFromMarkup":93,"./emptyFunction":96,"./getMarkupWrap":105,"./invariant":112}],11:[function(e,t,n){var r=e("./DOMProperty"),i=r.injection.MUST_USE_ATTRIBUTE,s=r.injection.MUST_USE_PROPERTY,o=r.injection.HAS_BOOLEAN_VALUE,u=r.injection.HAS_SIDE_EFFECTS,a=r.injection.HAS_POSITIVE_NUMERIC_VALUE,f={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,accessKey:null,action:null,allowFullScreen:i|o,allowTransparency:i,alt:null,async:o,autoComplete:null,autoPlay:o,cellPadding:null,cellSpacing:null,charSet:i,checked:s|o,className:s,cols:i|a,colSpan:null,content:null,contentEditable:null,contextMenu:i,controls:s|o,crossOrigin:null,data:null,dateTime:i,defer:o,dir:null,disabled:i|o,download:null,draggable:null,encType:null,form:i,formNoValidate:o,frameBorder:i,height:i,hidden:i|o,href:null,hrefLang:null,htmlFor:null,httpEquiv:null,icon:null,id:s,label:null,lang:null,list:null,loop:s|o,max:null,maxLength:i,mediaGroup:null,method:null,min:null,multiple:s|o,muted:s|o,name:null,noValidate:o,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:s|o,rel:null,required:o,role:i,rows:i|a,rowSpan:null,sandbox:null,scope:null,scrollLeft:s,scrollTop:s,seamless:i|o,selected:s|o,size:i|a,span:a,spellCheck:null,src:null,srcDoc:s,srcSet:null,step:null,style:null,tabIndex:null,target:null,title:null,type:null,value:s|u,width:i,wmode:i,autoCapitalize:null,autoCorrect:null,property:null,cx:i,cy:i,d:i,fill:i,fx:i,fy:i,gradientTransform:i,gradientUnits:i,offset:i,points:i,r:i,rx:i,ry:i,spreadMethod:i,stopColor:i,stopOpacity:i,stroke:i,strokeLinecap:i,strokeWidth:i,textAnchor:i,transform:i,version:i,viewBox:i,x1:i,x2:i,x:i,y1:i,y2:i,y:i},DOMAttributeNames:{className:"class",gradientTransform:"gradientTransform",gradientUnits:"gradientUnits",htmlFor:"for",spreadMethod:"spreadMethod",stopColor:"stop-color",stopOpacity:"stop-opacity",strokeLinecap:"stroke-linecap",strokeWidth:"stroke-width",textAnchor:"text-anchor",viewBox:"viewBox"},DOMPropertyNames:{autoCapitalize:"autocapitalize",autoComplete:"autocomplete",autoCorrect:"autocorrect",autoFocus:"autofocus",autoPlay:"autoplay",encType:"enctype",hrefLang:"hreflang",radioGroup:"radiogroup",spellCheck:"spellcheck",srcDoc:"srcdoc",srcSet:"srcset"}};t.exports=f},{"./DOMProperty":8}],12:[function(e,t,n){var r=e("./keyOf"),i=[r({ResponderEventPlugin:null}),r({SimpleEventPlugin:null}),r({TapEventPlugin:null}),r({EnterLeaveEventPlugin:null}),r({ChangeEventPlugin:null}),r({SelectEventPlugin:null}),r({CompositionEventPlugin:null}),r({AnalyticsEventPlugin:null}),r({MobileSafariClickEventPlugin:null})];t.exports=i},{"./keyOf":119}],13:[function(e,t,n){var r=e("./EventConstants"),i=e("./EventPropagators"),s=e("./SyntheticMouseEvent"),o=e("./ReactMount"),u=e("./keyOf"),a=r.topLevelTypes,f=o.getFirstReactDOM,l={mouseEnter:{registrationName:u({onMouseEnter:null}),dependencies:[a.topMouseOut,a.topMouseOver]},mouseLeave:{registrationName:u({onMouseLeave:null}),dependencies:[a.topMouseOut,a.topMouseOver]}},c=[null,null],h={eventTypes:l,extractEvents:function(e,t,n,r){if(e===a.topMouseOver&&(r.relatedTarget||r.fromElement))return null;if(e!==a.topMouseOut&&e!==a.topMouseOver)return null;var u;if(t.window===t)u=t;else{var h=t.ownerDocument;h?u=h.defaultView||h.parentWindow:u=window}var p,d;e===a.topMouseOut?(p=t,d=f(r.relatedTarget||r.toElement)||u):(p=u,d=t);if(p===d)return null;var v=p?o.getID(p):"",m=d?o.getID(d):"",g=s.getPooled(l.mouseLeave,v,r);g.type="mouseleave",g.target=p,g.relatedTarget=d;var y=s.getPooled(l.mouseEnter,m,r);return y.type="mouseenter",y.target=d,y.relatedTarget=p,i.accumulateEnterLeaveDispatches(g,y,v,m),c[0]=g,c[1]=y,c}};t.exports=h},{"./EventConstants":14,"./EventPropagators":19,"./ReactMount":55,"./SyntheticMouseEvent":81,"./keyOf":119}],14:[function(e,t,n){var r=e("./keyMirror"),i=r({bubbled:null,captured:null}),s=r({topBlur:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topContextMenu:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topError:null,topFocus:null,topInput:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topLoad:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topReset:null,topScroll:null,topSelectionChange:null,topSubmit:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topWheel:null}),o={topLevelTypes:s,PropagationPhases:i};t.exports=o},{"./keyMirror":118}],15:[function(e,t,n){var r=e("./emptyFunction"),i={listen:function(e,t,n){if(e.addEventListener)return e.addEventListener(t,n,!1),{remove:function(){e.removeEventListener(t,n,!1)}};if(e.attachEvent)return e.attachEvent("on"+t,n),{remove:function(){e.detachEvent(t,n)}}},capture:function(e,t,n){return e.addEventListener?(e.addEventListener(t,n,!0),{remove:function(){e.removeEventListener(t,n,!0)}}):(console.error("Attempted to listen to events during the capture phase on a browser that does not support the capture phase. Your application will not receive some events."),{remove:r})}};t.exports=i},{"./emptyFunction":96}],16:[function(e,t,n){function v(){var e=!d||!d.traverseTwoPhase||!d.traverseEnterLeave;if(e)throw new Error("InstanceHandle not injected before use!")}var r=e("./EventPluginRegistry"),i=e("./EventPluginUtils"),s=e("./ExecutionEnvironment"),o=e("./accumulate"),u=e("./forEachAccumulated"),a=e("./invariant"),f=e("./isEventSupported"),l=e("./monitorCodeUse"),c={},h=null,p=function(e){if(e){var t=i.executeDispatch,n=r.getPluginModuleForEvent(e);n&&n.executeDispatch&&(t=n.executeDispatch),i.executeDispatchesInOrder(e,t),e.isPersistent()||e.constructor.release(e)}},d=null,m={injection:{injectMount:i.injection.injectMount,injectInstanceHandle:function(e){d=e,v()},getInstanceHandle:function(){return v(),d},injectEventPluginOrder:r.injectEventPluginOrder,injectEventPluginsByName:r.injectEventPluginsByName},eventNameDispatchConfigs:r.eventNameDispatchConfigs,registrationNameModules:r.registrationNameModules,putListener:function(e,t,n){a(s.canUseDOM,"Cannot call putListener() in a non-DOM environment."),a(!n||typeof n=="function","Expected %s listener to be a function, instead got type %s",t,typeof n),t==="onScroll"&&!f("scroll",!0)&&(l("react_no_scroll_event"),console.warn("This browser doesn't support the `onScroll` event"));var r=c[t]||(c[t]={});r[e]=n},getListener:function(e,t){var n=c[t];return n&&n[e]},deleteListener:function(e,t){var n=c[t];n&&delete n[e]},deleteAllListeners:function(e){for(var t in c)delete c[t][e]},extractEvents:function(e,t,n,i){var s,u=r.plugins;for(var a=0,f=u.length;a<f;a++){var l=u[a];if(l){var c=l.extractEvents(e,t,n,i);c&&(s=o(s,c))}}return s},enqueueEvents:function(e){e&&(h=o(h,e))},processEventQueue:function(){var e=h;h=null,u(e,p),a(!h,"processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.")},__purge:function(){c={}},__getListenerBank:function(){return c}};t.exports=m},{"./EventPluginRegistry":17,"./EventPluginUtils":18,"./ExecutionEnvironment":20,"./accumulate":87,"./forEachAccumulated":101,"./invariant":112,"./isEventSupported":113,"./monitorCodeUse":125}],17:[function(e,t,n){function o(){if(!i)return;for(var e in s){var t=s[e],n=i.indexOf(e);r(n>-1,"EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.",e);if(f.plugins[n])continue;r(t.extractEvents,"EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.",e),f.plugins[n]=t;var o=t.eventTypes;for(var a in o)r(u(o[a],t,a),"EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.",a,e)}}function u(e,t,n){r(!f.eventNameDispatchConfigs[n],"EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.",n),f.eventNameDispatchConfigs[n]=e;var i=e.phasedRegistrationNames;if(i){for(var s in i)if(i.hasOwnProperty(s)){var o=i[s];a(o,t,n)}return!0}return e.registrationName?(a(e.registrationName,t,n),!0):!1}function a(e,t,n){r(!f.registrationNameModules[e],"EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.",e),f.registrationNameModules[e]=t,f.registrationNameDependencies[e]=t.eventTypes[n].dependencies}var r=e("./invariant"),i=null,s={},f={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},injectEventPluginOrder:function(e){r(!i,"EventPluginRegistry: Cannot inject event plugin ordering more than once."),i=Array.prototype.slice.call(e),o()},injectEventPluginsByName:function(e){var t=!1;for(var n in e){if(!e.hasOwnProperty(n))continue;var i=e[n];s[n]!==i&&(r(!s[n],"EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.",n),s[n]=i,t=!0)}t&&o()},getPluginModuleForEvent:function(e){var t=e.dispatchConfig;if(t.registrationName)return f.registrationNameModules[t.registrationName]||null;for(var n in t.phasedRegistrationNames){if(!t.phasedRegistrationNames.hasOwnProperty(n))continue;var r=f.registrationNameModules[t.phasedRegistrationNames[n]];if(r)return r}return null},_resetEventPlugins:function(){i=null;for(var e in s)s.hasOwnProperty(e)&&delete s[e];f.plugins.length=0;var t=f.eventNameDispatchConfigs;for(var n in t)t.hasOwnProperty(n)&&delete t[n];var r=f.registrationNameModules;for(var o in r)r.hasOwnProperty(o)&&delete r[o]}};t.exports=f},{"./invariant":112}],18:[function(e,t,n){function u(e){return e===o.topMouseUp||e===o.topTouchEnd||e===o.topTouchCancel}function a(e){return e===o.topMouseMove||e===o.topTouchMove}function f(e){return e===o.topMouseDown||e===o.topTouchStart}function c(e,t){var n=e._dispatchListeners,r=e._dispatchIDs;l(e);if(Array.isArray(n))for(var i=0;i<n.length;i++){if(e.isPropagationStopped())break;t(e,n[i],r[i])}else n&&t(e,n,r)}function h(e,t,n){e.currentTarget=s.Mount.getNode(n);var r=t(e,n);return e.currentTarget=null,r}function p(e,t){c(e,t),e._dispatchListeners=null,e._dispatchIDs=null}function d(e){var t=e._dispatchListeners,n=e._dispatchIDs;l(e);if(Array.isArray(t))for(var r=0;r<t.length;r++){if(e.isPropagationStopped())break;if(t[r](e,n[r]))return n[r]}else if(t&&t(e,n))return n;return null}function v(e){l(e);var t=e._dispatchListeners,n=e._dispatchIDs;i(!Array.isArray(t),"executeDirectDispatch(...): Invalid `event`.");var r=t?t(e,n):null;return e._dispatchListeners=null,e._dispatchIDs=null,r}function m(e){return!!e._dispatchListeners}var r=e("./EventConstants"),i=e("./invariant"),s={Mount:null,injectMount:function(e){s.Mount=e,i(e&&e.getNode,"EventPluginUtils.injection.injectMount(...): Injected Mount module is missing getNode.")}},o=r.topLevelTypes,l;l=function(e){var t=e._dispatchListeners,n=e._dispatchIDs,r=Array.isArray(t),s=Array.isArray(n),o=s?n.length:n?1:0,u=r?t.length:t?1:0;i(s===r&&o===u,"EventPluginUtils: Invalid `event`.")};var g={isEndish:u,isMoveish:a,isStartish:f,executeDirectDispatch:v,executeDispatch:h,executeDispatchesInOrder:p,executeDispatchesInOrderStopAtTrue:d,hasDispatches:m,injection:s,useTouchEvents:!1};t.exports=g},{"./EventConstants":14,"./invariant":112}],19:[function(e,t,n){function f(e,t,n){var r=t.dispatchConfig.phasedRegistrationNames[n];return a(e,r)}function l(e,t,n){if(!e)throw new Error("Dispatching id must not be null");var r=t?u.bubbled:u.captured,i=f(e,n,r);i&&(n._dispatchListeners=s(n._dispatchListeners,i),n._dispatchIDs=s(n._dispatchIDs,e))}function c(e){e&&e.dispatchConfig.phasedRegistrationNames&&i.injection.getInstanceHandle().traverseTwoPhase(e.dispatchMarker,l,e)}function h(e,t,n){if(n&&n.dispatchConfig.registrationName){var r=n.dispatchConfig.registrationName,i=a(e,r);i&&(n._dispatchListeners=s(n._dispatchListeners,i),n._dispatchIDs=s(n._dispatchIDs,e))}}function p(e){e&&e.dispatchConfig.registrationName&&h(e.dispatchMarker,null,e)}function d(e){o(e,c)}function v(e,t,n,r){i.injection.getInstanceHandle().traverseEnterLeave(n,r,h,e,t)}function m(e){o(e,p)}var r=e("./EventConstants"),i=e("./EventPluginHub"),s=e("./accumulate"),o=e("./forEachAccumulated"),u=r.PropagationPhases,a=i.getListener,g={accumulateTwoPhaseDispatches:d,accumulateDirectDispatches:m,accumulateEnterLeaveDispatches:v};t.exports=g},{"./EventConstants":14,"./EventPluginHub":16,"./accumulate":87,"./forEachAccumulated":101}],20:[function(e,t,n){var r=typeof window!="undefined",i={canUseDOM:r,canUseWorkers:typeof Worker!="undefined",canUseEventListeners:r&&(window.addEventListener||window.attachEvent),isInWorker:!r};t.exports=i},{}],21:[function(e,t,n){function u(e){i(e.props.checkedLink==null||e.props.valueLink==null,"Cannot provide a checkedLink and a valueLink. If you want to use checkedLink, you probably don't want to use valueLink and vice versa.")}function a(e){u(e),i(e.props.value==null&&e.props.onChange==null,"Cannot provide a valueLink and a value or onChange event. If you want to use value or onChange, you probably don't want to use valueLink.")}function f(e){u(e),i(e.props.checked==null&&e.props.onChange==null,"Cannot provide a checkedLink and a checked property or onChange event. If you want to use checked or onChange, you probably don't want to use checkedLink")}function l(e){this.props.valueLink.requestChange(e.target.value)}function c(e){this.props.checkedLink.requestChange(e.target.checked)}var r=e("./ReactPropTypes"),i=e("./invariant"),s=e("./warning"),o={button:!0,checkbox:!0,image:!0,hidden:!0,radio:!0,reset:!0,submit:!0},h={Mixin:{propTypes:{value:function(e,t,n){s(!e[t]||o[e.type]||e.onChange||e.readOnly||e.disabled,"You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.")},checked:function(e,t,n){s(!e[t]||e.onChange||e.readOnly||e.disabled,"You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.")},onChange:r.func}},getValue:function(e){return e.props.valueLink?(a(e),e.props.valueLink.value):e.props.value},getChecked:function(e){return e.props.checkedLink?(f(e),e.props.checkedLink.value):e.props.checked},getOnChange:function(e){return e.props.valueLink?(a(e),l):e.props.checkedLink?(f(e),c):e.props.onChange}};t.exports=h},{"./ReactPropTypes":64,"./invariant":112,"./warning":134}],22:[function(e,t,n){var r=e("./EventConstants"),i=e("./emptyFunction"),s=r.topLevelTypes,o={eventTypes:null,extractEvents:function(e,t,n,r){if(e===s.topTouchStart){var o=r.target;o&&!o.onclick&&(o.onclick=i)}}};t.exports=o},{"./EventConstants":14,"./emptyFunction":96}],23:[function(e,t,n){var r=e("./invariant"),i=function(e){var t=this;if(t.instancePool.length){var n=t.instancePool.pop();return t.call(n,e),n}return new t(e)},s=function(e,t){var n=this;if(n.instancePool.length){var r=n.instancePool.pop();return n.call(r,e,t),r}return new n(e,t)},o=function(e,t,n){var r=this;if(r.instancePool.length){var i=r.instancePool.pop();return r.call(i,e,t,n),i}return new r(e,t,n)},u=function(e,t,n,r,i){var s=this;if(s.instancePool.length){var o=s.instancePool.pop();return s.call(o,e,t,n,r,i),o}return new s(e,t,n,r,i)},a=function(e){var t=this;r(e instanceof t,"Trying to release an instance into a pool of a different type."),e.destructor&&e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},f=10,l=i,c=function(e,t){var n=e;return n.instancePool=[],n.getPooled=t||l,n.poolSize||(n.poolSize=f),n.release=a,n},h={addPoolingTo:c,oneArgumentPooler:i,twoArgumentPooler:s,threeArgumentPooler:o,fiveArgumentPooler:u};t.exports=h},{"./invariant":112}],24:[function(e,t,n){var r=e("./DOMPropertyOperations"),i=e("./EventPluginUtils"),s=e("./ReactChildren"),o=e("./ReactComponent"),u=e("./ReactCompositeComponent"),a=e("./ReactContext"),f=e("./ReactCurrentOwner"),l=e("./ReactDOM"),c=e("./ReactDOMComponent"),h=e("./ReactDefaultInjection"),p=e("./ReactInstanceHandles"),d=e("./ReactMount"),v=e("./ReactMultiChild"),m=e("./ReactPerf"),g=e("./ReactPropTypes"),y=e("./ReactServerRendering"),b=e("./ReactTextComponent"),w=e("./onlyChild");h.inject();var E={Children:{map:s.map,forEach:s.forEach,only:w},DOM:l,PropTypes:g,initializeTouchEvents:function(e){i.useTouchEvents=e},createClass:u.createClass,constructAndRenderComponent:d.constructAndRenderComponent,constructAndRenderComponentByID:d.constructAndRenderComponentByID,renderComponent:m.measure("React","renderComponent",d.renderComponent),renderComponentToString:y.renderComponentToString,renderComponentToStaticMarkup:y.renderComponentToStaticMarkup,unmountComponentAtNode:d.unmountComponentAtNode,isValidClass:u.isValidClass,isValidComponent:o.isValidComponent,withContext:a.withContext,__internals:{Component:o,CurrentOwner:f,DOMComponent:c,DOMPropertyOperations:r,InstanceHandles:p,Mount:d,MultiChild:v,TextComponent:b}},S=e("./ExecutionEnvironment");S.canUseDOM&&window.top===window.self&&navigator.userAgent.indexOf("Chrome")>-1&&console.debug("Download the React DevTools for a better development experience: http://fb.me/react-devtools"),E.version="0.10.0",t.exports=E},{"./DOMPropertyOperations":9,"./EventPluginUtils":18,"./ExecutionEnvironment":20,"./ReactChildren":26,"./ReactComponent":27,"./ReactCompositeComponent":29,"./ReactContext":30,"./ReactCurrentOwner":31,"./ReactDOM":32,"./ReactDOMComponent":34,"./ReactDefaultInjection":44,"./ReactInstanceHandles":53,"./ReactMount":55,"./ReactMultiChild":57,"./ReactPerf":60,"./ReactPropTypes":64,"./ReactServerRendering":68,"./ReactTextComponent":70,"./onlyChild":128}],25:[function(e,t,n){var r=e("./ReactMount"),i=e("./invariant"),s={getDOMNode:function(){return i(this.isMounted(),"getDOMNode(): A component must be mounted to have a DOM node."),r.getNode(this._rootNodeID)}};t.exports=s},{"./ReactMount":55,"./invariant":112}],26:[function(e,t,n){function a(e,t){this.forEachFunction=e,this.forEachContext=t}function f(e,t,n,r){var i=e;i.forEachFunction.call(i.forEachContext,t,r)}function l(e,t,n){if(e==null)return e;var r=a.getPooled(t,n);s(e,f,r),a.release(r)}function c(e,t,n){this.mapResult=e,this.mapFunction=t,this.mapContext=n}function h(e,t,n,r){var s=e,o=s.mapResult,u=s.mapFunction.call(s.mapContext,t,r);i(!o.hasOwnProperty(n),"ReactChildren.map(...): Encountered two children with the same key, `%s`. Children keys must be unique.",n),o[n]=u}function p(e,t,n){if(e==null)return e;var r={},i=c.getPooled(r,t,n);return s(e,h,i),c.release(i),r}var r=e("./PooledClass"),i=e("./invariant"),s=e("./traverseAllChildren"),o=r.twoArgumentPooler,u=r.threeArgumentPooler;r.addPoolingTo(a,o),r.addPoolingTo(c,u);var d={forEach:l,map:p};t.exports=d},{"./PooledClass":23,"./invariant":112,"./traverseAllChildren":133}],27:[function(e,t,n){function y(e){if(e.__keyValidated__||e.props.key!=null)return;e.__keyValidated__=!0;if(!r.current)return;var t=r.current.constructor.displayName;if(c.hasOwnProperty(t))return;c[t]=!0;var n='Each child in an array should have a unique "key" prop. Check the render method of '+t+".",i=null;e.isOwnedBy(r.current)||(i=e._owner&&e._owner.constructor.displayName,n+=" It was passed a child from "+i+"."),n+=" See http://fb.me/react-warning-keys for more information.",f("react_key_warning",{component:t,componentOwner:i}),console.warn(n)}function b(e){if(d.test(e)){var t=r.current.constructor.displayName;if(h.hasOwnProperty(t))return;h[t]=!0,f("react_numeric_key_warning"),console.warn("Child objects should have non-numeric keys so ordering is preserved. Check the render method of "+t+". "+"See http://fb.me/react-warning-keys for more information.")}}function w(){var e=r.current&&r.current.constructor.displayName||"";if(p.hasOwnProperty(e))return;p[e]=!0,f("react_object_map_children")}function E(e){if(Array.isArray(e))for(var t=0;t<e.length;t++){var n=e[t];S.isValidComponent(n)&&y(n)}else if(S.isValidComponent(e))e.__keyValidated__=!0;else if(e&&typeof e=="object"){w();for(var r in e)b(r,e)}}var r=e("./ReactCurrentOwner"),i=e("./ReactOwner"),s=e("./ReactUpdates"),o=e("./invariant"),u=e("./keyMirror"),a=e("./merge"),f=e("./monitorCodeUse"),l=u({MOUNTED:null,UNMOUNTED:null}),c={},h={},p={},d=/^\d+$/,v=!1,m=null,g=null,S={injection:{injectEnvironment:function(e){o(!v,"ReactComponent: injectEnvironment() can only be called once."),g=e.mountImageIntoNode,m=e.unmountIDFromEnvironment,S.BackendIDOperations=e.BackendIDOperations,S.ReactReconcileTransaction=e.ReactReconcileTransaction,v=!0}},isValidComponent:function(e){if(!e||!e.type||!e.type.prototype)return!1;var t=e.type.prototype;return typeof t.mountComponentIntoNode=="function"&&typeof t.receiveComponent=="function"},LifeCycle:l,BackendIDOperations:null,ReactReconcileTransaction:null,Mixin:{isMounted:function(){return this._lifeCycleState===l.MOUNTED},setProps:function(e,t){this.replaceProps(a(this._pendingProps||this.props,e),t)},replaceProps:function(e,t){o(this.isMounted(),"replaceProps(...): Can only update a mounted component."),o(this._mountDepth===0,"replaceProps(...): You called `setProps` or `replaceProps` on a component with a parent. This is an anti-pattern since props will get reactively updated when rendered. Instead, change the owner's `render` method to pass the correct value as props to the component where it is created."),this._pendingProps=e,s.enqueueUpdate(this,t)},construct:function(e,t){this.props=e||{},this._owner=r.current,this._lifeCycleState=l.UNMOUNTED,this._pendingProps=null,this._pendingCallbacks=null,this._pendingOwner=this._owner;var n=arguments.length-1;if(n===1)E(t),this.props.children=t;else if(n>1){var i=Array(n);for(var s=0;s<n;s++)E(arguments[s+1]),i[s]=arguments[s+1];this.props.children=i}},mountComponent:function(e,t,n){o(!this.isMounted(),"mountComponent(%s, ...): Can only mount an unmounted component. Make sure to avoid storing components between renders or reusing a single component instance in multiple places.",e);var r=this.props;r.ref!=null&&i.addComponentAsRefTo(this,r.ref,this._owner),this._rootNodeID=e,this._lifeCycleState=l.MOUNTED,this._mountDepth=n},unmountComponent:function(){o(this.isMounted(),"unmountComponent(): Can only unmount a mounted component.");var e=this.props;e.ref!=null&&i.removeComponentAsRefFrom(this,e.ref,this._owner),m(this._rootNodeID),this._rootNodeID=null,this._lifeCycleState=l.UNMOUNTED},receiveComponent:function(e,t){o(this.isMounted(),"receiveComponent(...): Can only update a mounted component."),this._pendingOwner=e._owner,this._pendingProps=e.props,this._performUpdateIfNecessary(t)},performUpdateIfNecessary:function(){var e=S.ReactReconcileTransaction.getPooled();e.perform(this._performUpdateIfNecessary,this,e),S.ReactReconcileTransaction.release(e)},_performUpdateIfNecessary:function(e){if(this._pendingProps==null)return;var t=this.props,n=this._owner;this.props=this._pendingProps,this._owner=this._pendingOwner,this._pendingProps=null,this.updateComponent(e,t,n)},updateComponent:function(e,t,n){var r=this.props;if(this._owner!==n||r.ref!==t.ref)t.ref!=null&&i.removeComponentAsRefFrom(this,t.ref,n),r.ref!=null&&i.addComponentAsRefTo(this,r.ref,this._owner)},mountComponentIntoNode:function(e,t,n){var r=S.ReactReconcileTransaction.getPooled();r.perform(this._mountComponentIntoNode,this,e,t,r,n),S.ReactReconcileTransaction.release(r)},_mountComponentIntoNode:function(e,t,n,r){var i=this.mountComponent(e,n,0);g(i,t,r)},isOwnedBy:function(e){return this._owner===e},getSiblingByRef:function(e){var t=this._owner;return!t||!t.refs?null:t.refs[e]}}};t.exports=S},{"./ReactCurrentOwner":31,"./ReactOwner":59,"./ReactUpdates":71,"./invariant":112,"./keyMirror":118,"./merge":121,"./monitorCodeUse":125}],28:[function(e,t,n){var r=e("./ReactDOMIDOperations"),i=e("./ReactMarkupChecksum"),s=e("./ReactMount"),o=e("./ReactPerf"),u=e("./ReactReconcileTransaction"),a=e("./getReactRootElementInContainer"),f=e("./invariant"),l=1,c=9,h={ReactReconcileTransaction:u,BackendIDOperations:r,unmountIDFromEnvironment:function(e){s.purgeID(e)},mountImageIntoNode:o.measure("ReactComponentBrowserEnvironment","mountImageIntoNode",function(e,t,n){f(t&&(t.nodeType===l||t.nodeType===c),"mountComponentIntoNode(...): Target container is not valid.");if(n){if(i.canReuseMarkup(e,a(t)))return;f(t.nodeType!==c,"You're trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side."),console.warn("React attempted to use reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generated on the server was not what the client was expecting. React injectednew markup to compensate which works but you have lost many of the benefits of server rendering. Instead, figure out why the markup being generated is different on the client or server.")}f(t.nodeType!==c,"You're trying to render a component to the document but you didn't use server rendering. We can't do this without using server rendering due to cross-browser quirks. See renderComponentToString() for server rendering."),t.innerHTML=e})};t.exports=h},{"./ReactDOMIDOperations":36,"./ReactMarkupChecksum":54,"./ReactMount":55,"./ReactPerf":60,"./ReactReconcileTransaction":66,"./getReactRootElementInContainer":107,"./invariant":112}],29:[function(e,t,n){function C(e,t,n){for(var r in t)t.hasOwnProperty(r)&&d(typeof t[r]=="function","%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.",e.displayName||"ReactCompositeComponent",c[n],r)}function k(e,t){var n=T[t];W.hasOwnProperty(t)&&d(n===S.OVERRIDE_BASE,"ReactCompositeComponentInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.",t),e.hasOwnProperty(t)&&d(n===S.DEFINE_MANY||n===S.DEFINE_MANY_MERGED,"ReactCompositeComponentInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.",t)}function L(e){var t=e._compositeLifeCycleState;d(e.isMounted()||t===z.MOUNTING,"replaceState(...): Can only update a mounted or mounting component."),d(t!==z.RECEIVING_STATE,"replaceState(...): Cannot update during an existing state transition (such as within `render`). This could potentially cause an infinite loop so it is forbidden."),d(t!==z.UNMOUNTING,"replaceState(...): Cannot update while unmounting component. This usually means you called setState() on an unmounted component.")}function A(e,t){d(!V(t),"ReactCompositeComponent: You're attempting to use a component class as a mixin. Instead, just use a regular object."),d(!r.isValidComponent(t),"ReactCompositeComponent: You're attempting to use a component as a mixin. Instead, just use a regular object.");var n=e.componentConstructor,i=n.prototype;for(var s in t){var o=t[s];if(!t.hasOwnProperty(s))continue;k(i,s);if(N.hasOwnProperty(s))N[s](e,o);else{var u=s in T,a=s in i,f=o&&o.__reactDontBind,l=typeof o=="function",c=l&&!u&&!a&&!f;c?(i.__reactAutoBindMap||(i.__reactAutoBindMap={}),i.__reactAutoBindMap[s]=o,i[s]=o):a?T[s]===S.DEFINE_MANY_MERGED?i[s]=_(i[s],o):i[s]=D(i[s],o):i[s]=o}}}function O(e,t){if(!t)return;for(var n in t){var r=t[n];if(!t.hasOwnProperty(n))return;var i=n in e,s=r;if(i){var o=e[n],u=typeof o,a=typeof r;d(u==="function"&&a==="function","ReactCompositeComponent: You are attempting to define `%s` on your component more than once, but that is only supported for functions, which are chained together. This conflict may be due to a mixin.",n),s=D(o,r)}e[n]=s,e.componentConstructor[n]=s}}function M(e,t){return d(e&&t&&typeof e=="object"&&typeof t=="object","mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects"),b(t,function(t,n){d(e[n]===undefined,"mergeObjectsWithNoDuplicateKeys(): Tried to merge two objects with the same key: %s",n),e[n]=t}),e}function _(e,t){return function(){var r=e.apply(this,arguments),i=t.apply(this,arguments);return r==null?i:i==null?r:M(r,i)}}function D(e,t){return function(){e.apply(this,arguments),t.apply(this,arguments)}}function V(e){return e instanceof Function&&"componentConstructor"in e&&e.componentConstructor instanceof Function}var r=e("./ReactComponent"),i=e("./ReactContext"),s=e("./ReactCurrentOwner"),o=e("./ReactErrorUtils"),u=e("./ReactOwner"),a=e("./ReactPerf"),f=e("./ReactPropTransferer"),l=e("./ReactPropTypeLocations"),c=e("./ReactPropTypeLocationNames"),h=e("./ReactUpdates"),p=e("./instantiateReactComponent"),d=e("./invariant"),v=e("./keyMirror"),m=e("./merge"),g=e("./mixInto"),y=e("./monitorCodeUse"),b=e("./objMap"),w=e("./shouldUpdateReactComponent"),E=e("./warning"),S=v({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null}),x=[],T={mixins:S.DEFINE_MANY,statics:S.DEFINE_MANY,propTypes:S.DEFINE_MANY,contextTypes:S.DEFINE_MANY,childContextTypes:S.DEFINE_MANY,getDefaultProps:S.DEFINE_MANY_MERGED,getInitialState:S.DEFINE_MANY_MERGED,getChildContext:S.DEFINE_MANY_MERGED,render:S.DEFINE_ONCE,componentWillMount:S.DEFINE_MANY,componentDidMount:S.DEFINE_MANY,componentWillReceiveProps:S.DEFINE_MANY,shouldComponentUpdate:S.DEFINE_ONCE,componentWillUpdate:S.DEFINE_MANY,componentDidUpdate:S.DEFINE_MANY,componentWillUnmount:S.DEFINE_MANY,updateComponent:S.OVERRIDE_BASE},N={displayName:function(e,t){e.componentConstructor.displayName=t},mixins:function(e,t){if(t)for(var n=0;n<t.length;n++)A(e,t[n])},childContextTypes:function(e,t){var n=e.componentConstructor;C(n,t,l.childContext),n.childContextTypes=m(n.childContextTypes,t)},contextTypes:function(e,t){var n=e.componentConstructor;C(n,t,l.context),n.contextTypes=m(n.contextTypes,t)},propTypes:function(e,t){var n=e.componentConstructor;C(n,t,l.prop),n.propTypes=m(n.propTypes,t)},statics:function(e,t){O(e,t)}},P={constructor:!0,construct:!0,isOwnedBy:!0,type:!0,props:!0,__keyValidated__:!0,_owner:!0,_currentContext:!0},H={__keyValidated__:!0,__keySetters:!0,_compositeLifeCycleState:!0,_currentContext:!0,_defaultProps:!0,_instance:!0,_lifeCycleState:!0,_mountDepth:!0,_owner:!0,_pendingCallbacks:!0,_pendingContext:!0,_pendingForceUpdate:!0,_pendingOwner:!0,_pendingProps:!0,_pendingState:!0,_renderedComponent:!0,_rootNodeID:!0,context:!0,props:!0,refs:!0,state:!0,_pendingQueries:!0,_queryPropListeners:!0,queryParams:!0},B={},j=0,F=function(e,t){var n=P.hasOwnProperty(t);if(j>0||n)return;var r=e.constructor.displayName||"Unknown",i=s.current,o=i&&i.constructor.displayName||"Unknown",u=t+"|"+r+"|"+o;if(B.hasOwnProperty(u))return;B[u]=!0;var a=i?" in "+o+".":" at the top level.",f="<"+r+" />.type."+t+"(...)";y("react_descriptor_property_access",{component:r}),console.warn('Invalid access to component property "'+t+'" on '+r+a+" See http://fb.me/react-warning-descriptors ."+" Use a static method instead: "+f)},I=function(e,t){return e.__reactMembraneFunction&&e.__reactMembraneSelf===t?e.__reactMembraneFunction:e.__reactMembraneFunction=function(){j++;try{var n=this===t?this.__realComponentInstance:this;return e.apply(n,arguments)}finally{j--}}},q=function(e,t,n){Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:function(){if(this===e)return t[n];F(this,n);var r=this.__realComponentInstance[n];return typeof r=="function"&&n!=="type"&&n!=="constructor"?I(r,this):r},set:function(r){if(this===e){t[n]=r;return}F(this,n),this.__realComponentInstance[n]=r}})},R=function(e){var t={},n;for(n in e)q(t,e,n);for(n in H)H.hasOwnProperty(n)&&!(n in e)&&q(t,e,n);return t},U=function(e){try{var t=function(){this.__realComponentInstance=new e,Object.freeze(this)};return t.prototype=R(e.prototype),t}catch(n){return e}},z=v({MOUNTING:null,UNMOUNTING:null,RECEIVING_PROPS:null,RECEIVING_STATE:null}),W={construct:function(e,t){r.Mixin.construct.apply(this,arguments),u.Mixin.construct.apply(this,arguments),this.state=null,this._pendingState=null,this.context=null,this._currentContext=i.current,this._pendingContext=null,this._descriptor=null,this._compositeLifeCycleState=null},toJSON:function(){return{type:this.type,props:this.props}},isMounted:function(){return r.Mixin.isMounted.call(this)&&this._compositeLifeCycleState!==z.MOUNTING},mountComponent:a.measure("ReactCompositeComponent","mountComponent",function(e,t,n){r.Mixin.mountComponent.call(this,e,t,n),this._compositeLifeCycleState=z.MOUNTING,this.context=this._processContext(this._currentContext),this._defaultProps=this.getDefaultProps?this.getDefaultProps():null,this.props=this._processProps(this.props),this.__reactAutoBindMap&&this._bindAutoBindMethods(),this.state=this.getInitialState?this.getInitialState():null,d(typeof this.state=="object"&&!Array.isArray(this.state),"%s.getInitialState(): must return an object or null",this.constructor.displayName||"ReactCompositeComponent"),this._pendingState=null,this._pendingForceUpdate=!1,this.componentWillMount&&(this.componentWillMount(),this._pendingState&&(this.state=this._pendingState,this._pendingState=null)),this._renderedComponent=p(this._renderValidatedComponent()),this._compositeLifeCycleState=null;var i=this._renderedComponent.mountComponent(e,t,n+1);return this.componentDidMount&&t.getReactMountReady().enqueue(this,this.componentDidMount),i}),unmountComponent:function(){this._compositeLifeCycleState=z.UNMOUNTING,this.componentWillUnmount&&this.componentWillUnmount(),this._compositeLifeCycleState=null,this._defaultProps=null,this._renderedComponent.unmountComponent(),this._renderedComponent=null,r.Mixin.unmountComponent.call(this)},setState:function(e,t){d(typeof e=="object"||e==null,"setState(...): takes an object of state variables to update."),E(e!=null,"setState(...): You passed an undefined or null state object; instead, use forceUpdate()."),this.replaceState(m(this._pendingState||this.state,e),t)},replaceState:function(e,t){L(this),this._pendingState=e,h.enqueueUpdate(this,t)},_processContext:function(e){var t=null,n=this.constructor.contextTypes;if(n){t={};for(var r in n)t[r]=e[r];this._checkPropTypes(n,t,l.context)}return t},_processChildContext:function(e){var t=this.getChildContext&&this.getChildContext(),n=this.constructor.displayName||"ReactCompositeComponent";if(t){d(typeof this.constructor.childContextTypes=="object","%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",n),this._checkPropTypes(this.constructor.childContextTypes,t,l.childContext);for(var r in t)d(r in this.constructor.childContextTypes,'%s.getChildContext(): key "%s" is not defined in childContextTypes.',n,r);return m(e,t)}return e},_processProps:function(e){var t=m(e),n=this._defaultProps;for(var r in n)typeof t[r]=="undefined"&&(t[r]=n[r]);var i=this.constructor.propTypes;return i&&this._checkPropTypes(i,t,l.prop),t},_checkPropTypes:function(e,t,n){var r=this.constructor.displayName;for(var i in e)e.hasOwnProperty(i)&&e[i](t,i,r,n)},performUpdateIfNecessary:function(){var e=this._compositeLifeCycleState;if(e===z.MOUNTING||e===z.RECEIVING_PROPS)return;r.Mixin.performUpdateIfNecessary.call(this)},_performUpdateIfNecessary:function(e){if(this._pendingProps==null&&this._pendingState==null&&this._pendingContext==null&&!this._pendingForceUpdate)return;var t=this._pendingContext||this._currentContext,n=this._processContext(t);this._pendingContext=null;var r=this.props;this._pendingProps!=null&&(r=this._processProps(this._pendingProps),this._pendingProps=null,this._compositeLifeCycleState=z.RECEIVING_PROPS,this.componentWillReceiveProps&&this.componentWillReceiveProps(r,n)),this._compositeLifeCycleState=z.RECEIVING_STATE;var i=this._pendingOwner,s=this._pendingState||this.state;this._pendingState=null;try{this._pendingForceUpdate||!this.shouldComponentUpdate||this.shouldComponentUpdate(r,s,n)?(this._pendingForceUpdate=!1,this._performComponentUpdate(r,i,s,t,n,e)):(this.props=r,this._owner=i,this.state=s,this._currentContext=t,this.context=n)}finally{this._compositeLifeCycleState=null}},_performComponentUpdate:function(e,t,n,r,i,s){var o=this.props,u=this._owner,a=this.state,f=this.context;this.componentWillUpdate&&this.componentWillUpdate(e,n,i),this.props=e,this._owner=t,this.state=n,this._currentContext=r,this.context=i,this.updateComponent(s,o,u,a,f),this.componentDidUpdate&&s.getReactMountReady().enqueue(this,this.componentDidUpdate.bind(this,o,a,f))},receiveComponent:function(e,t){if(e===this._descriptor)return;this._descriptor=e,this._pendingContext=e._currentContext,r.Mixin.receiveComponent.call(this,e,t)},updateComponent:a.measure("ReactCompositeComponent","updateComponent",function(e,t,n,i,s){r.Mixin.updateComponent.call(this,e,t,n);var o=this._renderedComponent,u=this._renderValidatedComponent();if(w(o,u))o.receiveComponent(u,e);else{var a=this._rootNodeID,f=o._rootNodeID;o.unmountComponent(),this._renderedComponent=p(u);var l=this._renderedComponent.mountComponent(a,e,this._mountDepth+1);r.BackendIDOperations.dangerouslyReplaceNodeWithMarkupByID(f,l)}}),forceUpdate:function(e){var t=this._compositeLifeCycleState;d(this.isMounted()||t===z.MOUNTING,"forceUpdate(...): Can only force an update on mounted or mounting components."),d(t!==z.RECEIVING_STATE&&t!==z.UNMOUNTING,"forceUpdate(...): Cannot force an update while unmounting component or during an existing state transition (such as within `render`)."),this._pendingForceUpdate=!0,h.enqueueUpdate(this,e)},_renderValidatedComponent:a.measure("ReactCompositeComponent","_renderValidatedComponent",function(){var e,t=i.current;i.current=this._processChildContext(this._currentContext),s.current=this;try{e=this.render()}finally{i.current=t,s.current=null}return d(r.isValidComponent(e),"%s.render(): A valid ReactComponent must be returned. You may have returned null, undefined, an array, or some other invalid object.",this.constructor.displayName||"ReactCompositeComponent"),e}),_bindAutoBindMethods:function(){for(var e in this.__reactAutoBindMap){if(!this.__reactAutoBindMap.hasOwnProperty(e))continue;var t=this.__reactAutoBindMap[e];this[e]=this._bindAutoBindMethod(o.guard(t,this.constructor.displayName+"."+e))}},_bindAutoBindMethod:function(e){var t=this,n=function(){return e.apply(t,arguments)};n.__reactBoundContext=t,n.__reactBoundMethod=e,n.__reactBoundArguments=null;var r=t.constructor.displayName,i=n.bind;return n.bind=function(s){var o=Array.prototype.slice.call(arguments,1);if(s!==t&&s!==null)y("react_bind_warning",{component:r}),console.warn("bind(): React component methods may only be bound to the component instance. See "+r);else if(!o.length)return y("react_bind_warning",{component:r}),console.warn("bind(): You are binding a component method to the component. React does this for you automatically in a high-performance way, so you can safely remove this call. See "+r),n;var u=i.apply(n,arguments);return u.__reactBoundContext=t,u.__reactBoundMethod=e,u.__reactBoundArguments=o,u},n}},X=function(){};g(X,r.Mixin),g(X,u.Mixin),g(X,f.Mixin),g(X,W);var $={LifeCycle:z,Base:X,createClass:function(e){var t=function(){};t.prototype=new X,t.prototype.constructor=t;var n=t,r=function(e,t){var r=new n;return r.construct.apply(r,arguments),r};r.componentConstructor=t,t.ConvenienceConstructor=r,r.originalSpec=e,x.forEach(A.bind(null,r)),A(r,e),d(t.prototype.render,"createClass(...): Class specification must implement a `render` method."),t.prototype.componentShouldUpdate&&(y("react_component_should_update_warning",{component:e.displayName}),console.warn((e.displayName||"A component")+" has a method called "+"componentShouldUpdate(). Did you mean shouldComponentUpdate()? "+"The name is phrased as a question because the function is "+"expected to return a value.")),r.type=t,t.prototype.type=t;for(var i in T)t.prototype[i]||(t.prototype[i]=null);return n=U(t),r},isValidClass:V,injection:{injectMixin:function(e){x.push(e)}}};t.exports=$},{"./ReactComponent":27,"./ReactContext":30,"./ReactCurrentOwner":31,"./ReactErrorUtils":47,"./ReactOwner":59,"./ReactPerf":60,"./ReactPropTransferer":61,"./ReactPropTypeLocationNames":62,"./ReactPropTypeLocations":63,"./ReactUpdates":71,"./instantiateReactComponent":111,"./invariant":112,"./keyMirror":118,"./merge":121,"./mixInto":124,"./monitorCodeUse":125,"./objMap":126,"./shouldUpdateReactComponent":131,"./warning":134}],30:[function(e,t,n){var r=e("./merge"),i={current:{},withContext:function(e,t){var n,s=i.current;i.current=r(s,e);try{n=t()}finally{i.current=s}return n}};t.exports=i},{"./merge":121}],31:[function(e,t,n){var r={current:null};t.exports=r},{}],32:[function(e,t,n){function o(e,t){var n=function(){};n.prototype=new r(e,t),n.prototype.constructor=n,n.displayName=e;var i=function(e,t){var r=new n;return r.construct.apply(r,arguments),r};return i.type=n,n.prototype.type=n,n.ConvenienceConstructor=i,i.componentConstructor=n,i}var r=e("./ReactDOMComponent"),i=e("./mergeInto"),s=e("./objMapKeyVal"),u=s({a:!1,abbr:!1,address:!1,area:!0,article:!1,aside:!1,audio:!1,b:!1,base:!0,bdi:!1,bdo:!1,big:!1,blockquote:!1,body:!1,br:!0,button:!1,canvas:!1,caption:!1,cite:!1,code:!1,col:!0,colgroup:!1,data:!1,datalist:!1,dd:!1,del:!1,details:!1,dfn:!1,div:!1,dl:!1,dt:!1,em:!1,embed:!0,fieldset:!1,figcaption:!1,figure:!1,footer:!1,form:!1,h1:!1,h2:!1,h3:!1,h4:!1,h5:!1,h6:!1,head:!1,header:!1,hr:!0,html:!1,i:!1,iframe:!1,img:!0,input:!0,ins:!1,kbd:!1,keygen:!0,label:!1,legend:!1,li:!1,link:!0,main:!1,map:!1,mark:!1,menu:!1,menuitem:!1,meta:!0,meter:!1,nav:!1,noscript:!1,object:!1,ol:!1,optgroup:!1,option:!1,output:!1,p:!1,param:!0,pre:!1,progress:!1,q:!1,rp:!1,rt:!1,ruby:!1,s:!1,samp:!1,script:!1,section:!1,select:!1,small:!1,source:!0,span:!1,strong:!1,style:!1,sub:!1,summary:!1,sup:!1,table:!1,tbody:!1,td:!1,textarea:!1,tfoot:!1,th:!1,thead:!1,time:!1,title:!1,tr:!1,track:!0,u:!1,ul:!1,"var":!1,video:!1,wbr:!0,circle:!1,defs:!1,g:!1,line:!1,linearGradient:!1,path:!1,polygon:!1,polyline:!1,radialGradient:!1,rect:!1,stop:!1,svg:!1,text:!1},o),a={injectComponentClasses:function(e){i(u,e)}};u.injection=a,t.exports=u},{"./ReactDOMComponent":34,"./mergeInto":123,"./objMapKeyVal":127}],33:[function(e,t,n){var r=e("./AutoFocusMixin"),i=e("./ReactBrowserComponentMixin"),s=e("./ReactCompositeComponent"),o=e("./ReactDOM"),u=e("./keyMirror"),a=o.button,f=u({onClick:!0,onDoubleClick:!0,onMouseDown:!0,onMouseMove:!0,onMouseUp:!0,onClickCapture:!0,onDoubleClickCapture:!0,onMouseDownCapture:!0,onMouseMoveCapture:!0,onMouseUpCapture:!0}),l=s.createClass({displayName:"ReactDOMButton",mixins:[r,i],render:function(){var e={};for(var t in this.props)this.props.hasOwnProperty(t)&&(!this.props.disabled||!f[t])&&(e[t]=this.props[t]);return a(e,this.props.children)}});t.exports=l},{"./AutoFocusMixin":1,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./keyMirror":118}],34:[function(e,t,n){function x(e){if(!e)return;p(e.children==null||e.dangerouslySetInnerHTML==null,"Can only set one of `children` or `props.dangerouslySetInnerHTML`."),p(e.style==null||typeof e.style=="object","The `style` prop expects a mapping from style properties to values, not a string.")}function T(e,t,n,r){var i=f.findReactContainerForID(e);if(i){var s=i.nodeType===S?i.ownerDocument:i;y(t,s)}r.getPutListenerQueue().enqueuePutListener(e,t,n)}function N(e,t){this._tagOpen="<"+e,this._tagClose=t?"":"</"+e+">",this.tagName=e.toUpperCase()}var r=e("./CSSPropertyOperations"),i=e("./DOMProperty"),s=e("./DOMPropertyOperations"),o=e("./ReactBrowserComponentMixin"),u=e("./ReactComponent"),a=e("./ReactEventEmitter"),f=e("./ReactMount"),l=e("./ReactMultiChild"),c=e("./ReactPerf"),h=e("./escapeTextForBrowser"),p=e("./invariant"),d=e("./keyOf"),v=e("./merge"),m=e("./mixInto"),g=a.deleteListener,y=a.listenTo,b=a.registrationNameModules,w={string:!0,number:!0},E=d({style:null}),S=1;N.Mixin={mountComponent:c.measure("ReactDOMComponent","mountComponent",function(e,t,n){return u.Mixin.mountComponent.call(this,e,t,n),x(this.props),this._createOpenTagMarkupAndPutListeners(t)+this._createContentMarkup(t)+this._tagClose}),_createOpenTagMarkupAndPutListeners:function(e){var t=this.props,n=this._tagOpen;for(var i in t){if(!t.hasOwnProperty(i))continue;var o=t[i];if(o==null)continue;if(b[i])T(this._rootNodeID,i,o,e);else{i===E&&(o&&(o=t.style=v(t.style)),o=r.createMarkupForStyles(o));var u=s.createMarkupForProperty(i,o);u&&(n+=" "+u)}}if(e.renderToStaticMarkup)return n+">";var a=s.createMarkupForID(this._rootNodeID);return n+" "+a+">"},_createContentMarkup:function(e){var t=this.props.dangerouslySetInnerHTML;if(t!=null){if(t.__html!=null)return t.__html}else{var n=w[typeof this.props.children]?this.props.children:null,r=n!=null?null:this.props.children;if(n!=null)return h(n);if(r!=null){var i=this.mountChildren(r,e);return i.join("")}}return""},receiveComponent:function(e,t){if(e===this)return;x(e.props),u.Mixin.receiveComponent.call(this,e,t)},updateComponent:c.measure("ReactDOMComponent","updateComponent",function(e,t,n){u.Mixin.updateComponent.call(this,e,t,n),this._updateDOMProperties(t,e),this._updateDOMChildren(t,e)}),_updateDOMProperties:function(e,t){var n=this.props,r,s,o;for(r in e){if(n.hasOwnProperty(r)||!e.hasOwnProperty(r))continue;if(r===E){var a=e[r];for(s in a)a.hasOwnProperty(s)&&(o=o||{},o[s]="")}else b[r]?g(this._rootNodeID,r):(i.isStandardName[r]||i.isCustomAttribute(r))&&u.BackendIDOperations.deletePropertyByID(this._rootNodeID,r)}for(r in n){var f=n[r],l=e[r];if(!n.hasOwnProperty(r)||f===l)continue;if(r===E){f&&(f=n.style=v(f));if(l){for(s in l)l.hasOwnProperty(s)&&!f.hasOwnProperty(s)&&(o=o||{},o[s]="");for(s in f)f.hasOwnProperty(s)&&l[s]!==f[s]&&(o=o||{},o[s]=f[s])}else o=f}else b[r]?T(this._rootNodeID,r,f,t):(i.isStandardName[r]||i.isCustomAttribute(r))&&u.BackendIDOperations.updatePropertyByID(this._rootNodeID,r,f)}o&&u.BackendIDOperations.updateStylesByID(this._rootNodeID,o)},_updateDOMChildren:function(e,t){var n=this.props,r=w[typeof e.children]?e.children:null,i=w[typeof n.children]?n.children:null,s=e.dangerouslySetInnerHTML&&e.dangerouslySetInnerHTML.__html,o=n.dangerouslySetInnerHTML&&n.dangerouslySetInnerHTML.__html,a=r!=null?null:e.children,f=i!=null?null:n.children,l=r!=null||s!=null,c=i!=null||o!=null;a!=null&&f==null?this.updateChildren(null,t):l&&!c&&this.updateTextContent(""),i!=null?r!==i&&this.updateTextContent(""+i):o!=null?s!==o&&u.BackendIDOperations.updateInnerHTMLByID(this._rootNodeID,o):f!=null&&this.updateChildren(f,t)},unmountComponent:function(){this.unmountChildren(),a.deleteAllListeners(this._rootNodeID),u.Mixin.unmountComponent.call(this)}},m(N,u.Mixin),m(N,N.Mixin),m(N,l.Mixin),m(N,o),t.exports=N},{"./CSSPropertyOperations":3,"./DOMProperty":8,"./DOMPropertyOperations":9,"./ReactBrowserComponentMixin":25,"./ReactComponent":27,"./ReactEventEmitter":48,"./ReactMount":55,"./ReactMultiChild":57,"./ReactPerf":60,"./escapeTextForBrowser":98,"./invariant":112,"./keyOf":119,"./merge":121,"./mixInto":124}],35:[function(e,t,n){var r=e("./ReactBrowserComponentMixin"),i=e("./ReactCompositeComponent"),s=e("./ReactDOM"),o=e("./ReactEventEmitter"),u=e("./EventConstants"),a=s.form,f=i.createClass({displayName:"ReactDOMForm",mixins:[r],render:function(){return this.transferPropsTo(a(null,this.props.children))},componentDidMount:function(){o.trapBubbledEvent(u.topLevelTypes.topReset,"reset",this.getDOMNode()),o.trapBubbledEvent(u.topLevelTypes.topSubmit,"submit",this.getDOMNode())}});t.exports=f},{"./EventConstants":14,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./ReactEventEmitter":48}],36:[function(e,t,n){var r=e("./CSSPropertyOperations"),i=e("./DOMChildrenOperations"),s=e("./DOMPropertyOperations"),o=e("./ReactMount"),u=e("./ReactPerf"),a=e("./invariant"),f={dangerouslySetInnerHTML:"`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.",style:"`style` must be set using `updateStylesByID()`."},l,c={updatePropertyByID:u.measure("ReactDOMIDOperations","updatePropertyByID",function(e,t,n){var r=o.getNode(e);a(!f.hasOwnProperty(t),"updatePropertyByID(...): %s",f[t]),n!=null?s.setValueForProperty(r,t,n):s.deleteValueForProperty(r,t)}),deletePropertyByID:u.measure("ReactDOMIDOperations","deletePropertyByID",function(e,t,n){var r=o.getNode(e);a(!f.hasOwnProperty(t),"updatePropertyByID(...): %s",f[t]),s.deleteValueForProperty(r,t,n)}),updateStylesByID:u.measure("ReactDOMIDOperations","updateStylesByID",function(e,t){var n=o.getNode(e);r.setValueForStyles(n,t)}),updateInnerHTMLByID:u.measure("ReactDOMIDOperations","updateInnerHTMLByID",function(e,t){var n=o.getNode(e);if(l===undefined){var r=document.createElement("div");r.innerHTML=" ",l=r.innerHTML===""}l&&n.parentNode.replaceChild(n,n),l&&t.match(/^[ \r\n\t\f]/)?(n.innerHTML="﻿"+t,n.firstChild.deleteData(0,1)):n.innerHTML=t}),updateTextContentByID:u.measure("ReactDOMIDOperations","updateTextContentByID",function(e,t){var n=o.getNode(e);i.updateTextContent(n,t)}),dangerouslyReplaceNodeWithMarkupByID:u.measure("ReactDOMIDOperations","dangerouslyReplaceNodeWithMarkupByID",function(e,t){var n=o.getNode(e);i.dangerouslyReplaceNodeWithMarkup(n,t)}),dangerouslyProcessChildrenUpdates:u.measure("ReactDOMIDOperations","dangerouslyProcessChildrenUpdates",function(e,t){for(var n=0;n<e.length;n++)e[n].parentNode=o.getNode(e[n].parentID);i.processUpdates(e,t)})};t.exports=c},{"./CSSPropertyOperations":3,"./DOMChildrenOperations":7,"./DOMPropertyOperations":9,"./ReactMount":55,"./ReactPerf":60,"./invariant":112}],37:[function(e,t,n){var r=e("./ReactBrowserComponentMixin"),i=e("./ReactCompositeComponent"),s=e("./ReactDOM"),o=e("./ReactEventEmitter"),u=e("./EventConstants"),a=s.img,f=i.createClass({displayName:"ReactDOMImg",tagName:"IMG",mixins:[r],render:function(){return a(this.props)},componentDidMount:function(){var e=this.getDOMNode();o.trapBubbledEvent(u.topLevelTypes.topLoad,"load",e),o.trapBubbledEvent(u.topLevelTypes.topError,"error",e)}});t.exports=f},{"./EventConstants":14,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./ReactEventEmitter":48}],38:[function(e,t,n){var r=e("./AutoFocusMixin"),i=e("./DOMPropertyOperations"),s=e("./LinkedValueUtils"),o=e("./ReactBrowserComponentMixin"),u=e("./ReactCompositeComponent"),a=e("./ReactDOM"),f=e("./ReactMount"),l=e("./invariant"),c=e("./merge"),h=a.input,p={},d=u.createClass({displayName:"ReactDOMInput",mixins:[r,s.Mixin,o],getInitialState:function(){var e=this.props.defaultValue;return{checked:this.props.defaultChecked||!1,value:e!=null?e:null}},shouldComponentUpdate:function(){return!this._isChanging},render:function(){var e=c(this.props);e.defaultChecked=null,e.defaultValue=null;var t=s.getValue(this);e.value=t!=null?t:this.state.value;var n=s.getChecked(this);return e.checked=n!=null?n:this.state.checked,e.onChange=this._handleChange,h(e,this.props.children)},componentDidMount:function(){var e=f.getID(this.getDOMNode());p[e]=this},componentWillUnmount:function(){var e=this.getDOMNode(),t=f.getID(e);delete p[t]},componentDidUpdate:function(e,t,n){var r=this.getDOMNode();this.props.checked!=null&&i.setValueForProperty(r,"checked",this.props.checked||!1);var o=s.getValue(this);o!=null&&i.setValueForProperty(r,"value",""+o)},_handleChange:function(e){var t,n=s.getOnChange(this);n&&(this._isChanging=!0,t=n.call(this,e),this._isChanging=!1),this.setState({checked:e.target.checked,value:e.target.value});var r=this.props.name;if(this.props.type==="radio"&&r!=null){var i=this.getDOMNode(),o=i;while(o.parentNode)o=o.parentNode;var u=o.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]');for(var a=0,c=u.length;a<c;a++){var h=u[a];if(h===i||h.form!==i.form)continue;var d=f.getID(h);l(d,"ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");var v=p[d];l(v,"ReactDOMInput: Unknown radio button ID %s.",d),v.setState({checked:!1})}}return t}});t.exports=d},{"./AutoFocusMixin":1,"./DOMPropertyOperations":9,"./LinkedValueUtils":21,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./ReactMount":55,"./invariant":112,"./merge":121}],39:[function(e,t,n){var r=e("./ReactBrowserComponentMixin"),i=e("./ReactCompositeComponent"),s=e("./ReactDOM"),o=e("./warning"),u=s.option,a=i.createClass({displayName:"ReactDOMOption",mixins:[r],componentWillMount:function(){o(this.props.selected==null,"Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>.")},render:function(){return u(this.props,this.props.children)}});t.exports=a},{"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./warning":134}],40:[function(e,t,n){function c(e,t,n){if(e[t]==null)return;e.multiple?a(Array.isArray(e[t]),"The `%s` prop supplied to <select> must be an array if `multiple` is true.",t):a(!Array.isArray(e[t]),"The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.",t)}function h(e,t){var n=e.props.multiple,r=t!=null?t:e.state.value,i=e.getDOMNode().options,s,o,u;if(n){s={};for(o=0,u=r.length;o<u;++o)s[""+r[o]]=!0}else s=""+r;for(o=0,u=i.length;o<u;o++){var a=n?s.hasOwnProperty(i[o].value):i[o].value===s;a!==i[o].selected&&(i[o].selected=a)}}var r=e("./AutoFocusMixin"),i=e("./LinkedValueUtils"),s=e("./ReactBrowserComponentMixin"),o=e("./ReactCompositeComponent"),u=e("./ReactDOM"),a=e("./invariant"),f=e("./merge"),l=u.select,p=o.createClass({displayName:"ReactDOMSelect",mixins:[r,i.Mixin,s],propTypes:{defaultValue:c,value:c},getInitialState:function(){return{value:this.props.defaultValue||(this.props.multiple?[]:"")}},componentWillReceiveProps:function(e){!this.props.multiple&&e.multiple?this.setState({value:[this.state.value]}):this.props.multiple&&!e.multiple&&this.setState({value:this.state.value[0]})},shouldComponentUpdate:function(){return!this._isChanging},render:function(){var e=f(this.props);return e.onChange=this._handleChange,e.value=null,l(e,this.props.children)},componentDidMount:function(){h(this,i.getValue(this))},componentDidUpdate:function(){var e=i.getValue(this);e!=null&&h(this,e)},_handleChange:function(e){var t,n=i.getOnChange(this);n&&(this._isChanging=!0,t=n.call(this,e),this._isChanging=!1);var r;if(this.props.multiple){r=[];var s=e.target.options;for(var o=0,u=s.length;o<u;o++)s[o].selected&&r.push(s[o].value)}else r=e.target.value;return this.setState({value:r}),t}});t.exports=p},{"./AutoFocusMixin":1,"./LinkedValueUtils":21,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./invariant":112,"./merge":121}],41:[function(e,t,n){function s(e){var t=document.selection,n=t.createRange(),r=n.text.length,i=n.duplicate();i.moveToElementText(e),i.setEndPoint("EndToStart",n);var s=i.text.length,o=s+r;return{start:s,end:o}}function o(e){var t=window.getSelection();if(t.rangeCount===0)return null;var n=t.anchorNode,r=t.anchorOffset,i=t.focusNode,s=t.focusOffset,o=t.getRangeAt(0),u=o.toString().length,a=o.cloneRange();a.selectNodeContents(e),a.setEnd(o.startContainer,o.startOffset);var f=a.toString().length,l=f+u,c=document.createRange();c.setStart(n,r),c.setEnd(i,s);var h=c.collapsed;return c.detach(),{start:h?l:f,end:h?f:l}}function u(e,t){var n=document.selection.createRange().duplicate(),r,i;typeof t.end=="undefined"?(r=t.start,i=r):t.start>t.end?(r=t.end,i=t.start):(r=t.start,i=t.end),n.moveToElementText(e),n.moveStart("character",r),n.setEndPoint("EndToStart",n),n.moveEnd("character",i-r),n.select()}function a(e,t){var n=window.getSelection(),s=e[i()].length,o=Math.min(t.start,s),u=typeof t.end=="undefined"?o:Math.min(t.end,s);if(!n.extend&&o>u){var a=u;u=o,o=a}var f=r(e,o),l=r(e,u);if(f&&l){var c=document.createRange();c.setStart(f.node,f.offset),n.removeAllRanges(),o>u?(n.addRange(c),n.extend(l.node,l.offset)):(c.setEnd(l.node,l.offset),n.addRange(c)),c.detach()}}var r=e("./getNodeForCharacterOffset"),i=e("./getTextContentAccessor"),f={getOffsets:function(e){var t=document.selection?s:o;return t(e)},setOffsets:function(e,t){var n=document.selection?u:a;n(e,t)}};t.exports=f},{"./getNodeForCharacterOffset":106,"./getTextContentAccessor":108}],42:[function(e,t,n){var r=e("./AutoFocusMixin"),i=e("./DOMPropertyOperations"),s=e("./LinkedValueUtils"),o=e("./ReactBrowserComponentMixin"),u=e("./ReactCompositeComponent"),a=e("./ReactDOM"),f=e("./invariant"),l=e("./merge"),c=e("./warning"),h=a.textarea,p=u.createClass({displayName:"ReactDOMTextarea",mixins:[r,s.Mixin,o],getInitialState:function(){var e=this.props.defaultValue,t=this.props.children;t!=null&&(c(!1,"Use the `defaultValue` or `value` props instead of setting children on <textarea>."),f(e==null,"If you supply `defaultValue` on a <textarea>, do not pass children."),Array.isArray(t)&&(f(t.length<=1,"<textarea> can only have at most one child."),t=t[0]),e=""+t),e==null&&(e="");var n=s.getValue(this);return{initialValue:""+(n!=null?n:e),value:e}},shouldComponentUpdate:function(){return!this._isChanging},render:function(){var e=l(this.props),t=s.getValue(this);return f(e.dangerouslySetInnerHTML==null,"`dangerouslySetInnerHTML` does not make sense on <textarea>."),e.defaultValue=null,e.value=t!=null?t:this.state.value,e.onChange=this._handleChange,h(e,this.state.initialValue)},componentDidUpdate:function(e,t,n){var r=s.getValue(this);if(r!=null){var o=this.getDOMNode();i.setValueForProperty(o,"value",""+r)}},_handleChange:function(e){var t,n=s.getOnChange(this);return n&&(this._isChanging=!0,t=n.call(this,e),this._isChanging=!1),this.setState({value:e.target.value}),t}});t.exports=p},{"./AutoFocusMixin":1,"./DOMPropertyOperations":9,"./LinkedValueUtils":21,"./ReactBrowserComponentMixin":25,"./ReactCompositeComponent":29,"./ReactDOM":32,"./invariant":112,"./merge":121,"./warning":134}],43:[function(e,t,n){function l(){this.reinitializeTransaction()}var r=e("./ReactUpdates"),i=e("./Transaction"),s=e("./emptyFunction"),o=e("./mixInto"),u={initialize:s,close:function(){h.isBatchingUpdates=!1}},a={initialize:s,close:r.flushBatchedUpdates.bind(r)},f=[a,u];o(l,i.Mixin),o(l,{getTransactionWrappers:function(){return f}});var c=new l,h={isBatchingUpdates:!1,batchedUpdates:function(e,t){var n=h.isBatchingUpdates;h.isBatchingUpdates=!0,n?e(t):c.perform(e,null,t)}};t.exports=h},{"./ReactUpdates":71,"./Transaction":85,"./emptyFunction":96,"./mixInto":124}],44:[function(e,t,n){function O(){r.EventEmitter.injectTopLevelCallbackCreator(d),r.EventPluginHub.injectEventPluginOrder(f),r.EventPluginHub.injectInstanceHandle(x),r.EventPluginHub.injectMount(T),r.EventPluginHub.injectEventPluginsByName({SimpleEventPlugin:k,EnterLeaveEventPlugin:l,ChangeEventPlugin:o,CompositionEventPlugin:a,MobileSafariClickEventPlugin:c,SelectEventPlugin:N}),r.DOM.injectComponentClasses({button:m,form:g,img:y,input:b,option:w,select:E,textarea:S,html:A(v.html),head:A(v.head),title:A(v.title),body:A(v.body)}),r.CompositeComponent.injectMixin(h),r.DOMProperty.injectDOMPropertyConfig(s),r.Updates.injectBatchingStrategy(L),r.RootIndex.injectCreateReactRootIndex(i.canUseDOM?u.createReactRootIndex:C.createReactRootIndex),r.Component.injectEnvironment(p);var t=i.canUseDOM&&window.location.href||"";if(/[?&]react_perf\b/.test(t)){var n=e("./ReactDefaultPerf");n.start()}}var r=e("./ReactInjection"),i=e("./ExecutionEnvironment"),s=e("./DefaultDOMPropertyConfig"),o=e("./ChangeEventPlugin"),u=e("./ClientReactRootIndex"),a=e("./CompositionEventPlugin"),f=e("./DefaultEventPluginOrder"),l=e("./EnterLeaveEventPlugin"),c=e("./MobileSafariClickEventPlugin"),h=e("./ReactBrowserComponentMixin"),p=e("./ReactComponentBrowserEnvironment"),d=e("./ReactEventTopLevelCallback"),v=e("./ReactDOM"),m=e("./ReactDOMButton"),g=e("./ReactDOMForm"),y=e("./ReactDOMImg"),b=e("./ReactDOMInput"),w=e("./ReactDOMOption"),E=e("./ReactDOMSelect"),S=e("./ReactDOMTextarea"),x=e("./ReactInstanceHandles"),T=e("./ReactMount"),N=e("./SelectEventPlugin"),C=e("./ServerReactRootIndex"),k=e("./SimpleEventPlugin"),L=e("./ReactDefaultBatchingStrategy"),A=e("./createFullPageComponent");t.exports={inject:O}},{"./ChangeEventPlugin":4,"./ClientReactRootIndex":5,"./CompositionEventPlugin":6,"./DefaultDOMPropertyConfig":11,"./DefaultEventPluginOrder":12,"./EnterLeaveEventPlugin":13,"./ExecutionEnvironment":20,"./MobileSafariClickEventPlugin":22,"./ReactBrowserComponentMixin":25,"./ReactComponentBrowserEnvironment":28,"./ReactDOM":32,"./ReactDOMButton":33,"./ReactDOMForm":35,"./ReactDOMImg":37,"./ReactDOMInput":38,"./ReactDOMOption":39,"./ReactDOMSelect":40,"./ReactDOMTextarea":42,"./ReactDefaultBatchingStrategy":43,"./ReactDefaultPerf":45,"./ReactEventTopLevelCallback":50,"./ReactInjection":51,"./ReactInstanceHandles":53,"./ReactMount":55,"./SelectEventPlugin":72,"./ServerReactRootIndex":73,"./SimpleEventPlugin":74,"./createFullPageComponent":92}],45:[function(e,t,n){function a(e){return Math.floor(e*100)/100}var r=e("./DOMProperty"),i=e("./ReactDefaultPerfAnalysis"),s=e("./ReactMount"),o=e("./ReactPerf"),u=e("./performanceNow"),f={_allMeasurements:[],_injected:!1,start:function(){f._injected||o.injection.injectMeasure(f.measure),f._allMeasurements.length=0,o.enableMeasure=!0},stop:function(){o.enableMeasure=!1},getLastMeasurements:function(){return f._allMeasurements},printExclusive:function(e){e=e||f._allMeasurements;var t=i.getExclusiveSummary(e);console.table(t.map(function(e){return{"Component class name":e.componentName,"Total inclusive time (ms)":a(e.inclusive),"Total exclusive time (ms)":a(e.exclusive),"Exclusive time per instance (ms)":a(e.exclusive/e.count),Instances:e.count}})),console.log("Total time:",i.getTotalTime(e).toFixed(2)+" ms")},printInclusive:function(e){e=e||f._allMeasurements;var t=i.getInclusiveSummary(e);console.table(t.map(function(e){return{"Owner > component":e.componentName,"Inclusive time (ms)":a(e.time),Instances:e.count}})),console.log("Total time:",i.getTotalTime(e).toFixed(2)+" ms")},printWasted:function(e){e=e||f._allMeasurements;var t=i.getInclusiveSummary(e,!0);console.table(t.map(function(e){return{"Owner > component":e.componentName,"Wasted time (ms)":e.time,Instances:e.count}})),console.log("Total time:",i.getTotalTime(e).toFixed(2)+" ms")},printDOM:function(e){e=e||f._allMeasurements;var t=i.getDOMSummary(e);console.table(t.map(function(e){var t={};return t[r.ID_ATTRIBUTE_NAME]=e.id,t.type=e.type,t.args=JSON.stringify(e.args),t})),console.log("Total time:",i.getTotalTime(e).toFixed(2)+" ms")},_recordWrite:function(e,t,n,r){var i=f._allMeasurements[f._allMeasurements.length-1].writes;i[e]=i[e]||[],i[e].push({type:t,time:n,args:r})},measure:function(e,t,n){return function(){var r=Array.prototype.slice.call(arguments,0),i,o,a;if(t==="_renderNewRootComponent"||t==="flushBatchedUpdates")return f._allMeasurements.push({exclusive:{},inclusive:{},counts:{},writes:{},displayNames:{},totalTime:0}),a=u(),o=n.apply(this,r),f._allMeasurements[f._allMeasurements.length-1].totalTime=u()-a,o;if(e==="ReactDOMIDOperations"||e==="ReactComponentBrowserEnvironment"){a=u(),o=n.apply(this,r),i=u()-a;if(t==="mountImageIntoNode"){var l=s.getID(r[1]);f._recordWrite(l,t,i,r[0])}else t==="dangerouslyProcessChildrenUpdates"?r[0].forEach(function(e){var t={};e.fromIndex!==null&&(t.fromIndex=e.fromIndex),e.toIndex!==null&&(t.toIndex=e.toIndex),e.textContent!==null&&(t.textContent=e.textContent),e.markupIndex!==null&&(t.markup=r[1][e.markupIndex]),f._recordWrite(e.parentID,e.type,i,t)}):f._recordWrite(r[0],t,i,Array.prototype.slice.call(r,1));return o}if(e!=="ReactCompositeComponent"||t!=="mountComponent"&&t!=="updateComponent"&&t!=="_renderValidatedComponent")return n.apply(this,r);var c=t==="mountComponent"?r[0]:this._rootNodeID,h=t==="_renderValidatedComponent",p=f._allMeasurements[f._allMeasurements.length-1];h&&(p.counts[c]=p.counts[c]||0,p.counts[c]+=1),a=u(),o=n.apply(this,r),i=u()-a;var d=h?p.exclusive:p.inclusive;return d[c]=d[c]||0,d[c]+=i,p.displayNames[c]={current:this.constructor.displayName,owner:this._owner?this._owner.constructor.displayName:"<root>"},o}}};t.exports=f},{"./DOMProperty":8,"./ReactDefaultPerfAnalysis":46,"./ReactMount":55,"./ReactPerf":60,"./performanceNow":129}],46:[function(e,t,n){function o(e){var t=0;for(var n=0;n<e.length;n++){var r=e[n];t+=r.totalTime}return t}function u(e){var t=[];for(var n=0;n<e.length;n++){var r=e[n],i;for(i in r.writes)r.writes[i].forEach(function(e){t.push({id:i,type:s[e.type]||e.type,args:e.args})})}return t}function a(e){var t={},n;for(var s=0;s<e.length;s++){var o=e[s],u=r(o.exclusive,o.inclusive);for(var a in u)n=o.displayNames[a].current,t[n]=t[n]||{componentName:n,inclusive:0,exclusive:0,count:0},o.exclusive[a]&&(t[n].exclusive+=o.exclusive[a]),o.inclusive[a]&&(t[n].inclusive+=o.inclusive[a]),o.counts[a]&&(t[n].count+=o.counts[a])}var f=[];for(n in t)t[n].exclusive>=i&&f.push(t[n]);return f.sort(function(e,t){return t.exclusive-e.exclusive}),f}function f(e,t){var n={},s;for(var o=0;o<e.length;o++){var u=e[o],a=r(u.exclusive,u.inclusive),f;t&&(f=l(u));for(var c in a){if(t&&!f[c])continue;var h=u.displayNames[c];s=h.owner+" > "+h.current,n[s]=n[s]||{componentName:s,time:0,count:0},u.inclusive[c]&&(n[s].time+=u.inclusive[c]),u.counts[c]&&(n[s].count+=u.counts[c])}}var p=[];for(s in n)n[s].time>=i&&p.push(n[s]);return p.sort(function(e,t){return t.time-e.time}),p}function l(e){var t={},n=Object.keys(e.writes),i=r(e.exclusive,e.inclusive);for(var s in i){var o=!1;for(var u=0;u<n.length;u++)if(n[u].indexOf(s)===0){o=!0;break}!o&&e.counts[s]>0&&(t[s]=!0)}return t}var r=e("./merge"),i=1.2,s={mountImageIntoNode:"set innerHTML",INSERT_MARKUP:"set innerHTML",MOVE_EXISTING:"move",REMOVE_NODE:"remove",TEXT_CONTENT:"set textContent",updatePropertyByID:"update attribute",deletePropertyByID:"delete attribute",updateStylesByID:"update styles",updateInnerHTMLByID:"set innerHTML",dangerouslyReplaceNodeWithMarkupByID:"replace"},c={getExclusiveSummary:a,getInclusiveSummary:f,getDOMSummary:u,getTotalTime:o};t.exports=c},{"./merge":121}],47:[function(e,t,n){var r={guard:function(e,t){return e}};t.exports=r},{}],48:[function(e,t,n){function y(e){return e[g]==null&&(e[g]=v++,p[e[g]]={}),p[e[g]]}function b(e,t,n){i.listen(n,t,E.TopLevelCallbackCreator.createTopLevelCallback(e))}function w(e,t,n){i.capture(n,t,E.TopLevelCallbackCreator.createTopLevelCallback(e))}var r=e("./EventConstants"),i=e("./EventListener"),s=e("./EventPluginHub"),o=e("./EventPluginRegistry"),u=e("./ExecutionEnvironment"),a=e("./ReactEventEmitterMixin"),f=e("./ViewportMetrics"),l=e("./invariant"),c=e("./isEventSupported"),h=e("./merge"),p={},d=!1,v=0,m={topBlur:"blur",topChange:"change",topClick:"click",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topScroll:"scroll",topSelectionChange:"selectionchange",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",topTouchStart:"touchstart",topWheel:"wheel"},g="_reactListenersID"+String(Math.random()).slice(2),E=h(a,{TopLevelCallbackCreator:null,injection:{injectTopLevelCallbackCreator:function(e){E.TopLevelCallbackCreator=e}},setEnabled:function(e){l(u.canUseDOM,"setEnabled(...): Cannot toggle event listening in a Worker thread. This is likely a bug in the framework. Please report immediately."),E.TopLevelCallbackCreator&&E.TopLevelCallbackCreator.setEnabled(e)},isEnabled:function(){return!!E.TopLevelCallbackCreator&&!!E.TopLevelCallbackCreator.isEnabled()},listenTo:function(e,t){var n=t,i=y(n),s=o.registrationNameDependencies[e],u=r.topLevelTypes;for(var a=0,f=s.length;a<f;a++){var l=s[a];if(!i[l]){var h=u[l];h===u.topWheel?c("wheel")?b(u.topWheel,"wheel",n):c("mousewheel")?b(u.topWheel,"mousewheel",n):b(u.topWheel,"DOMMouseScroll",n):h===u.topScroll?c("scroll",!0)?w(u.topScroll,"scroll",n):b(u.topScroll,"scroll",window):h===u.topFocus||h===u.topBlur?(c("focus",!0)?(w(u.topFocus,"focus",n),w(u.topBlur,"blur",n)):c("focusin")&&(b(u.topFocus,"focusin",n),b(u.topBlur,"focusout",n)),i[u.topBlur]=!0,i[u.topFocus]=!0):m[l]&&b(h,m[l],n),i[l]=!0}}},ensureScrollValueMonitoring:function(){if(!d){var e=f.refreshScrollValues;i.listen(window,"scroll",e),i.listen(window,"resize",e),d=!0}},eventNameDispatchConfigs:s.eventNameDispatchConfigs,registrationNameModules:s.registrationNameModules,putListener:s.putListener,getListener:s.getListener,deleteListener:s.deleteListener,deleteAllListeners:s.deleteAllListeners,trapBubbledEvent:b,trapCapturedEvent:w});t.exports=E},{"./EventConstants":14,"./EventListener":15,"./EventPluginHub":16,"./EventPluginRegistry":17,"./ExecutionEnvironment":20,"./ReactEventEmitterMixin":49,"./ViewportMetrics":86,"./invariant":112,"./isEventSupported":113,"./merge":121}],49:[function(e,t,n){function s(e){r.enqueueEvents(e),r.processEventQueue()}var r=e("./EventPluginHub"),i=e("./ReactUpdates"),o={handleTopLevel:function(e,t,n,o){var u=r.extractEvents(e,t,n,o);i.batchedUpdates(s,u)}};t.exports=o},{"./EventPluginHub":16,"./ReactUpdates":71}],50:[function(e,t,n){function l(e){var t=o.getID(e),n=s.getReactRootIDFromNodeID(t),r=o.findReactContainerForID(n),i=o.getFirstReactDOM(r);return i}function c(e,t,n){var r=o.getFirstReactDOM(u(t))||window,s=r;while(s)n.ancestors.push(s),s=l(s);for(var a=0,f=n.ancestors.length;a<f;a++){r=n.ancestors[a];var c=o.getID(r)||"";i.handleTopLevel(e,r,c,t)}}function h(){this.ancestors=[]}var r=e("./PooledClass"),i=e("./ReactEventEmitter"),s=e("./ReactInstanceHandles"),o=e("./ReactMount"),u=e("./getEventTarget"),a=e("./mixInto"),f=!0;a(h,{destructor:function(){this.ancestors.length=0}}),r.addPoolingTo(h);var p={setEnabled:function(e){f=!!e},isEnabled:function(){return f},createTopLevelCallback:function(e){return function(t){if(!f)return;var n=h.getPooled();try{c(e,t,n)}finally{h.release(n)}}}};t.exports=p},{"./PooledClass":23,"./ReactEventEmitter":48,"./ReactInstanceHandles":53,"./ReactMount":55,"./getEventTarget":104,"./mixInto":124}],51:[function(e,t,n){var r=e("./DOMProperty"),i=e("./EventPluginHub"),s=e("./ReactComponent"),o=e("./ReactCompositeComponent"),u=e("./ReactDOM"),a=e("./ReactEventEmitter"),f=e("./ReactPerf"),l=e("./ReactRootIndex"),c=e("./ReactUpdates"),h={Component:s.injection,CompositeComponent:o.injection,DOMProperty:r.injection,EventPluginHub:i.injection,DOM:u.injection,EventEmitter:a.injection,Perf:f.injection,RootIndex:l.injection,Updates:c.injection};t.exports=h},{"./DOMProperty":8,"./EventPluginHub":16,"./ReactComponent":27,"./ReactCompositeComponent":29,"./ReactDOM":32,"./ReactEventEmitter":48,"./ReactPerf":60,"./ReactRootIndex":67,"./ReactUpdates":71}],52:[function(e,t,n){function u(e){return i(document.documentElement,e)}var r=e("./ReactDOMSelection"),i=e("./containsNode"),s=e("./focusNode"),o=e("./getActiveElement"),a={hasSelectionCapabilities:function(e){return e&&(e.nodeName==="INPUT"&&e.type==="text"||e.nodeName==="TEXTAREA"||e.contentEditable==="true")},getSelectionInformation:function(){var e=o();return{focusedElem:e,selectionRange:a.hasSelectionCapabilities(e)?a.getSelection(e):null}},restoreSelection:function(e){var t=o(),n=e.focusedElem,r=e.selectionRange;t!==n&&u(n)&&(a.hasSelectionCapabilities(n)&&a.setSelection(n,r),s(n))},getSelection:function(e){var t;if("selectionStart"in e)t={start:e.selectionStart,end:e.selectionEnd};else if(document.selection&&e.nodeName==="INPUT"){var n=document.selection.createRange();n.parentElement()===e&&(t={start:-n.moveStart("character",-e.value.length),end:-n.moveEnd("character",-e.value.length)})}else t=r.getOffsets(e);return t||{start:0,end:0}},setSelection:function(e,t){var n=t.start,i=t.end;typeof i=="undefined"&&(i=n);if("selectionStart"in e)e.selectionStart=n,e.selectionEnd=Math.min(i,e.value.length);else if(document.selection&&e.nodeName==="INPUT"){var s=e.createTextRange();s.collapse(!0),s.moveStart("character",n),s.moveEnd("character",i-n),s.select()}else r.setOffsets(e,t)}};t.exports=a},{"./ReactDOMSelection":41,"./containsNode":89,"./focusNode":100,"./getActiveElement":102}],53:[function(e,t,n){function a(e){return s+e.toString(36)}function f(e,t){return e.charAt(t)===s||t===e.length}function l(e){return e===""||e.charAt(0)===s&&e.charAt(e.length-1)!==s}function c(e,t){return t.indexOf(e)===0&&f(t,e.length)}function h(e){return e?e.substr(0,e.lastIndexOf(s)):""}function p(e,t){i(l(e)&&l(t),"getNextDescendantID(%s, %s): Received an invalid React DOM ID.",e,t),i(c(e,t),"getNextDescendantID(...): React has made an invalid assumption about the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.",e,t);if(e===t)return e;var n=e.length+o;for(var r=n;r<t.length;r++)if(f(t,r))break;return t.substr(0,r)}function d(e,t){var n=Math.min(e.length,t.length);if(n===0)return"";var r=0;for(var s=0;s<=n;s++)if(f(e,s)&&f(t,s))r=s;else if(e.charAt(s)!==t.charAt(s))break;var o=e.substr(0,r);return i(l(o),"getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s",e,t,o),o}function v(e,t,n,r,s,o){e=e||"",t=t||"",i(e!==t,"traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.",e);var a=c(t,e);i(a||c(e,t),"traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do not have a parent path.",e,t);var f=0,l=a?h:p;for(var d=e;;d=l(d,t)){var v;(!s||d!==e)&&(!o||d!==t)&&(v=n(d,a,r));if(v===!1||d===t)break;i(f++<u,"traverseParentPath(%s, %s, ...): Detected an infinite loop while traversing the React DOM ID tree. This may be due to malformed IDs: %s",e,t)}}var r=e("./ReactRootIndex"),i=e("./invariant"),s=".",o=s.length,u=100,m={createReactRootID:function(){return a(r.createReactRootIndex())},createReactID:function(e,t){return e+t},getReactRootIDFromNodeID:function(e){if(e&&e.charAt(0)===s&&e.length>1){var t=e.indexOf(s,1);return t>-1?e.substr(0,t):e}return null},traverseEnterLeave:function(e,t,n,r,i){var s=d(e,t);s!==e&&v(e,s,n,r,!1,!0),s!==t&&v(s,t,n,i,!0,!1)},traverseTwoPhase:function(e,t,n){e&&(v("",e,t,n,!0,!1),v(e,"",t,n,!1,!0))},traverseAncestors:function(e,t,n){v("",e,t,n,!0,!1)},_getFirstCommonAncestorID:d,_getNextDescendantID:p,isAncestorIDOf:c,SEPARATOR:s};t.exports=m},{"./ReactRootIndex":67,"./invariant":112}],54:[function(e,t,n){var r=e("./adler32"),i={CHECKSUM_ATTR_NAME:"data-react-checksum",addChecksumToMarkup:function(e){var t=r(e);return e.replace(">"," "+i.CHECKSUM_ATTR_NAME+'="'+t+'">')},canReuseMarkup:function(e,t){var n=t.getAttribute(i.CHECKSUM_ATTR_NAME);n=n&&parseInt(n,10);var s=r(e);return s===n}};t.exports=i},{"./adler32":88}],55:[function(e,t,n){function E(e){var t=a(e);return t&&M.getID(t)}function S(e){var t=x(e);if(t)if(d.hasOwnProperty(t)){var n=d[t];n!==e&&(l(!C(n,t),"ReactMount: Two valid but unequal nodes with the same `%s`: %s",p,t),d[t]=e)}else d[t]=e;return t}function x(e){return e&&e.getAttribute&&e.getAttribute(p)||""}function T(e,t){var n=x(e);n!==t&&delete d[n],e.setAttribute(p,t),d[t]=e}function N(e){if(!d.hasOwnProperty(e)||!C(d[e],e))d[e]=M.findReactNodeByID(e);return d[e]}function C(e,t){if(e){l(x(e)===t,"ReactMount: Unexpected modification of `%s`",p);var n=M.findReactContainerForID(t);if(n&&u(n,e))return!0}return!1}function k(e){delete d[e]}function A(e){var t=d[e];if(!t||!C(t,e))return!1;L=t}function O(e){L=null,s.traverseAncestors(e,A);var t=L;return L=null,t}var r=e("./DOMProperty"),i=e("./ReactEventEmitter"),s=e("./ReactInstanceHandles"),o=e("./ReactPerf"),u=e("./containsNode"),a=e("./getReactRootElementInContainer"),f=e("./instantiateReactComponent"),l=e("./invariant"),c=e("./shouldUpdateReactComponent"),h=s.SEPARATOR,p=r.ID_ATTRIBUTE_NAME,d={},v=1,m=9,g={},y={},b={},w=[],L=null,M={totalInstantiationTime:0,totalInjectionTime:0,useTouchEvents:!1,_instancesByReactRootID:g,scrollMonitor:function(e,t){t()},_updateRootComponent:function(e,t,n,r){var i=t.props;return M.scrollMonitor(n,function(){e.replaceProps(i,r)}),b[E(n)]=a(n),e},_registerComponent:function(e,t){l(t&&(t.nodeType===v||t.nodeType===m),"_registerComponent(...): Target container is not a DOM element."),i.ensureScrollValueMonitoring();var n=M.registerContainer(t);return g[n]=e,n},_renderNewRootComponent:o.measure("ReactMount","_renderNewRootComponent",function(e,t,n){var r=f(e),i=M._registerComponent(r,t);return r.mountComponentIntoNode(i,t,n),b[i]=a(t),r}),renderComponent:function(e,t,n){var r=g[E(t)];if(r){if(c(r,e))return M._updateRootComponent(r,e,t,n);M.unmountComponentAtNode(t)}var i=a(t),s=i&&M.isRenderedByReact(i),o=s&&!r,u=M._renderNewRootComponent(e,t,o);return n&&n.call(u),u},constructAndRenderComponent:function(e,t,n){return M.renderComponent(e(t),n)},constructAndRenderComponentByID:function(e,t,n){var r=document.getElementById(n);return l(r,'Tried to get element with id of "%s" but it is not present on the page.',n),M.constructAndRenderComponent(e,t,r)},registerContainer:function(e){var t=E(e);return t&&(t=s.getReactRootIDFromNodeID(t)),t||(t=s.createReactRootID()),y[t]=e,t},unmountComponentAtNode:function(e){var t=E(e),n=g[t];return n?(M.unmountComponentFromNode(n,e),delete g[t],delete y[t],delete b[t],!0):!1},unmountComponentFromNode:function(e,t){e.unmountComponent(),t.nodeType===m&&(t=t.documentElement);while(t.lastChild)t.removeChild(t.lastChild)},findReactContainerForID:function(e){var t=s.getReactRootIDFromNodeID(e),n=y[t],r=b[t];if(r&&r.parentNode!==n){l(x(r)===t,"ReactMount: Root element ID differed from reactRootID.");var i=n.firstChild;i&&t===x(i)?b[t]=i:console.warn("ReactMount: Root element has been removed from its original container. New container:",r.parentNode)}return n},findReactNodeByID:function(e){var t=M.findReactContainerForID(e);return M.findComponentRoot(t,e)},isRenderedByReact:function(e){if(e.nodeType!==1)return!1;var t=M.getID(e);return t?t.charAt(0)===h:!1},getFirstReactDOM:function(e){var t=e;while(t&&t.parentNode!==t){if(M.isRenderedByReact(t))return t;t=t.parentNode}return null},findComponentRoot:function(e,t){var n=w,r=0,i=O(t)||e;n[0]=i.firstChild,n.length=1;while(r<n.length){var o=n[r++],u;while(o){var a=M.getID(o);a?t===a?u=o:s.isAncestorIDOf(a,t)&&(n.length=r=0,n.push(o.firstChild)):n.push(o.firstChild),o=o.nextSibling}if(u)return n.length=0,u}n.length=0,l(!1,"findComponentRoot(..., %s): Unable to find element. This probably means the DOM was unexpectedly mutated (e.g., by the browser), usually due to forgetting a <tbody> when using tables or nesting <p> or <a> tags. Try inspecting the child nodes of the element with React ID `%s`.",t,M.getID(e))},getReactRootID:E,getID:S,setID:T,getNode:N,purgeID:k};t.exports=M},{"./DOMProperty":8,"./ReactEventEmitter":48,"./ReactInstanceHandles":53,"./ReactPerf":60,"./containsNode":89,"./getReactRootElementInContainer":107,"./instantiateReactComponent":111,"./invariant":112,"./shouldUpdateReactComponent":131}],56:[function(e,t,n){function s(e){this._queue=e||null}var r=e("./PooledClass"),i=e("./mixInto");i(s,{enqueue:function(e,t){this._queue=this._queue||[],this._queue.push({component:e,callback:t})},notifyAll:function(){var e=this._queue;if(e){this._queue=null;for(var t=0,n=e.length;t<n;t++){var r=e[t].component,i=e[t].callback;i.call(r)}e.length=0}},reset:function(){this._queue=null},destructor:function(){this.reset()}}),r.addPoolingTo(s),t.exports=s},{"./PooledClass":23,"./mixInto":124}],57:[function(e,t,n){function c(e,t,n){f.push({parentID:e,parentNode:null,type:i.INSERT_MARKUP,markupIndex:l.push(t)-1,textContent:null,fromIndex:null,toIndex:n})}function h(e,t,n){f.push({parentID:e,parentNode:null,type:i.MOVE_EXISTING,markupIndex:null,textContent:null,fromIndex:t,toIndex:n})}function p(e,t){f.push({parentID:e,parentNode:null,type:i.REMOVE_NODE,markupIndex:null,textContent:null,fromIndex:t,toIndex:null})}function d(e,t){f.push({parentID:e,parentNode:null,type:i.TEXT_CONTENT,markupIndex:null,textContent:t,fromIndex:null,toIndex:null})}function v(){f.length&&(r.BackendIDOperations.dangerouslyProcessChildrenUpdates(f,l),m())}function m(){f.length=0,l.length=0}var r=e("./ReactComponent"),i=e("./ReactMultiChildUpdateTypes"),s=e("./flattenChildren"),o=e("./instantiateReactComponent"),u=e("./shouldUpdateReactComponent"),a=0,f=[],l=[],g={Mixin:{mountChildren:function(e,t){var n=s(e),r=[],i=0;this._renderedChildren=n;for(var u in n){var a=n[u];if(n.hasOwnProperty(u)){var f=o(a);n[u]=f;var l=this._rootNodeID+u,c=f.mountComponent(l,t,this._mountDepth+1);f._mountIndex=i,r.push(c),i++}}return r},updateTextContent:function(e){a++;var t=!0;try{var n=this._renderedChildren;for(var r in n)n.hasOwnProperty(r)&&this._unmountChildByName(n[r],r);this.setTextContent(e),t=!1}finally{a--,a||(t?m():v())}},updateChildren:function(e,t){a++;var n=!0;try{this._updateChildren(e,t),n=!1}finally{a--,a||(n?m():v())}},_updateChildren:function(e,t){var n=s(e),r=this._renderedChildren;if(!n&&!r)return;var i,a=0,f=0;for(i in n){if(!n.hasOwnProperty(i))continue;var l=r&&r[i],c=n[i];if(u(l,c))this.moveChild(l,f,a),a=Math.max(l._mountIndex,a),l.receiveComponent(c,t),l._mountIndex=f;else{l&&(a=Math.max(l._mountIndex,a),this._unmountChildByName(l,i));var h=o(c);this._mountChildByNameAtIndex(h,i,f,t)}f++}for(i in r)r.hasOwnProperty(i)&&(!n||!n[i])&&this._unmountChildByName(r[i],i)},unmountChildren:function(){var e=this._renderedChildren;for(var t in e){var n=e[t];n.unmountComponent&&n.unmountComponent()}this._renderedChildren=null},moveChild:function(e,t,n){e._mountIndex<n&&h(this._rootNodeID,e._mountIndex,t)},createChild:function(e,t){c(this._rootNodeID,t,e._mountIndex)},removeChild:function(e){p(this._rootNodeID,e._mountIndex)},setTextContent:function(e){d(this._rootNodeID,e)},_mountChildByNameAtIndex:function(e,t,n,r){var i=this._rootNodeID+t,s=e.mountComponent(i,r,this._mountDepth+1);e._mountIndex=n,this.createChild(e,s),this._renderedChildren=this._renderedChildren||{},this._renderedChildren[t]=e},_unmountChildByName:function(e,t){r.isValidComponent(e)&&(this.removeChild(e),e._mountIndex=null,e.unmountComponent(),delete this._renderedChildren[t])}}};t.exports=g},{"./ReactComponent":27,"./ReactMultiChildUpdateTypes":58,"./flattenChildren":99,"./instantiateReactComponent":111,"./shouldUpdateReactComponent":131}],58:[function(e,t,n){var r=e("./keyMirror"),i=r({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,TEXT_CONTENT:null});t.exports=i},{"./keyMirror":118}],59:[function(e,t,n){var r=e("./emptyObject"),i=e("./invariant"),s={isValidOwner:function(e){return!!e&&typeof e.attachRef=="function"&&typeof e.detachRef=="function"},addComponentAsRefTo:function(e,t,n){i(s.isValidOwner(n),"addComponentAsRefTo(...): Only a ReactOwner can have refs. This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."),n.attachRef(t,e)},removeComponentAsRefFrom:function(e,t,n){i(s.isValidOwner(n),"removeComponentAsRefFrom(...): Only a ReactOwner can have refs. This usually means that you're trying to remove a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref."),n.refs[t]===e&&n.detachRef(t)},Mixin:{construct:function(){this.refs=r},attachRef:function(e,t){i(t.isOwnedBy(this),"attachRef(%s, ...): Only a component's owner can store a ref to it.",e);var n=this.refs===r?this.refs={}:this.refs;n[e]=t},detachRef:function(e){delete this.refs[e]}}};t.exports=s},{"./emptyObject":97,"./invariant":112}],60:[function(e,t,n){function i(e,t,n){return n}var r={enableMeasure:!1,storedMeasure:i,measure:function(e,t,n){var i=null;return function(){return r.enableMeasure?(i||(i=r.storedMeasure(e,t,n)),i.apply(this,arguments)):n.apply(this,arguments)}},injection:{injectMeasure:function(e){r.storedMeasure=e}}};t.exports=r},{}],61:[function(e,t,n){function u(e){return function(t,n,r){t.hasOwnProperty(n)?t[n]=e(t[n],r):t[n]=r}}var r=e("./emptyFunction"),i=e("./invariant"),s=e("./joinClasses"),o=e("./merge"),a={children:r,className:u(s),key:r,ref:r,style:u(o)},f={TransferStrategies:a,mergeProps:function(e,t){var n=o(e);for(var r in t){if(!t.hasOwnProperty(r))continue;var i=a[r];i&&a.hasOwnProperty(r)?i(n,r,t[r]):n.hasOwnProperty(r)||(n[r]=t[r])}return n},Mixin:{transferPropsTo:function(e){return i(e._owner===this,"%s: You can't call transferPropsTo() on a component that you don't own, %s. This usually means you are calling transferPropsTo() on a component passed in as props or children.",this.constructor.displayName,e.constructor.displayName),e.props=f.mergeProps(e.props,this.props),e}}};t.exports=f},{"./emptyFunction":96,"./invariant":112,"./joinClasses":117,"./merge":121}],62:[function(e,t,n){var r={};r={prop:"prop",context:"context",childContext:"child context"},t.exports=r},{}],63:[function(e,t,n){var r=e("./keyMirror"),i=r({prop:null,context:null,childContext:null});t.exports=i},{"./keyMirror":118}],64:[function(e,t,n){function f(e){switch(typeof e){case"number":case"string":return!0;case"object":if(Array.isArray(e))return e.every(f);if(r.isValidComponent(e))return!0;for(var t in e)if(!f(e[t]))return!1;return!0;default:return!1}}function l(e){var t=typeof e;return t==="object"&&Array.isArray(e)?"array":t}function c(){function e(e,t,n,r,i){return!0}return w(e)}function h(e){function t(t,n,r,o,u){var a=l(n),f=a===e;return t&&s(f,"Invalid %s `%s` of type `%s` supplied to `%s`, expected `%s`.",i[u],r,a,o,e),f}return w(t)}function p(e){function n(e,n,r,o,u){var a=t[n];return e&&s(a,"Invalid %s `%s` supplied to `%s`, expected one of %s.",i[u],r,o,JSON.stringify(Object.keys(t))),a}var t=o(e);return w(n)}function d(e){function t(t,n,r,o,u){var a=l(n),f=a==="object";if(f)for(var c in e){var h=e[c];if(h&&!h(n,c,o,u))return!1}return t&&s(f,"Invalid %s `%s` of type `%s` supplied to `%s`, expected `object`.",i[u],r,a,o),f}return w(t)}function v(e){function t(t,n,r,o,u){var f=n instanceof e;return t&&s(f,"Invalid %s `%s` supplied to `%s`, expected instance of `%s`.",i[u],r,o,e.name||a),f}return w(t)}function m(e){function t(t,n,r,o,u){var a=Array.isArray(n);if(a)for(var f=0;f<n.length;f++)if(!e(n,f,o,u))return!1;return t&&s(a,"Invalid %s `%s` supplied to `%s`, expected an array.",i[u],r,o),a}return w(t)}function g(){function e(e,t,n,r,o){var u=f(t);return e&&s(u,"Invalid %s `%s` supplied to `%s`, expected a renderable prop.",i[o],n,r),u}return w(e)}function y(){function e(e,t,n,o,u){var a=r.isValidComponent(t);return e&&s(a,"Invalid %s `%s` supplied to `%s`, expected a React component.",i[u],n,o),a}return w(e)}function b(e){return function(t,n,r,o){var u=!1;for(var f=0;f<e.length;f++){var l=e[f];typeof l.weak=="function"&&(l=l.weak);if(l(t,n,r,o)){u=!0;break}}return s(u,"Invalid %s `%s` supplied to `%s`.",i[o],n,r||a),u}}function w(e){function t(t,n,r,o,u,f){var l=r[o];if(l!=null)return e(n,l,o,u||a,f);var c=!t;return n&&s(c,"Required %s `%s` was not specified in `%s`.",i[f],o,u||a),c}var n=t.bind(null,!1,!0);return n.weak=t.bind(null,!1,!1),n.isRequired=t.bind(null,!0,!0),n.weak.isRequired=t.bind(null,!0,!1),n.isRequired.weak=n.weak.isRequired,n}var r=e("./ReactComponent"),i=e("./ReactPropTypeLocationNames"),s=e("./warning"),o=e("./createObjectFrom"),u={array:h("array"),bool:h("boolean"),func:h("function"),number:h("number"),object:h("object"),string:h("string"),shape:d,oneOf:p,oneOfType:b,arrayOf:m,instanceOf:v,renderable:g(),component:y(),any:c()},a="<<anonymous>>";t.exports=u},{"./ReactComponent":27,"./ReactPropTypeLocationNames":62,"./createObjectFrom":94,"./warning":134}],65:[function(e,t,n){function o(){this.listenersToPut=[]}var r=e("./PooledClass"),i=e("./ReactEventEmitter"),s=e("./mixInto");s(o,{enqueuePutListener:function(e,t,n){this.listenersToPut.push({rootNodeID:e,propKey:t,propValue:n})},putListeners:function(){for(var e=0;e<this.listenersToPut.length;e++){var t=this.listenersToPut[e];i.putListener(t.rootNodeID,t.propKey,t.propValue)}},reset:function(){this.listenersToPut.length=0},destructor:function(){this.reset()}}),r.addPoolingTo(o),t.exports=o},{"./PooledClass":23,"./ReactEventEmitter":48,"./mixInto":124}],66:[function(e,t,n){function v(){this.reinitializeTransaction(),this.renderToStaticMarkup=!1,this.reactMountReady=o.getPooled(null),this.putListenerQueue=u.getPooled()}var r=e("./PooledClass"),i=e("./ReactEventEmitter"),s=e("./ReactInputSelection"),o=e("./ReactMountReady"),u=e("./ReactPutListenerQueue"),a=e("./Transaction"),f=e("./mixInto"),l={initialize:s.getSelectionInformation,close:s.restoreSelection},c={initialize:function(){var e=i.isEnabled();return i.setEnabled(!1),e},close:function(e){i.setEnabled(e)}},h={initialize:function(){this.reactMountReady.reset()},close:function(){this.reactMountReady.notifyAll()}},p={initialize:function(){this.putListenerQueue.reset()},close:function(){this.putListenerQueue.putListeners()}},d=[p,l,c,h],m={getTransactionWrappers:function(){return d},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){o.release(this.reactMountReady),this.reactMountReady=null,u.release(this.putListenerQueue),this.putListenerQueue=null}};f(v,a.Mixin),f(v,m),r.addPoolingTo(v),t.exports=v},{"./PooledClass":23,"./ReactEventEmitter":48,"./ReactInputSelection":52,"./ReactMountReady":56,"./ReactPutListenerQueue":65,"./Transaction":85,"./mixInto":124}],67:[function(e,t,n){var r={injectCreateReactRootIndex:function(e){i.createReactRootIndex=e}},i={createReactRootIndex:null,injection:r};t.exports=i},{}],68:[function(e,t,n){function f(e){a(r.isValidComponent(e),"renderComponentToString(): You must pass a valid ReactComponent."),a(arguments.length!==2||typeof arguments[1]!="function","renderComponentToString(): This function became synchronous and now returns the generated markup. Please remove the second parameter.");var t;try{var n=i.createReactRootID();return t=o.getPooled(!1),t.perform(function(){var r=u(e),i=r.mountComponent(n,t,0);return s.addChecksumToMarkup(i)},null)}finally{o.release(t)}}function l(e){a(r.isValidComponent(e),"renderComponentToStaticMarkup(): You must pass a valid ReactComponent.");var t;try{var n=i.createReactRootID();return t=o.getPooled(!0),t.perform(function(){var r=u(e);return r.mountComponent(n,t,0)},null)}finally{o.release(t)}}var r=e("./ReactComponent"),i=e("./ReactInstanceHandles"),s=e("./ReactMarkupChecksum"),o=e("./ReactServerRenderingTransaction"),u=e("./instantiateReactComponent"),a=e("./invariant");t.exports={renderComponentToString:f,renderComponentToStaticMarkup:l}},{"./ReactComponent":27,"./ReactInstanceHandles":53,"./ReactMarkupChecksum":54,"./ReactServerRenderingTransaction":69,"./instantiateReactComponent":111,"./invariant":112}],69:[function(e,t,n){function h(e){this.reinitializeTransaction(),this.renderToStaticMarkup=e,this.reactMountReady=i.getPooled(null),this.putListenerQueue=s.getPooled()}var r=e("./PooledClass"),i=e("./ReactMountReady"),s=e("./ReactPutListenerQueue"),o=e("./Transaction"),u=e("./emptyFunction"),a=e("./mixInto"),f={initialize:function(){this.reactMountReady.reset()},close:u},l={initialize:function(){this.putListenerQueue.reset()},close:u},c=[l,f],p={getTransactionWrappers:function(){return c},getReactMountReady:function(){return this.reactMountReady},getPutListenerQueue:function(){return this.putListenerQueue},destructor:function(){i.release(this.reactMountReady),this.reactMountReady=null,s.release(this.putListenerQueue),this.putListenerQueue=null}};a(h,o.Mixin),a(h,p),r.addPoolingTo(h),t.exports=h},{"./PooledClass":23,"./ReactMountReady":56,"./ReactPutListenerQueue":65,"./Transaction":85,"./emptyFunction":96,"./mixInto":124}],70:[function(e,t,n){var r=e("./DOMPropertyOperations"),i=e("./ReactBrowserComponentMixin"),s=e("./ReactComponent"),o=e("./escapeTextForBrowser"),u=e("./mixInto"),a=function(e){this.construct({text:e})};a.ConvenienceConstructor=function(e){return new a(e.text)},u(a,s.Mixin),u(a,i),u(a,{mountComponent:function(e,t,n){s.Mixin.mountComponent.call(this,e,t,n);var i=o(this.props.text);return t.renderToStaticMarkup?i:"<span "+r.createMarkupForID(e)+">"+i+"</span>"},receiveComponent:function(e,t){var n=e.props;n.text!==this.props.text&&(this.props.text=n.text,s.BackendIDOperations.updateTextContentByID(this._rootNodeID,n.text))}}),a.type=a,a.prototype.type=a,t.exports=a},{"./DOMPropertyOperations":9,"./ReactBrowserComponentMixin":25,"./ReactComponent":27,"./escapeTextForBrowser":98,"./mixInto":124}],71:[function(e,t,n){function u(){i(o,"ReactUpdates: must inject a batching strategy")}function a(e,t){u(),o.batchedUpdates(e,t)}function f(e,t){return e._mountDepth-t._mountDepth}function l(){s.sort(f);for(var e=0;e<s.length;e++){var t=s[e];if(t.isMounted()){var n=t._pendingCallbacks;t._pendingCallbacks=null,t.performUpdateIfNecessary();if(n)for(var r=0;r<n.length;r++)n[r].call(t)}}}function c(){s.length=0}function p(e,t){i(!t||typeof t=="function","enqueueUpdate(...): You called `setProps`, `replaceProps`, `setState`, `replaceState`, or `forceUpdate` with a callback that isn't callable."),u();if(!o.isBatchingUpdates){e.performUpdateIfNecessary(),t&&t.call(e);return}s.push(e),t&&(e._pendingCallbacks?e._pendingCallbacks.push(t):e._pendingCallbacks=[t])}var r=e("./ReactPerf"),i=e("./invariant"),s=[],o=null,h=r.measure("ReactUpdates","flushBatchedUpdates",function(){try{l()}finally{c()}}),d={injectBatchingStrategy:function(e){i(e,"ReactUpdates: must provide a batching strategy"),i(typeof e.batchedUpdates=="function","ReactUpdates: must provide a batchedUpdates() function"),i(typeof e.isBatchingUpdates=="boolean","ReactUpdates: must provide an isBatchingUpdates boolean attribute"),o=e}},v={batchedUpdates:a,enqueueUpdate:p,flushBatchedUpdates:h,injection:d};t.exports=v},{"./ReactPerf":60,"./invariant":112}],72:[function(e,t,n){function g(e){if("selectionStart"in e&&s.hasSelectionCapabilities(e))return{start:e.selectionStart,end:e.selectionEnd};if(document.selection){var t=document.selection.createRange();return{parentElement:t.parentElement(),text:t.text,top:t.boundingTop,left:t.boundingLeft}}var n=window.getSelection();return{anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}}function y(e){if(m||p==null||p!=u())return;var t=g(p);if(!v||!l(v,t)){v=t;var n=o.getPooled(h.select,d,e);return n.type="select",n.target=p,i.accumulateTwoPhaseDispatches(n),n}}var r=e("./EventConstants"),i=e("./EventPropagators"),s=e("./ReactInputSelection"),o=e("./SyntheticEvent"),u=e("./getActiveElement"),a=e("./isTextInputElement"),f=e("./keyOf"),l=e("./shallowEqual"),c=r.topLevelTypes,h={select:{phasedRegistrationNames:{bubbled:f({onSelect:null}),captured:f({onSelectCapture:null})},dependencies:[c.topBlur,c.topContextMenu,c.topFocus,c.topKeyDown,c.topMouseDown,c.topMouseUp,c.topSelectionChange]}},p=null,d=null,v=null,m=!1,b={eventTypes:h,extractEvents:function(e,t,n,r){switch(e){case c.topFocus:if(a(t)||t.contentEditable==="true")p=t,d=n,v=null;break;case c.topBlur:p=null,d=null,v=null;break;case c.topMouseDown:m=!0;break;case c.topContextMenu:case c.topMouseUp:return m=!1,y(r);case c.topSelectionChange:case c.topKeyDown:case c.topKeyUp:return y(r)}}};t.exports=b},{"./EventConstants":14,"./EventPropagators":19,"./ReactInputSelection":52,"./SyntheticEvent":78,"./getActiveElement":102,"./isTextInputElement":115,"./keyOf":119,"./shallowEqual":130}],73:[function(e,t,n){var r=Math.pow(2,53),i={createReactRootIndex:function(){return Math.ceil(Math.random()*r)}};t.exports=i},{}],74:[function(e,t,n){var r=e("./EventConstants"),i=e("./EventPluginUtils"),s=e("./EventPropagators"),o=e("./SyntheticClipboardEvent"),u=e("./SyntheticEvent"),a=e("./SyntheticFocusEvent"),f=e("./SyntheticKeyboardEvent"),l=e("./SyntheticMouseEvent"),c=e("./SyntheticDragEvent"),h=e("./SyntheticTouchEvent"),p=e("./SyntheticUIEvent"),d=e("./SyntheticWheelEvent"),v=e("./invariant"),m=e("./keyOf"),g=r.topLevelTypes,y={blur:{phasedRegistrationNames:{bubbled:m({onBlur:!0}),captured:m({onBlurCapture:!0})}},click:{phasedRegistrationNames:{bubbled:m({onClick:!0}),captured:m({onClickCapture:!0})}},contextMenu:{phasedRegistrationNames:{bubbled:m({onContextMenu:!0}),captured:m({onContextMenuCapture:!0})}},copy:{phasedRegistrationNames:{bubbled:m({onCopy:!0}),captured:m({onCopyCapture:!0})}},cut:{phasedRegistrationNames:{bubbled:m({onCut:!0}),captured:m({onCutCapture:!0})}},doubleClick:{phasedRegistrationNames:{bubbled:m({onDoubleClick:!0}),captured:m({onDoubleClickCapture:!0})}},drag:{phasedRegistrationNames:{bubbled:m({onDrag:!0}),captured:m({onDragCapture:!0})}},dragEnd:{phasedRegistrationNames:{bubbled:m({onDragEnd:!0}),captured:m({onDragEndCapture:!0})}},dragEnter:{phasedRegistrationNames:{bubbled:m({onDragEnter:!0}),captured:m({onDragEnterCapture:!0})}},dragExit:{phasedRegistrationNames:{bubbled:m({onDragExit:!0}),captured:m({onDragExitCapture:!0})}},dragLeave:{phasedRegistrationNames:{bubbled:m({onDragLeave:!0}),captured:m({onDragLeaveCapture:!0})}},dragOver:{phasedRegistrationNames:{bubbled:m({onDragOver:!0}),captured:m({onDragOverCapture:!0})}},dragStart:{phasedRegistrationNames:{bubbled:m({onDragStart:!0}),captured:m({onDragStartCapture:!0})}},drop:{phasedRegistrationNames:{bubbled:m({onDrop:!0}),captured:m({onDropCapture:!0})}},focus:{phasedRegistrationNames:{bubbled:m({onFocus:!0}),captured:m({onFocusCapture:!0})}},input:{phasedRegistrationNames:{bubbled:m({onInput:!0}),captured:m({onInputCapture:!0})}},keyDown:{phasedRegistrationNames:{bubbled:m({onKeyDown:!0}),captured:m({onKeyDownCapture:!0})}},keyPress:{phasedRegistrationNames:{bubbled:m({onKeyPress:!0}),captured:m({onKeyPressCapture:!0})}},keyUp:{phasedRegistrationNames:{bubbled:m({onKeyUp:!0}),captured:m({onKeyUpCapture:!0})}},load:{phasedRegistrationNames:{bubbled:m({onLoad:!0}),captured:m({onLoadCapture:!0})}},error:{phasedRegistrationNames:{bubbled:m({onError:!0}),captured:m({onErrorCapture:!0})}},mouseDown:{phasedRegistrationNames:{bubbled:m({onMouseDown:!0}),captured:m({onMouseDownCapture:!0})}},mouseMove:{phasedRegistrationNames:{bubbled:m({onMouseMove:!0}),captured:m({onMouseMoveCapture:!0})}},mouseOut:{phasedRegistrationNames:{bubbled:m({onMouseOut:!0}),captured:m({onMouseOutCapture:!0})}},mouseOver:{phasedRegistrationNames:{bubbled:m({onMouseOver:!0}),captured:m({onMouseOverCapture:!0})}},mouseUp:{phasedRegistrationNames:{bubbled:m({onMouseUp:!0}),captured:m({onMouseUpCapture:!0})}},paste:{phasedRegistrationNames:{bubbled:m({onPaste:!0}),captured:m({onPasteCapture:!0})}},reset:{phasedRegistrationNames:{bubbled:m({onReset:!0}),captured:m({onResetCapture:!0})}},scroll:{phasedRegistrationNames:{bubbled:m({onScroll:!0}),captured:m({onScrollCapture:!0})}},submit:{phasedRegistrationNames:{bubbled:m({onSubmit:!0}),captured:m({onSubmitCapture:!0})}},touchCancel:{phasedRegistrationNames:{bubbled:m({onTouchCancel:!0}),captured:m({onTouchCancelCapture:!0})}},touchEnd:{phasedRegistrationNames:{bubbled:m({onTouchEnd:!0}),captured:m({onTouchEndCapture:!0})}},touchMove:{phasedRegistrationNames:{bubbled:m({onTouchMove:!0}),captured:m({onTouchMoveCapture:!0})}},touchStart:{phasedRegistrationNames:{bubbled:m({onTouchStart:!0}),captured:m({onTouchStartCapture:!0})}},wheel:{phasedRegistrationNames:{bubbled:m({onWheel:!0}),captured:m({onWheelCapture:!0})}}},b={topBlur:y.blur,topClick:y.click,topContextMenu:y.contextMenu,topCopy:y.copy,topCut:y.cut,topDoubleClick:y.doubleClick,topDrag:y.drag,topDragEnd:y.dragEnd,topDragEnter:y.dragEnter,topDragExit:y.dragExit,topDragLeave:y.dragLeave,topDragOver:y.dragOver,topDragStart:y.dragStart,topDrop:y.drop,topError:y.error,topFocus:y.focus,topInput:y.input,topKeyDown:y.keyDown,topKeyPress:y.keyPress,topKeyUp:y.keyUp,topLoad:y.load,topMouseDown:y.mouseDown,topMouseMove:y.mouseMove,topMouseOut:y.mouseOut,topMouseOver:y.mouseOver,topMouseUp:y.mouseUp,topPaste:y.paste,topReset:y.reset,topScroll:y.scroll,topSubmit:y.submit,topTouchCancel:y.touchCancel,topTouchEnd:y.touchEnd,topTouchMove:y.touchMove,topTouchStart:y.touchStart,topWheel:y.wheel};for(var w in b)b[w].dependencies=[w];var E={eventTypes:y,executeDispatch:function(e,t,n){var r=i.executeDispatch(e,t,n);r===!1&&(e.stopPropagation(),e.preventDefault())},extractEvents:function(e,t,n,r){var i=b[e];if(!i)return null;var m;switch(e){case g.topInput:case g.topLoad:case g.topError:case g.topReset:case g.topSubmit:m=u;break;case g.topKeyDown:case g.topKeyPress:case g.topKeyUp:m=f;break;case g.topBlur:case g.topFocus:m=a;break;case g.topClick:if(r.button===2)return null;case g.topContextMenu:case g.topDoubleClick:case g.topMouseDown:case g.topMouseMove:case g.topMouseOut:case g.topMouseOver:case g.topMouseUp:m=l;break;case g.topDrag:case g.topDragEnd:case g.topDragEnter:case g.topDragExit:case g.topDragLeave:case g.topDragOver:case g.topDragStart:case g.topDrop:m=c;break;case g.topTouchCancel:case g.topTouchEnd:case g.topTouchMove:case g.topTouchStart:m=h;break;case g.topScroll:m=p;break;case g.topWheel:m=d;break;case g.topCopy:case g.topCut:case g.topPaste:m=o}v(m,"SimpleEventPlugin: Unhandled event type, `%s`.",e);var y=m.getPooled(i,n,r);return s.accumulateTwoPhaseDispatches(y),y}};t.exports=E},{"./EventConstants":14,"./EventPluginUtils":18,"./EventPropagators":19,"./SyntheticClipboardEvent":75,"./SyntheticDragEvent":77,"./SyntheticEvent":78,"./SyntheticFocusEvent":79,"./SyntheticKeyboardEvent":80,"./SyntheticMouseEvent":81,"./SyntheticTouchEvent":82,"./SyntheticUIEvent":83,"./SyntheticWheelEvent":84,"./invariant":112,"./keyOf":119}],75:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),i={clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}};r.augmentClass(s,i),t.exports=s},{"./SyntheticEvent":78}],76:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),i={data:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticEvent":78}],77:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticMouseEvent"),i={dataTransfer:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticMouseEvent":81}],78:[function(e,t,n){function f(e,t,n){this.dispatchConfig=e,this.dispatchMarker=t,this.nativeEvent=n;var r=this.constructor.Interface;for(var s in r){if(!r.hasOwnProperty(s))continue;var o=r[s];o?this[s]=o(n):this[s]=n[s]}var u=n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1;u?this.isDefaultPrevented=i.thatReturnsTrue:this.isDefaultPrevented=i.thatReturnsFalse,this.isPropagationStopped=i.thatReturnsFalse}var r=e("./PooledClass"),i=e("./emptyFunction"),s=e("./getEventTarget"),o=e("./merge"),u=e("./mergeInto"),a={type:null,target:s,currentTarget:i.thatReturnsNull,eventPhase:null,bubbles:null,cancelable:null,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};u(f.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e.preventDefault?e.preventDefault():e.returnValue=!1,this.isDefaultPrevented=i.thatReturnsTrue},stopPropagation:function(){var e=this.nativeEvent;e.stopPropagation?e.stopPropagation():e.cancelBubble=!0,this.isPropagationStopped=i.thatReturnsTrue},persist:function(){this.isPersistent=i.thatReturnsTrue},isPersistent:i.thatReturnsFalse,destructor:function(){var e=this.constructor.Interface;for(var t in e)this[t]=null;this.dispatchConfig=null,this.dispatchMarker=null,this.nativeEvent=null}}),f.Interface=a,f.augmentClass=function(e,t){var n=this,i=Object.create(n.prototype);u(i,e.prototype),e.prototype=i,e.prototype.constructor=e,e.Interface=o(n.Interface,t),e.augmentClass=n.augmentClass,r.addPoolingTo(e,r.threeArgumentPooler)},r.addPoolingTo(f,r.threeArgumentPooler),t.exports=f},{"./PooledClass":23,"./emptyFunction":96,"./getEventTarget":104,"./merge":121,"./mergeInto":123}],79:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),i={relatedTarget:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticUIEvent":83}],80:[function(e,t,n){function o(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),i=e("./getEventKey"),s={key:i,location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,"char":null,charCode:null,keyCode:null,which:null};r.augmentClass(o,s),t.exports=o},{"./SyntheticUIEvent":83,"./getEventKey":103}],81:[function(e,t,n){function o(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),i=e("./ViewportMetrics"),s={screenX:null,screenY:null,clientX:null,clientY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,button:function(e){var t=e.button;return"which"in e?t:t===2?2:t===4?1:0},buttons:null,relatedTarget:function(e){return e.relatedTarget||(e.fromElement===e.srcElement?e.toElement:e.fromElement)},pageX:function(e){return"pageX"in e?e.pageX:e.clientX+i.currentScrollLeft},pageY:function(e){return"pageY"in e?e.pageY:e.clientY+i.currentScrollTop}};r.augmentClass(o,s),t.exports=o},{"./SyntheticUIEvent":83,"./ViewportMetrics":86}],82:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticUIEvent"),i={touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticUIEvent":83}],83:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticEvent"),i={view:null,detail:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticEvent":78}],84:[function(e,t,n){function s(e,t,n){r.call(this,e,t,n)}var r=e("./SyntheticMouseEvent"),i={deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:null,deltaMode:null};r.augmentClass(s,i),t.exports=s},{"./SyntheticMouseEvent":81}],85:[function(e,t,n){var r=e("./invariant"),i={reinitializeTransaction:function(){this.transactionWrappers=this.getTransactionWrappers(),this.wrapperInitData?this.wrapperInitData.length=0:this.wrapperInitData=[],this.timingMetrics||(this.timingMetrics={}),this.timingMetrics.methodInvocationTime=0,this.timingMetrics.wrapperInitTimes?this.timingMetrics.wrapperInitTimes.length=0:this.timingMetrics.wrapperInitTimes=[],this.timingMetrics.wrapperCloseTimes?this.timingMetrics.wrapperCloseTimes.length=0:this.timingMetrics.wrapperCloseTimes=[],this._isInTransaction=!1},_isInTransaction:!1,getTransactionWrappers:null,isInTransaction:function(){return!!this._isInTransaction},perform:function(e,t,n,i,s,o,u,a){r(!this.isInTransaction(),"Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.");var f=Date.now(),l,c;try{this._isInTransaction=!0,l=!0,this.initializeAll(0),c=e.call(t,n,i,s,o,u,a),l=!1}finally{var h=Date.now();this.methodInvocationTime+=h-f;try{if(l)try{this.closeAll(0)}catch(p){}else this.closeAll(0)}finally{this._isInTransaction=!1}}return c},initializeAll:function(e){var t=this.transactionWrappers,n=this.timingMetrics.wrapperInitTimes;for(var r=e;r<t.length;r++){var i=Date.now(),o=t[r];try{this.wrapperInitData[r]=s.OBSERVED_ERROR,this.wrapperInitData[r]=o.initialize?o.initialize.call(this):null}finally{var u=n[r],a=Date.now();n[r]=(u||0)+(a-i);if(this.wrapperInitData[r]===s.OBSERVED_ERROR)try{this.initializeAll(r+1)}catch(f){}}}},closeAll:function(e){r(this.isInTransaction(),"Transaction.closeAll(): Cannot close transaction when none are open.");var t=this.transactionWrappers,n=this.timingMetrics.wrapperCloseTimes;for(var i=e;i<t.length;i++){var o=t[i],u=Date.now(),a=this.wrapperInitData[i],f;try{f=!0,a!==s.OBSERVED_ERROR&&o.close&&o.close.call(this,a),f=!1}finally{var l=Date.now(),c=n[i];n[i]=(c||0)+(l-u);if(f)try{this.closeAll(i+1)}catch(h){}}}this.wrapperInitData.length=0}},s={Mixin:i,OBSERVED_ERROR:{}};t.exports=s},{"./invariant":112}],86:[function(e,t,n){var r=e("./getUnboundedScrollPosition"),i={currentScrollLeft:0,currentScrollTop:0,refreshScrollValues:function(){var e=r(window);i.currentScrollLeft=e.x,i.currentScrollTop=e.y}};t.exports=i},{"./getUnboundedScrollPosition":109}],87:[function(e,t,n){function i(e,t){r(t!=null,"accumulate(...): Accumulated items must be not be null or undefined.");if(e==null)return t;var n=Array.isArray(e),i=Array.isArray(t);return n?e.concat(t):i?[e].concat(t):[e,t]}var r=e("./invariant");t.exports=i},{"./invariant":112}],88:[function(e,t,n){function i(e){var t=1,n=0;for(var i=0;i<e.length;i++)t=(t+e.charCodeAt(i))%r,n=(n+t)%r;return t|n<<16}var r=65521;t.exports=i},{}],89:[function(e,t,n){function i(e,t){return!e||!t?!1:e===t?!0:r(e)?!1:r(t)?i(e,t.parentNode):e.contains?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1}var r=e("./isTextNode");t.exports=i},{"./isTextNode":116}],90:[function(e,t,n){function r(e,t,n,r,i,s,o){e=e||{};if(o)throw new Error("Too many arguments passed to copyProperties");var u=[t,n,r,i,s],a=0,f;while(u[a]){f=u[a++];for(var l in f)e[l]=f[l];f.hasOwnProperty&&f.hasOwnProperty("toString")&&typeof f.toString!="undefined"&&e.toString!==f.toString&&(e.toString=f.toString)}return e}t.exports=r},{}],91:[function(e,t,n){function i(e){return!!e&&(typeof e=="object"||typeof e=="function")&&"length"in e&&!("setInterval"in e)&&typeof e.nodeType!="number"&&(Array.isArray(e)||"callee"in e||"item"in e)}function s(e){return i(e)?Array.isArray(e)?e.slice():r(e):[e]}var r=e("./toArray");t.exports=s},{"./toArray":132}],92:[function(e,t,n){function s(e){var t=r.createClass({displayName:"ReactFullPageComponent"+(e.componentConstructor.displayName||""),componentWillUnmount:function(){i(!1,"%s tried to unmount. Because of cross-browser quirks it is impossible to unmount some top-level components (eg <html>, <head>, and <body>) reliably and efficiently. To fix this, have a single top-level component that never unmounts render these elements.",this.constructor.displayName)},render:function(){return this.transferPropsTo(e(null,this.props.children))}});return t}var r=e("./ReactCompositeComponent"),i=e("./invariant");t.exports=s},{"./ReactCompositeComponent":29,"./invariant":112}],93:[function(e,t,n){function f(e){var t=e.match(a);return t&&t[1].toLowerCase()}function l(e,t){var n=u;o(!!u,"createNodesFromMarkup dummy not initialized");var r=f(e),a=r&&s(r);if(a){n.innerHTML=a[1]+e+a[2];var l=a[0];while(l--)n=n.lastChild}else n.innerHTML=e;var c=n.getElementsByTagName("script");c.length&&(o(t,"createNodesFromMarkup(...): Unexpected <script> element rendered."),i(c).forEach(t));var h=i(n.childNodes);while(n.lastChild)n.removeChild(n.lastChild);return h}var r=e("./ExecutionEnvironment"),i=e("./createArrayFrom"),s=e("./getMarkupWrap"),o=e("./invariant"),u=r.canUseDOM?document.createElement("div"):null,a=/^\s*<(\w+)/;t.exports=l},{"./ExecutionEnvironment":20,"./createArrayFrom":91,"./getMarkupWrap":105,"./invariant":112}],94:[function(e,t,n){function r(e,t){if(!Array.isArray(e))throw new TypeError("Must pass an array of keys.");var n={},r=Array.isArray(t);typeof t=="undefined"&&(t=!0);for(var i=e.length;i--;)n[e[i]]=r?t[i]:t;return n}t.exports=r},{}],95:[function(e,t,n){function i(e,t){var n=t==null||typeof t=="boolean"||t==="";if(n)return"";var i=isNaN(t);return i||t===0||r.isUnitlessNumber[e]?""+t:t+"px"}var r=e("./CSSProperty");t.exports=i},{"./CSSProperty":2}],96:[function(e,t,n){function i(e){return function(){return e}}function s(){}var r=e("./copyProperties");r(s,{thatReturns:i,thatReturnsFalse:i(!1),thatReturnsTrue:i(!0),thatReturnsNull:i(null),thatReturnsThis:function(){return this},thatReturnsArgument:function(e){return e}}),t.exports=s},{"./copyProperties":90}],97:[function(e,t,n){var r={};Object.freeze(r),t.exports=r},{}],98:[function(e,t,n){function s(e){return r[e]}function o(e){return(""+e).replace(i,s)}var r={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#x27;","/":"&#x2f;"},i=/[&><"'\/]/g;t.exports=o},{}],99:[function(e,t,n){function s(e,t,n){var i=e;r(!i.hasOwnProperty(n),"flattenChildren(...): Encountered two children with the same key, `%s`. Children keys must be unique.",n),t!=null&&(i[n]=t)}function o(e){if(e==null)return e;var t={};return i(e,s,t),t}var r=e("./invariant"),i=e("./traverseAllChildren");t.exports=o},{"./invariant":112,"./traverseAllChildren":133}],100:[function(e,t,n){function r(e){e.disabled||e.focus()}t.exports=r},{}],101:[function(e,t,n){var r=function(e,t,n){Array.isArray(e)?e.forEach(t,n):e&&t.call(n,e)};t.exports=r},{}],102:[function(e,t,n){function r(){try{return document.activeElement||document.body}catch(e){return document.body}}t.exports=r},{}],103:[function(e,t,n){function s(e){return"key"in e?r[e.key]||e.key:i[e.which||e.keyCode]||"Unidentified"}var r={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},i={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};t.exports=s},{}],104:[function(e,t,n){function r(e){var t=e.target||e.srcElement||window;return t.nodeType===3?t.parentNode:t}t.exports=r},{}],105:[function(e,t,n){function h(e){return i(!!s,"Markup wrapping node not initialized"),c.hasOwnProperty(e)||(e="*"),o.hasOwnProperty(e)||(e==="*"?s.innerHTML="<link />":s.innerHTML="<"+e+"></"+e+">",o[e]=!s.firstChild),o[e]?c[e]:null}var r=e("./ExecutionEnvironment"),i=e("./invariant"),s=r.canUseDOM?document.createElement("div"):null,o={circle:!0,defs:!0,g:!0,line:!0,linearGradient:!0,path:!0,polygon:!0,polyline:!0,radialGradient:!0,rect:!0,stop:!0,text:!0},u=[1,'<select multiple="true">',"</select>"],a=[1,"<table>","</table>"],f=[3,"<table><tbody><tr>","</tr></tbody></table>"],l=[1,"<svg>","</svg>"],c={"*":[1,"?<div>","</div>"],area:[1,"<map>","</map>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],legend:[1,"<fieldset>","</fieldset>"],param:[1,"<object>","</object>"],tr:[2,"<table><tbody>","</tbody></table>"],optgroup:u,option:u,caption:a,colgroup:a,tbody:a,tfoot:a,thead:a,td:f,th:f,circle:l,defs:l,g:l,line:l,linearGradient:l,path:l,polygon:l,polyline:l,radialGradient:l,rect:l,stop:l,text:l};t.exports=h},{"./ExecutionEnvironment":20,"./invariant":112}],106:[function(e,t,n){function r(e){while(e&&e.firstChild)e=e.firstChild;return e}function i(e){while(e){if(e.nextSibling)return e.nextSibling;e=e.parentNode}}function s(e,t){var n=r(e),s=0,o=0;while(n){if(n.nodeType==3){o=s+n.textContent.length;if(s<=t&&o>=t)return{node:n,offset:t-s};s=o}n=r(i(n))}}t.exports=s},{}],107:[function(e,t,n){function i(e){return e?e.nodeType===r?e.documentElement:e.firstChild:null}var r=9;t.exports=i},{}],108:[function(e,t,n){function s(){return!i&&r.canUseDOM&&(i="textContent"in document.createElement("div")?"textContent":"innerText"),i}var r=e("./ExecutionEnvironment"),i=null;t.exports=s},{"./ExecutionEnvironment":20}],109:[function(e,t,n){function r(e){return e===window?{x:window.pageXOffset||document.documentElement.scrollLeft,y:window.pageYOffset||document.documentElement.scrollTop}:{x:e.scrollLeft,y:e.scrollTop}}t.exports=r},{}],110:[function(e,t,n){function i(e){return e.replace(r,"-$1").toLowerCase()}var r=/([A-Z])/g;t.exports=i},{}],111:[function(e,t,n){function i(e){return typeof e.constructor=="function"&&typeof e.constructor.prototype.construct=="function"&&typeof e.constructor.prototype.mountComponent=="function"&&typeof e.constructor.prototype.receiveComponent=="function"}function s(e){r(i(e),"Only React Components are valid for mounting.");var t=e.__realComponentInstance||e;return t._descriptor=e,t}var r=e("./warning");t.exports=s},{"./warning":134}],112:[function(e,t,n){var r=function(e){if(!e){var t=new Error("Minified exception occured; use the non-minified dev environment for the full error message and additional helpful warnings.");throw t.framesToPop=1,t}};r=function(e,t,n,r,i,s,o,u){if(t===undefined)throw new Error("invariant requires an error message argument");if(!e){var a=[n,r,i,s,o,u],f=0,l=new Error("Invariant Violation: "+t.replace(/%s/g,function(){return a[f++]}));throw l.framesToPop=1,l}},t.exports=r},{}],113:[function(e,t,n){function s(e,t){if(!r.canUseDOM||t&&!("addEventListener"in document))return!1;var n="on"+e,s=n in document;if(!s){var o=document.createElement("div");o.setAttribute(n,"return;"),s=typeof o[n]=="function"}return!s&&i&&e==="wheel"&&(s=document.implementation.hasFeature("Events.wheel","3.0")),s}var r=e("./ExecutionEnvironment"),i;r.canUseDOM&&(i=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0),t.exports=s},{"./ExecutionEnvironment":20}],114:[function(e,t,n){function r(e){return!!e&&(typeof Node=="function"?e instanceof Node:typeof e=="object"&&typeof e.nodeType=="number"&&typeof e.nodeName=="string")}t.exports=r},{}],115:[function(e,t,n){function i(e){return e&&(e.nodeName==="INPUT"&&r[e.type]||e.nodeName==="TEXTAREA")}var r={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};t.exports=i},{}],116:[function(e,t,n){function i(e){return r(e)&&e.nodeType==3}var r=e("./isNode");t.exports=i},{"./isNode":114}],117:[function(e,t,n){function r(e){e||(e="");var t,n=arguments.length;if(n>1)for(var r=1;r<n;r++)t=arguments[r],t&&(e+=" "+t);return e}t.exports=r},{}],118:[function(e,t,n){var r=e("./invariant"),i=function(e){var t={},n;r(e instanceof Object&&!Array.isArray(e),"keyMirror(...): Argument must be an object.");for(n in e){if(!e.hasOwnProperty(n))continue;t[n]=n}return t};t.exports=i},{"./invariant":112}],119:[function(e,t,n){var r=function(e){var t;for(t in e){if(!e.hasOwnProperty(t))continue;return t}return null};t.exports=r},{}],120:[function(e,t,n){function r(e){var t={};return function(n){return t.hasOwnProperty(n)?t[n]:t[n]=e.call(this,n)}}t.exports=r},{}],121:[function(e,t,n){var r=e("./mergeInto"),i=function(e,t){var n={};return r(n,e),r(n,t),n};t.exports=i},{"./mergeInto":123}],122:[function(e,t,n){var r=e("./invariant"),i=e("./keyMirror"),s=36,o=function(e){return typeof e!="object"||e===null},u={MAX_MERGE_DEPTH:s,isTerminal:o,normalizeMergeArg:function(e){return e===undefined||e===null?{}:e},checkMergeArrayArgs:function(e,t){r(Array.isArray(e)&&Array.isArray(t),"Tried to merge arrays, instead got %s and %s.",e,t)},checkMergeObjectArgs:function(e,t){u.checkMergeObjectArg(e),u.checkMergeObjectArg(t)},checkMergeObjectArg:function(e){r(!o(e)&&!Array.isArray(e),"Tried to merge an object, instead got %s.",e)},checkMergeLevel:function(e){r(e<s,"Maximum deep merge depth exceeded. You may be attempting to merge circular structures in an unsupported way.")},checkArrayStrategy:function(e){r(e===undefined||e in u.ArrayStrategies,"You must provide an array strategy to deep merge functions to instruct the deep merge how to resolve merging two arrays.")},ArrayStrategies:i({Clobber:!0,IndexByIndex:!0})};t.exports=u},{"./invariant":112,"./keyMirror":118}],123:[function(e,t,n){function s(e,t){i(e);if(t!=null){i(t);for(var n in t){if(!t.hasOwnProperty(n))continue;e[n]=t[n]}}}var r=e("./mergeHelpers"),i=r.checkMergeObjectArg;t.exports=s},{"./mergeHelpers":122}],124:[function(e,t,n){var r=function(e,t){var n;for(n in t){if(!t.hasOwnProperty(n))continue;e.prototype[n]=t[n]}};t.exports=r},{}],125:[function(e,t,n){function i(e,t){r(e&&!/[^a-z0-9_]/.test(e),"You must provide an eventName using only the characters [a-z0-9_]")}var r=e("./invariant");t.exports=i},{"./invariant":112}],126:[function(e,t,n){function r(e,t,n){if(!e)return null;var r=0,i={};for(var s in e)e.hasOwnProperty(s)&&(i[s]=t.call(n,e[s],s,r++));return i}t.exports=r},{}],127:[function(e,t,n){function r(e,t,n){if(!e)return null;var r=0,i={};for(var s in e)e.hasOwnProperty(s)&&(i[s]=t.call(n,s,e[s],r++));return i}t.exports=r},{}],128:[function(e,t,n){function s(e){return i(r.isValidComponent(e),"onlyChild must be passed a children with exactly one child."),e}var r=e("./ReactComponent"),i=e("./invariant");t.exports=s},{"./ReactComponent":27,"./invariant":112}],129:[function(e,t,n){var r=e("./ExecutionEnvironment"),i=null;r.canUseDOM&&(i=window.performance||window.webkitPerformance);if(!i||!i.now)i=Date;var s=i.now.bind(i);t.exports=s},{"./ExecutionEnvironment":20}],130:[function(e,t,n){function r(e,t){if(e===t)return!0;var n;for(n in e)if(e.hasOwnProperty(n)&&(!t.hasOwnProperty(n)||e[n]!==t[n]))return!1;for(n in t)if(t.hasOwnProperty(n)&&!e.hasOwnProperty(n))return!1;return!0}t.exports=r},{}],131:[function(e,t,n){function r(e,t){if(e&&t&&e.constructor===t.constructor&&(e.props&&e.props.key)===(t.props&&t.props.key)){if(e._owner===t._owner)return!0;e.state&&console.warn("A recent change to React has been found to impact your code. A mounted component will now be unmounted and replaced by a component (of the same class) if their owners are different. Previously, ownership was not considered when updating.",e,t)}return!1}t.exports=r},{}],132:[function(e,t,n){function i(e){var t=e.length;r(!Array.isArray(e)&&(typeof e=="object"||typeof e=="function"),"toArray: Array-like object expected"),r(typeof t=="number","toArray: Object needs a length property"),r(t===0||t-1 in e,"toArray: Object should have keys for indices");if(e.hasOwnProperty)try{return Array.prototype.slice.call(e)}catch(n){}var i=Array(t);for(var s=0;s<t;s++)i[s]=e[s];return i}var r=e("./invariant");t.exports=i},{"./invariant":112}],133:[function(e,t,n){function l(e){return a[e]}function c(e,t){return e&&e.props&&e.props.key!=null?p(e.props.key):t.toString(36)}function h(e){return(""+e).replace(f,l)}function p(e){return"$"+h(e)}function v(e,t,n){e!==null&&e!==undefined&&d(e,"",0,t,n)}var r=e("./ReactInstanceHandles"),i=e("./ReactTextComponent"),s=e("./invariant"),o=r.SEPARATOR,u=":",a={"=":"=0",".":"=1",":":"=2"},f=/[=.:]/g,d=function(e,t,n,r,a){var f=0;if(Array.isArray(e))for(var l=0;l<e.length;l++){var h=e[l],v=t+(t?u:o)+c(h,l),m=n+f;f+=d(h,v,m,r,a)}else{var g=typeof e,y=t==="",b=y?o+c(e,0):t;if(e==null||g==="boolean")r(a,null,b,n),f=1;else if(e.type&&e.type.prototype&&e.type.prototype.mountComponentIntoNode)r(a,e,b,n),f=1;else if(g==="object"){s(!e||e.nodeType!==1,"traverseAllChildren(...): Encountered an invalid child; DOM elements are not valid children of React components.");for(var w in e)e.hasOwnProperty(w)&&(f+=d(e[w],t+(t?u:o)+p(w)+u+c(e[w],0),n+f,r,a))}else if(g==="string"){var E=new i(e);r(a,E,b,n),f+=1}else if(g==="number"){var S=new i(""+e);r(a,S,b,n),f+=1}}return f};t.exports=v},{"./ReactInstanceHandles":53,"./ReactTextComponent":70,"./invariant":112}],134:[function(e,t,n){var r=e("./emptyFunction"),i=r;i=function(e,t){var n=Array.prototype.slice.call(arguments,2);if(t===undefined)throw new Error("`warning(condition, format, ...args)` requires a warning message argument");if(!e){var r=0;console.warn("Warning: "+t.replace(/%s/g,function(){return n[r++]}))}},t.exports=i},{"./emptyFunction":96}]},{},[24])(24)}),define("mout/lang/toString",[],function(){function e(e){return e==null?"":e.toString()}return e}),define("mout/number/toInt",[],function(){function e(e){return~~e}return e}),define("mout/string/repeat",["../lang/toString","../number/toInt"],function(e,t){function n(n,r){var i="";n=e(n),r=t(r);if(r<1)return"";while(r>0)r%2&&(i+=n),r=Math.floor(r/2),n+=n;return i}return n}),define("mout/string/lpad",["../lang/toString","./repeat"],function(e,t){function n(n,r,i){return n=e(n),i=i||" ",n.length<r?t(i,r-n.length)+n:n}return n}),define("mout/lang/kindOf",[],function(){function r(r){return r===null?"Null":r===n?"Undefined":e.exec(t.call(r))[1]}var e=/^\[object (.*)\]$/,t=Object.prototype.toString,n;return r}),define("mout/lang/isKind",["./kindOf"],function(e){function t(t,n){return e(t)===n}return t}),define("mout/lang/isArray",["./isKind"],function(e){var t=Array.isArray||function(t){return e(t,"Array")};return t}),define("mout/lang/toNumber",["./isArray"],function(e){function t(t){return typeof t=="number"?t:t?typeof t=="string"?parseFloat(t):e(t)?NaN:Number(t):0}return t}),define("mout/number/pad",["../string/lpad","../lang/toNumber"],function(e,t){function n(n,r,i){return n=t(n),e(""+n,r,i||"0")}return n}),define("mout/object/hasOwn",[],function(){function e(e,t){return Object.prototype.hasOwnProperty.call(e,t)}return e}),define("mout/object/forIn",["./hasOwn"],function(e){function r(){n=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],t=!0;for(var e in{toString:null})t=!1}function i(i,o,u){var a,f=0;t==null&&r();for(a in i)if(s(o,i,a,u)===!1)break;if(t){var l=i.constructor,c=!!l&&i===l.prototype;while(a=n[f++])if((a!=="constructor"||!c&&e(i,a))&&i[a]!==Object.prototype[a]&&s(o,i,a,u)===!1)break}}function s(e,t,n,r){return e.call(r,t[n],n,t)}var t,n;return i}),define("mout/object/forOwn",["./hasOwn","./forIn"],function(e,t){function n(n,r,i){t(n,function(t,s){if(e(n,s))return r.call(i,n[s],s,n)})}return n}),define("mout/object/mixIn",["./forOwn"],function(e){function t(t,r){var i=0,s=arguments.length,o;while(++i<s)o=arguments[i],o!=null&&e(o,n,t);return t}function n(e,t){this[t]=e}return t}),define("mout/date/i18n/en-US",[],function(){return{am:"AM",pm:"PM",x:"%m/%d/%y",X:"%H:%M:%S",c:"%a %d %b %Y %I:%M:%S %p %Z",months:["January","February","March","April","May","June","July","August","September","October","November","December"],months_abbr:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],days_abbr:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]}}),define("mout/date/i18n_",["../object/mixIn","./i18n/en-US"],function(e,t){var n=e({},t,{set:function(t){e(n,t)}});return n}),define("mout/lang/isDate",["./isKind"],function(e){function t(t){return e(t,"Date")}return t}),define("mout/date/dayOfTheYear",["../lang/isDate"],function(e){function t(e){return(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())-Date.UTC(e.getFullYear(),0,1))/864e5+1}return t}),define("mout/date/timezoneOffset",["../number/pad"],function(e){function t(t){var n=t.getTimezoneOffset(),r=Math.abs(n),i=e(Math.floor(r/60),2),s=e(r%60,2);return(n>0?"-":"+")+i+s}return t}),define("mout/date/timezoneAbbr",["./timezoneOffset"],function(e){function t(t){var n=/\(([A-Z]{3,4})\)/.exec(t.toString());return n?n[1]:e(t)}return t}),define("mout/date/weekOfTheYear",["./dayOfTheYear"],function(e){function t(t,n){n=n==null?0:n;var r=e(t),i=(7+t.getDay()-n)%7,s=6-n-i;return Math.floor((r+s)/7)}return t}),define("mout/date/strftime",["../number/pad","../string/lpad","./i18n_","./dayOfTheYear","./timezoneOffset","./timezoneAbbr","./weekOfTheYear"],function(e,t,n,r,i,s,o){function a(e,t,r){function s(t){return function(n,i){return t(e,i,r)}}r=r||n;var i=/%([a-z%])/gi;return t.replace(i,s(f)).replace(i,s(l))}function f(e,t,n){if(t in u){var r=u[t];return r==="locale"?n[t]:r}return"%"+t}function l(n,u,a){switch(u){case"a":return a.days_abbr[n.getDay()];case"A":return a.days[n.getDay()];case"h":case"b":return a.months_abbr[n.getMonth()];case"B":return a.months[n.getMonth()];case"C":return e(Math.floor(n.getFullYear()/100),2);case"d":return e(n.getDate(),2);case"e":return e(n.getDate(),2," ");case"H":return e(n.getHours(),2);case"I":return e(n.getHours()%12,2);case"j":return e(r(n),3);case"l":return t(n.getHours()%12,2);case"L":return e(n.getMilliseconds(),3);case"m":return e(n.getMonth()+1,2);case"M":return e(n.getMinutes(),2);case"n":return"\n";case"p":return n.getHours()>=12?a.pm:a.am;case"P":return l(n,"p",a).toLowerCase();case"s":return n.getTime()/1e3;case"S":return e(n.getSeconds(),2);case"t":return"	";case"u":var f=n.getDay();return f===0?7:f;case"U":return e(o(n),2);case"w":return n.getDay();case"W":return e(o(n,1),2);case"y":return e(n.getFullYear()%100,2);case"Y":return e(n.getFullYear(),4);case"z":return i(n);case"Z":return s(n);case"%":return"%";default:return"%"+u}}var u={D:"%m/%d/%y",F:"%Y-%m-%d",r:"%I:%M:%S %p",R:"%H:%M",T:"%H:%M:%S",x:"locale",X:"locale",c:"locale"};return a}),define("views/week_allday",["require","exports","module","react","mout/date/strftime"],function(e,t){var n=e("react"),r=e("mout/date/strftime"),i=n.createClass({displayName:"WeekAllDay",render:function(){var e=this.props.days.map(function(e){function i(e){return r(e,"%a %d")}var t=e.alldayEvents.map(function(e){return n.DOM.li({className:"week-allday-event",key:e.id,"data-id":e.id},e.title)});return n.DOM.section({className:"week-allday",key:e.date},n.DOM.h1({className:"week-allday-date"},i(e.date)),n.DOM.ol({className:"week-allday-events"},t))});return n.DOM.div({className:"week-alldays"},e)}});return i}),define("views/week_sidebar",["require","react"],function(e){var t=e("react"),n=t.createClass({displayName:"WeekSidebarHours",render:function(){var e=[],n=-1;while(++n<24)e.push(t.DOM.li({"data-hour":n,key:n},n));return t.DOM.ol({className:"week-sidebar-hours"},e)}});return n}),define("views/week_days",["require","react"],function(e){var t=e("react"),n=t.createClass({displayName:"WeekDays",render:function(){var e=this.props.days.map(function(e){var n=e.hours.map(function(e,n){var r=e.events.map(function(e){var n={height:e.duration*3+"rem"};return t.DOM.li({className:"week-event",key:e.id,"data-id":e.id,style:n},e.title)});return t.DOM.ol({className:"week-hour","data-hour":n,key:n},r)});return t.DOM.section({className:"week-day","data-date":e.date,key:e.date},t.DOM.section({className:"week-day-hours"},n))});return t.DOM.section({className:"week-days"},e)}});return n}),define("mout/array/indexOf",[],function(){function e(e,t,n){n=n||0;if(e==null)return-1;var r=e.length,i=n<0?r+n:n;while(i<r){if(e[i]===t)return i;i++}return-1}return e}),define("mout/array/remove",["./indexOf"],function(e){function t(t,n){var r=e(t,n);r!==-1&&t.splice(r,1)}return t}),define("mout/math/clamp",[],function(){function e(e,t,n){return e<t?t:e>n?n:e}return e}),define("mout/lang/isPlainObject",[],function(){function e(e){return!!e&&typeof e=="object"&&e.constructor===Object}return e}),define("mout/lang/clone",["./kindOf","./isPlainObject","../object/mixIn"],function(e,t,n){function r(t){switch(e(t)){case"Object":return i(t);case"Array":return u(t);case"RegExp":return s(t);case"Date":return o(t);default:return t}}function i(e){return t(e)?n({},e):e}function s(e){var t="";return t+=e.multiline?"m":"",t+=e.global?"g":"",t+=e.ignorecase?"i":"",new RegExp(e.source,t)}function o(e){return new Date(+e)}function u(e){return e.slice()}return r}),define("mout/date/startOf",["../lang/clone"],function(e){function t(t,n){t=e(t);switch(n){case"year":t.setMonth(0);case"month":t.setDate(1);case"week":case"day":t.setHours(0);case"hour":t.setMinutes(0);case"minute":t.setSeconds(0);case"second":t.setMilliseconds(0);break;default:throw new Error('"'+n+'" is not a valid period')}if(n==="week"){var r=t.getDay(),i=t.getDate();r&&(r>=i&&t.setDate(0),t.setDate(t.getDate()-t.getDay()))}return t}return t}),define("mout/date/isSame",["./startOf"],function(e){function t(t,n,r){return r&&(t=e(t,r),n=e(n,r)),Number(t)===Number(n)}return t}),define("mout/math/round",[],function(){function e(e,t){return t=t||1,Math.round(e/t)*t}return e}),define("mout/function/times",[],function(){function e(e,t,n){var r=-1;while(++r<e)if(t.call(n,r)===!1)break}return e}),function(e){function t(e,t,n,r,i){this._listener=t,this._isOnce=n,this.context=r,this._signal=e,this._priority=i||0}function n(e,t){if(typeof e!="function")throw new Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",t))}function r(){this._bindings=[],this._prevParams=null;var e=this;this.dispatch=function(){r.prototype.dispatch.apply(e,arguments)}}t.prototype={active:!0,params:null,execute:function(e){var t,n;return this.active&&!!this._listener&&(n=this.params?this.params.concat(e):e,t=this._listener.apply(this.context,n),this._isOnce&&this.detach()),t},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal,delete this._listener,delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}},r.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(e,n,r,i){var s=this._indexOfListener(e,r),o;if(s!==-1){o=this._bindings[s];if(o.isOnce()!==n)throw new Error("You cannot add"+(n?"":"Once")+"() then add"+(n?"Once":"")+"() the same listener without removing the relationship first.")}else o=new t(this,e,n,r,i),this._addBinding(o);return this.memorize&&this._prevParams&&o.execute(this._prevParams),o},_addBinding:function(e){var t=this._bindings.length;do--t;while(this._bindings[t]&&e._priority<=this._bindings[t]._priority);this._bindings.splice(t+1,0,e)},_indexOfListener:function(e,t){var n=this._bindings.length,r;while(n--){r=this._bindings[n];if(r._listener===e&&r.context===t)return n}return-1},has:function(e,t){return this._indexOfListener(e,t)!==-1},add:function(e,t,r){return n(e,"add"),this._registerListener(e,!1,t,r)},addOnce:function(e,t,r){return n(e,"addOnce"),this._registerListener(e,!0,t,r)},remove:function(e,t){n(e,"remove");var r=this._indexOfListener(e,t);return r!==-1&&(this._bindings[r]._destroy(),this._bindings.splice(r,1)),e},removeAll:function(){var e=this._bindings.length;while(e--)this._bindings[e]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(e){if(!this.active)return;var t=Array.prototype.slice.call(arguments),n=this._bindings.length,r;this.memorize&&(this._prevParams=t);if(!n)return;r=this._bindings.slice(),this._shouldPropagate=!0;do n--;while(r[n]&&this._shouldPropagate&&r[n].execute(t)!==!1)},forget:function(){this._prevParams=null},dispose:function(){this.removeAll(),delete this._bindings,delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var i=r;i.Signal=r,typeof define=="function"&&define.amd?define("signals",[],function(){return i}):typeof module!="undefined"&&module.exports?module.exports=i:e.signals=i}(this),define("mout/number/MIN_INT",[],function(){return-2147483648}),define("mout/number/MAX_INT",[],function(){return 2147483647}),define("mout/random/rand",["./random","../number/MIN_INT","../number/MAX_INT"],function(e,t,n){function r(r,i){return r=r==null?t:r,i=i==null?n:i,r+(i-r)*e()}return r}),define("mout/random/randInt",["../number/MIN_INT","../number/MAX_INT","./rand"],function(e,t,n){function r(r,i){return r=r==null?e:~~r,i=i==null?t:~~i,Math.round(n(r-.5,i+.499999999999))}return r}),define("mout/random/choice",["./randInt","../lang/isArray"],function(e,t){function n(n){var r=arguments.length===1&&t(n)?n:arguments;return r[e(0,r.length-1)]}return n}),define("mout/random/randHex",["./choice"],function(e){function n(n){n=n&&n>0?n:6;var r="";while(n--)r+=e(t);return r}var t="0123456789abcdef".split("");return n}),define("mout/random/guid",["./randHex","./choice"],function(e,t){function n(){return e(8)+"-"+e(4)+"-"+"4"+e(3)+"-"+t(8,9,"a","b")+e(3)+"-"+e(12)}return n}),define("models/event",["require","exports","module","signals","mout/function/times","mout/date/strftime","mout/random/randInt","mout/random/choice","mout/random/guid"],function(e,t){function l(e){return i(e,"%Y-%m-%d")}function c(e,n){n.forEach(function(t){if(t.isAllDay)e.alldayEvents.push(t);else{var n=(new Date(t.startDate)).getHours();e.hours[n].events.push(t)}}),t.onEventExpansion.dispatch()}function h(){var e=[];return r(24,function(t){e.push({hour:t,events:[]})}),e}function p(e){var t=l(e);if(a[t])return a[t];var n=a[t]=[];return r(s(0,5),function(){var t=new Date(e);e.setHours(s(0,23));var r=new Date(t),i=s(1,4);r.setHours(r.getHours()+i);var a={isAllDay:s(0,5)>4,startDate:t,endDate:r,duration:i,id:u()};a.title=o(f),a.title+=s(0,1)?" "+o(f):"",n.push(a)}),n}var n=e("signals"),r=e("mout/function/times"),i=e("mout/date/strftime"),s=e("mout/random/randInt"),o=e("mout/random/choice"),u=e("mout/random/guid"),a={},f="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non metus urna. Etiam vitae turpis vel sem pulvinar accumsan in in leo. Praesent libero mauris, ultricies sit amet felis feugiat, dignissim condimentum felis. Mauris varius lectus et accumsan tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut in lorem sed augue feugiat tempor nec eu libero. Vivamus tempor lacinia aliquam. Sed eget porttitor leo. Interdum et malesuada fames ac ante ipsum primis in faucibus.".split(" ");t.onEventExpansion=new n,t.getDay=function(e){var t={date:e,hours:h(),alldayEvents:[]},n=l(e);return a[n]?setTimeout(function(){c(t,a[n])},10):setTimeout(function(){var n=p(e);c(t,n)},s(100,1e3)),t}}),define("gesture_detector",[],function(){var e=function(){function e(t,n){this.element=t,this.options=n||{},this.options.panThreshold=this.options.panThreshold||e.PAN_THRESHOLD,this.options.mousePanThreshold=this.options.mousePanThreshold||e.MOUSE_PAN_THRESHOLD,this.state=m,this.timers={},this.listeningForMouseEvents=!0}function u(e){var t=e.timeStamp;return t>2*Date.now()?Math.floor(t/1e3):t}function a(e,t){return Object.freeze({screenX:t.screenX,screenY:t.screenY,clientX:t.clientX,clientY:t.clientY,timeStamp:u(e)})}function f(e,t,r){return Object.freeze({screenX:n((t.screenX+r.screenX)/2),screenY:n((t.screenY+r.screenY)/2),clientX:n((t.clientX+r.clientX)/2),clientY:n((t.clientY+r.clientY)/2),timeStamp:u(e)})}function l(e){return Object.freeze({screenX:e.screenX,screenY:e.screenY,clientX:e.clientX,clientY:e.clientY,timeStamp:u(e)})}function c(t,r){var i=e.THRESHOLD_SMOOTHING;return Object.freeze({screenX:n(t.screenX+i*(r.screenX-t.screenX)),screenY:n(t.screenY+i*(r.screenY-t.screenY)),clientX:n(t.clientX+i*(r.clientX-t.clientX)),clientY:n(t.clientY+i*(r.clientY-t.clientY)),timeStamp:n(t.timeStamp+i*(r.timeStamp-t.timeStamp))})}function h(e,t){var n=t.screenX-e.screenX,i=t.screenY-e.screenY;return r(n*n+i*i)}function p(e,t){return i(t.screenY-e.screenY,t.screenX-e.screenX)*180/s}function d(e,t){var n=t-e;return n>180?n-=360:n<=-180&&(n+=360),n}function v(n,r){var i=t(r.screenX-n.screenX),s=t(r.screenY-n.screenY),o=r.timeStamp-n.timeStamp;return i<e.DOUBLE_TAP_DISTANCE&&s<e.DOUBLE_TAP_DISTANCE&&o<e.DOUBLE_TAP_TIME}e.prototype.startDetecting=function(){var e=this;o.forEach(function(t){e.element.addEventListener(t,e)})},e.prototype.stopDetecting=function(){var e=this;o.forEach(function(t){e.element.removeEventListener(t,e)})},e.prototype.handleEvent=function(e){var t=this.state[e.type];if(!t)return;if(e.changedTouches){this.listeningForMouseEvents&&(this.listeningForMouseEvents=!1,this.element.removeEventListener("mousedown",this)),e.type==="touchend"&&e.changedTouches.length>1&&console.warn("gesture_detector.js: spurious extra changed touch on touchend. See https://bugzilla.mozilla.org/show_bug.cgi?id=785554");for(var n=0;n<e.changedTouches.length;n++)t(this,e,e.changedTouches[n]),t=this.state[e.type]}else t(this,e)},e.prototype.startTimer=function(e,t){this.clearTimer(e);var n=this;this.timers[e]=setTimeout(function(){n.timers[e]=null;var t=n.state[e];t&&t(n,e)},t)},e.prototype.clearTimer=function(e){this.timers[e]&&(clearTimeout(this.timers[e]),this.timers[e]=null)},e.prototype.switchTo=function(e,t,n){this.state=e,e.init&&e.init(this,t,n)},e.prototype.emitEvent=function(e,t){if(!this.target){console.error("Attempt to emit event with no target");return}var n=this.element.ownerDocument.createEvent("CustomEvent");n.initCustomEvent(e,!0,!0,t),this.target.dispatchEvent(n)},e.HOLD_INTERVAL=1e3,e.PAN_THRESHOLD=20,e.MOUSE_PAN_THRESHOLD=15,e.DOUBLE_TAP_DISTANCE=50,e.DOUBLE_TAP_TIME=500,e.VELOCITY_SMOOTHING=.5,e.SCALE_THRESHOLD=20,e.ROTATE_THRESHOLD=22.5,e.THRESHOLD_SMOOTHING=.9;var t=Math.abs,n=Math.floor,r=Math.sqrt,i=Math.atan2,s=Math.PI,o=["touchstart","touchmove","touchend","mousedown"],m={name:"initialState",init:function(e){e.target=null,e.start=e.last=null,e.touch1=e.touch2=null,e.vx=e.vy=null,e.startDistance=e.lastDistance=null,e.startDirection=e.lastDirection=null,e.lastMidpoint=null,e.scaled=e.rotated=null},touchstart:function(e,t,n){e.switchTo(g,t,n)},mousedown:function(e,t){e.switchTo(S,t)}},g={name:"touchStartedState",init:function(t,n,r){t.target=n.target,t.touch1=r.identifier,t.start=t.last=a(n,r),t.options.holdEvents&&t.startTimer("holdtimeout",e.HOLD_INTERVAL)},touchstart:function(e,t,n){e.clearTimer("holdtimeout"),e.switchTo(w,t,n)},touchmove:function(e,n,r){if(r.identifier!==e.touch1)return;if(t(r.screenX-e.start.screenX)>e.options.panThreshold||t(r.screenY-e.start.screenY)>e.options.panThreshold)e.clearTimer("holdtimeout"),e.switchTo(y,n,r)},touchend:function(e,t,n){if(n.identifier!==e.touch1)return;e.lastTap&&v(e.lastTap,e.start)?(e.emitEvent("tap",e.start),e.emitEvent("dbltap",e.start),e.lastTap=null):(e.emitEvent("tap",e.start),e.lastTap=a(t,n)),e.clearTimer("holdtimeout"),e.switchTo(m)},holdtimeout:function(e){e.switchTo(b)}},y={name:"panStartedState",init:function(e,t,n){e.start=e.last=c(e.start,a(t,n)),t.type==="touchmove"&&y.touchmove(e,t,n)},touchmove:function(t,n,r){if(r.identifier!==t.touch1)return;var i=a(n,r);t.emitEvent("pan",{absolute:{dx:i.screenX-t.start.screenX,dy:i.screenY-t.start.screenY},relative:{dx:i.screenX-t.last.screenX,dy:i.screenY-t.last.screenY},position:i});var s=i.timeStamp-t.last.timeStamp,o=(i.screenX-t.last.screenX)/s,u=(i.screenY-t.last.screenY)/s;t.vx==null?(t.vx=o,t.vy=u):(t.vx=t.vx*e.VELOCITY_SMOOTHING+o*(1-e.VELOCITY_SMOOTHING),t.vy=t.vy*e.VELOCITY_SMOOTHING+u*(1-e.VELOCITY_SMOOTHING)),t.last=i},touchend:function(e,t,n){if(n.identifier!==e.touch1)return;var r=a(t,n),o=r.screenX-e.start.screenX,u=r.screenY-e.start.screenY,f=i(u,o)*180/s;f<0&&(f+=360);var l;f>=315||f<45?l="right":f>=45&&f<135?l="down":f>=135&&f<225?l="left":f>=225&&f<315&&(l="up"),e.emitEvent("swipe",{start:e.start,end:r,dx:o,dy:u,dt:t.timeStamp-e.start.timeStamp,vx:e.vx,vy:e.vy,direction:l,angle:f}),e.switchTo(m)}},b={name:"holdState",init:function(e){e.emitEvent("holdstart",e.start)},touchmove:function(e,t,n){var r=a(t,n);e.emitEvent("holdmove",{absolute:{dx:r.screenX-e.start.screenX,dy:r.screenY-e.start.screenY},relative:{dx:r.screenX-e.last.screenX,dy:r.screenY-e.last.screenY},position:r}),e.last=r},touchend:function(e,t,n){var r=a(t,n);e.emitEvent("holdend",{start:e.start,end:r,dx:r.screenX-e.start.screenX,dy:r.screenY-e.start.screenY}),e.switchTo(m)}},w={name:"transformState",init:function(e,t,n){e.touch2=n.identifier;var r=t.touches.identifiedTouch(e.touch1),i=t.touches.identifiedTouch(e.touch2);e.startDistance=e.lastDistance=h(r,i),e.startDirection=e.lastDirection=p(r,i),e.scaled=e.rotated=!1},touchmove:function(r,i,s){if(s.identifier!==r.touch1&&s.identifier!==r.touch2)return;var o=i.touches.identifiedTouch(r.touch1),u=i.touches.identifiedTouch(r.touch2),a=f(i,o,u),l=h(o,u),c=p(o,u),v=d(r.startDirection,c);r.scaled||(t(l-r.startDistance)>e.SCALE_THRESHOLD?(r.scaled=!0,r.startDistance=r.lastDistance=n(r.startDistance+e.THRESHOLD_SMOOTHING*(l-r.startDistance))):l=r.startDistance),r.rotated||(t(v)>e.ROTATE_THRESHOLD?r.rotated=!0:c=r.startDirection);if(r.scaled||r.rotated)r.emitEvent("transform",{absolute:{scale:l/r.startDistance,rotate:d(r.startDirection,c)},relative:{scale:l/r.lastDistance,rotate:d(r.lastDirection,c)},midpoint:a}),r.lastDistance=l,r.lastDirection=c,r.lastMidpoint=a},touchend:function(e,t,n){if(n.identifier===e.touch2)e.touch2=null;else{if(n.identifier!==e.touch1)return;e.touch1=e.touch2,e.touch2=null}(e.scaled||e.rotated)&&e.emitEvent("transformend",{absolute:{scale:e.lastDistance/e.startDistance,rotate:d(e.startDirection,e.lastDirection)},relative:{scale:1,rotate:0},midpoint:e.lastMidpoint}),e.switchTo(E)}},E={name:"afterTransformState",touchstart:function(e,t,n){e.switchTo(w,t,n)},touchend:function(e,t,n){n.identifier===e.touch1&&e.switchTo(m)}},S={name:"mouseDownState",init:function(t,n){t.target=n.target;var r=t.element.ownerDocument;r.addEventListener("mousemove",t,!0),r.addEventListener("mouseup",t,!0),t.start=t.last=l(n),t.options.holdEvents&&t.startTimer("holdtimeout",e.HOLD_INTERVAL)},mousemove:function(e,n){if(t(n.screenX-e.start.screenX)>e.options.mousePanThreshold||t(n.screenY-e.start.screenY)>e.options.mousePanThreshold)e.clearTimer("holdtimeout"),e.switchTo(T,n)},mouseup:function(e,t){var n=e.element.ownerDocument;n.removeEventListener("mousemove",e,!0),n.removeEventListener("mouseup",e,!0),e.lastTap&&v(e.lastTap,e.start)?(e.emitEvent("tap",e.start),e.emitEvent("dbltap",e.start),e.lastTap=null):(e.emitEvent("tap",e.start),e.lastTap=l(t)),e.clearTimer("holdtimeout"),e.switchTo(m)},holdtimeout:function(e){e.switchTo(x)}},x={name:"mouseHoldState",init:function(e){e.emitEvent("holdstart",e.start)},mousemove:function(e,t){var n=l(t);e.emitEvent("holdmove",{absolute:{dx:n.screenX-e.start.screenX,dy:n.screenY-e.start.screenY},relative:{dx:n.screenX-e.last.screenX,dy:n.screenY-e.last.screenY},position:n}),e.last=n},mouseup:function(e,t){var n=l(t);e.emitEvent("holdend",{start:e.start,end:n,dx:n.screenX-e.start.screenX,dy:n.screenY-e.start.screenY}),e.switchTo(m)}},T={name:"mousePannedState",init:function(e,t){e.start=e.last=c(e.start,l(t)),t.type==="mousemove"&&T.mousemove(e,t)},mousemove:function(t,n){var r=l(n);t.emitEvent("pan",{absolute:{dx:r.screenX-t.start.screenX,dy:r.screenY-t.start.screenY},relative:{dx:r.screenX-t.last.screenX,dy:r.screenY-t.last.screenY},position:r});var i=r.timeStamp-t.last.timeStamp,s=(r.screenX-t.last.screenX)/i,o=(r.screenY-t.last.screenY)/i;t.vx==null?(t.vx=s,t.vy=o):(t.vx=t.vx*e.VELOCITY_SMOOTHING+s*(1-e.VELOCITY_SMOOTHING),t.vy=t.vy*e.VELOCITY_SMOOTHING+o*(1-e.VELOCITY_SMOOTHING)),t.last=r},mouseup:function(e,t){var n=e.element.ownerDocument;n.removeEventListener("mousemove",e,!0),n.removeEventListener("mouseup",e,!0);var r=l(t),o=r.screenX-e.start.screenX,u=r.screenY-e.start.screenY,a=i(u,o)*180/s;a<0&&(a+=360);var f;a>=315||a<45?f="right":a>=45&&a<135?f="down":a>=135&&a<225?f="left":a>=225&&a<315&&(f="up"),e.emitEvent("swipe",{start:e.start,end:r,dx:o,dy:u,dt:r.timeStamp-e.start.timeStamp,vx:e.vx,vy:e.vy,direction:f,angle:a}),e.switchTo(m)}};return e}();return e}),define("views/week",["require","react","./week_allday","./week_sidebar","./week_days","mout/array/remove","mout/math/clamp","mout/date/isSame","mout/math/round","mout/date/strftime","mout/function/times","models/event","gesture_detector"],function(e){function g(e,t){return Math.abs(e-t)<864e5}function y(e,t){return u(new Date(e),new Date(t),"month")}function b(e,t){return e.startDate<=t&&e.endDate>=t}var t=e("react"),n=e("./week_allday"),r=e("./week_sidebar"),i=e("./week_days"),s=e("mout/array/remove"),o=e("mout/math/clamp"),u=e("mout/date/isSame"),a=e("mout/math/round"),f=e("mout/date/strftime"),l=e("mout/function/times"),c=e("models/event"),h=e("gesture_detector"),p=58,d=p*-10,v=p*-5,m=t.createClass({displayName:"WeekView",getDefaultProps:function(){var e=new Date;return e.setHours(0,0,0,0),{baseDate:e,range:this.getRange(e)}},getInitialState:function(){return{days:[],visibleRange:this.getVisibleRange(this.props.range)}},componentDidMount:function(){this.updateDays(),this.setupPan(),c.onEventExpansion.add(this.forceUpdate,this)},render:function(){return t.DOM.main(null,t.DOM.header({id:"time-header"},t.DOM.h1(null,this.weekHeader()),t.DOM.button({type:"button",onClick:this.showToday},"today")),t.DOM.div({id:"week"},t.DOM.div({className:"week-sidebar-allday icon-allday"},"All day"),t.DOM.div({className:"week-alldays-wrapper"},n({days:this.state.days,ref:"weekAllDays"})),t.DOM.div({className:"week-main"},t.DOM.div({className:"week-days-wrapper"},r(null),i({days:this.state.days,ref:"weekDays"})))))},getScrollDiff:function(){return Math.round((v-this.props.scrollOffsetX)/p)},showToday:function(){var e=new Date;e.setHours(0,0,0,0),this.props.baseDate=e,this.updateDays()},weekHeader:function(){function e(e){return f(e,"%b %Y")}var t=this.state.visibleRange,n=e(t.startDate);return y(t.startDate,t.endDate)||(n+=" "+e(t.endDate)),n},getVisibleRange:function(e){var t=this.getScrollDiff(),n=new Date(e.startDate);n.setDate(n.getDate()+5+t);var r=new Date(e.startDate);r.setDate(r.getDate()+9+t);var i={startDate:n,endDate:r};return i},updateVisibleRange:function(){var e=this.getVisibleRange(this.props.range);return this.setState({visibleRange:e}),e},setupPan:function(){var e=this.getDOMNode(),t=new h(e);t.startDetecting();var n=this;e.addEventListener("pan",function(e){var t=e.detail,r=Math.abs(t.absolute.dx),i=Math.abs(t.absolute.dy);if(i>30||r<i)return;e.preventDefault(),e.stopPropagation(),n.setScrollOffsetX(n.props.scrollOffsetX+t.relative.dx)}),e.addEventListener("swipe",function(){n.setScrollOffsetX(a(n.props.scrollOffsetX,p)),n.updateBaseDateAfterScroll()})},setScrollOffsetX:function(e){this.props.scrollOffsetX=o(e,d,0);var t="translateX("+this.props.scrollOffsetX+"px)";this.refs.weekAllDays.getDOMNode().style.transform=t,this.refs.weekDays.getDOMNode().style.transform=t,this.updateVisibleRange()},updateBaseDateAfterScroll:function(){var e=new Date(this.props.baseDate);e.setDate(e.getDate()+this.getScrollDiff()),this.props.baseDate=e,this.updateDays()},updateDays:function(){var e=this.updateRange(),t=e.startDate,n=0,r=this.state.days.slice();if(r.length){var i,o=r.length;while(i=r[--o])b(e,i.date)||s(r,i);r.length&&g(t,r[0].date)&&(t=e.endDate,n=r.length-14)}var u=15-r.length;if(!u)return;l(u,function(i){var s=new Date(t);s.setDate(s.getDate()+n+i),s.setHours(0,0,0,0);var o=c.getDay(s);t===e.endDate?r.push(o):r.splice(i,0,o)}),this.setState({days:r}),this.setScrollOffsetX(v)},getRange:function(e){var t=new Date(e);t.setDate(e.getDate()+9),t.setHours(0,0,0,0);var n=new Date(e);n.setDate(e.getDate()-5),n.setHours(0,0,0,0);var r={startDate:n,endDate:t};return r},updateRange:function(){var e=this.getRange(this.props.baseDate);return this.props.range=e,e}});return m}),define("app",["require","mout/random/random","seedrandom","react","./views/week"],function(e){var t=e("mout/random/random"),n=e("seedrandom"),r=new n("gaia-calendar");t.get=r;var i=e("react"),s=e("./views/week");i.renderComponent(s(),document.body)}),require(["app"]);