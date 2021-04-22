# Database tests using Python's built-in SQLite3 support.  Will need to be rewritten for MySQL, shouldn't be too hard.

print("Running recommender.py")

import sqlite3, math, random, datetime
import mysql.connector

#USER_ID = 1
NEAREST_USERS_LIMIT = 3  # Number of other users to draw from
RECOMMENDATIONS_LIMIT = 10  # Number of games to recommend

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
                    while (len(results) > NEAREST_USERS_LIMIT):  # If we have too many entries
                        results.pop()  # Remove the lowest-priority elements (the userIDs that match the least)

    return results

#nearestTastes = findNearestTastes(MATRIX, USER_ID)
#print(nearestTastes)

# Look through the games that user has played, see if we can find a new one to recommend
def recommendGames(matrix, userID):
    nearestTastes = findNearestTastes(matrix, userID)
    userVector = matrix[userID-1]
    # Goal: Find games that the user has played the least and the people they share tastes with have played the most
    maxDiffs = [float("-inf")] * RECOMMENDATIONS_LIMIT
    maxDiffIndices = [-1] * RECOMMENDATIONS_LIMIT

    for n in nearestTastes:
        nearestID = n[1]
        for i in range(len(matrix[nearestID-1])):  # Loop through the games that user has played
            # Get the number of times the user we're recommending for has played that game
            userPlays = 0
            if i < len(userVector):
                userPlays = userVector[i]
            diff = matrix[nearestID-1][i] - userPlays

            if i+1 not in maxDiffIndices:
                # Insert the recommendation in the list
                for j in range(RECOMMENDATIONS_LIMIT):
                    if diff > maxDiffs[j]:
                        maxDiffs.insert(j, diff)
                        maxDiffIndices.insert(j, i+1)
                        maxDiffs.pop()
                        maxDiffIndices.pop()
                        break
            
    return maxDiffIndices, maxDiffs

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

def convertIndexToGameID(matrixIndex, gameIDs):
    return gameIDs[matrixIndex][0]

def writeToDB(matrix, gameIDs):
    print("Connecting to DB...")
    db = mysql.connector.connect(host="gamescore.gcc.edu",
                             database="gamescore",
                             user="gamescore",
                             password="GameScore2!")
    try:
        cursor = db.cursor(prepared=True)
        print("Connection established")
        statement = "SELECT * FROM AppUserRecommendedGame"
        cursor.execute(statement)
        print(cursor.fetchall())

        # Clear the recommendations table
        statement = "DELETE FROM AppUserRecommendedGame"
        cursor.execute(statement)
        print("Recommendations table cleared")
        try:
            for userID in range(1, len(matrix)+1):
                #print("For loop")
                recommendedGameIDs, diffs = recommendGames(matrix, userID)
                print("matrixIndices for", userID, recommendedGameIDs)
                #recommendedGameIDs = [-1] * RECOMMENDATIONS_LIMIT
                for i in range(len(recommendedGameIDs)):
                    if (recommendedGameIDs[i],) not in gameIDs:  # We didn't find a good recommendation, make a random one
                        #print("Recommending random ID")
                        randomID = getRandomGameID(gameIDs)
                        while randomID in recommendedGameIDs:  # Make sure it's not a duplicate of something else in the list
                            #print("randomID while loop")
                            randomID = getRandomGameID(gameIDs)
                        recommendedGameIDs[i] = randomID
                    #else:
                        #print("Converting ID", matrixIndices[i])
                        #recommendedGameIDs[i] = convertIndexToGameID(matrixIndices[i], gameIDs)  # Maybe this conversion helps.  I believe recommendGames() just gives indices in the matrix, not actual game IDs
                        #print("Converted ID:", recommendedGameIDs[i])
                        
                    #print("Recommended ID: " + str(recommendedGameIDs[i]))
                    print("userID:", userID, "gameID:", recommendedGameIDs[i])
                    statement = "INSERT INTO AppUserRecommendedGame (gameID, userID) VALUES (%s, %s)"
                    cursor.execute(statement, (recommendedGameIDs[i], userID))

            db.commit()
        except Exception as e:
            print("Error while writing to DB")
            print(e)
            
        cursor.close()
        
    finally:
        db.close()
    
def writeLog():
    file = open("recommender.log", 'w')
    file.write("recommender.py last run " + str(datetime.datetime.now()) + "\n")
    file.close()
    
print("Generating matrix")
MATRIX = generateMatrix()
print("Collecting game IDs")
GAME_IDS = getGameIDs()
print(len(GAME_IDS))
#for row in MATRIX:
#    print(row)
print("Writing to DB")
writeToDB(MATRIX, GAME_IDS)
print("Writing log")
writeLog()
print("End of program")
