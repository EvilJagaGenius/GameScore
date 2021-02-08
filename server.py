# GameScore server
# Nathan J. McNany, Joshua Benjamin 2021

import mysql.connector
import secrets

# Setup
from flask import Flask, render_template, request, url_for, flash, redirect, Response,make_response
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)

#Establish DB Connection
mydb = mysql.connector.connect(
  host="10.18.110.183",
  user="gamescore",
  password="GameScore2!",
  database="gamescore"
)

#Test DB Connection, will print out number in console
mycursor = mydb.cursor()
mycursor.execute("SELECT userID from AppUser")
myresult = mycursor.fetchall()
mycursor.close()

for x in myresult:
  print(x)


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
    #Get Values
    username = request.form.get('username')
    password = request.form.get('password')
    email = request.form.get('email')

    #Check DB for dupe email
    mycursor = mydb.cursor(prepared=True)
    stmtCheckEmail = (
        "select userID from UppUser where email = %s"
    )
    mycursor.execute(stmtCheckEmail,(email,))
    myresult = mycursor.fetchone()
    mycursor.close()

    #If email not already in DB, create account updating DB
    if myresult == None:
        mycursor = mydb.cursor(prepared=True)
        stmtAddUser = ( "INSERT INTO AppUser(username,userPassword,email) VALUES(%s,SHA1(%s),%s)")
        mycursor.execute(stmtAddUser,(username,password,email,))
        mydb.commit()
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
    mycursor = mydb.cursor(prepared=True)
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
    #Get Form Info
    username = request.form.get('username')
    password = request.form.get('password')
    remember = True if request.form.get('remember') else False

    #Check to see if username/password combo exists
    mycursor = mydb.cursor(prepared=True)
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

        mycursor = mydb.cursor(prepared=True)
        stmt = ("update AppUser SET credHash = %s where userPassword = SHA1(%s) AND username = %s")
        mycursor.execute(stmt,(token,password,username,))
        mydb.commit()
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
    mycursor = mydb.cursor(prepared=True)
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
    mycursor = mydb.cursor(prepared=True)
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
    mycursor = mydb.cursor(prepared=True)
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
    mycursor = mydb.cursor(prepared=True)
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
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select ActiveMatch.gameID, ActiveMatch.templateID, gameName, templateName from ActiveMatch JOIN Template ON ActiveMatch.templateID = Template.templateID AND ActiveMatch.gameID = Template.gameID JOIN Game ON Template.gameID=Game.gameID WHERE ActiveMatch.matchID = 1")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    mycursor.close()

    #Parse Game/Template Info
    gameID, templateID, gameName, templateName = myresult
    overview = {"templateName":"{}".format(templateName)
                  ,"templateID":templateID
                  ,"gameName":"{}".format(gameName)
                  ,"gameID":gameID
                  , "players":[]}
    result["scoringOverview"] = overview

    #Get Players info
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select DISTINCT Player.playerID, Player.totalScore, Player.displayOrder from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = 1")

    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        playerID, score, displayOrder = row
        player = {"playerID":playerID
                    ,"score":score
                    ,"displayOrder":displayOrder}
        #append each new dictionary to its appropriate list
        result["scoringOverview"]["players"].append(player)

    ### Global Awards ###
    #Get Conditions
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select DISTINCT conditionName, maxPerGame, conditionID FROM ScoringCondition JOIN ActiveMatch using (GameID, TemplateID) WHERE matchID = 1 AND maxPerGame > 0")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        conditionName, maxPerGame, conditionID = row
        condition = {"conditionName":"{}".format(conditionName)
                    ,"maxPerGame":maxPerGame
                    ,"players":[]}

        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT value, Player.displayName FROM ActiveMatchPlayerConditionScore JOIN Player using(playerID) WHERE conditionID = %s AND Player.matchID = 1")
        mycursor.execute(stmt,(conditionID,))
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

    #Assuming will get playerID

    mycursor = mydb.cursor(prepared=True)
    stmt = ("select DISTINCT Player.playerID, Player.displayName from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = 1")
    mycursor.execute(stmt,())
    myresultPlayer = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for rowPlayer in myresultPlayer:
        playerID, displayName = rowPlayer
        player = {"playerID":playerID
                    ,"displayName":"{}".format(displayName)
                    ,"conditions":[]}

        mycursor = mydb.cursor(prepared=True)
        stmt = ("select conditionName, value, score, inputType FROM ActiveMatchPlayerConditionScore JOIN ScoringCondition using(conditionID,templateID,gameID)WHERE ActiveMatchPlayerConditionScore.matchID = 1 AND playerID = %s")
        mycursor.execute(stmt,(playerID,))
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

    mycursor = mydb.cursor(prepared=True)
    stmt = ("select gameName, templateName FROM ActiveMatch JOIN Game using(gameID) JOIN Template using(templateID) WHERE matchID=1")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    mycursor.close()

    gameName, templateName = myresult

    mycursor = mydb.cursor(prepared=True)
    stmt = ("select displayName FROM Player WHERE totalScore in (Select MAX(totalScore) FROM Player WHERE matchID=1 GROUP BY matchID)")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchone()
    mycursor.close()

    winnerDisplayName = myresult

    result = {"gameName":"{}".format(gameName)
                    ,"templateName":"{}".format(templateName)
                    ,"winnerDisplayName":"{}".format(winnerDisplayName)
                    ,"scoreTable":[]}

    mycursor = mydb.cursor(prepared=True)
    stmt = ("select RANK() OVER (PARTITION BY matchID ORDER BY totalScore desc),displayName,totalScore FROM Player WHERE matchID=1")
    mycursor.execute(stmt,())
    myresult = mycursor.fetchall()
    mycursor.close()

    for row in myresult:
            rank, displayName,score = row
            finalScoreRow = {"rank":rank
                    ,"displayName":"{}".format(displayName)
                    ,"score":score}
            #append each new dictionary to its appropriate list
            result["scoreTable"].append(finalScoreRow)
    
    return result

