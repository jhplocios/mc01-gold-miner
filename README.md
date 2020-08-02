You can access the app here https://gold-miner.herokuapp.com/

## MC01 Gold Miner

Gold Miner is a web application of an intelligent agent that simulates a Miner on a square grid with n dimension. The objective of the agent is to reach the pot of gold with the shortest path posible while avoiding falling into a pit. 

Here are the list of the specs of Gold Miner: 

###### MINING AREA

Each location (square) in the mining area (the nxn grid) can have only one of the following objects:

    the miner
    the pot of gold (G)
    a pit (P)
    a beacon (B)

###### FRONT

The miner has a front, indicating the direction of the actions scan and move. The miner moves around the mining area by displacing itself one square to the front, unless it is over the edge of the grid, which should be programmed as a technical “impossibility”.

###### SCAN

To view what is in front of the miner all the way to the edge of the mining area, the miner uses the action scan. The scan action returns only one of the following : p for pit, g for gold, b for beacon, depending on which one of these is nearest to the miner. If there is no pit, beacon nor gold in all the squares in front of the miner, then the action scan returns “NULL”. 

###### ROTATE

The direction of its front can be altered through the action rotate, which moves 90 degrees clockwise each time rotate is invoked.

###### PIT

If the miner moves into square that is a pit, it is game-over!

###### BEACON

A beacon on a square indicates that from that square, the golden square can be reached in m squares in any vertical or horizontal direction, where m < n, without ever falling into a pit. The value of m is not returned by the action scan.

###### GOLDEN SQUARE

If the miner moves into square that contains the pot of gold,   the miner stops, and delivers a “search successful” message. 

###### AGENT RATIONALITY

The locations of the pits and beacons are variable. The most intelligent agent will be determined by comparing the average number of squares that were traversed to reach the golden square.  
