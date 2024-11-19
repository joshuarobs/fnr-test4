# README Other Libraries
A file to dump various info about different npm packages to help with AI coding.

## ctrl-keys

A tiny, super fast, typescript library to handle keybindings efficiently.

Bundle size Tests Status Coverage Status Version MIT

Contents
Features
Installation
Simple usage in 3 steps
Exploring the ctrl-keys API
Defining keybindings
Adding new keybindings
Removing keybindings
Disabling and enabling keybindings
Handling keyboard events
Comparaison with other keybindings libraries
Changelog
Features
Zero code dependencies (Uses just-types for types).
Small bundle size < 2kb.
Super fast performance (see benchmark).
Fully typed, offers autocomplete for keybindings.
Handles multi-keys sequences like ctrl+k ctrl+b (Inspired by vscode keybindings).
Does not add global listeners to the window, instead it lets you create multiple handlers and bind them to any DOM elements.
Dynamically add, remove, enable, and disable keybindings.
Installation
You can install it using npm or yarn

npm i ctrl-keys
// or
yarn add ctrl-keys
Or use it directly on modern browsers

<script type="module">
  import keys from 'https://unpkg.com/ctrl-keys/dist/index.mjs'
  // ...
</script>
if you need to use this library on an old browser that doesn't support es modules, please open an issue and I will add a CDN that works for you

Simple usage in 3 steps
import keys from 'ctrl-keys'

// 1. Create a keybindings handler
const handler = keys()

// 2. Add keybindings
handler
  .add('ctrl+up', () => {
    // do something
  })
  .add('ctrl+shift+space', 'ctrl+shift+c', () => {
    // do something else ...
  })

// 3. Handle events
window.addEventListener('keydown', handler.handle)
That's it. Now:

Whenever the ctrl and up keys are pressed at the same time; the first function will be called.
Whenever ctrl, shift and space keys are pressed then right after ctrl, shift and c are pressed; the second function will be called.
Let's explore what ctrl-keys has to offer in more details in the next section.

Exploring the ctrl-keys API
The default export of ctrl-keys is a function that takes no argument and returns a new keybindings handler:

function keys(): Handler
The handler has the following interface

interface HandlerInterface {
  add(...keys: Keys, fn: Callback): this
  remove(...keys: Keys, fn: Callback): this
  enable(...keys: Keys): this
  disable(...keys: Keys): this
  handle(event: KeyboardEvent): boolean
}
add method binds some keys to a function fn so that whenever the keys are pressed on the keyboard, that function is called.
remove removes the binding of keys to the function fn.
disable can be used to temporary disable some keys (not trigger the functions associated to them) and enable is used to enable them again.
handle handles a KeyboardEvent (the event emitted by keydown for example).
We will take a deeper look to each one of these methods bellow. But first, let's see what values can we give as keys.

Defining keybindings
The methods add, remove, enable and disable can take from 1 to 4 keys.

A key is represented by a string in the following format {modifiers}+{character} where:

modifiers is any combination of the modifiers ctrl, alt, shift and meta separated by +.
Examples: ctrl+alt, shift, alt+meta, ctrl+alt+meta.
And character is one of:
a, b, ..., z
0, 1, ..., 9
', ", ~, !, @, #, $, %, ^, &, *, (, ), ., -, _, +, =, [, ], {, }, <, >, ,, /, ?, ;, :, \, |
f1, f2, ..., f23
space, enter, tab, down, left, right, up, end, capslock, numlock, home, pagedown, pageup, backspace, delete, insert, escape
if you are using Typescript, it will offer autocomplete and help you detect typos when writing keys.

Typescript Autocomplete

Adding new keybindings
The add method lets you add new keybindings to the handler, you do that by specifying the keys that will be pressed and the function to call when they are pressed.

const handler = keys()
  .add('ctrl+up', fn1)  // add single key binding
  .add('ctrl+left', 'ctrl+up', 'ctrl+right', fn2)  // add multi keys binding
  .add('tab', event => {
    // You can access the keyboard event inside the callbacks
  })
You can add multiple functions to the same key

handler.add('ctrl+enter', fn1)
handler.add('ctrl+enter', fn2)
handler.add('ctrl+enter', fn3)
handler.add('ctrl+enter', fn2)
All added functions will be called (in the same order by which they were added) when handling keyboard events that match the given keys. Adding the same function to the same keys mutiple times will only add it once (the fn2 in the example above will only be called once when ctrl+enter is pressed).

Removing keybindings
The remove method does the opposite of add, it by removing keybindings from the handler.

const handler = keys()
  .add('ctrl+a', fn1)
  .add('ctrl+b', fn2)
  .add('ctrl+a', fn3)
// 'ctrl+a' calls `fn1` and `fn3`
// 'ctrl+b' calls `fn2`

handler.remove('ctrl+b', fn2) // now 'ctrl+b' does nothing
handler.remove('ctrl+a', fn1) // now 'ctrl+a' only calls `fn3`
handler.remove('ctrl+a', fn1) // does nothing because `fn1` is not bound to 'ctrl+a'
Disabling and enabling keybindings
The disable and enable methods let you disable/enable keybindings.

const handler = keys()
  .add('ctrl+a', fn1)
  .add('ctrl+b', fn2)
  .add('ctrl+a', fn3)
// 'ctrl+a' calls `fn1` and `fn3`
// 'ctrl+b' calls `fn2`

handler.disable('ctrl+a') // now 'ctrl+a' does nothing
// ...
handler.enable('ctrl+a') // now 'ctrl+a' calls `fn1` and `fn3`
Example use case

const handler = keys()
  .add('ctrl+a', fn1)
  .add('ctrl+a', fn2)
  .add('ctrl+a', fn3)

window.addEventListener('keydown', handler.handle)
This code will run fn1, fn2 and fn3 whenever ctrl+a is pressed. So if the user is typing into a textarea and presses ctrl+a to select all text the functions will be called which may not be the behavior we want. In that case, we can use disable to disable all ctrl+a bindings when the user starts focuses an input or textarea, and use enable to enable them again when the user removes focus from the input.

Handling keyboard events
ctrl-keys does not add listeners to window automatically, instead it lets you decide where and when to handle keyboard events. So after creating a handler and adding keybindings to it, you need to use its handle method to actually handle keyboard events

window.addEventListener('keydown', event => {
  handler.handle(event)
})
Note event.key is used when matching events against keybindings.

---
