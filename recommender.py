# Database tests using Python's built-in SQLite3 support.  Will need to be rewritten for MySQL, shouldn't be too hard.

import sqlite3, math, random
import mysql.connector

USER_ID = 1
TOP_LIMIT = 3  # Use only the top 3 games for each category

# Load the DB
#db = sqlite3.connect("db.sqlite3")
#cursor = db.cursor()

print("User ID:", USER_ID)

# Create a matrix to do math off of
def generateMatrix():
    db = mysql.connector.connect(host="gamescore.gcc.edu",
                             database="gamescore",
                             user="gamescore",
                             password="GameScore2!")
    cursor = db.cursor()
    # Let's say, for the moment, our metric is total games played.
    statement = "SELECT userID, gameID, gamesPlayed FROM AppUserPlayedGame ORDER BY userID ASC, gameID ASC"
    cursor.execute(statement)
    results = cursor.fetchall()
    
    matrix = []
    for row in results:
        userID = int(row[0])
        while userID > len(matrix):  # If there's no row in the matrix for the user yet, add a row for them
            matrix.append([])
        gameID = int(row[1])
        while gameID > len(matrix[userID-1]):  # If there's no cell for that game yet, add 0s until there is
            matrix[userID-1].append(0)
        matrix[userID-1][gameID-1] = int(row[2])
    
    cursor.close()
    db.close()

    return matrix

MATRIX = generateMatrix()

for row in MATRIX:
    print(row)

def findNearestTastes(matrix, userID):
    # Takes in a userID and matrix like the one above, gives a userID of a person who shares similar tastes
    results = []  # Priority queue.  Holds our top X matches for the user's tastes
    
    # Get the user's vector and its magnitude
    userVector = matrix[userID-1]
    userVectorMagnitude = 0
    for val in userVector:
        userVectorMagnitude += val ** 2
    userVectorMagnitude = math.sqrt(userVectorMagnitude)
    for i in range(len(matrix)):
        vector = matrix[i]
        if (userID-1) != i and len(vector) > 0:  # If we're not looking at the user's own row (and the vector actually has data)
            # Treat them as vectors and dot them together
            magnitude = 0
            dotProduct = 0
            for j in range(len(userVector)):
                if j < len(vector):
                    dotProduct += userVector[j] * vector[j]
                    magnitude += vector[j] ** 2
            magnitude = math.sqrt(magnitude)
            # cos(theta) = dotProduct(A, B) / (magnitude(A) * magnitude(B))
            cosTheta = dotProduct / (magnitude * userVectorMagnitude)
            results.append((cosTheta, i+1))  # Insert that other user's ID and cos(theta) into the priority queue)
            results.sort(reverse=True)  # Sort the priority queue
            while (len(results) > TOP_LIMIT):  # If we have too many entries
                results.pop()  # Remove the lowest-priority elements (the userIDs that match the least)

    return results

nearestTastes = findNearestTastes(MATRIX, USER_ID)
print(nearestTastes)

# Look through the games that user has played, see if we can find a new one to recommend
def recommendGame(matrix, userID):
    nearestTastes = findNearestTastes(matrix, userID)
    userVector = matrix[userID-1]
    # Goal: Find games that the user has played the least and the people they share tastes with have played the most
    maxDiff = 0
    maxDiffIndex = 0

    for n in nearestTastes:
        nearestID = n[1]
        for i in range(len(matrix[nearestID-1])):  # Loop through the games that user has played
            userPlays = 0
            if i < len(userVector):
                userPlays = userVector[i]
            diff = matrix[nearestID-1][i] - userPlays
            if diff > maxDiff:
                maxDiff = diff
                maxDiffIndex = i+1
            
    return maxDiffIndex, maxDiff

def getRandomGameID():
    db = mysql.connector.connect(host="gamescore.gcc.edu",
                             database="gamescore",
                             user="gamescore",
                             password="GameScore2!")
    cursor = db.cursor()
    statement = "SELECT gameID FROM Game"
    cursor.execute(statement)
    results = cursor.fetchall()
    randomIndex = random.randint(0, len(results)-1)
    randomID = results[randomIndex][0]
    
    cursor.close()
    db.close()

    return randomID

recommendedGameID, diff = recommendGame(MATRIX, USER_ID)
if recommendedGameID == 0:  # This means we couldn't find anything good to recommend using the algorithm
    print("Recommending random game ID")
    recommendedGameID = getRandomGameID()  # Grab a random ID
print("Recommended game ID:", recommendedGameID, ", Diff:", diff)
print("End of program")
