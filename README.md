# Gamezon
This was my first major React project. It took me all the way from learning useState-useEffect, to concurrent react, and maintaining global state using reducers. 

## Libraries and notable APIs used
### Material UI
I used MUI for most of the components, and as a global theme provider. This was my first experience with a component library, and I was impressed. In my previous projects, writing the CSS was the worst part of the job. Two reasons why:
  1. **Styling phase is detached from the logic phase:** Conceptually, the UI design guides the logic of the component. So it makes sense to have them both in the same place, instead of having some contrived separation using file extensions. When writing the style rules, you don't know all the scenarios that require styling; which only come up when you write the JS. So this kind of pre-emptive styling was always incomplete until you wrote the JS, since you had to come back to add the finishing touches.
  2. **Naming classes sucks:** Its just something I'd wrather outsource, and focus on stuff that really matters. With MUI's CSS in JS solution - the **sx** prop, everything else has its own namespace. I only need to name the classes when theres some relative styling that needs to happen from the parent element; 

In my previous projects, I kept thinking that I was taking so much time to build stuff like navbars and modals and tooltips, that are common to 99% of the websites on the internet. With MUI's components, all of this stuff was pre-built. 
  - Basic styling ✔.
  - a11y ✔

All I needed to focus on was the small parts of the UI I needed to customize to make the website style 'mine' (and avoid the whole bootstrap conundrum), and the business logic.

MUI's customization and theming turned out to be complex, but immensely powerful. I now feel confident that MUI can help build almost any of the components for a standard website, while providing a theme that is starkly distinct from any cookie cutter websites and CSS frameworks.

### Puppeteer
A significant chunk of the development time for this project went into scraping the dataset off the internet. My only previous experience with scraping was seeing Jesse Eisenberg write Perl scripts from his dorm room in the Social Network. 

Although puppeteer was straightforward enough, the bulk of my time went into redoing the work, since this was my first experience in designing a database schema. I had no clue what a good database schema is, and still don't have a clue. 

What I do know is that I have iterated over my designs several times and each subsequent iteration provided incremental improvements to the developer(ie. my) experience. Keep in mind that at the time of scraping the dataset, and creating the database, the front-end of the website was non-existent. I was collecting data and organizing it, with nothing more than a hypothesis that this could be useful in the final website. Perhaps if I knew about backend design, I would have approached this in a more structured manner, and not dealt with as much frustration.

### Firebase
Firebase was one of the big stepping stones for me in this project. Aside from React itself, this was one of the main libraries I intended to get better at using this project. I had seen fireship.io's videos and noticed how he says firebase is very beginner friendly. Nothing really is *friendly* when you first learn it. But after using firebase extensively for this project - using it for authentication, pageinated queries, nested collections - I understand how elegant firebase is.

### Algolia
I did not expect to use algolia in this project. However when firebase's documentation pointed to it, and gave me no other option, I decided to use it to implement the search feature. Initially, I was a little overwhelmed with the features (and slightly afraid of emptying my monthly search quota), but very quickly, I got the feeling that algolia is just like firebase: *Overwhelming, but elegant*.

I was initially going to use their `InstantSearch.js` library, but then decided that at this stage of the website, their base api client `algoliasearch` was more than enough.

### Formik and Yup
This was another one of the libraries I intended, but didn't expect to use in this project. In this very project, I have used formik+yup for one form and implemented the other using plain react; and the difference in DX is stark. Formik+Yup provides a much more streamlined experience and handles the different input cases much more elegantly than manually implementing these checks.

However I did notice that there was noticeable lag in the form when using these two libraries. On researching this problem, I found that the problem was that formik runs validation and updates the entire form-state for each keystroke in the form (in any input field!). In future projects I will opt for a more optimized package like `react-hook-form` which I hear doesn't have this issue.

One other thing I'd like to mention is that I created a custom component to use `react-phone-number-input` to accept the user's phone number along with country code. That turned out to be a huge headache. The component logic was straightforward, but styling the component with MUI, while making sure the logic still worked, was a pain in the ass. In hindsight, this would have been much simpler if I read the documentation for `react-phone-number-input` more deeply the first time. However through this intense headache of a task, I have become quite adept at creating custom components with MUI, and overriding the default styles for any stock components.

### Suspense for data fetching
Although this is not a separate library, it deserves its own place in this write up. Including suspense for data fetching did more than just add a fallback UI. In hindsight, I think that suspense was one of the biggest drivers for me to clean up the low-level architecture of my react components. Including `resource`s, forced me to abstract the data handling to a separate class, and handle the data within the component in a much more elegant, and declarative fashion. 

Huge shoutout to [Sam Selikoff](https://www.youtube.com/c/SamSelikoff). His channel might be small, but the stuff in there is gold. His suspense videos are really good. The login modal component animation is a direct inspiration from his framer motion video.

### Reducers and Proxies
This is definitely not something I expected I'd learn through this project. Instead it was mothered by the necessity of the application. I had to maintain a global state for the user data like the cart and wishlist, since they could conceptually be modified from any location in the application. For this, the solution I ended up making was to maintain a global state, and push changes to this state using a common reducer-like function. So no matter what property was changed, this was propagated to the global state using the same reducer function, carrying differing payloads. Several days after implementing this, I came to know that this is called a reducer pattern. A delightful surprise. Reminds me of how I ended up making HTML templates and document fragments in my previous project(toDoApp), since building out the UI using JS is very cumbersome. That was just JSX!

The use of JS proxy was another thing I just so happened to stumble upon. I was trying to wrap the methods of certain classes with the above reducer function. That way, when the object was modified, the reducer function would fire on its own, without a manual invocation. I couldn't really find a way to do that, and I kept landing at this ASP.NET solution called ActionFilters. By god's grace I stumbled upon this feature called proxies in JS, and that turned out to be a lifesaver. Really cleaned up the code.

## Code Style:
### Stage 1
When I started this project, I had no real conception of what clean code is. Sure I've heard bits and pieces of what to do and what not to do, but couldn't really tell if I was living up to the mark. However I was pretty blown away by how sleek the code in [some repos](https://github.com/michalosman/restaurant-page/blob/main/src/website.js) were. It seemed so simple and easy to understand what was going on. I wanted to emulate this, but I had no idea where to start.

At this point, my idea of a function/component was this:

> Make a function whenever you need to reuse a component

This meant my functions(and components) were usually a 100+ lines each, with a lot of `JSX` mess, and `async`'s inside useEffects to handle data fetching and what not. 
```js
function reallyBigMessyFunction(L,o,t,s,O,f,P,a,r,a,m,s){
  mumbojumbodothatandthisandthatandthisandthat
  stuffYou(do).andThenThisAndThat
  AnotherThingYouDoWithThisAndThat
  // imagine the above lines repeating for 30 times
}
```
Not a pretty sight. Why did I do this? Cause you most of the stuff inside a react component or a function is veeeery specific to that component. So why bother making a function when you'll never use it again.

### Stage 2
Bit by bit, I started abstracting. I would look at long paragraphs of code and think "Hey! This stuff is related", and I would put spaces between them, and a comment above to say what that block does.

```js
function reallyBigFunction(L,o,t,s,O,f,P,a,r,a,m,s){
  // Calculate that thing
  calculatecalculatecalculate
  calculatecalculatecalculate
  calculatecalculatecalculate

  // and while something is true
  do{
    // And do something with that value
    doSomethingdoSomethingdoSomething
    doSomethingdoSomethingdoSomething
    doSomethingdoSomethingdoSomething
  }while(somethingIsTrue)
}
```

Not that pretty yet, but still better than before.

### Stage 3
Occassionally I thought "Hey these are already inter related blocks of code. Lets just make a function out of these anyway."
```js
function reallyBigFunction(L,o,t,s,O,f,P,a,r,a,m,s){
  // Calculate that thing
  const thatThing = calculate();

  // and while something is true
  do{
    // And do something with that value
    doSomething(thatThing.value)
  }while(somethingIsTrue)

  function calculate(){
    calculatecalculatecalculate
    calculatecalculatecalculate
    calculatecalculatecalculate
  }

  function doSomething(){
    doSomethingdoSomethingdoSomething
    doSomethingdoSomethingdoSomething
    doSomethingdoSomethingdoSomething
  }
}
```
Nice. If you can ignore the second half of the function definition, (the part with the nested functions), my function is only a couple of lines long, right? Progress, finally.

This was the stage I was in for a long time. I would extract stuff whenever I could logically put them together. But the downside of this was function definitions inside function definitions inside function definitions.
```js
function doSomething(){
  firstDoThis();
  thenDoThis();

  function firstDoThis(){
    butfirstThis();
    andThenThis();
    notBeforeThis();

    function butfirstThis(){
      somecodesomecodesomecode
      somecodesomecodesomecode
      somecodesomecodesomecode
    }
    function andThenThis(){
      notBeforeThis();
      somecodesomecodesomecode
      somecodesomecodesomecode
      somecodesomecodesomecode

      function notBeforeThis(){
        somecodesomecodesomecode
        somecodesomecodesomecode
        somecodesomecodesomecode
      }
    }
  }
  function thenDoThis(){
    // rinse and repeat the above
  }
}
```
This has its problems; but hey, I'm abstracting, right?

### Stage 4
The real breakthrough came after watching [this talk](https://youtu.be/7EmboKQH8lM?t=3620)(and several [others]((https://www.youtube.com/watch?v=TbP2B1ijWr8&t=1757s)) after it; but this is the one that really opened things up). 

I had learnt about OOP first in my school days when we were taught C++. I knew what it meant conceptually, but knowing something instinctively is completely different (perhaps I never will understand it properly until I learn Haskell or the sort). But when I saw Uncle Bob simply [draw boxes](https://youtu.be/7EmboKQH8lM?t=3620) around the function definitions, and say

> You want to extract the function; but the IDE won't let you, cause it changes two local variables... What do you do now? **Make them global!**
>
> Now I have a set of functions, which manipulate a set of variables.
>
> ***That's a class.***

<div style="text-align:center">
<img src="slap-the-head-oh-no.gif" alt="Facepalm" width="60%" >
</div>

That's it? I was doing screwed up classes(JS closures) all this time. Why not go all the way and use the ES6 syntax. I thought, instead of having these long ass function definitions inside the react component, let me just extract it to a class.

```js
function ReactComponent({ someProp }){
  const dataHandlerRef = useRef(new HandlerClassForReactComponent(someProp));
  const dataHandler = dataHandlerRef.current;
  
  const [data, setData] = useState();
  useEffect(updateData,[])

  function updateData(){
    (async ()=>{
      const newData = await dataHandler.fetchData()
      setData(newData);
    })();
  }

  return (
    <SomeJSX data={data}>
      <ChildComponentsJSX />
      {/* More JSX */}
    </SomeJSX>
  );
}
```
Now that's a clean component! Meanwhile the data was being handled elsewhere

```js
class HandlerClassForReactComponent{
  #someProp;
  constructor(someProp){
    this.#someProp = someProp
  }

  get #url(){
    return `someUrl/${this.#someProp}`
  }

  async fetchData(){
    const response = await fetch(this.#url);
    const data = await response.json();
    return data;
  }
}
```
**Perfect!**

Now, with each component I write, I feel more and more compelled to make sure the code I wrote is clean af. My last project was 82 commits in 12 days. *Yikes!* This project was much more deliberate practice and I can see the results. The best part? I can come back to my code weeks later, and immediately understand what's going on.
> Does this, this and this. Okay..okay... Yeah pretty straightforward.

Onward and upward.