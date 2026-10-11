import { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } from 'react'

const LESSONS = {
  useState: {
    title: 'useState',
    intro: 'Think of your component as a picture on the screen. By default it can\'t "remember" anything—it just shows the same thing. useState is how you give it a memory: "remember this number. When it changes, redraw the picture." That number is your state, and changing it is what makes the screen update.',
    lines: [
      { code: 'const [count, setCount] = useState(0)', explanation: 'This line says: "I want to remember a number. Call it count. Start it at 0. And give me a way to change it—that\'s setCount." So count is the number you see on screen; setCount is the function you call when the user clicks a button. When you call setCount, React redraws the screen with the new number.' },
      { code: '<p className="count-display">{count}</p>', explanation: 'This is how we show the number on the page. The curly braces {count} mean "put the value of count here." So if count is 5, the user sees 5. When count changes, this part of the screen updates automatically.' },
      { code: 'onClick={() => setCount(count - 1)}', explanation: 'When the user clicks the decrease button, this runs. We say: "set the remembered number to whatever it is now minus 1." So if count was 3, it becomes 2. React then redraws the screen so the user sees 2.' },
      { code: 'onClick={() => setCount(count + 1)}', explanation: 'Same idea for the increase button: "set the remembered number to count plus 1." The number goes up by one, and the screen updates so the user sees the new number.' }
    ],
    inOurExample: [
      '**What happens:** When the page first loads, React runs the App component. useState(0) runs once and gives us count = 0 and setCount. The screen shows 0. When the user clicks "increase," the onClick runs: setCount(count + 1), so we call setCount(1). React stores 1 as the new state, marks the component as needing a redraw, and runs the component again. This time count is 1, so the big number on the card shows 1.',
      '**Why we do it this way:** We need a number that can change when the user clicks, and the screen must update to show that new number. useState is the standard way to "remember" a value in a function component and trigger a redraw when it changes.',
      '**How it fits together:** The buttons call setCount with the new value (count + 1 or count - 1). React then re-runs the component from the top with the updated count. The JSX uses {count}, so whatever count is now gets shown. The user always sees the current number.'
    ]
  },
  useEffect: {
    title: 'useEffect',
    intro: 'Sometimes you want to do something *after* the screen has been drawn—like save something, fetch data, or in our demo just write down the current time. useEffect is React\'s way of saying: "run this code after we draw the screen, and run it again whenever this list of things changes."',
    lines: [
      { code: 'const [count, setCount] = useState(0)', explanation: 'Same as the useState lesson: we remember the count so the user can click and see the number change.' },
      { code: "const [effectRanAt, setEffectRanAt] = useState('—')", explanation: 'We also remember a piece of text (effectRanAt)—when did we last run our "extra" code? We start with "—" and later put the current time there so the user can see it.' },
      { code: 'useEffect(() => {', explanation: 'useEffect says: "after you draw the screen, run this function." So first the screen shows up, then this code runs. It\'s for doing things that happen "on the side" after the picture is on screen.' },
      { code: "  setEffectRanAt(new Date().toLocaleTimeString())", explanation: 'Inside that function we get the current time (like "2:30:45 PM"), turn it into a string, and save it in effectRanAt. Saving it causes React to redraw, so the user sees the new time on screen.' },
      { code: '}, [count])', explanation: 'The [count] part is the "when to run again" list. It means: run this effect when the component first shows up, and run it again every time count changes. So every time you click increase or decrease, the effect runs and the "effect last ran at" time updates.' }
    ],
    inOurExample: [
      '**What happens:** When the UseEffectLesson card first appears, React draws it: count = 0, effectRanAt = "—". After that draw, React runs the effect. The effect calls setEffectRanAt with the current time, so state updates and React redraws—now you see "Effect last ran at: 2:30:45 PM" (or whatever time). When you click "increase," setCount(count + 1) runs, count changes, React redraws the component. Because count is in the dependency array [count], React runs the effect again after this draw. The effect sets the time again, so "Effect last ran at" updates to the new time.',
      '**Why we use [count]:** We want the effect to run when the component first mounts (so we show a time right away) and again whenever count changes (so every click updates the "last ran at" time). That\'s exactly what [count] does.',
      '**How it works:** The effect does not run during the render. It runs after React has painted the screen. So we\'re doing "side" work (recording the time) without blocking the display. When we call setEffectRanAt inside the effect, that triggers another render, but React batches and handles that so you see the updated time on the next paint.'
    ]
  },
  useRef: {
    title: 'useRef',
    intro: 'useRef is like a pocket that your component can use to store a value. The big difference from useState: when you change what\'s in the pocket, React does *not* redraw the screen. So you use it when you want to keep track of something (like how many times we drew) without that change causing an update.',
    lines: [
      { code: 'const [count, setCount] = useState(0)', explanation: 'We still have count so the user can click and see the number. Changing count is what causes the screen to redraw.' },
      { code: 'const renderCount = useRef(0)', explanation: 'useRef(0) creates that "pocket" and puts 0 in it at the start. The pocket stays the same for the whole life of the component—we just change the number inside it.' },
      { code: 'renderCount.current++', explanation: 'Every time React redraws this component, we add 1 to the number in the pocket. But changing the pocket does *not* trigger a redraw. So we\'re quietly counting "how many times have we drawn?" without causing extra draws ourselves.' },
      { code: 'Re-renders: {renderCount.current}', explanation: 'We show the number in the pocket on screen. The only time that number on screen changes is when something else (like the user clicking and changing count) causes a redraw. So the number you see is "total times this component has been drawn."' }
    ],
    inOurExample: [
      '**What happens:** When UseRefLesson first renders, renderCount is a ref with current = 0. We run renderCount.current++, so it becomes 1. We show count (0) and "Re-renders: 1." When you click "increase," setCount(1) runs, React redraws. On this second render we run renderCount.current++ again, so it becomes 2. We show count (1) and "Re-renders: 2." So the "Re-renders" number only goes up when something else (the count change) causes a redraw.',
      '**Why we use a ref instead of state:** If we used useState to count renders, we\'d do setRenderCount(n => n + 1) during render. That would update state, which would trigger another render, which would update state again—infinite loop. A ref lets us store a value that persists across renders without triggering a redraw when we change it.',
      '**How it works:** We mutate renderCount.current during render. React does not treat that as a state change, so there\'s no extra redraw. We only read the value when we render and stick it in the JSX, so the user sees it. The display updates only when some other reason (like count changing) causes the component to run again.'
    ]
  },
  useMemo: {
    title: 'useMemo',
    intro: 'If you compute something from your state (like "count times 2"), normally React would do that math every single time it redraws—even when count didn\'t change. useMemo says: "only do this calculation again when these things change. Otherwise reuse the answer you got last time." So you do less work and still show the right number.',
    lines: [
      { code: 'const [count, setCount] = useState(0)', explanation: 'Same as before: we remember the count. When the user clicks, count changes and the screen redraws.' },
      { code: 'const doubled = useMemo(() => count * 2, [count])', explanation: 'We want "count times 2." useMemo says: run the function count * 2 and remember the result. Only run it again when count changes. So we don\'t recalculate on every redraw—only when count actually changes.' },
      { code: '<p className="count-display">{count}</p>', explanation: 'We show the count on screen, same as the useState lesson.' },
      { code: 'Doubled: {doubled}', explanation: 'We show the doubled value. It always matches count * 2, but we only did the multiplication when count changed, not on every single redraw. For this small example it\'s overkill; useMemo really helps when the calculation is slow or heavy.' }
    ],
    inOurExample: [
      '**What happens:** On the first render, count is 0. useMemo runs the function () => count * 2, gets 0, and stores it. We show count 0 and Doubled: 0. When you click "increase," count becomes 1, React redraws. useMemo compares the new [count] (1) to the previous one (0). They\'re different, so it runs the function again: doubled = 2. We show 1 and Doubled: 2. If we had other state that changed without count changing, useMemo would see [count] unchanged and return the cached 2 without running the function.',
      '**Why we use useMemo here:** In this demo the calculation is trivial (count * 2). We use it to show the behavior: the value is only recalculated when a dependency changes. In a real app you\'d use it when the calculation is expensive (e.g. filtering a huge list) so you don\'t do that work on every render.',
      '**How it works:** React keeps the last computed value and the last dependency list. When the component runs again, it compares the current [count] to the previous one (same reference or same value, depending on implementation). If they\'re the same, it returns the cached value. If not, it runs your function, caches the result, and returns it.'
    ]
  },
  useCallback: {
    title: 'useCallback',
    intro: 'When you give a button a function ("do this when I\'m clicked"), React normally creates a brand-new function every time it redraws. useCallback says: "keep giving them the *same* function until this list of things changes." That way you don\'t create new functions every time, and components that receive these functions don\'t redraw unnecessarily.',
    lines: [
      { code: 'const [count, setCount] = useState(0)', explanation: 'We remember the count. We\'ll update it from our button handlers.' },
      { code: 'const handleDecrease = useCallback(() => setCount((c) => c - 1), [])', explanation: 'handleDecrease is the function we give to the decrease button. useCallback keeps the same function every time. The (c) => c - 1 part means "take the current count and subtract 1"—so we don\'t need to list count in the dependency array. The [] means "never replace this function."' },
      { code: 'const handleIncrease = useCallback(() => setCount((c) => c + 1), [])', explanation: 'Same for increase: a function that adds 1 to the current count. Again we use the same function every time ([]), so we\'re not creating new functions on every redraw.' },
      { code: 'onClick={handleDecrease}  onClick={handleIncrease}', explanation: 'We pass these functions to the buttons. "When you\'re clicked, run handleDecrease or handleIncrease." Because we used useCallback, it\'s the same function reference every time—handy when you pass these down to other components that might otherwise redraw too often.' }
    ],
    inOurExample: [
      '**What happens:** On the first render we create handleDecrease and handleIncrease with useCallback and []. So we get two function references. When you click "increase," handleIncrease runs and calls setCount((c) => c + 1). React passes the current count (e.g. 0) to that function, gets 1, updates state, and redraws. On the second render, useCallback runs again. Because the dependency array [] hasn\'t changed, React returns the *same* function references as before. The buttons still have the same onClick handlers.',
      '**Why we use setCount((c) => c + 1) instead of setCount(count + 1):** If we wrote setCount(count + 1), we would "close over" the current count. To keep the callback correct we\'d need [count] in the dependency array, so the function would be recreated every time count changed—no benefit from useCallback. The functional form (c) => c + 1 asks React "give me the latest count and add 1," so we don\'t need count in the array and can use [], giving us a stable function.',
      '**How it fits together:** The buttons receive the same function reference on every render. If we passed these handlers to a child wrapped in React.memo, that child wouldn\'t re-render just because the parent re-rendered, since the callback reference didn\'t change. In our simple card we don\'t have that, but the pattern is the same.'
    ]
  },
  useReducer: {
    title: 'useReducer',
    intro: 'useReducer is another way to "remember" something and update it. Instead of calling setCount(5) directly, you send a message like "I want to add one" and a separate function (the reducer) figures out the new number. It\'s useful when you have lots of different ways to update state and want them all in one place.',
    lines: [
      { code: 'function reducer(state, action) {', explanation: 'The reducer is a function that takes two things: the current state (e.g. { count: 3 }) and an "action" (a message like "add one" or "subtract one"). It returns the new state. All the "how do we update?" logic lives in this one function.' },
      { code: '  switch (action.type) {', explanation: 'We look at the action\'s type to decide what to do. So if the message is "INCREMENT" we add one; if it\'s "DECREMENT" we subtract one. The action is usually an object with a type (and maybe more info).' },
      { code: "    case 'INCREMENT': return { count: state.count + 1 }", explanation: 'If the message type is INCREMENT, we return a new state object where count is one more than before. We never change the old state—we always return a new object. That\'s how React knows something changed.' },
      { code: "    case 'DECREMENT': return { count: state.count - 1 }", explanation: 'If the message type is DECREMENT, we return new state with count minus one. Same idea: new object, don\'t mutate the old one.' },
      { code: 'const [state, dispatch] = useReducer(reducer, { count: 0 })', explanation: 'useReducer needs the reducer function and the starting state ({ count: 0 }). It gives us state (the current value, e.g. { count: 5 }) and dispatch (a function we call to send a message). When we call dispatch with an action, the reducer runs and React redraws with the new state.' },
      { code: "onClick={() => dispatch({ type: 'INCREMENT' })}", explanation: 'When the user clicks the button, we "dispatch" a message: { type: \'INCREMENT\' }. React calls our reducer with the current state and this action; the reducer returns the new state (count + 1), and the screen updates.' }
    ],
    inOurExample: [
      '**What happens:** When UseReducerLesson first renders, useReducer(reducer, { count: 0 }) gives us state = { count: 0 } and dispatch. We show state.count (0). When you click "increase," we call dispatch({ type: \'INCREMENT\' }). React takes the current state ({ count: 0 }) and the action, and calls countReducer(state, action). The reducer\'s switch sees action.type === \'INCREMENT\', so it returns { count: 1 }. React stores that as the new state and redraws. Now state is { count: 1 }, we show 1.',
      '**Why we use useReducer here:** In this demo it\'s just another way to manage a single number—you could do the same with useState. useReducer really shines when you have many different actions (reset, set to value, increment by N) or more complex state, so all update logic lives in one reducer function.',
      '**How it works:** dispatch is a stable function (same reference every time). You call dispatch(action) with an object that describes what happened. React runs your reducer with (currentState, action). Whatever the reducer returns becomes the next state. React then re-renders the component with that new state.'
    ]
  },
  useContext: {
    title: 'useContext',
    intro: 'Context is a way to "pass down" a value to components deep in the tree without passing props through every level. You create a context, a parent "provides" a value (like count and setCount), and any child inside that parent can "read" that value with useContext. No more prop drilling.',
    lines: [
      { code: 'const CountContext = createContext(null)', explanation: 'We create a "channel" called CountContext. The null is the default value if a component uses this context but isn\'t inside a provider. Think of it as a named slot that some parent will fill with a value.' },
      { code: 'function CountProvider({ children }) {', explanation: 'CountProvider is a component that "has" the count (using useState) and wraps its children. Whatever we put inside CountProvider will be able to read that count.' },
      { code: '  const [count, setCount] = useState(0)', explanation: 'Inside the provider we remember the count, same as the useState lesson. This is where the actual number lives.' },
      { code: '  return <CountContext.Provider value={{ count, setCount }}>{children}</CountContext.Provider>', explanation: 'We "provide" the value to the tree: value={{ count, setCount }} means "any child can read count and setCount from here." All components inside {children} can use useContext(CountContext) to get this object.' },
      { code: 'const { count, setCount } = useContext(CountContext)', explanation: 'Inside a child component we say: "give me whatever value CountContext is providing right now." We get back { count, setCount } and use it to show the number and update it when the user clicks. No props needed—we "reached up" to the provider.' }
    ],
    inOurExample: [
      '**What happens:** App renders <CountProvider><UseContextLesson /></CountProvider>. CountProvider runs first: it calls useState(0), so it owns count and setCount. It wraps its children in <CountContext.Provider value={{ count, setCount }}>. UseContextLesson is inside that provider. When UseContextLesson runs, it calls useContext(CountContext). React looks up the tree for the nearest CountContext.Provider and returns its value—so we get { count, setCount } from the provider. We show {count} and the buttons call setCount(count + 1) or setCount(count - 1). That updates state inside CountProvider, so the provider re-renders, the value prop changes, and UseContextLesson (as a descendant) re-renders too with the new count.',
      '**Why we use context:** So UseContextLesson doesn\'t need count and setCount passed as props from App. Without context we\'d have to do <UseContextLesson count={count} setCount={setCount} />. With context, the component "reaches up" to the provider and gets the value itself. When you have many levels of components that need the same data, context avoids passing props through every level ("prop drilling").',
      '**How it fits together:** The provider holds the real state (useState) and passes it down via value={...}. Any component that renders inside that provider—no matter how deep—can call useContext(CountContext) and get the current value. When the provider\'s state changes, its value changes, so every component that used useContext re-renders with the new value.'
    ]
  }
}

function App() {
  const [count, setCount] = useState(0)
  const [openModal, setOpenModal] = useState(null)

  return (
    <div className="app-lessons">
      <div className="counter-card" onClick={() => setOpenModal('useState')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setOpenModal('useState')}>
        <h1 className="title">useState Lesson</h1>
        <p className="count-display">{count}</p>
        <div className="buttons" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-decrease" onClick={() => setCount(count - 1)}>decrease</button>
          <button className="btn btn-increase" onClick={() => setCount(count + 1)}>increase</button>
        </div>
      </div>

      <UseEffectLesson onCardClick={() => setOpenModal('useEffect')} />
      <UseRefLesson onCardClick={() => setOpenModal('useRef')} />
      <UseMemoLesson onCardClick={() => setOpenModal('useMemo')} />
      <UseCallbackLesson onCardClick={() => setOpenModal('useCallback')} />
      <UseReducerLesson onCardClick={() => setOpenModal('useReducer')} />
      <CountProvider>
        <UseContextLesson onCardClick={() => setOpenModal('useContext')} />
      </CountProvider>

      {openModal && (
        <div className="modal-overlay" onClick={() => setOpenModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{LESSONS[openModal].title}</h2>
            <p className="modal-intro">{LESSONS[openModal].intro}</p>
            <div className="modal-code-block">
              {LESSONS[openModal].lines.map((item, i) => (
                <div key={i} className="modal-code-line">
                  <div className="modal-code">
                    <span className="modal-line-num">{i + 1}</span>
                    <code>{item.code}</code>
                  </div>
                  <p className="modal-line-explanation">{item.explanation}</p>
                </div>
              ))}
            </div>
            {LESSONS[openModal].inOurExample && (
              <div className="modal-in-our-example">
                <h3 className="modal-in-our-example-title">In our example</h3>
                {LESSONS[openModal].inOurExample.map((paragraph, i) => (
                  <p key={i} className="modal-in-our-example-p">
                    {paragraph.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                      part.startsWith('**') && part.endsWith('**') ? (
                        <strong key={j}>{part.slice(2, -2)}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
            )}
            <button type="button" className="btn btn-increase modal-close" onClick={() => setOpenModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

function UseEffectLesson({ onCardClick }) {
  const [count, setCount] = useState(0)
  const [effectRanAt, setEffectRanAt] = useState('—')

  useEffect(() => {
    setEffectRanAt(new Date().toLocaleTimeString())
  }, [count])

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useEffect Lesson</h1>
      <p className="count-display">{count}</p>
      <p className="effect-info">Effect last ran at: {effectRanAt}</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={() => setCount(count - 1)}>decrease</button>
        <button className="btn btn-increase" onClick={() => setCount(count + 1)}>increase</button>
      </div>
    </div>
  )
}

function UseRefLesson({ onCardClick }) {
  const [count, setCount] = useState(0)
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useRef Lesson</h1>
      <p className="count-display">{count}</p>
      <p className="effect-info">Re-renders: {renderCount.current}</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={() => setCount(count - 1)}>decrease</button>
        <button className="btn btn-increase" onClick={() => setCount(count + 1)}>increase</button>
      </div>
    </div>
  )
}

function UseMemoLesson({ onCardClick }) {
  const [count, setCount] = useState(0)
  const doubled = useMemo(() => count * 2, [count])

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useMemo Lesson</h1>
      <p className="count-display">{count}</p>
      <p className="effect-info">Doubled: {doubled}</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={() => setCount(count - 1)}>decrease</button>
        <button className="btn btn-increase" onClick={() => setCount(count + 1)}>increase</button>
      </div>
    </div>
  )
}

function UseCallbackLesson({ onCardClick }) {
  const [count, setCount] = useState(0)
  const handleDecrease = useCallback(() => setCount((c) => c - 1), [])
  const handleIncrease = useCallback(() => setCount((c) => c + 1), [])

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useCallback Lesson</h1>
      <p className="count-display">{count}</p>
      <p className="effect-info">Handlers memoized</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={handleDecrease}>decrease</button>
        <button className="btn btn-increase" onClick={handleIncrease}>increase</button>
      </div>
    </div>
  )
}

function countReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 }
    case 'DECREMENT':
      return { count: state.count - 1 }
    default:
      return state
  }
}

function UseReducerLesson({ onCardClick }) {
  const [state, dispatch] = useReducer(countReducer, { count: 0 })

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useReducer Lesson</h1>
      <p className="count-display">{state.count}</p>
      <p className="effect-info">State via reducer</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={() => dispatch({ type: 'DECREMENT' })}>decrease</button>
        <button className="btn btn-increase" onClick={() => dispatch({ type: 'INCREMENT' })}>increase</button>
      </div>
    </div>
  )
}

const CountContext = createContext(null)

function CountProvider({ children }) {
  const [count, setCount] = useState(0)
  return (
    <CountContext.Provider value={{ count, setCount }}>
      {children}
    </CountContext.Provider>
  )
}

function UseContextLesson({ onCardClick }) {
  const { count, setCount } = useContext(CountContext)

  return (
    <div className="counter-card" onClick={onCardClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCardClick?.()}>
      <h1 className="title">useContext Lesson</h1>
      <p className="count-display">{count}</p>
      <p className="effect-info">Value from context</p>
      <div className="buttons" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-decrease" onClick={() => setCount(count - 1)}>decrease</button>
        <button className="btn btn-increase" onClick={() => setCount(count + 1)}>increase</button>
      </div>
    </div>
  )
}

export default App
