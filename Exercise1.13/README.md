- The votes state was defined as an array storing the number of votes for each anecdote.

- The handleNextAnecdote function randomly selects an index to replace the current anecdote.

- The handleVote function adds a vote to the current anecdote and updates the status using a copy of the vote array.

- The number of votes for the current anecdote is indicated by `votes[selected]`.