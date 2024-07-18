- Three different states are managed within the app component: good, neutral and bad. Each one is initialized with the useState hook and its initial values ​​are set to 0.

- <div>: A container element that encapsulates all content.

- <h1>: The main heading asks for feedback from users.

- Three <button>: OnClick event is defined for each button. When the button is clicked, the relevant status is incremented by one:
  * "good" button: calls the setGood(good + 1) function.
  * "neutral" button: calls the setNeutral(neutral + 1) function.
  * "bad" button: calls the setBad(bad + 1) function.

- A second <div> for statistics:
  * <h2>: Statistics heading.
  * Three <p>s: Each shows the relevant number of feedback (good, neutral, bad).