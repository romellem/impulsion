# Impulsion.js

> Fork of the excellent [impetus.js](https://github.com/chrisbateman/impetus) by Chris Bateman.
>
> Adds new features such as:
> - Exposes `previousX` and `previousY` to our lifecycle events.
> - Adds more lifecycle events:
>    - `onStart`: Called when starting to drag the element.
>    - `onStartDecelerating`: Called when the deceleration begun.
>    - `onEndDecelerating`: called when the deceleration has ended.
>
> As well other bugfixes and minor features.

Add momentum to anything. It's like iScroll, except not for scrolling. Supports mouse and touch events.

Check out the demos on the [home page](http://romellem.github.io/impulsion).

Impulsion will probably never support anything other than simple momentum. If you need scrolling or touch carousels or anything like that, this probably isn't the tool you're looking for.

## Installation

```
yarn add impulsion
# or npm install impulsion
```

### Usage
```javascript
import Impulsion from 'impulsion';
// const Impulsion = require('impulsion');

let myImpulsion = new Impulsion({
    source: myNode,
    onUpdate(x, y, previousX, previousY) {
        // whatever you want to do with the values
    }
});
```

You give it an area to listen to for touch or mouse events, and it gives you the `x` and `y` values with some momentum.

Impulsion will register itself as an AMD module if it's available.

### Constructor Options
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Type</th>
			<th scope="col">Default</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left"><code>source</code></th>
			<td><code>HTMLElement</code>|<code>String</code></td>
			<td>window</td>
			<td>Element reference or query string for the target on which to listen for movement.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>onStart</code></th>
			<td><code>function(x, y, px, py)</code></td>
			<td>-</td>
			<td>This function will be called when starting to drag the element. <var>px</var> and <var>py</var> are the <em>previous</em> x and y values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>onUpdate</code> (required)</th>
			<td><code>function(x, y, px, py)</code></td>
			<td>-</td>
			<td>This function will be called with the updated <var>x</var> and <var>y</var> values. <var>px</var> and <var>py</var> are the <em>previous</em> x and y values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>onStartDecelerating</code></th>
			<td><code>function(x, y, px, py)</code></td>
			<td>-</td>
			<td>This function will be called when the deceleration begun (and drag has ended). <var>px</var> and <var>py</var> are the <em>previous</em> x and y values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>onEndDecelerating</code></th>
			<td><code>function(x, y, px, py)</code></td>
			<td>-</td>
			<td>This function will be called when the deceleration has ended. <var>px</var> and <var>py</var> are the <em>previous</em> x and y values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>multiplier</code></th>
			<td><code>Number</code></td>
			<td><code>1</code></td>
			<td>The relationship between the input and output values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>friction</code></th>
			<td><code>Number</code></td>
			<td><code>0.92</code></td>
			<td>Rate at which values slow down after you let go.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>initialValues</code></th>
			<td><code>[Number, Number]</code></td>
			<td><code>[0, 0]</code></td>
			<td>Array of initial <var>x</var> and <var>y</var> values.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>boundX</code></th>
			<td><code>[Number, Number]</code></td>
			<td>-</td>
			<td>Array of low and high values. <var>x</var>-values will remain within these bounds.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>boundY</code></th>
			<td><code>[Number, Number]</code></td>
			<td>-</td>
			<td>Array of low and high values. <var>y</var>-values will remain within these bounds.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>bounce</code></th>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
			<td>Whether to stretch and rebound values when pulled outside the bounds.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>window</code></th>
			<td><code>HTMLElement</code></td>
			<td><code>window</code></td>
			<td>Specify the root <code>window</code> element, only really needed when trying to applied Impulsion to child iframes.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>addIosTouchmoveFix</code></th>
			<td><code>Boolean</code></td>
			<td><code>true</code></td>
			<td>iOS sometimes fails to <code>preventDefault</code> when scrolling on the body. Per <a href="https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356">this comment</a>, one fix is to add an empty <code>touchmove</code> listener to the main <code>window</code>. This library adds this by default, but if you want to override this hacky listener, it can be disabled by setting this option to <code>false</code>.<br><br>Other information: <ul><li><a href="https://stackoverflow.com/a/49582193">Can't prevent "touchmove" from scrolling window on iOS</a></li><li><a href="https://github.com/facebook/react/issues/9809">touchstart preventDefault() does not prevent click event.</a></li></td>
		</tr>
	</tbody>
</table>

### Methods
<table>
	<thead>
		<tr>
			<th></th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row" align="left"><code>.pause()</code></th>
			<td>Disable movement processing.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.resume()</code></th>
			<td>Re-enable movement processing.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.forceUpdate()</code></th>
			<td>Call the <code>onUpdate</code> function manually. Can be used to update the scene after <code>setValues()</code> has been run.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.setMultiplier( &lt;number&gt; )</code></th>
			<td>Adjust the <var>multiplier</var> in flight.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.setValues( &lt;number&gt; , &lt;number&gt; , &lt;number|null&gt; , &lt;number|null&gt;)</code></th>
			<td>Adjust the current <var>x</var>, <var>y</var>, <var>previousX</var> and <var>previousY</var> output values. <var>previousX</var> and <var>previousY</var> can be <code>null</code>.</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.setBoundX( &lt;number[2]&gt; )</code></th>
			<td>Adjust the X bound</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.setBoundY( &lt;number[2]&gt; )</code></th>
			<td>Adjust the Y bound</td>
		</tr>
		<tr>
			<th scope="row" align="left"><code>.destroy()</code></th>
			<td>
				This will remove the previous event listeners. Returns null so you can use it to destroy your variable if you wish, i.e. <code>instance = instance.destroy()</code>
			</td>
		</tr>
	</tbody>
</table>

### Browser Support
Chrome, Firefox, Safari, Opera, IE 9+, iOS, Android. Support for IE 8 can be achieved by adding a polyfill for `addEventListener`.
