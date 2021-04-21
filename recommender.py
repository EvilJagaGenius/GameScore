# Database tests using Python's built-in SQLite3 support.  Will need to be rewritten for MySQL, shouldn't be too hard.

print("Running recommender.py")

import sqlite3, math, random, datetime
import mysql.connector

#USER_ID = 1
TOP_LIMIT = 3  # Use only the top 3 games for each category

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

def findNearestTastes(matrix, userID):
    # Takes in a userID and matrix like the one above, gives a userID of a person who shares similar tastes
    results = []  # Priority queue.  Holds our top X matches for the user's tastes
    
    # Get the user's vector and its magnitude
    userVector = matrix[userID-1]
    userVectorMagnitude = 0
    for val in userVector:
        userVectorMagnitude += val ** 2
    userVectorMagnitude = math.sqrt(userVectorMagnitude)
    if userVector != []:
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
                if magnitude != 0:
                    # cos(theta) = dotProduct(A, B) / (magnitude(A) * magnitude(B))
                    cosTheta = dotProduct / (magnitude * userVectorMagnitude)
                    results.append((cosTheta, i+1))  # Insert that other user's ID and cos(theta) into the priority queue)
                    results.sort(reverse=True)  # Sort the priority queue
                    while (len(results) > TOP_LIMIT):  # If we have too many entries
                        results.pop()  # Remove the lowest-priority elements (the userIDs that match the least)

    return results

#nearestTastes = findNearestTastes(MATRIX, USER_ID)
#print(nearestTastes)

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

def getRandomGameID(gameIDs):
    randomIndex = random.randint(0, len(gameIDs)-1)
    randomID = gameIDs[randomIndex][0]
    return randomID

def getGameIDs():
    db = mysql.connector.connect(host="gamescore.gcc.edu",
                             database="gamescore",
                             user="gamescore",
                             password="GameScore2!")
    cursor = db.cursor()
    statement = "SELECT gameID FROM Game"
    cursor.execute(statement)
    results = cursor.fetchall()
    cursor.close()
    db.close()
    return results

def writeToDB(matrix, gameIDs):
    db = mysql.connector.connect(host="gamescore.gcc.edu",
                             database="gamescore",
                             user="gamescore",
                             password="GameScore2!")
    cursor = db.cursor(prepared=True)
    statement = "SELECT userID FROM AppUserRecommendedGame"
    cursor.execute(statement)
    usersInTable = cursor.fetchall()
    #print(usersInTable)
    
    for userID in range(1, len(matrix)+1):
        recommendedGameID, diff = recommendGame(matrix, userID)
        if recommendedGameID == 0:  # We didn't find a good recommendation, make a random one
            recommendedGameID = getRandomGameID(gameIDs)  # Might be cheaper to re-implement this
        if (userID,) not in usersInTable:
            statement = "INSERT INTO AppUserRecommendedGame (gameID, userID) VALUES (%s, %s)"
        else:
            statement = "UPDATE AppUserRecommendedGame SET gameID = %s WHERE userID = %s"
        cursor.execute(statement, (recommendedGameID, userID))
        
    db.commit()
    cursor.close()
    db.close()
    
def writeLog():
    file = open("recommender.log", 'w')
    file.write("recommender.py last run " + str(datetime.datetime.now()) + "\n")
    file.close()
    
print("Generating matrix")
MATRIX = generateMatrix()
print("Collecting game IDs")
GAME_IDS = getGameIDs()
#for row in MATRIX:
#    print(row)
print("Writing to DB")
writeToDB(MATRIX, GAME_IDS)
print("Writing log")
writeLog()
print("End of program")
