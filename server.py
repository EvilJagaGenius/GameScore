# GameScore server
# Nathan J. McNany, Joshua Benjamin 2021

import mysql.connector
import secrets
import json

# Setup
from flask import flash, Flask, jsonify, make_response, redirect, render_template, request, Response, session, url_for
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)

#### DB Functions ###
connection = None

def init_db():
    return mysql.connector.connect(
      host="10.18.110.183",
      user="gamescore",
      password="GameScore2!",
      database="gamescore"
    )


connection = init_db()

def get_cursor():
    global connection
    try:
        connection.ping(reconnect=True, attempts=3, delay=5)
    except mysql.connector.Error as err:
        # reconnect your cursor as you did in __init__ or whereve    
        connection = init_db()
    return connection.cursor(prepared=True)


# Cleanup function
@app.teardown_appcontext
def cleanup(exception):
    # Do something, Taipu
    pass

#Routes
@app.route("/profile/")
def profileGET():
    return render_template("profile.html")

@app.route("/join/")
def joinGET():
    return render_template("join.html")

@app.route("/play/")
def playGET():
    return render_template("play.html")

@app.route("/mytemplates/")
def myTemplatesGET():
    return render_template("mytemplates.html")

@app.route("/postgame/")
def postGameGET():
    return render_template("postgame.html")

@app.route("/logout/")
def logoutGET():
    #Clear Auth Cookies
    response = make_response(redirect('/home/'))
    response.set_cookie('credHash',"",max_age=0)
    response.set_cookie('username',"",max_age=0) 
    return response

@app.route('/createaccount/')
def createAccountGET():
    return render_template('createaccount.html')

@app.route('/createaccount/', methods=['POST'])
def createAccountPost():
    global connection
    #Get Values
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    #Check DB for dupe email
    mycursor = get_cursor()
    stmtCheckEmail = (
        "select userID from UppUser where email = %s"
    )
    mycursor.execute(stmtCheckEmail,(email,))
    myresult = mycursor.fetchone()
    mycursor.close()

    #If email not already in DB, create account updating DB
    if myresult == None:
        mycursor = get_cursor()
        stmtAddUser = ( "INSERT INTO AppUser(username,userPassword,email) VALUES(%s,SHA1(%s),%s)")
        mycursor.execute(stmtAddUser,(username,password,email,))
        connection.commit()
        mycursor.close()
        return redirect(url_for('login'))
    else:
        return redirect(url_for('createAccountGET'))
    
    return redirect(url_for('homePage'))


@app.route('/login/')
def login():
    #Check Cookies
    credHash = request.cookies.get('credHash')
    username = request.cookies.get('username')

    #Check if user exists with that username and that credHash
    mycursor = get_cursor()
    stmt = ("select userID from AppUser where credHash = %s AND username = %s")
    mycursor.execute(stmt,(credHash,username,))
    myresult = mycursor.fetchone()
    mycursor.close()

    if(myresult!=None):
        return redirect(url_for('homePage'))
    else:
        return render_template('login.html')

@app.route('/login/', methods=['POST'])
def login_post():
    global connection
    #Get Form Info
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    #Check to see if username/password combo exists
    mycursor = get_cursor()
    stmt = ("select userID from AppUser where userPassword = SHA1(%s) AND username = %s")
    mycursor.execute(stmt,(password,username,))
    myresult = mycursor.fetchone()
    mycursor.close()

    if myresult == None:
        response = make_response(redirect('/login'))
        return response
    else: #Add cookies, and add credHash to DB
        response = make_response(redirect('/home/'))

        token = secrets.token_hex(32)
        response.set_cookie('credHash',token)
        response.set_cookie('username', username)

        mycursor = get_cursor()
        stmt = ("update AppUser SET credHash = %s where userPassword = SHA1(%s) AND username = %s")
        mycursor.execute(stmt,(token,password,username,))
        connection.commit()
        mycursor.close()
        return response
    
    return redirect(url_for('homePage'))

# /home/ (default route)
@app.route("/home/")
@app.route("/")
def homePage():
    # Do something, Taipu
    print('HEY IT WORKS!12345')
    return render_template("home.html")




##################################### homepage API ########################################

@app.route("/api/getHomePage")
def apiGetHomePage():
    #Create JSON framework for what we will return
    result = {"highestRated":[]
              ,"recommendedGames":[]
              ,"favoritedTemplates":[]
              ,"recentlyPlayed":[]}

    ### Highest Rated Templates ###
    
    #Execute sql call to get appropriate data
    mycursor = get_cursor()
    stmt = ("select pictureURL, templateName, numRatings, averageRating from Template JOIN Game ON Template.gameID=Game.gameID ORDER BY averageRating DESC LIMIT 10")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"NumRatings":numRatings
                    ,"averageRating":averageRating}
        #append each new dictionary to its appropriate list
        result["highestRated"].append(template)


    ### Recommended Games ###
    
    #Execute sql call to get appropriate data
    mycursor = get_cursor()
    stmt = ("select pictureURL, gameName from AppUserRecommendedGame JOIN Game ON AppUserRecommendedGame.gameID=Game.gameID LIMIT 8")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, gameName = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"gameName":"{}".format(gameName)}
        #append each new dictionary to its appropriate list
        result["recommendedGames"].append(template)



    ### Favorited Templates ###
    
    #Execute sql call to get appropriate data
    mycursor = get_cursor()
    stmt = ("select pictureURL, templateName, numRatings, averageRating from Template JOIN Game ON Template.gameID=Game.gameID JOIN AppUserInteractTemplate ON Template.templateID=AppUserInteractTemplate.templateID WHERE favorited=true ORDER BY averageRating DESC LIMIT 10")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"NumRatings":numRatings
                    ,"averageRating":averageRating}
        #append each new dictionary to its appropriate list
        result["favoritedTemplates"].append(template)



    ### Recently Played ###
    
    #Execute sql call to get appropriate data
    mycursor = get_cursor()
    stmt = ("select pictureURL, templateName, numRatings, averageRating from Template JOIN Game ON Template.gameID=Game.gameID JOIN AppUserInteractTemplate ON Template.templateID=AppUserInteractTemplate.templateID ORDER BY lastPlayed DESC, averageRating DESC LIMIT 10")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"NumRatings":numRatings
                    ,"averageRating":averageRating}
        #append each new dictionary to its appropriate list
        result["recentlyPlayed"].append(template)



  
    return result

##################################### getScoring API ########################################

@app.route("/api/getScoring")
def apiGetScoring():
    #Create JSON framework for what we will return
    result = {"scoringOverview":[]
              ,"globalAwards":[]
              ,"individualScoring":[]}

    ### Scoring Overview ###
    
    #Get Template and GameName Info
    mycursor = get_cursor()
    stmt = ("select matchID, ActiveMatch.gameID, ActiveMatch.templateID, gameName, templateName from ActiveMatch JOIN Template ON ActiveMatch.templateID = Template.templateID AND ActiveMatch.gameID = Template.gameID JOIN Game ON Template.gameID=Game.gameID ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    mycursor.close()

    #Parse Game/Template Info
    matchID, gameID, templateID, gameName, templateName = myresult
    overview = {"templateName":"{}".format(templateName)
                  ,"templateID":templateID
                  ,"gameName":"{}".format(gameName)
                  ,"gameID":gameID
                  , "players":[]}
    result["scoringOverview"] = overview

    #Get Players info
    mycursor = get_cursor()
    stmt = ("select DISTINCT Player.playerID, Player.totalScore, Player.displayOrder, displayName from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = %s")

    mycursor.execute(stmt,(matchID,))
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        playerID, score, displayOrder, displayName = row
        player = {"playerID":playerID
                    ,"score":score
                    ,"displayOrder":displayOrder
                    ,"displayName":"{}".format(displayName)}
        #append each new dictionary to its appropriate list
        result["scoringOverview"]["players"].append(player)

    ### Global Awards ###
    #Get Conditions
    mycursor = get_cursor()
    stmt = ("select DISTINCT conditionName, maxPerGame, conditionID FROM ScoringCondition JOIN ActiveMatch using (GameID, TemplateID) WHERE matchID = %s AND maxPerGame > 0")
    mycursor.execute(stmt,(matchID,))
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        conditionName, maxPerGame, conditionID = row
        condition = {"conditionName":"{}".format(conditionName)
                    ,"maxPerGame":maxPerGame
                    ,"players":[]}

        mycursor = get_cursor()
        stmt = ("SELECT value, Player.displayName FROM ActiveMatchPlayerConditionScore JOIN Player using(playerID) WHERE conditionID = %s AND Player.matchID = %s")
        mycursor.execute(stmt,(conditionID,matchID))
        myresultPlayer = mycursor.fetchall()
        mycursor.close()

        #For each row returned from DB: parse and create a dictionary from it
        for rowPlayer in myresultPlayer:
          value, displayName = rowPlayer
          player = {"value":value
                    ,"displayName":"{}".format(displayName)}
          #append each new dictionary to its appropriate list
          condition["players"].append(player)

        
        #append each new dictionary to its appropriate list
        result["globalAwards"].append(condition)


    ### Individual Scoring ###
    mycursor = get_cursor()
    stmt = ("select DISTINCT Player.playerID, Player.displayName, Player.totalScore from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = %s")
    mycursor.execute(stmt,(matchID,))
    myresultPlayer = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for rowPlayer in myresultPlayer:
        playerID, displayName,totalScore = rowPlayer
        player = {"playerID":playerID
                    ,"displayName":"{}".format(displayName)
                    ,"conditions":[]
                    ,"totalScore":totalScore}

        mycursor = get_cursor()
        stmt = ("select conditionName, value, score, inputType FROM ActiveMatchPlayerConditionScore JOIN ScoringCondition using(conditionID,templateID,gameID)WHERE ActiveMatchPlayerConditionScore.matchID = %s AND playerID = %s")
        mycursor.execute(stmt,(matchID,playerID))
        myresultCondition = mycursor.fetchall()
        mycursor.close()

        for rowCondition in myresultCondition:
            conditionName, value, score, inputType = rowCondition
            condition = {"conditionName":"{}".format(conditionName)
                    ,"score":score
                    ,"value":value
                    ,"inputType":"{}".format(inputType)}
            #append each new dictionary to its appropriate list
            player["conditions"].append(condition)
      
        
        #append each new dictionary to its appropriate list
        result["individualScoring"].append(player)

    return result


##################################### postgame API ########################################

@app.route("/api/getPostGame")
def apiGetPostGame():
    #Create JSON framework for what we will return

    mycursor = get_cursor()
    stmt = ("select gameName, templateName,matchID FROM ActiveMatch JOIN Game using(gameID) JOIN Template using(templateID) ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    mycursor.close()

    gameName,templateName,matchID = myresult

    mycursor = get_cursor()
    stmt = ("select displayName FROM Player WHERE totalScore in (Select MAX(totalScore) FROM Player WHERE matchID=%s GROUP BY matchID) LIMIT 1")
    mycursor.execute(stmt,(matchID,))
    myresult = mycursor.fetchone()
    mycursor.close()

    winnerDisplayName = myresult

    result = {"gameName":"{}".format(gameName)
                    ,"templateName":"{}".format(templateName)
                    ,"winnerDisplayName":"{}".format(winnerDisplayName)
                    ,"scoreTable":[]
                    ,"numOfPlayers":[]}

    mycursor = get_cursor()
    stmt = ("select RANK() OVER (PARTITION BY matchID ORDER BY totalScore desc),displayName,totalScore FROM Player WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    myresult = mycursor.fetchall()
    mycursor.close()

    result["numOfPlayers"] = len(myresult)

    for row in myresult:
            rank, displayName,score = row
            finalScoreRow = {"rank":rank
                    ,"displayName":"{}".format(displayName)
                    ,"score":score}
            #append each new dictionary to its appropriate list
            result["scoreTable"].append(finalScoreRow)
    
    return result


##################################### start game API ########################################

@app.route("/api/postCreateNewGame")
def apiPostCreateNewGame():
    global connection
    templateID = request.args.get('templateID')
    gameID = request.args.get('gameID')
    numPlayers = request.args.get('numOfPlayers')

    mycursor = get_cursor()
    stmt = ("INSERT INTO ActiveMatch(templateID, gameID) VALUES(%s,%s)")
    mycursor.execute(stmt,(templateID,gameID))
    mycursor.close()

    mycursor = get_cursor()
    stmt = ("SELECT LAST_INSERT_ID()")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    matchID, = myresult
    mycursor.close()

    #Find Condition IDs for Template
    mycursor = get_cursor()
    stmt = ("Select conditionID FROM ScoringCondition WHERE templateID=%s")
    mycursor.execute(stmt,(templateID,))
    conditionList = mycursor.fetchall()
    mycursor.close()
  
    for x in range(1, int(numPlayers)+1):

        displayName = "Player"+str(x)
        if x==1:
            displayName = "Caustic Prince"

        userID = None
        if x==1:
            userID = 1
        #Create Players in the DB
        mycursor = get_cursor()
        stmt = ("INSERT INTO Player(userID,color,displayOrder,totalScore,displayName,matchID) VALUES(%s,'RED',%s,0,%s,%s)")
        mycursor.execute(stmt,(userID,x,displayName,matchID))
        mycursor.close()

        #Find new PlayerID
        mycursor = get_cursor()
        stmt = ("SELECT LAST_INSERT_ID()")
        mycursor.execute(stmt,())
        myresult = mycursor.fetchone()
        playerID, = myresult
        mycursor.close()

        for row in conditionList:
            conditionID, = row
            mycursor = get_cursor()
            stmt = ("INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score) VALUES(%s,%s,%s,%s,%s,0,0)")
            mycursor.execute(stmt,(matchID,playerID,conditionID,gameID,templateID))
            mycursor.close()
    
    connection.commit()
    
    #return {"result":"successful","matchID":matchID,"gameID":gameID,"templateID":templateID}

    return redirect(url_for('apiGetScoring'))

##################################### update Scoring API ########################################

@app.route("/api/postUpdateScore")
def apiPostUpdateScore():
    global connection
    conditionID = request.args.get('conditionID')
    value = float(request.args.get('value'))
    playerID = request.args.get('playerID')
    
    mycursor = get_cursor()
    stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(1,))
    myresult = mycursor.fetchone()
    matchID, = myresult
    mycursor.close()

    mycursor = get_cursor()
    stmt = ("SELECT scoringType, pointMultiplier FROM ScoringCondition WHERE conditionID=%s")
    mycursor.execute(stmt,(conditionID,))
    myresult = mycursor.fetchone()
    scoringType, pointMultiplier = myresult
    mycursor.close()

    if scoringType == 'Linear':
        score = value * float(pointMultiplier)
    elif scoringType == 'Tabular':
        mycursor = get_cursor()
        stmt = ("SELECT inputMax, inputMin, outputValue FROM ValueRow WHERE conditionID=%s ORDER BY inputMin ASC")
        mycursor.execute(stmt,(conditionID,))
        valueRows = mycursor.fetchall()
        mycursor.close()

        score = 0
        for row in valueRows:
            inputMax,inputMin,outputValue
            if value >= minValue and value <maxValue:
                score = outputValue
                break

    mycursor = get_cursor()
    stmt = ("UPDATE ActiveMatchPlayerConditionScore SET score=%s, value=%s WHERE conditionID=%s AND playerID=%s AND matchID = %s")
    mycursor.execute(stmt,(score,value,conditionID,playerID,matchID))
    mycursor.fetchone()
    mycursor.close()
    connection.commit()
    return redirect(url_for('apiGetScoring'))


##################################### Finalize Score API ####################################
@app.route("/api/postFinalizeScore")
def apiPostFinalizeScore():
    global connection
    mycursor = get_cursor()
    stmt = ("SELECT matchID, Template.templateID, Template.gameID,templateName,gameName FROM AppUser JOIN Player using(userID) JOIN ActiveMatch using(matchID) JOIN Template using(templateID) JOIN Game on Template.gameID=Game.gameID WHERE AppUser.userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(1,))
    myresult = mycursor.fetchone()
    matchID,templateID,gameID,templateName,gameName = myresult
    mycursor.close()


    #Find winning player ID
    mycursor = get_cursor()
    stmt = ("select playerID FROM Player WHERE totalScore in (Select MAX(totalScore) FROM Player WHERE matchID=%s GROUP BY matchID) LIMIT 1")
    mycursor.execute(stmt,(matchID,))
    myresult = mycursor.fetchone()
    winningPlayerID = myresult
    mycursor.close()


    #Find all Actual Users for that current match
    mycursor = get_cursor()
    stmt = ("SELECT userID, totalScore, playerID FROM AppUser JOIN Player using(userID) WHERE matchID=%s ORDER BY totalScore DESC")
    mycursor.execute(stmt,(matchID,))
    listUsers = mycursor.fetchall()
    mycursor.close()


    #Find all Players for that current match
    mycursor = get_cursor()
    stmt = ("SELECT displayName,totalScore FROM Player WHERE matchID=%s ORDER BY totalScore DESC")
    mycursor.execute(stmt,(matchID,))
    listPlayers = mycursor.fetchall()
    mycursor.close()

    #Create JSON for storing scores
    result = {"gameName":"{}".format(gameName)
                  ,"templateName":"{}".format(templateName)
                  ,"players":[]}
    for row in listPlayers:
          displayName,totalScore = row
          player = {"displayName":"{}".format(displayName)
                    ,"totalScore":totalScore}
          result["players"].append(player)
   
        

    for row in listUsers:
          userID,totalScore,playerID= row
          #See if entry already exists (interacted with template)
          mycursor = get_cursor()
          stmt = ("SELECT userID FROM AppUserInteractTemplate WHERE templateID=%s AND userID=%s")
          mycursor.execute(stmt,(templateID,userID))
          myresult = mycursor.fetchall()
          mycursor.close()

          #If no entry exists
          if(len(myresult)<=0):
              mycursor = get_cursor()
              stmt = ("INSERT INTO AppUserInteractTemplate(userID,gameID,templateID,lastPlayed) VALUES(%s,%s,%s,now())")
              mycursor.execute(stmt,(userID,gameID,templateID))
              mycursor.close()
          else:
              mycursor = get_cursor()
              stmt = ("UPDATE AppUserInteractTemplate SET lastPlayed=now() WHERE templateID=%s AND userID=%s")
              mycursor.execute(stmt,(templateID,userID))
              mycursor.close()


          #See if entry already exists (played this game)
          mycursor = get_cursor()
          stmt = ("SELECT userID FROM AppUserPlayedGame WHERE gameID=%s AND userID=%s")
          mycursor.execute(stmt,(gameID,userID))
          myresult = mycursor.fetchall()
          mycursor.close()

          #If no entry exists, create blank entry (for game stats)
          if(len(myresult)<=0):
              mycursor = get_cursor()
              stmt = ("INSERT INTO AppUserPlayedGame(userID,gameID) VALUES(%s,%s)")
              mycursor.execute(stmt,(userID,gameID))
              mycursor.close()

          if playerID == winningPlayerID:
                wonCount = 1
          else:
                wonCount = 0              
          mycursor = get_cursor()
          
          stmt = ("UPDATE AppUserPlayedGame SET gamesPlayed = gamesPlayed + 1, gamesWon = gamesWon + %s, aggregateScore = aggregateScore + %s WHERE gameID=%s AND userID=%s")
          mycursor.execute(stmt,(wonCount,totalScore,gameID,userID))
          mycursor.close()


          mycursor = get_cursor()
          stmt = ("INSERT INTO AppUserHistoryGame(userID,gameID,gameHistoryString) VALUES(%s,%s,%s)")
          mycursor.execute(stmt,(userID,gameID,json.dumps(result)))
          mycursor.close()

    
    connection.commit()
    return redirect(url_for('apiGetPostGame'))

##################################### Leave Game API ########################################

@app.route("/api/postLeaveGame")
def apiPostLeaveGame():

    #Assuming only main player/host is leaving
    mycursor = get_cursor()
    stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(1,))
    myresult = mycursor.fetchone()
    matchID, = myresult
    mycursor.close()

    destroyMatch(matchID)
    
    return "success"


#Destroys match given the matchID
def destroyMatch(matchID):
    global connection
    mycursor = get_cursor()
    stmt = ("DELETE FROM ActiveMatchPlayerConditionScore WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()
    
    mycursor = get_cursor()
    stmt = ("DELETE FROM Player WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()

    mycursor = get_cursor()
    stmt = ("DELETE FROM ActiveMatch WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()
    connection.commit()
    return "success"

    
      
##################################### edit Template API ########################################

# Edit template stuff
@app.route("/edit/", methods=["GET"])
def editTemplateGET():
	# Skeleton function.  Returns all the conditions for this specific template in JSON form.
	templateID = session.get("templateID", None)
	if templateID == None:
		return "templateID not set"
	cursor = get_cursor()
	statement = """
	SELECT conditionID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier
	FROM ScoringCondition WHERE templateID = %s;
	"""
	cursor.execute(statement, (templateID,))
	result = cursor.fetchall()
	print(result)  # Result is a list of tuples
	
	response = {}
	for t in result:
		# Add that tuple to our response
		dictionary = {
		"conditionName": t[1],
		"description": t[2],
		"maxPerGame": t[3],
		"maxPerPlayer": t[4],
		"scoringType": t[5],
		"pointMultiplier": t[6]
		}
		response.update({t[0]: dictionary})  # Use conditionID as a key
	
	#return "Edit Template goes here"  # Comment out once jsonify() and response are implemented
	return jsonify(response)
	
@app.route("/edit/condition", methods=["GET"])
def editConditionGET():
	return "Edit Condition goes here"
	
@app.route("/edit/deleteCondition")
def deleteCondition():
	# Skeleton function.  Called after the "Are you sure?" dialog when deleting a template
	# Needs conditionID and templateID from somewhere.  Assuming they're stored in session
	conditionID = session.get("conditionID", None)
	templateID = session.get("templateID", None)
	if templateID == None:
		return "templateID not set"
	if conditionID == None:
		return "conditionID not set"
	cursor = get_cursor()
	statement = "DELETE FROM ScoringCondition WHERE conditionID = %s AND templateID = %s"
	result = cursor.execute(statement, (conditionID, templateID))
	# Do we need a commit() before we close()?
	cursor.close()
	
	return redirect(url_for("editTemplateGET"))  # Redirect back to Edit Template
	
@app.route("/edit/conditionName", methods=["POST"])
def editConditionName():
	# Skeleton function
	# Needs conditionID and templateID from somewhere.  Assuming they're stored in session
	conditionID = session.get("conditionID", None)
	templateID = session.get("templateID", None)
	if templateID == None:
		return "templateID not set"
	if conditionID == None:
		return "conditionID not set"
	newName = request.form.get("new_name")
	cursor = get_cursor()
	statement = 'UPDATE ScoringCondition SET conditionName = "%s" WHERE conditionID = %s AND templateID = %s'
	result = cursor.execute(statement, (newName, conditionID, templateID))
	cursor.close()
	
	return redirect(url_for("editConditionGET"))
	
@app.route("/edit/addCondition", methods=["POST"])
def addCondition():
	# Skeleton function
	# Needs some way to get all those parameters, presumably from a form.
	templateID = session.get("templateID", None)
	if templateID == None:
		return "templateID not set"
	conditionName = request.form.get("condition_name")
	description = request.form.get("description")
	maxPerGame = request.form.get("max_per_game")
	maxPerPlayer = request.form.get("max_per_player")
	scoringType = request.form.get("scoring_type")
	inputType = request.form.get("input_type")
	pointMultiplier = request.form.get("point_multiplier")
	statement = """
	INSERT INTO ScoringCondition (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier)
	VALUES (%s, %s, "%s", "%s", %s, %s, '%s', '%s', %s)
	"""
	result = cursor.execute(statement, (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier))
	# We need a way to get the new conditionID
	return redirect(url_for("editConditionGET"))



	
