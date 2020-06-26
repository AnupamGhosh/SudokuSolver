import math

class SudokuSolver():
  def __init__(self, A):
    self.N = len(A[0])
    self.n = int(math.sqrt(self.N))

    self.ans = [[0 for _ in range(self.N)] for _ in range(self.N)]
    self.fixed = [0] * self.N
    self.row = [1] * self.N
    self.col = [1] * self.N
    self.box = [1] * self.N
    # self.ldg = [1] * N
    # self.rdg = [1] * N

    for r in range(self.N):
      for c in range(self.N):
        self.ans[r][c] = A[r][c]
        if self.ans[r][c] == 0:
          continue

        x = int(r / self.n) * self.n + int(c / self.n)
        assert (self.row[r] | self.col[c] | self.box[x]) & (1 << self.ans[r][c]) == 0  # no repetation
        self.fixed[r] |= 1 << c
        self.row[r] |= 1 << self.ans[r][c]
        self.col[c] |= 1 << self.ans[r][c]
        self.box[x] |= 1 << self.ans[r][c]

  def solve(self):
    solution_exists = self.solution(0)
    assert solution_exists
    return self.ans

  def solution(self, r):
    if r == self.N:
      return True

    colBit = ~self.fixed[r] & (self.fixed[r] + 1) # rightmost 0 bit
    c = SudokuSolver.countTrailingZero(colBit)
    if c == self.N: # row completed
        return self.solution(r + 1)

    self.fixed[r] |= colBit # assuming colBit index as correct
    x = int(r / self.n) * self.n + int(c / self.n)

    # iterating over remaining [1-9], i.e. 0-values
    mask = self.row[r] | self.col[c] | self.box[x]
    while (mask < (1 << self.N + 1) - 1):
      value = ~mask & mask + 1
      self.ans[r][c] = SudokuSolver.countTrailingZero(value)
      self.row[r] |= value # remembers row[r] contains value
      self.col[c] |= value # sets the value bit
      self.box[x] |= value
      if self.solution(r):
          return True

      self.row[r] ^= value # clears the value bit
      self.col[c] ^= value
      self.box[x] ^= value
      mask |= mask + 1


    self.fixed[r] ^= colBit
    return False

  @staticmethod
  def countTrailingZero(x): 
    count = 0
    while ((x & 1) == 0): 
      x = x >> 1
      count += 1
      
    return count


A = [
  [0, 0, 0, 0, 3, 0, 11, 0, 0, 0, 5, 0, 0, 0, 16, 9],
  [0, 3, 2, 5, 0, 0, 10, 15, 0, 0, 0, 14, 0, 8, 12, 13],
  [4, 0, 15, 7, 2, 14, 0, 0, 0, 0, 8, 0, 5, 0, 0, 0],
  [0, 12, 0, 16, 5, 0, 0, 6, 10, 4, 0, 11, 7, 0, 0, 15],
  [0, 11, 3, 0, 0, 12, 0, 0, 8, 0, 4, 10, 15, 9, 0, 0],
  [0, 6, 5, 4, 0, 11, 0, 0, 1, 12, 14, 0, 13, 0, 10, 0],
  [0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 1, 5, 0],
  [2, 14, 0, 0, 13, 16, 0, 1, 5, 0, 7, 9, 0, 4, 11, 0],
  [0, 13, 8, 0, 11, 3, 0, 4, 9, 0, 16, 15, 0, 0, 7, 5],
  [0, 16, 14, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0],
  [0, 15, 0, 2, 0, 1, 14, 16, 0, 0, 13, 0, 9, 10, 8, 0],
  [0, 0, 11, 3, 8, 7, 0, 10, 0, 0, 1, 0, 0, 14, 13, 0],
  [15, 0, 0, 6, 14, 0, 12, 3, 2, 0, 0, 16, 10, 0, 9, 0],
  [0, 0, 0, 11, 0, 2, 0, 0, 0, 0, 6, 1, 8, 12, 0, 14],
  [12, 2, 13, 0, 16, 0, 0, 0, 14, 9, 0, 0, 3, 5, 4, 0],
  [3, 8, 0, 0, 0, 15, 0, 0, 0, 13, 0, 4, 0, 0, 0, 0]
]
solver = SudokuSolver(A)
solution = solver.solve()
for row in solution:
  for no in row:
    print("%2d" % no, end=' ')
  print()
