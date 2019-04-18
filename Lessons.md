# Lesson learnt
Porting the application to Svelte proved challenging (took close to two days vs. a few hours for 
the other frameworks) :
- a template language without IDE suuport
  - some errors are silently ignored
  - some errors are difficult to decipher and help litle finding the rootcause, which involve 
  lengthy debugging sessions of the framework...
    - for instance, I used a computed property with a `screen` property used in the body of the 
    computation, but `args` property in the parameter section of the function.  No warning or 
    errors were issued. That is the typical stuff that is trivially caught by IDEs.
  - to be fair, svelte does offer some warning about common mistakes
- compiling and building is non-trivial
  - rollup showed some strange errors, which we obviated by moving commonjs modules from 
  `node_modules` to the repo (superagent), and ignoring completely the warning (replacing `this` 
  for `undefined`)
  - ~~I observe a damnning issue with css, and had to remove the `index.css` from the `index.html`.
   That is a build issue or compilation issue, and I do not want to investigate it.~~
  - Compiling means you have to care about the build, and that can very well be a nightmare, as 
  usual, given the high number of moving parts.
- the templating language has to be learnt
  - while there is a rather decent documentation, it takes some time to understand the best 
  practices
  - understanding scoping rules is tricky
    - data and props are colocated in the same object. That makes sense, both are a part of the 
    component state, but it is confusing vs. other frameworks
    - methods are visible in event handlers, but not helpers?
    - event handlers are applied directly to return an expression, and `event` is the syntax for 
    the event related to the handler. That is closer to html, alright but a change vs. other 
    framework (vdom)
    - most confusingly, it is not possible to use curried function. i.e. f(next)(event) did not 
    work, but f(next, event) did work! That is totally undocumented
- to have the DOM updating smoothly it was not possible to use several components, and switch 
them according to the screen to display. This caused the input field to loose focus, because 
switching components means DOM nodes are not reused or updated but recreated... So the screens 
have to be factored into one template.
- the props or data shape admitted by the component a part of the component specification
  - it is good to keep that information at hand in a comment or elsewhere
- best practices :
  - use `helpers` to gather constants and properties
  - use `computed` to precompute expressions used in if clauses, so any branching is always made 
  from short variables, that is more readable
  - use `methods` to gather the event handlers all in one place rather than having them inline

While the implementation had its set of challenges for a first-time user, past the learning curve, the truth is Svelte is a 
pretty nice library among template-based front-end libraries. Having all the component 
specifications in one file is great.  

Svelte is also finally small in memory and latency due to its compilation techniques.

