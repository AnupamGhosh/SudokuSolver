##[Solve your Sudoku](http://anupamghosh.github.io/SudokuSolver/)
Uses bitmasking to solve the Sudoku, hence faster than trivial method of solving where, for a single `row` the trivial method _**searches**_ which column is still not filled  and then _**checks**_ whether a particular number can be put there; these two _costs_ are not there while using bitmasking. 

This algorithm iterates through all the cells where a number can be placed and then places only those numbers that can be placed in a particular cell
