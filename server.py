# GameScore server
# Nathan J. McNany, Joshua Benjamin 2021

import mysql.connector
import secrets
import json
import random

# Email stuff
import smtplib
import traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask_socketio import SocketIO,join_room, leave_room,close_room

connCount = 0;

# Setup
from flask import flash, Flask, jsonify, make_response, redirect, render_template, request, Response, session, url_for
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)
SERVER_NAME = 'flask-api:5000'
app.secret_key = 'pepperoni secret'

socketIo = SocketIO(app, cors_allowed_origins="*")

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', request.environ.get('HTTP_ORIGIN', 'default value'))
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response


def getUserID():
    token = request.cookies.get('credHash')
    username = request.cookies.get('username')
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from AppUser where credHash=%s AND username=%s")
    mycursor.execute(stmt,(token,username))
    myresult = mycursor.fetchone()
    userID=-1
    if myresult != None:
        userID, = myresult
    mycursor.close()
    mydb.close()
    print(userID)
    print(token)
    return userID


def generateRandom(size=3, chars='ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'):
    return str(''.join(random.choice(chars) for _ in range(size)))

def createJoinCode():
    return generateRandom() + "-" + generateRandom() + "-" + generateRandom()


@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', request.environ.get('HTTP_ORIGIN', 'default value'))
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  response.headers.add('Access-Control-Allow-Credentials', 'true')
  return response


mydb = mysql.connector.connect(
      host="10.18.110.183",
      #host="10.31.106.126",
      port="3306",
      user="gamescore",
      password="GameScore2!",
      database="gamescore",
      raise_on_warnings= True
      ,pool_name = "mypool",
      pool_size = 16)


mycursor = mydb.cursor()
mycursor.execute("SELECT userID from AppUser")
myresult = mycursor.fetchall()
mycursor.close()
print(myresult)
mydb.close()

# Function for loading email credentials from a text file.
def loadEmailCreds(filename):
    file = open(filename, 'r')
    credentials = {}
    for line in file:
        line = line.strip()
        if line.startswith("//"):  # Ignore comments
            pass
        elif line.startswith("emailAddress"):
            credentials.update({"emailAddress": line.split(":")[1]})
        elif line.startswith("username:"):
            credentials.update({"username": line.split(":")[1]})
        elif line.startswith("password:"):
            credentials.update({"password": line.split(":")[1]})
    file.close()
    return credentials


# Cleanup function
@app.teardown_appcontext
def cleanup(exception):
    # Do something, Taipu
    pass

#Routes
@app.route("/profile/")
def profileGET():
    getUserID()
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



# /home/ (default route)
@app.route("/home/")
def homePage():
    # Do something, Taipu
    print('HEY IT WORKS!12345')
    return render_template("home.html")

@app.route('/createaccount/')
def createAccountGET():
    return render_template('createaccount.html')


##################################### login API ########################################

@app.route('/api/postLogin', methods=["POST"])
def login_post():
    mydb = mysql.connector.connect(pool_name = "mypool")
    #Get Form Info
    content = request.json
    username = content['username']
    password = content['password']


    #Check to see if username/password combo exists
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from AppUser where userPassword = SHA1(%s) AND username = %s")
    mycursor.execute(stmt,(password,username,))
    myresult = mycursor.fetchone()
    mycursor.close()

    if myresult == None:
        result = {"successful":False,"error":100,"error description":"No such username/password combination."}
        response = jsonify(result)
        mydb.close()
        return response
    else: #Add cookies, and add credHash to DB
        token = secrets.token_hex(32)
        result = {"successful":True,"credHash":token}
        response = jsonify(result)
        response.set_cookie('credHash',token)
        response.set_cookie('username', username)
        

        mycursor = mydb.cursor(prepared=True)
        stmt = ("update AppUser SET credHash = %s where userPassword = SHA1(%s) AND username = %s")
        mycursor.execute(stmt,(token,password,username,))
        mydb.commit()
        mycursor.close()
        mydb.close()
        return response

##################################### Reset Password Email ########################################

@app.route("/api/postResetPasswordEmail", methods=["POST"])
def sendPasswordEmail():
    # Skeleton function
    # See if the username is in the database
    content = request.json
    username = content['username']


    userEmailAddress = ""
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT email FROM AppUser WHERE username = %s"
    cursor.execute(statement, (username, ))
    result = cursor.fetchall()  # List of single-element tuples (in theory, only one tuple holding a single string)
    if len(result) == 0:  # If we got an empty result
        # Error
        result = {"successful":False,"error":103,"errorMessage":"Username not in database"}
        response = jsonify(result)
        cursor.close()
        mydb.close()
        return response
        
    userEmailAddress = result[0][0]
    print(userEmailAddress)
    
    cursor.close()
    mydb.close()
    
    try:
        # Log in to the email service
        emailCreds = loadEmailCreds("emailCredentials.txt")
        mailer = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        mailer.ehlo()
        mailer.login(emailCreds["username"], emailCreds["password"])
        
        token = secrets.token_hex(32)

        msg = MIMEMultipart('alternative')
        msg['Subject'] = "GameScore - Reset Password"
        msg['From'] = "GameScore Accounts"
        msg['To'] = userEmailAddress
        # Construct the message
        text = """<p>You have requested to reset your GameScore password.  Click <a href="http://localhost:3000/login/resetpassword?token={}">here</a> to reset your password.</p>
""".format(token)
        part1 = MIMEText(text,'html')
        msg.attach(part1)
        
        # Send the message
        mailer.sendmail("GameScore Accounts", userEmailAddress,msg.as_string())
        mailer.close()
        print("Reset password email sent")
        
        result = {"successful":True}
        response = jsonify(result)

        mydb = mysql.connector.connect(pool_name = "mypool")
        cursor = mydb.cursor(prepared=True)
        statement = "UPDATE AppUser SET resetPasswordToken=%s WHERE username = %s"
        cursor.execute(statement, (token,username))
        result = cursor.fetchall()  # List of single-element tuples (in theory, only one tuple holding a single string)
        mydb.commit()
        mydb.close()


        return response
    
    except:
        print("Error sending email")
        traceback.print_exc()
        result = {"successful":False,"error":105,"errorMessage":"Error sending email"}
        response = jsonify(result)
        return response
    


##################################### Reset Password ########################################

@app.route("/api/postResetPassword", methods=["POST"])
def resetPassword():
    # Skeleton function

    content = request.json
    token = content['token']
    newPassword = content['newPassword']

    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE AppUser SET userPassword = SHA1(%s),resetPasswordToken = %s WHERE resetPasswordToken=%s AND resetPasswordToken IS NOT NULL"
    cursor.execute(statement, (newPassword,None,token))
    rowsChanged = cursor.rowcount
    cursor.close()
    mydb.commit()
    mydb.close()


    if rowsChanged > 0:
         result = {"successful":True}
    else:
        result = {"successful":False,"error":106,"errorMessage":"Invalid Token - No Passwords Changed."}
    response = jsonify(result)
    return response
    

##################################### Reset Username Email API########################################

@app.route("/api/postResetUsernameEmail", methods=["POST"])
def sendUsernameEmail():
    # Skeleton function
    content = request.json
    userEmailAddress = content['email']

    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT email FROM AppUser WHERE email = %s"
    cursor.execute(statement, (userEmailAddress, ))
    result = cursor.fetchall()  # List of single-element tuples (in theory, only one tuple holding a single string)
    if len(result) == 0:  # If we got an empty result
        result = {"successful":False,"error":104,"errorMessage":"Email address not in database"}
        response = jsonify(result)
        cursor.close()
        mydb.close()
        return response
    userEmailAddress = result[0][0]
    cursor.close()
    mydb.close()
    
    try:
        # Log in to the email service
        emailCreds = loadEmailCreds("emailCredentials.txt")
        mailer = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        mailer.ehlo()
        mailer.login(emailCreds["username"], emailCreds["password"])
        
        token = secrets.token_hex(32)

        # Construct the message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "GameScore - Reset Username"
        msg['From'] = "GameScore Accounts"
        msg['To'] = userEmailAddress
        
        text = """<p>You have requested to reset your GameScore Username.  Click <a href="http://localhost:3000/login/resetusername?token={}">here</a> to reset your username.</p>
""".format(token)
        part1 = MIMEText(text,'html')
        msg.attach(part1)
        
        # Send the message
        mailer.sendmail("GameScore Accounts", userEmailAddress, msg.as_string())
        mailer.close()
        print("Reset username email sent")

        mydb = mysql.connector.connect(pool_name = "mypool")
        cursor = mydb.cursor(prepared=True)
        statement = "UPDATE AppUser SET resetUsernameToken=%s WHERE email = %s"
        cursor.execute(statement, (token,userEmailAddress))
        result = cursor.fetchall()  # List of single-element tuples (in theory, only one tuple holding a single string)
        mydb.commit()
        mydb.close()

        response = jsonify({"successful":True})
        return response
        
    except:
        print("Error sending email")
        traceback.print_exc()
        result = {"successful":False,"error":105,"errorMessage":"Error sending email"}
        response = jsonify(result)
        return response
    
##################################### Reset Username API ########################################

@app.route("/api/postResetUsername", methods=["POST"])
def resetUsername():
    # Skeleton function

    content = request.json
    token = content['token']
    newUsername = content['newUsername']

    # Do whatever extra authentication we need to here
    # Do checking/hashing the password here
    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE AppUser SET username = %s, resetUsernameToken = %s WHERE resetUsernameToken= %s AND resetUsernameToken IS NOT NULL"
    cursor.execute(statement, (newUsername, None,token))
    rowsChanged = cursor.rowcount
    cursor.close()
    mydb.commit()
    mydb.close()
    
    if rowsChanged > 0:
         result = {"successful":True}
    else:
        result = {"successful":False,"error":106,"errorMessage":"Invalid Token - No Username Changed."}

    response = jsonify(result)
    return response

##################################### logout API ########################################

@app.route("/api/postLogout", methods=["POST"])
def logoutGET():
    #Clear Auth Cookies
    result = {"successful":True}
    response = jsonify(result)
    response.set_cookie('credHash',"",max_age=0)
    response.set_cookie('username',"",max_age=0)
    return response

##################################### Create Account API ########################################

@app.route('/api/postCreateAccount', methods=["POST"])
def createAccountPost():
    
    #Get Values
    content = request.json
    username = content['username']
    password = content['password']
    email = content['email']

    #Check DB for dupe email
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmtCheckEmail = (
        "select userID from AppUser where email = %s"
    )
    mycursor.execute(stmtCheckEmail,(email,))
    myresult = mycursor.fetchone()
    mycursor.close()

    #If Email is already in DB
    if myresult != None:
        result = {"successful":False,"error":101,"errorMessage":"Email is already linked to a GameScore account."}
        response = jsonify(result)
        mydb.close()
        return response
        
    else: #if email not in DB
        mycursor = mydb.cursor(prepared=True)
        stmtCheckEmail = (
            "select userID from AppUser where username = %s"
        )
        mycursor.execute(stmtCheckEmail,(username,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult != None: #if username already in DB
            result = {"successful":False,"error":102,"errorMessage":"Username is already in use."}
            response = jsonify(result)
            mydb.close()
            return response

        else: #if username is not in use
            mycursor = mydb.cursor(prepared=True)
            stmtAddUser = ( "INSERT INTO AppUser(username,userPassword,email) VALUES(%s,SHA1(%s),%s)")
            mycursor.execute(stmtAddUser,(username,password,email))
            mydb.commit()
            mycursor.close()
            result = {"successful":True}
            response = jsonify(result)
            mydb.close()
            return response

##################################### Home API ########################################

@app.route("/api/getHomePage")
def apiGetHomePage():

    userID = getUserID()

    #Create JSON framework for what we will return
    result = {"highestRated":[]
              ,"recommendedGames":[]
              ,"favoritedTemplates":[]
              ,"recentlyPlayed":[]
              ,"successful":True}

    ### Highest Rated Templates ###
    
    #Execute sql call to get appropriate data
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor2 = mydb.cursor(prepared=True)
    stmt = ("select pictureURL, templateName, numRatings, averageRating,Game.gameID,Template.templateID from Template JOIN Game ON Template.gameID=Game.gameID ORDER BY averageRating DESC LIMIT 10")
    mycursor2.execute(stmt,())
    myresult = mycursor2.fetchall()
    mycursor2.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating,gameID,templateID = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"numRatings":numRatings
                    ,"averageRating":float(averageRating)
                    ,"gameID":"{}".format(gameID)
                    ,"templateID":"{}".format(templateID)}
        #append each new dictionary to its appropriate list
        result["highestRated"].append(template)


    ### Recommended Games ###
    #Execute sql call to get appropriate data
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select pictureURL, gameName from AppUserRecommendedGame JOIN Game ON AppUserRecommendedGame.gameID=Game.gameID WHERE userID=%s LIMIT 8")
    mycursor.execute(stmt,(userID,))
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
    stmt = ("select pictureURL, templateName, numRatings, averageRating,Game.gameID,Template.templateID from Template JOIN Game ON Template.gameID=Game.gameID JOIN AppUserInteractTemplate ON Template.templateID=AppUserInteractTemplate.templateID WHERE favorited=true AND AppUserInteractTemplate.userID=%s ORDER BY averageRating DESC LIMIT 10")
    mycursor.execute(stmt,(userID,))
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating,gameID,templateID = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"numRatings":numRatings
                    ,"averageRating":round(float(averageRating),2)
                    ,"gameID":"{}".format(gameID)
                    ,"templateID":"{}".format(templateID)}
        #append each new dictionary to its appropriate list
        result["favoritedTemplates"].append(template)



    ### Recently Played ###
    
    #Execute sql call to get appropriate data
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select pictureURL, templateName, numRatings, averageRating, Game.gameID,Template.templateID from Template JOIN Game ON Template.gameID=Game.gameID JOIN AppUserInteractTemplate ON Template.templateID=AppUserInteractTemplate.templateID WHERE AppUserInteractTemplate.userID=%s ORDER BY lastPlayed DESC, averageRating DESC LIMIT 10")
    mycursor.execute(stmt,(userID,))
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: parse and create a dictionary from it
    for row in myresult:
        picURL, templateName, numRatings, averageRating,gameID,templateID = row
        template = {"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"numRatings":numRatings
                    ,"averageRating":round(float(averageRating),2)
                    ,"gameID":"{}".format(gameID)
                    ,"templateID":"{}".format(templateID)}
        #append each new dictionary to its appropriate list

        result["recentlyPlayed"].append(template)


    mydb.close()

    if userID == -1:
        result["successful"] = False
        result["error"] = 110
        result["errorMessage"] = "User not logged-in"

    response = jsonify(result)

    if userID == -1:
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)

    return response


##################################### getScoring API ########################################

def getScoring(userID):
#Get Template and GameName Info
    print(userID)
    result = {"scoringOverview":[]
          ,"globalAwards":[]
          ,"individualScoring":[]
          ,"finalizeScore":{"players":[],"awards":[]}
          ,"colors":["RED","BLUE","YELLOW","PURPLE","GREEN","PINK","GRAY","ORANGE"]
          ,"isHost":""}
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select matchID, ActiveMatch.gameID, ActiveMatch.templateID, gameName, templateName from ActiveMatch JOIN Template ON ActiveMatch.templateID = Template.templateID AND ActiveMatch.gameID = Template.gameID JOIN Game ON Template.gameID=Game.gameID JOIN Player using(matchID) WHERE Player.userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(userID,))
    myresult = mycursor.fetchone()
    mycursor.close()

    if myresult == None: # if no games in DB
        result = {"successful":False,"error":111,"errorMessage":"No active game."}
        response = jsonify(result)
        mydb.close()
        return response
    else:
        #Parse Game/Template Info
        matchID, gameID, templateID, gameName, templateName = myresult
        overview = {"templateName":"{}".format(templateName)
                      ,"templateID":templateID
                      ,"gameName":"{}".format(gameName)
                      ,"gameID":gameID
                      , "players":[]}
        result["scoringOverview"] = overview

        #Get Players info
        mycursor = mydb.cursor(prepared=True)
        stmt = ("select DISTINCT Player.playerID, Player.totalScore, Player.displayOrder, displayName, userID from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = %s")

        mycursor.execute(stmt,(matchID,))
        myresult = mycursor.fetchall()
        mycursor.close()

        #For each row returned from DB: parse and create a dictionary from it
        for row in myresult:
            playerID, score, displayOrder, displayName, userID = row
            player = {"playerID":playerID
                        ,"score":score
                        ,"displayOrder":displayOrder
                        ,"userID":userID
                        ,"displayName":"{}".format(displayName)}
            #append each new dictionary to its appropriate list
            result["scoringOverview"]["players"].append(player)

        ### Global Awards ###
        #Get Conditions
        mycursor = mydb.cursor(prepared=True)
        stmt = ("select DISTINCT conditionName, maxPerGame, ScoringCondition.conditionID FROM ScoringCondition JOIN ActiveMatch using (GameID, TemplateID) WHERE matchID = %s AND maxPerGameActive =%s")
        mycursor.execute(stmt,(matchID,True))
        myresult = mycursor.fetchall()
        mycursor.close()

        #For each row returned from DB: parse and create a dictionary from it
        for row in myresult:
            conditionName, maxPerGame, conditionID= row
            condition = {"conditionName":"{}".format(conditionName)
                        ,"maxPerGame":maxPerGame
                        ,"players":[]}


            mycursor = mydb.cursor(prepared=True)
            stmt = ("select Sum(value) FROM ActiveMatchPlayerConditionScore WHERE matchID = %s AND conditionID = %s GROUP BY conditionID")
            mycursor.execute(stmt,(matchID,conditionID))
            myresult = mycursor.fetchone()
            mycursor.close()

            sumValue, = myresult

            if sumValue > maxPerGame:
                result["finalizeScore"]["awards"].append({
                    "name":"{}".format(conditionName),
                    "sumValue":sumValue,
                    "maxPerGame":maxPerGame
                    })


            mycursor = mydb.cursor(prepared=True)
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
        mycursor = mydb.cursor(prepared=True)
        stmt = ("select DISTINCT Player.playerID, Player.displayName, Player.totalScore,Player.color,Player.isHost from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = %s")
        mycursor.execute(stmt,(matchID,))
        myresultPlayer = mycursor.fetchall()
        mycursor.close()

        #For each row returned from DB: parse and create a dictionary from it
        for rowPlayer in myresultPlayer:
            playerID, displayName,totalScore,color,isHost = rowPlayer
            playerFinalizeScore = {"displayName":"{}".format(displayName)
            ,"conditions":[]}
            player = {"playerID":playerID
                        ,"displayName":"{}".format(displayName)
                        ,"conditions":[]
                        ,"color":"{}".format(color)
                        ,"totalScore":round(totalScore,2)}


            if isHost==True:
            	result["isHost"]=displayName

            mycursor = mydb.cursor(prepared=True)
            stmt = ("select conditionName, conditionID, value, score, inputType, maxPerPlayer, maxPerPlayerActive FROM ActiveMatchPlayerConditionScore JOIN ScoringCondition using(conditionID,templateID,gameID)WHERE ActiveMatchPlayerConditionScore.matchID = %s AND playerID = %s")
            mycursor.execute(stmt,(matchID,playerID))
            myresultCondition = mycursor.fetchall()
            mycursor.close()

            for rowCondition in myresultCondition:
                conditionName, conditionID, value, score, inputType, maxPerPlayer,maxPerPlayerActive = rowCondition
                
                isHigher = False
                if value>maxPerPlayer and maxPerPlayer>0 and maxPerPlayerActive==True:
                    playerFinalizeScore["conditions"].append({
                        "conditionName":"{}".format(conditionName)
                        ,"value":"{}".format(value)
                        ,"maxPerPlayer":"{}".format(maxPerPlayer)
                        })
                    isHigher = True

                condition = {"conditionName":"{}".format(conditionName)
                        ,"score":round(score,2)
                        ,"value":round(value,2)
                        ,"conditionID":conditionID
                        ,"inputType":"{}".format(inputType)
                        ,"exceedsLimits":isHigher}
                #append each new dictionary to its appropriate list
                player["conditions"].append(condition)
                
            
            #append each new dictionary to its appropriate list
            result["individualScoring"].append(player)

            if len(playerFinalizeScore["conditions"])>0:
                result["finalizeScore"]["players"].append(playerFinalizeScore)

        mydb.close()
        result["successful"] = True
        response = jsonify(result)
        return result


@app.route("/api/getScoring")
def apiGetScoring():
    #Create JSON framework for what we will return

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        return getScoring(userID)
        ### Scoring Overview ###
        
        

##################################### postgame API ########################################

def getPostGame(userID):
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select gameName, templateName,matchID,Game.gameID,Template.templateID FROM ActiveMatch JOIN Game using(gameID) JOIN Template using(templateID) JOIN Player using (matchID) WHERE Player.userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(userID,))
    myresult = mycursor.fetchone()
    mycursor.close()

    if myresult == None:
        result = {"successful":False,"error":112,"errorMessage":"No game results found."}
        response = jsonify(result)
        mydb.close()
        return response
    else:
        gameName,templateName,matchID,gameID,templateID = myresult

        mycursor = mydb.cursor(prepared=True)
        stmt = ("select displayName FROM Player WHERE totalScore in (Select MAX(totalScore) FROM Player WHERE matchID=%s GROUP BY matchID) AND matchID=%s LIMIT 1")
        mycursor.execute(stmt,(matchID,matchID))
        myresult = mycursor.fetchone()
        mycursor.close()

        winnerDisplayName, = myresult

        result = {"gameName":"{}".format(gameName)
                        ,"templateName":"{}".format(templateName)
                        ,"winnerDisplayName":"{}".format(winnerDisplayName)
                        ,"gameID":"{}".format(gameID)
                        ,"templateID":"{}".format(templateID)
                        ,"scoreTable":[]
                        ,"numOfPlayers":[]}

        mycursor = mydb.cursor(prepared=True)
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
        mydb.close()
        result["successful"] = True
        response = jsonify(result)
        return response

@app.route("/api/getPostGame")
def apiGetPostGame():
    #Create JSON framework for what we will return
    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        return getPostGame(userID)
        

##################################### Create Game API ########################################

@app.route("/api/postCreateNewGame")
def apiPostCreateNewGame():

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        templateID = request.args.get('templateID')
        gameID = request.args.get('gameID')
        numPlayers = request.args.get('numOfPlayers')

        uniqueCode = False
        
        while uniqueCode == False:
            currentCode = createJoinCode()
            mycursor = mydb.cursor(prepared=True)
            stmt = ("Select matchID FROM ActiveMatch where joinCode=%s")
            mycursor.execute(stmt,(currentCode,))
            myresult = mycursor.fetchall()
            num = mycursor.rowcount
            mycursor.close()

            if num ==0:
                uniqueCode = True;


        mycursor = mydb.cursor(prepared=True)
        stmt = ("INSERT INTO ActiveMatch(templateID, gameID,joinCode) VALUES(%s,%s,%s)")
        mycursor.execute(stmt,(templateID,gameID,currentCode))
        mycursor.close()

        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT LAST_INSERT_ID()")
        mycursor.execute(stmt,())
        myresult = mycursor.fetchone()
        matchID, = myresult
        mycursor.close()

        #Find Condition IDs for Template
        mycursor = mydb.cursor(prepared=True)
        stmt = ("Select conditionID FROM ScoringCondition WHERE templateID=%s")
        mycursor.execute(stmt,(templateID,))
        conditionList = mycursor.fetchall()
        mycursor.close()
      
        for x in range(1, int(numPlayers)+1):

            displayName = "Player"+str(x)
            if x==1:
                displayName = request.cookies.get('username')

            userIDToEnter = None
            if x==1:
                userIDToEnter = userID

            isHost = False
            if x==1:
            	isHost=True
            #Create Players in the DB
            mycursor = mydb.cursor(prepared=True)
            stmt = ("INSERT INTO Player(userID,color,displayOrder,totalScore,displayName,matchID,isHost) VALUES(%s,'RED',%s,0,%s,%s,%s)")
            mycursor.execute(stmt,(userIDToEnter,x,displayName,matchID,isHost))
            mycursor.close()

            #Find new PlayerID
            mycursor = mydb.cursor(prepared=True)
            stmt = ("SELECT LAST_INSERT_ID()")
            mycursor.execute(stmt,())
            myresult = mycursor.fetchone()
            playerID, = myresult
            mycursor.close()

            for row in conditionList:
                conditionID, = row
                mycursor = mydb.cursor(prepared=True)
                stmt = ("INSERT INTO ActiveMatchPlayerConditionScore(matchID,playerID,conditionID,gameID,templateID,value,score) VALUES(%s,%s,%s,%s,%s,0,0)")
                mycursor.execute(stmt,(matchID,playerID,conditionID,gameID,templateID))
                mycursor.close()
        
        mydb.commit()
        mydb.close()
        #return {"result":"successful","matchID":matchID,"gameID":gameID,"templateID":templateID}

        return (getScoring(userID))


##################################### update Scoring API ########################################

@app.route("/api/postUpdateScore", methods=["POST"])
def apiPostUpdateScore():

    content = request.json
    conditionID = content['conditionID']
    value = content['value']
    playerID = content['playerID']

    print(conditionID)
    print(value)
    print(playerID)

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")        
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        matchID, = myresult
        mycursor.close()


        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            mycursor = mydb.cursor(prepared=True)
            stmt = ("SELECT scoringType, pointMultiplier FROM ScoringCondition WHERE conditionID=%s")
            mycursor.execute(stmt,(conditionID,))
            myresult = mycursor.fetchone()
            scoringType, pointMultiplier = myresult
            mycursor.close()

            if scoringType == 'Linear':
                score = value * float(pointMultiplier)
            elif scoringType == 'Tabular':
                mycursor = mydb.cursor(prepared=True)
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

            mycursor = mydb.cursor(prepared=True)
            stmt = ("UPDATE ActiveMatchPlayerConditionScore SET score=%s, value=%s WHERE conditionID=%s AND playerID=%s AND matchID = %s")
            mycursor.execute(stmt,(score,value,conditionID,playerID,matchID))
            mycursor.fetchone()
            mycursor.close()
            mydb.commit()
            mydb.close()
            return (getScoring(userID))


##################################### Finalize Score API ####################################

@app.route("/api/postFinalizeScore")
def apiPostFinalizeScore():

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID, Template.templateID, Template.gameID,templateName,gameName FROM AppUser JOIN Player using(userID) JOIN ActiveMatch using(matchID) JOIN Template using(templateID) JOIN Game on Template.gameID=Game.gameID WHERE AppUser.userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            #Find winning player ID
            matchID,templateID,gameID,templateName,gameName = myresult
            mycursor = mydb.cursor(prepared=True)
            stmt = ("select playerID FROM Player WHERE totalScore in (Select MAX(totalScore) FROM Player WHERE matchID=%s GROUP BY matchID) AND matchID=%s LIMIT 1")
            mycursor.execute(stmt,(matchID,matchID))
            myresult = mycursor.fetchone()
            winningPlayerID = myresult
            mycursor.close()


            #Find all Actual Users for that current match
            mycursor = mydb.cursor(prepared=True)
            stmt = ("SELECT userID, totalScore, playerID FROM AppUser JOIN Player using(userID) WHERE matchID=%s ORDER BY totalScore DESC")
            mycursor.execute(stmt,(matchID,))
            listUsers = mycursor.fetchall()
            mycursor.close()


            #Find all Players for that current match
            mycursor = mydb.cursor(prepared=True)
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
                  mycursor = mydb.cursor(prepared=True)
                  stmt = ("SELECT userID FROM AppUserInteractTemplate WHERE templateID=%s AND userID=%s")
                  mycursor.execute(stmt,(templateID,userID))
                  myresult = mycursor.fetchall()
                  mycursor.close()

                  #If no entry exists
                  if(len(myresult)<=0):
                      mycursor = mydb.cursor(prepared=True)
                      stmt = ("INSERT INTO AppUserInteractTemplate(userID,gameID,templateID,lastPlayed) VALUES(%s,%s,%s,now())")
                      mycursor.execute(stmt,(userID,gameID,templateID))
                      mycursor.close()
                  else:
                      mycursor = mydb.cursor(prepared=True)
                      stmt = ("UPDATE AppUserInteractTemplate SET lastPlayed=now() WHERE templateID=%s AND userID=%s")
                      mycursor.execute(stmt,(templateID,userID))
                      mycursor.close()


                  #See if entry already exists (played this game)
                  mycursor = mydb.cursor(prepared=True)
                  stmt = ("SELECT userID FROM AppUserPlayedGame WHERE gameID=%s AND userID=%s")
                  mycursor.execute(stmt,(gameID,userID))
                  myresult = mycursor.fetchall()
                  mycursor.close()

                  #If no entry exists, create blank entry (for game stats)
                  if(len(myresult)<=0):
                      mycursor = mydb.cursor(prepared=True)
                      stmt = ("INSERT INTO AppUserPlayedGame(userID,gameID) VALUES(%s,%s)")
                      mycursor.execute(stmt,(userID,gameID))
                      mycursor.close()

                  if playerID == winningPlayerID:
                        wonCount = 1
                  else:
                        wonCount = 0              
                  mycursor = mydb.cursor(prepared=True)
                  
                  stmt = ("UPDATE AppUserPlayedGame SET gamesPlayed = gamesPlayed + 1, gamesWon = gamesWon + %s, aggregateScore = aggregateScore + %s WHERE gameID=%s AND userID=%s")
                  mycursor.execute(stmt,(wonCount,totalScore,gameID,userID))
                  mycursor.close()


                  mycursor = mydb.cursor(prepared=True)
                  stmt = ("INSERT INTO AppUserHistoryGame(userID,gameID,gameHistoryString) VALUES(%s,%s,%s)")
                  mycursor.execute(stmt,(userID,gameID,json.dumps(result)))
                  mycursor.close()

            
            mydb.commit()
            mydb.close()

            socketIo.emit('gameEnd', room=matchID)

            close_room(matchID,namespace='/')

            return getPostGame(userID)



##################################### Leave Game API ########################################
@app.route("/api/postLeaveGame")
def apiPostLeaveGame():

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        #Assuming only main player/host is leaving
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID, = myresult
            destroyMatch(matchID)
            mydb.close()
            response = jsonify({"successful":True})
            return response


#Destroys match given the matchID
def destroyMatch(matchID):
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("DELETE FROM ActiveMatchPlayerConditionScore WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()
    
    mycursor = mydb.cursor(prepared=True)
    stmt = ("DELETE FROM Player WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()

    mycursor = mydb.cursor(prepared=True)
    stmt = ("DELETE FROM ActiveMatch WHERE matchID=%s")
    mycursor.execute(stmt,(matchID,))
    mycursor.close()
    mydb.commit()
    mydb.close()
    return "success"


##################################### updateName API ########################################

@app.route("/api/postUpdatePlayerName")
def apiPostUpdatePlayerName():

    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID, = myresult
            changedPlayerIDs = request.args.getlist("playerID")
            changedNames = request.args.getlist("newDisplayName")

            for x in range(0,len(changedPlayerIDs)):
                mydb = mysql.connector.connect(pool_name = "mypool")
                mycursor = mydb.cursor(prepared=True)
                stmt = ("UPDATE Player SET displayName=%s WHERE playerID=%s AND matchID=%s")
                mycursor.execute(stmt,(str(changedNames[x]),int(changedPlayerIDs[x]),matchID))
                mycursor.close()
                mydb.commit()
            socketIo.emit('sendNewScores',getScoring(userID), room=matchID)   
            mydb.close()
            return getScoring(userID)




##################################### Get Invite INFO API ############################################

@app.route("/api/getInviteInfo")
def apiGetInviteInfo():
    userID = getUserID()

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT ActiveMatch.matchID, ActiveMatch.joinCode FROM AppUser JOIN Player using(userID) JOIN ActiveMatch using(matchID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID,joinCode = myresult


            mydb.close()
            result = {"successful":True,
            "joinCode":joinCode}
            response = jsonify(result)
            return response



##################################### Join Game API ############################################

@app.route("/api/postJoinGame", methods=["POST"])
def apiPostJoinGame():
    userID = getUserID()

    content = request.json
    joinCode = content['joinCode']
    username = request.cookies.get('username')

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID FROM ActiveMatch WHERE joinCode=%s")
        mycursor.execute(stmt,(joinCode,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID, = myresult

            mycursor = mydb.cursor(prepared=True)
            stmt = ("SELECT playerID from Player join ActiveMatch using(matchID) WHERE matchID=%s AND Player.userID IS NULL ORDER BY playerID ASC LIMIT 1")
            mycursor.execute(stmt,(matchID,))
            myresult = mycursor.fetchone()
            mycursor.close()

            if myresult == None:
                result = {"successful":False,"error":113,"errorMessage":"Game is full!"}
                response = jsonify(result)
                mydb.close()
                return response
            else:
                playerID, = myresult
                mycursor = mydb.cursor(prepared=True)
                stmt = ("UPDATE Player SET userID=%s,displayName=%s WHERE playerID=%s")
                mycursor.execute(stmt,(userID,username,playerID))
                myresult = mycursor.fetchone()
                mycursor.close()
                mydb.commit()
                mydb.close()
                result = {"successful":True,
                "matchID":matchID}
                response = jsonify(result)
                return response 


##################################### Kick Player API ############################################

@app.route("/api/postKickPlayer", methods=["POST"])
def apiPostKickPlayer():
    userID = getUserID()

    content = request.json
    playerID = content['playerID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT ActiveMatch.matchID FROM Player JOIN ActiveMatch using(matchID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID, = myresult

            mycursor = mydb.cursor(prepared=True)
            stmt = ("UPDATE Player SET userID=NULL WHERE playerID=%s")
            mycursor.execute(stmt,(playerID,))
            myresult = mycursor.fetchone()
            mycursor.close()
            mydb.commit()
            mydb.close()
            socketIo.emit('sendNewScores',getScoring(userID), room=matchID)
            return getScoring(userID)



##################################### Change Player Color ############################################

@app.route("/api/postChangePlayerColor", methods=["POST"])
def apiPostChangePlayerColor():
    userID = getUserID()

    content = request.json
    playerID = content['playerID']
    color = content['color']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT ActiveMatch.matchID FROM Player JOIN ActiveMatch using(matchID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        mycursor.close()

        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            matchID, = myresult

            mycursor = mydb.cursor(prepared=True)
            stmt = ("UPDATE Player SET color=%s WHERE playerID=%s")
            mycursor.execute(stmt,(color,playerID))
            myresult = mycursor.fetchone()
            mycursor.close()
            mydb.commit()
            mydb.close()
            socketIo.emit('sendNewScores',getScoring(userID), room=matchID)

            return getScoring(userID)



##################################### Get Games and Templates ########################################

#Template Creation Screen
@app.route("/api/getGamesAndTemplates")
def getGamesAndTemplates():

    result = {"successful":True,"games":[],"templates":[]}

    result["templates"].append({"templateName":"<Do Not Clone>","templateID":-1})

    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    statement = "SELECT gameID, gameName FROM Game"
    mycursor.execute(statement)
    results = mycursor.fetchall()
    mycursor.close()

    for row in results:
        gameID, gameName = row

        game = {"gameName":"{}".format(gameName),
        "gameID":"{}".format(gameID)}

        result["games"].append(game)

    mycursor = mydb.cursor(prepared=True)
    statement = "SELECT templateID, templateName FROM Template"
    mycursor.execute(statement)
    results = mycursor.fetchall()
    for row in results:
        templateID,templateName=row

        template = {"templateName":"{}".format(templateName),
        "templateID":"{}".format(templateID)}

        result["templates"].append(template)

    mycursor.close()
    mydb.close()
    response = jsonify(result)
    return result


##################################### Create Template API ########################################

@app.route("/api/postCreateTemplate", methods=["POST"])
def createNewTemplate():
    userID = getUserID()

    content = request.json
    gameID = content['gameID']
    templateName = content['templateName']
    cloneID = content['cloneID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "INSERT INTO Template (gameID,templateName,userID) VALUES(%s,%s,%s)"
        mycursor.execute(stmt,(gameID,templateName,userID))
        mydb.commit()
        templateID = mycursor.lastrowid

        #cloning conditions for new template
        if cloneID != -1:

            #Find and duplicate conditions
            mycursor = mydb.cursor(prepared=True)
            stmt = "SELECT conditionID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier FROM ScoringCondition WHERE templateID = %s;"
            mycursor.execute(stmt, (cloneID,))
            result = mycursor.fetchall()

            #for each condition
            for row in result:
                mycursor = mydb.cursor(prepared=True)
                conditionID,conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier = row

                stmt = "INSERT INTO ScoringCondition (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);"
                mycursor.execute(stmt, (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier))
                mycursor.close()


                #Find and duplicate condition rows
                mycursor = mydb.cursor(prepared=True)
                stmt = "SELECT inputMax, inputMin, outputValue FROM ValueRow WHERE conditionID = %s;"
                mycursor.execute(stmt, (conditionID,))
                result = mycursor.fetchall()
                #For each ConditionRow
                for row in result:
                    mycursor = mydb.cursor(prepared=True)
                    inputMax,inputMin,outputValue = row

                    stmt = "INSERT INTO ValueRow (gameID,templateID,conditionID,inputMax,inputMin,outputValue) VALUES (%s, %s, %s, %s, %s, %s);"
                    mycursor.execute(stmt, (gameID,templateID,conditionID,inputMax,inputMin,outputValue))
                    mycursor.close()

        result={"successful":True,"templateID":templateID}
        mycursor.close()
        mydb.commit()
        mydb.close()
        response = jsonify(result)
        return result


##################################### get Template Info ########################################
def getConditionsSeperate(userID,templateID):

    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = "SELECT templateName, Game.gameName FROM Template JOIN Game using(gameID) WHERE userID=%s AND templateID=%s"
    mycursor.execute(stmt,(userID,templateID))
    row = mycursor.fetchone()

    print(userID)
    print(templateID)

    if row == None:
        result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
        response = jsonify(result)
        mydb.close()
        return response;
    else:
        result = {"templateName":"",
                  "gameName":"",
                  "templateID":"",
                  "conditions":[]}

        templateName,gameName = row
        print(templateName)

        result["gameName"] = gameName
        result["templateName"] = templateName
        result["templateID"] = templateID

        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT conditionName,description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier,conditionID,maxPerPlayerActive,maxPerGameActive FROM ScoringCondition WHERE templateID=%s"
        mycursor.execute(stmt,(templateID,))
        results = mycursor.fetchall()
        mycursor.close();

        for row in results:
            conditionName, description,maxPerGame,maxPerPlayer,scoringType,inputType,pointMultiplier,conditionID,maxPerPlayerActive,maxPerGameActive = row

            condition = {
            "conditionName":"{}".format(conditionName),
            "description":"{}".format(description),
            "maxPerGame":maxPerGame,
            "maxPerPlayer":maxPerPlayer,
            "scoringType":"{}".format(scoringType),
            "inputType":"{}".format(inputType),
            "pointMultiplier":pointMultiplier,
            "conditionID":conditionID,
            "valueRows":[],
            "maxPerGameActive":maxPerGameActive,
            "maxPerPlayerActive":maxPerPlayerActive
            }

            mycursor = mydb.cursor(prepared=True)
            stmt = "SELECT rowID, inputMax, inputMin, outputValue FROM ValueRow WHERE conditionID=%s"
            mycursor.execute(stmt,(conditionID,))
            valueRows = mycursor.fetchall()
            mycursor.close()

            for row in valueRows:
                rowID, inputMax,inputMin,outputVal = row
                rowDict = {
                "rowID":rowID,
                "inputMax":inputMax,
                "inputMin":inputMin,
                "outputVal":outputVal
                }
                condition["valueRows"].append(rowDict)

            result["conditions"].append(condition)

        result["successful"] = True
        mydb.close()
        response = jsonify(result)
        return result


@app.route("/api/getConditions", methods=["POST"])
def getConditions():

    userID = getUserID()
    content = request.json
    templateID = content['templateID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        return getConditionsSeperate(userID,templateID)
        

##################################### Edit Template Name API ########################################

@app.route("/api/postEditTemplateName", methods=["POST"])
def postEditTemplateName():

    userID = getUserID()

    content = request.json
    templateID = content['templateID']
    templateName = content['templateName']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT templateName, Game.gameName FROM Template JOIN Game using(gameID) WHERE userID=%s AND templateID=%s"
        mycursor.execute(stmt,(userID,templateID))
        row = mycursor.fetchone()

        print(userID)
        print(templateID)

        if row == None:
            result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
            response = jsonify(result)
            mydb.close()
            return response;
        else:

            mycursor = mydb.cursor(prepared=True)
            stmt = "UPDATE Template SET templateName=%s WHERE templateID=%s"
            mycursor.execute(stmt,(templateName,templateID))
            mydb.commit();
            mycursor.close()
            mydb.close()
            return getConditionsSeperate(userID,templateID)





##################################### Save Condition Changes ########################################

@app.route("/api/postEditCondition", methods=["POST"])
def postEditCondition():

    userID = getUserID()

    print(request.json)

    content = request.json
    templateID = content['templateID']
    conditionID = content['conditionID']
    conditionName = content['conditionName']
    maxPerGame = content['maxPerGame']
    maxPerPlayer = content['maxPerPlayer']
    maxPerGameActive = content['maxPerGameActive']
    maxPerPlayerActive = content['maxPerPlayerActive']
    scoringType = content['scoringType']
    inputType = content['inputType']
    description = content['description']
    pointMultiplier = content['pointMultiplier']
    valueRows = content['valueRows']
    deletedRowIDs = content['deletedRowIDs']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT templateName, Game.gameName,Game.gameID FROM ScoringCondition JOIN Template using(templateID) JOIN Game on Template.gameID=Game.gameID WHERE userID=%s AND ScoringCondition.conditionID=%s"
        mycursor.execute(stmt,(userID,conditionID))
        row = mycursor.fetchone()

        print(userID)
        print(templateID)

        if row == None:
            result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
            response = jsonify(result)
            mydb.close()
            return response;
        else:
            templateName,gameName,gameID = row
            mycursor = mydb.cursor(prepared=True)
            print(maxPerPlayerActive)
            stmt = "UPDATE ScoringCondition SET conditionName=%s, maxPerGame=%s,maxPerPlayer=%s,description=%s,scoringType=%s,inputType=%s,pointMultiplier=%s,maxPerGameActive=%s,maxPerPlayerActive=%s WHERE conditionID=%s"
            mycursor.execute(stmt,(conditionName,maxPerGame,maxPerPlayer,description,scoringType,inputType,pointMultiplier,maxPerGameActive,maxPerPlayerActive,conditionID))
            
            mycursor = mydb.cursor(prepared=True)
            stmt = "Select rowID from ValueRow WHERE conditionID=%s"
            mycursor.execute(stmt,(conditionID,))
            result = mycursor.fetchall()
            mycursor.close()

            allRowIDs = []

            for ID in result:
                val, = ID
                allRowIDs.append(val)


            for valueRow in valueRows:
                print(valueRow)
                inputMin = valueRow["inputMin"]
                inputMax = valueRow["inputMax"]
                outputVal = valueRow["outputVal"]
                rowID = valueRow["rowID"]

                print(rowID)
                print(allRowIDs)
                if rowID in allRowIDs: #if already exists
                    mycursor = mydb.cursor(prepared=True)
                    stmt = "UPDATE ValueRow SET inputMin=%s,inputMax=%s,outputValue=%s WHERE rowID=%s AND conditionID=%s"
                    mycursor.execute(stmt,(inputMin,inputMax,outputVal,rowID,conditionID))
                    numChanged = mycursor.rowcount
                    mycursor.close()

                else: #if need to create
                    mycursor = mydb.cursor(prepared=True)
                    stmt = "INSERT INTO ValueRow (gameID,templateID,conditionID,inputMin,inputMax,outputValue) VALUES(%s,%s,%s,%s,%s,%s)"
                    mycursor.execute(stmt,(gameID,templateID,conditionID,inputMin,inputMax,outputVal))
                    mycursor.close()

            print(deletedRowIDs)
            for oldID in deletedRowIDs:
                mycursor = mydb.cursor(prepared=True)
                stmt = "DELETE FROM ValueRow WHERE rowID=%s AND conditionID=%s AND templateID=%s"
                mycursor.execute(stmt,(oldID,conditionID,templateID))
                mycursor.close()

            mydb.commit();
            mycursor.close()
            mydb.close()
            return getConditionsSeperate(userID,templateID)



##################################### Create Condition API ########################################
     
@app.route("/api/postCreateCondition", methods=["POST"])
#@app.route("/edit/addCondition")
def postCreateCondition():
    userID = getUserID()


    content = request.json
    templateID = content['templateID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT DISTINCT templateName, Game.gameID FROM Template JOIN Game on Template.gameID=Game.gameID WHERE userID=%s AND Template.templateID=%s"
        mycursor.execute(stmt,(userID,templateID))
        row = mycursor.fetchone()
        mycursor.close()

        if row == None:
            result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
            response = jsonify(result)
            mydb.close()
            return response;
        else:
            templateName,gameID = row
            mycursor = mydb.cursor(prepared=True)
            stmt = "INSERT INTO ScoringCondition (gameID,templateID,conditionName) VALUES(%s,%s,%s)"
            mycursor.execute(stmt,(gameID,templateID,"NewCondition"))
            mycursor.fetchall()
            mydb.commit();
            mycursor.close()
            mydb.close()
            return getConditionsSeperate(userID,templateID)


##################################### Delete Condition API ########################################

@app.route("/api/postDeleteCondition", methods=["POST"])
def postDeleteCondition():

    userID = getUserID()
    content = request.json
    templateID = content['templateID']
    conditionID = content['conditionID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT DISTINCT templateName, Game.gameID FROM Template JOIN Game on Template.gameID=Game.gameID WHERE userID=%s AND Template.templateID=%s"
        mycursor.execute(stmt,(userID,templateID))
        row = mycursor.fetchone()
        mycursor.close()

        if row == None:
            result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
            response = jsonify(result)
            mydb.close()
            return response;
        else:
            templateName,gameID = row
            mycursor = mydb.cursor(prepared=True)
            stmt = "DELETE FROM ScoringCondition WHERE conditionID=%s"
            mycursor.execute(stmt,(conditionID,))
            mydb.commit();
            mycursor.close()
            mydb.close()
            return getConditionsSeperate(userID,templateID)



##################################### Delete Template API ########################################

@app.route("/api/postDeleteTemplate", methods=["POST"])
def postDeleteTemplate():

    userID = getUserID()
    content = request.json
    templateID = content['templateID']

    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt = "SELECT DISTINCT templateName, Game.gameID FROM Template JOIN Game on Template.gameID=Game.gameID WHERE userID=%s AND Template.templateID=%s"
        mycursor.execute(stmt,(userID,templateID))
        row = mycursor.fetchone()
        mycursor.close()

        if row == None:
            result = {"successful":False,"error":120,"errorMessage":"User does not have access to edit this template."}
            response = jsonify(result)
            mydb.close()
            return response;
        else:
            templateName,gameID = row

            mycursor = mydb.cursor(prepared=True)
            stmt = "DELETE FROM ValueRow WHERE templateID=%s"
            mycursor.execute(stmt,(templateID,))
            mycursor.close();

            mycursor = mydb.cursor(prepared=True)
            stmt = "DELETE FROM ScoringCondition WHERE templateID=%s"
            mycursor.execute(stmt,(templateID,))
            mycursor.close();

            mycursor = mydb.cursor(prepared=True)
            stmt = "DELETE FROM Template WHERE templateID=%s"
            mycursor.execute(stmt,(templateID,))
            mycursor.close();

            mydb.commit();
            mydb.close()
            return getConditionsSeperate(userID,templateID)
    

##################################### My Templates Page ########################################

# My Templates page
@app.route("/api/getMyTemplates", methods=["POST"])
def getMyTemplates():

    userID = getUserID()
    content = request.json


    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        #Execute sql call to get appropriate data
        mydb = mysql.connector.connect(pool_name = "mypool")
        mycursor = mydb.cursor(prepared=True)
        stmt  = "select pictureURL, templateName, numRatings, averageRating,Game.gameID,Template.templateID from Template JOIN Game ON Template.gameID=Game.gameID WHERE Template.userID=%s ORDER BY averageRating"
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchall()
        mycursor.close()

        result = {
        "templates":[],
        "successful":True
        }

        #For each row returned from DB: parse and create a dictionary from it
        for row in myresult:
            picURL, templateName, numRatings, averageRating,gameID,templateID = row
            template = {"pictureURL":"{}".format(picURL)
                        ,"templateName":"{}".format(templateName)
                        ,"numRatings":numRatings
                        ,"averageRating":float(averageRating)
                        ,"gameID":"{}".format(gameID)
                        ,"templateID":"{}".format(templateID)}
            #append each new dictionary to its appropriate list
            result["templates"].append(template)


        mydb.close()
        response = jsonify(result)
        return response

# --------------------------- Async Stuffs ----------------------#

@socketIo.on('join')
def joinRoom(token,username):
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from AppUser where credHash=%s AND username=%s")
    mycursor.execute(stmt,(token,username))
    myresult = mycursor.fetchone()
    userID=-1
    if myresult != None:
        userID, = myresult
    mycursor.close()
    mydb.close()

    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select matchID FROM ActiveMatch JOIN Game using(gameID) JOIN Template using(templateID) JOIN Player using (matchID) WHERE Player.userID=%s ORDER BY matchID DESC LIMIT 1")
    mycursor.execute(stmt,(userID,))
    myresult = mycursor.fetchone()
    mycursor.close()
    mydb.close()

    if myresult != None:
        matchID,=myresult
        print(matchID)
        join_room(matchID)


@socketIo.on('connect')
def sayHi():
	global connCount
	connCount = connCount +1
	print("HELLO!"+str(connCount))

@socketIo.on('disconnect')
def sayHi():
	global connCount
	connCount = connCount -1
	print("GOODBYE!"+str(connCount))

@socketIo.on('updateScoreValue')
def handle_my_custom_event(content, methods=['GET', 'POST']):

    print(content)
    content = json.loads(content)
    conditionID = content["conditionID"]
    value = content["value"]
    playerID = content["playerID"]
    token = content["token"]
    username = content["username"]

    print(conditionID)
    print(value)
    print(playerID)

    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("select userID from AppUser where credHash=%s AND username=%s")
    mycursor.execute(stmt,(token,username))
    myresult = mycursor.fetchone()
    userID=-1
    if myresult != None:
        userID, = myresult
    mycursor.close()
    mydb.close()


    if userID == -1:
        result = {"successful":False,"error":110,"errorMessage":"User not logged-in."}
        response = jsonify(result)
        response.set_cookie('credHash',"",max_age=0)
        response.set_cookie('username',"",max_age=0)
        return response
    else:

        mydb = mysql.connector.connect(pool_name = "mypool")        
        mycursor = mydb.cursor(prepared=True)
        stmt = ("SELECT matchID FROM AppUser JOIN Player using(userID) WHERE userID=%s ORDER BY matchID DESC LIMIT 1")
        mycursor.execute(stmt,(userID,))
        myresult = mycursor.fetchone()
        matchID, = myresult
        mycursor.close()


        if myresult == None:
            result = {"successful":False,"error":111,"errorMessage":"No game found."}
            response = jsonify(result)
            mydb.close()
            return response
        else:
            mycursor = mydb.cursor(prepared=True)
            stmt = ("SELECT scoringType, pointMultiplier FROM ScoringCondition WHERE conditionID=%s")
            mycursor.execute(stmt,(conditionID,))
            myresult = mycursor.fetchone()
            scoringType, pointMultiplier = myresult
            mycursor.close()

            if scoringType == 'Linear':
                score = value * float(pointMultiplier)
            elif scoringType == 'Tabular':
                mycursor = mydb.cursor(prepared=True)
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

            mycursor = mydb.cursor(prepared=True)
            stmt = ("UPDATE ActiveMatchPlayerConditionScore SET score=%s, value=%s WHERE conditionID=%s AND playerID=%s AND matchID = %s")
            mycursor.execute(stmt,(score,value,conditionID,playerID,matchID))
            mycursor.fetchone()
            mycursor.close()
            mydb.commit()
            mydb.close()

            print('received my event: ' + str(content))
            socketIo.emit('sendNewScores',getScoring(userID), room=matchID)

if __name__ == '__main__':
    socketIo.run(app, debug=True)
    
    
##################################### Report API ########################################
# Submit reports
@app.route("/api/reportTemplate")
def reportTemplate():
    # Right now, until I understand this better, we're just going to report templates..?  It looks like that's all the DB supports right now
    # So we need the game ID, template ID and description
    gameID = request.form.get("game_id")
    templateID = request.form.get("template_id")
    description = request.form.get("description")
    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = """
    INSERT INTO Report (description, reason, templateID, gameID)
    VALUES %s, Template, %s, %s
    """
    cursor.execute(statement, (description, templateID, gameID))
    
    cursor.close()
    mydb.close()
    # What should we send as a response?
    return jsonify({"successful": True})
    
# List reports
@app.route("/api/listReports")
def listReports():
    adminStatus = request.cookies.get("admin", None)
    if adminStatus != True:
        return "Current user is not an admin"

    # Get a list of reports and send them to the user in JSON format
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT reportID, description, reason, templateID, gameID FROM Report"
    cursor.execute(statement, ())
    reports = cursor.fetchall()
    response = {}
    for t in reports:
        dictionary = {
        "description": t[1],
        "reason": t[2],
        "templateID": t[3],
        "gameID": t[4]
        }
        response.update({t[0]: dictionary})
        
    cursor.close()
    mydb.close()
    
    return jsonify(response)
    
# Do something about the report
@app.route("/api/doReports")  # Change this to something more sensible once you think of it
def doReports():
    # Do something, Taipu
    return "ok"


# Rate Bottom UI (move this)
@app.route("/api/rateTemplate", methods=["POST"])
def rateTemplate():
    # Do something, Taipu
    print("Recieved rateTemplate")
    templateID = 1  # We need some way to get this.  Form?  Session?
    gameID = 1
    rating = float(request.form.get("rating", None))
    print("Rating: " + str(rating))
    
    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT numRatings, averageRating FROM Template WHERE templateID = %s AND gameID = %s"
    cursor.execute(statement, (templateID, gameID))
    result = cursor.fetchone()
    numberOfRatings = result[0]
    prevTotalRating = numberOfRatings * result[1]
    newRating = (prevTotalRating + rating) / numberOfRatings + 1
    numberOfRatings += 1
    
    statement = "UPDATE Template SET numRatings = %s, averageRating = %s WHERE templateID = %s AND gameID = %s"
    cursor.execute(statement, (numberOfRatings, newRating, templateID, gameID))
    
    cursor.close()
    mydb.close()
    
    response = {"successful": True}
    
    return jsonify(response)
    
    

##################################### Profile API ########################################
@app.route("/api/profile/changePassword", methods=["POST"])
def changePassword():
    userID = getUserID()
    if userID == -1:  # getUserID failed for some reason
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
    
    content = request.json
    #oldPassword = content.get("old_password")
    newPassword = content.get("new_password")
    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    #statement = "UPDATE AppUser SET userPassword = SHA1(%s) WHERE userPassword=SHA1(%s) AND userID=%s"
    statement = "UPDATE AppUser SET userPassword = SHA1(%s) WHERE userID=%s"
    cursor.execute(statement, (newPassword, userID))
    
    mydb.commit()
    cursor.close()
    mydb.close()
    
    response = {"successful": True}
    return jsonify(response)

@app.route("/api/profile/changeUsername", methods=["POST"])
def changeUsername():
    userID = getUserID()
    if userID == -1:  # getUserID failed for some reason
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
    
    content = request.json
    newUsername = content.get("new_username")
        
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE AppUser SET username = %s WHERE userID=%s"
    cursor.execute(statement, (newUsername, userID))
    cursor.nextset()
    
    # Check for duplicates
    statement = "SELECT userID FROM AppUser WHERE username=%s"
    cursor.execute(statement, (newUsername, ))
    results = cursor.fetchall()
    rowsChanged = len(results)
    if rowsChanged > 1:  # There's duplicate emails
        cursor.close()
        mydb.close()
        response = {"successful": False, "errorMessage": "Duplicate username"}
        return jsonify(response)
    
    mydb.commit()
    cursor.close()
    mydb.close()
        
    responseDict = {"successful": True}
    response = jsonify(responseDict)
    response.set_cookie('username', newUsername)
    return response

@app.route("/api/profile/changeEmail", methods=["POST"])
def changeEmail():
    userID = getUserID()
    if userID == -1:  # getUserID failed for some reason
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
        
    content = request.json
    newEmail = content.get("new_email")
        
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE AppUser SET email=%s WHERE userID=%s"
    cursor.execute(statement, (newEmail, userID))
    cursor.nextset()
    
    # Check for duplicates
    statement = "SELECT userID FROM AppUser WHERE email=%s"
    cursor.execute(statement, (newEmail, ))
    results = cursor.fetchall()
    rowsChanged = len(results)
    if rowsChanged > 1:  # There's duplicate emails
        cursor.close()
        mydb.close()
        response = {"successful": False, "errorMessage": "Duplicate email address"}
        return jsonify(response)
    
    mydb.commit()
    cursor.close()
    mydb.close()
        
    response = {"successful": True}
    return jsonify(response)
    
"""@app.route("/api/profile/changeProfileInfo")
def changeProfileInfo():
    userID = getUserID()
    if userID == -1:  # getUserID failed for some reason
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
        
    content = request.json
    newEmail = content.get("new_email", None)
    newUsername = content.get("new_username", None)
    newPassword = content.get("new_password", None)
    oldPassword = content.get("old_password", None)
    
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    if newEmail != None:
        statement = "UPDATE AppUser SET email=%s WHERE userID=%s"
        cursor.execute(statement, (newEmail, userID))
    if newUsername != None:
        statement = "UPDATE AppUser SET username = %s WHERE userID=%s"
        cursor.execute(statement, (newUsername, userID))
    if newPassword != None and oldPassword != None:
        statement = "UPDATE AppUser SET userPassword = SHA1(%s) WHERE userPassword=SHA1(%s) AND userID=%s"
        cursor.execute(statement, (newPassword, oldPassword, userID))
    
    
    mydb.commit()
    cursor.close()
    mydb.close()
        
    response = {"successful": True}
    return jsonify(response)
"""

@app.route("/api/profile/avatar", methods=["GET"])
def avatarGET():
    userID = getUserID()
    if userID == -1:
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
        
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT avatarID FROM AppUser WHERE userID=%s"
    cursor.execute(statement, (userID,))
    result = cursor.fetchone()
    avatarID = result[0]
    
    cursor.close()
    mydb.close()
        
    response = {"successful": True, "avatarID": avatarID}
    return jsonify(response)
    
@app.route("/api/profile/avatar", methods=["POST"])
def avatarPOST():
    userID = getUserID()
    if userID == -1:
        response = {"successful": False, "errorMessage": "userID not set"}
        return jsonify(response)
    content = request.json
    newAvatarID = content.get("new_avatar")
        
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE AppUser SET AvatarID=%s WHERE userID=%s"
    cursor.execute(statement, (newAvatarID, userID))
    
    mydb.commit()
    cursor.close()
    mydb.close()
        
    response = {"successful": True}
    return jsonify(response)

##################################### Search API ########################################
@app.route("/api/search/templates", methods=["GET"])
def templateSearch():
    
    #Create JSON framework for what we will return
    result = {"templates":[]}

    ### get all templates ###
    
    #Execute sql call to get appropriate data
    mydb = mysql.connector.connect(pool_name = "mypool")
    mycursor = mydb.cursor(prepared=True)
    stmt = ("""
    SELECT u.userID as userID, u.userName as userName, g.pictureURL as picURL, t.templateName as templateName, t.numRatings as numRatings, t.averageRating as averageRating, g.gameID as gameID, t.templateID as templateID, g.gameName as gameName
    FROM AppUser u
        INNER JOIN Template t ON u.userID = t.userID
        INNER JOIN Game g ON t.gameID = g.gameID
    ORDER BY t.averageRating DESC;
    """)
    mycursor.execute(stmt)
    myresult = mycursor.fetchall()
    mycursor.close()

    #For each row returned from DB: pares and create a dictionary from it
    for row in myresult:
        userID, userName, picURL, templateName, numRatings, averageRating, gameID, templateID, gameName = row
        template = {"userID":"{}".format(userID)
                    ,"userName":"{}".format(userName)
                    ,"pictureURL":"{}".format(picURL)
                    ,"templateName":"{}".format(templateName)
                    ,"numRatings":numRatings
                    ,"averageRating":float(averageRating)
                    ,"gameID":"{}".format(gameID)
                    ,"templateID":"{}".format(templateID)
                    ,"gameName":"{}".format(gameName)}
        #append each new dictionary to list
        result["templates"].append(template)

    return jsonify(result)