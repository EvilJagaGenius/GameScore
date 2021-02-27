# GameScore server
# Nathan J. McNany, Joshua Benjamin 2021

import mysql.connector
import secrets
import json

# Email stuff
import smtplib
import traceback
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Setup
from flask import flash, Flask, jsonify, make_response, redirect, render_template, request, Response, session, url_for
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # Always do a complete refresh (for now)
SERVER_NAME = 'flask-api:5000'
# app.secret_key = 'pepperoni secret'


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
@app.route("/")
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
          ,"finalizeScore":{"players":[],"awards":[]}}
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
        stmt = ("select DISTINCT conditionName, maxPerGame, ScoringCondition.conditionID FROM ScoringCondition JOIN ActiveMatch using (GameID, TemplateID) WHERE matchID = %s AND maxPerGame > 0")
        mycursor.execute(stmt,(matchID,))
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
        stmt = ("select DISTINCT Player.playerID, Player.displayName, Player.totalScore from ActiveMatchPlayerConditionScore RIGHT OUTER JOIN Player using(playerID) WHERE Player.matchID = %s")
        mycursor.execute(stmt,(matchID,))
        myresultPlayer = mycursor.fetchall()
        mycursor.close()

        #For each row returned from DB: parse and create a dictionary from it
        for rowPlayer in myresultPlayer:
            playerID, displayName,totalScore = rowPlayer
            playerFinalizeScore = {"displayName":"{}".format(displayName)
            ,"conditions":[]}
            player = {"playerID":playerID
                        ,"displayName":"{}".format(displayName)
                        ,"conditions":[]
                        ,"totalScore":round(totalScore,2)}

            mycursor = mydb.cursor(prepared=True)
            stmt = ("select conditionName, conditionID, value, score, inputType, maxPerPlayer FROM ActiveMatchPlayerConditionScore JOIN ScoringCondition using(conditionID,templateID,gameID)WHERE ActiveMatchPlayerConditionScore.matchID = %s AND playerID = %s")
            mycursor.execute(stmt,(matchID,playerID))
            myresultCondition = mycursor.fetchall()
            mycursor.close()

            for rowCondition in myresultCondition:
                conditionName, conditionID, value, score, inputType, maxPerPlayer = rowCondition
                
                isHigher = False
                if value>maxPerPlayer and maxPerPlayer>0:
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
        return response


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

        mycursor = mydb.cursor(prepared=True)
        stmt = ("INSERT INTO ActiveMatch(templateID, gameID) VALUES(%s,%s)")
        mycursor.execute(stmt,(templateID,gameID))
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
            #Create Players in the DB
            mycursor = mydb.cursor(prepared=True)
            stmt = ("INSERT INTO Player(userID,color,displayOrder,totalScore,displayName,matchID) VALUES(%s,'RED',%s,0,%s,%s)")
            mycursor.execute(stmt,(userIDToEnter,x,displayName,matchID))
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

@app.route("/api/postUpdateScore")
def apiPostUpdateScore():

    conditionID = request.args.get('conditionID')
    value = float(request.args.get('value'))
    playerID = request.args.get('playerID')

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
            
            return getScoring(userID)

      
##################################### edit Template API ########################################

# Edit template stuff
@app.route("/edit/", methods=["GET"])
def editTemplateGET():
    # Skeleton function.  Returns all the conditions for this specific template in JSON form.
    mydb = mysql.connector.connect(pool_name = "mypool")
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    cursor = mydb.cursor(prepared=True)
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
        "conditionID": t[0],
        "conditionName": t[1],
        "description": t[2],
        "maxPerGame": t[3],
        "maxPerPlayer": t[4],
        "scoringType": t[5],
        "pointMultiplier": t[6],
        "inputType": t[7]
        }
        response.update({t[0]: dictionary})  # Use conditionID as a key
    
    #return "Edit Template goes here"  # Comment out once jsonify() and response are implemented
    mydb.close()
    return jsonify(response)
    
@app.route("/edit/name", methods=["POST"])
def editTemplateName():
    # Do something, Taipu
    mydb = mysql.connector.connect(pool_name = "mypool")
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    newName = request.form.get("new_name")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE Template SET templateName = %s WHERE templateID = %s"
    cursor.execute(statement, (newName, templateID))
    
    #return redirect(url_for("editTemplateGET"))
    return "ok"
    
@app.route("/edit/condition", methods=["GET"])
def editConditionGET():
    # Get the condition data from the database and send it over
    mydb = mysql.connector.connect(pool_name = "mypool")
    conditionID = session.get("conditionID", None)
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT (conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier) FROM ScoringCondition WHERE conditionID = %s AND templateID = %s"
    cursor.execute(statement, (conditionID, templateID))
    result = cursor.fetchall()
    
    response = {
    "conditionName": result[0],
    "description": result[1],
    "maxPerGame": result[2],
    "maxPerPlayer": result[3],
    "scoringType": result[4],
    "inputType": result[5],
    "pointMultiplier": result[6]
    }
    
    return jsonify(response)
    
@app.route("/edit/deleteCondition")
def deleteCondition():
    # Skeleton function.  Called after the "Are you sure?" dialog when deleting a condition
    # Needs conditionID and templateID from somewhere.  Assuming they're stored in session
    mydb = mysql.connector.connect(pool_name = "mypool")
    conditionID = session.get("conditionID", None)
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    cursor = mydb.cursor(prepared=True)
    statement = "DELETE FROM ScoringCondition WHERE conditionID = %s AND templateID = %s"
    cursor.execute(statement, (conditionID, templateID))
    # Do we need a commit() before we close()?
    cursor.close()
    mydb.close()
    
    return redirect(url_for("editTemplateGET"))  # Redirect back to Edit Template
    
@app.route("/edit/conditionName", methods=["POST"])
def editConditionName():
    # Skeleton function
    # Needs conditionID and templateID from somewhere.  Assuming they're stored in session
    mydb = mysql.connector.connect(pool_name = "mypool")
    conditionID = session.get("conditionID", None)
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    newName = request.form.get("new_name")
    cursor = mydb.cursor(prepared=True)
    statement = 'UPDATE ScoringCondition SET conditionName = "%s" WHERE conditionID = %s AND templateID = %s'
    result = cursor.execute(statement, (newName, conditionID, templateID))
    cursor.close()
    mydb.close()
    #return redirect(url_for("editConditionGET"))
    return "ok"
    
#@app.route("/edit/addCondition", methods=["POST"])
@app.route("/edit/addCondition")
def addCondition():
    # Skeleton function
    # Needs some way to get all those parameters, presumably from a form.
    mydb = mysql.connector.connect(pool_name = "mypool")
    templateID = session.get("templateID", None)
    gameID = session.get("gameID", None)
    if templateID == None:
        return "templateID not set"
    if gameID == None:
        return "gameID not set"
    # Below values are nullable, not needed
    #conditionName = request.form.get("condition_name")
    #description = request.form.get("description")
    #maxPerGame = request.form.get("max_per_game")
    #maxPerPlayer = request.form.get("max_per_player")
    #scoringType = request.form.get("scoring_type")
    #inputType = request.form.get("input_type")
    #pointMultiplier = request.form.get("point_multiplier")
    cursor = mydb.cursor(prepared=True)
    statement = """
    INSERT INTO ScoringCondition (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier)
    VALUES (%s, %s, "%s", "%s", %s, %s, '%s', '%s', %s)
    """
    
    cursor.execute(statement, (gameID, templateID, conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier))
    lastRowID = cursor.lastrowid
    print(lastRowID)
    response = {"id": lastRowID}
    
    cursor.close()
    mydb.close()
    
    return jsonify(response)

@app.route("/edit/conditionTable/swapRows", methods=["POST"])
def swapTableRowsPOST():
    mydb = mysql.connector.connect(pool_name = "mypool")
    rowA = request.form.get("row_a")
    rowB = request.form.get("row_b")
    templateID = session.get("templateID", None)
    conditionID = session.net("conditionID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    
    cursor = mydb.cursor(prepared=True)
    # Dang that's an ugly-looking prepared statement
    statement = """
    UPDATE ValueRow SET rowID = -1 WHERE rowID = %s AND templateID = %s AND conditionID = %s;
    UPDATE ValueRow SET rowID = %s WHERE rowID = %s AND templateID = %s AND conditionID = %s;
    UPDATE ValueRow SET rowID = %s WHERE rowID = -1 AND templateID = %s AND conditionID = %s;
    """
    cursor.execute(statement, (rowA, templateID, conditionID, rowA, rowB, templateID, conditionID, rowB, templateID, conditionID))
    
    cursor.close()
    mydb.close()
    return "ok"
    
@app.route("/edit/conditionTable", methods=["GET"])
def editConditionTableGET():
    mydb = mysql.connector.connect(pool_name = "mypool")
    templateID = session.get("templateID", None)
    conditionID = session.net("conditionID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT (rowID, inputMax, inputMin, outputValue) FROM ValueRow WHERE templateID = %s AND conditionID = %s"
    cursor.execute(statement, (templateID, conditionID))
    result = cursor.fetchall()  # List of tuples
    
    response = {}
    for t in result:
        dictionary = {
        "inputMax": t[1],
        "inputMin": t[2],
        "outputValue": t[3]
        }
        response.update({t[0]: dictionary})
    
    cursor.close()
    mydb.close()
    return jsonify(response)

@app.route("/edit/conditionTable", methods=["POST"])
def editConditionTablePOST():
    mydb = mysql.connector.connect(pool_name = "mypool")
    # Edit a row in the condition's scoring table
    conditionID = session.get("conditionID", None)
    templateID = session.get("templateID", None)
    rowID = 0 #session.get("rowID", None)  # Dummy value.  How do we get this?
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    if rowID == None:
        return "rowID not set"
    min = request.form.get("min")
    max = request.form.get("max")
    outputValue = request.form.get("output_value")
    cursor = mydb.cursor(prepared=True)
    statement = "UPDATE ValueRow SET min = %s, max = %s, outputValue = %s WHERE templateID = %s AND conditionID = %s AND rowID = %s"
    cursor.execute(statement, (min, max, outputValue, templateID, conditionID, rowID))
    cursor.close()
    mydb.close()
    #return redirect(url_for("editConditionGET"))
    return "ok"
    
@app.route("/edit/conditionValues", methods=["POST"])
def editConditionValues():
    mydb = mysql.connector.connect(pool_name = "mypool")
    # I'm not sure if we should split this up into multiple functions, like editing the name above
    conditionID = session.get("conditionID", None)
    templateID = session.get("templateID", None)
    if templateID == None:
        return "templateID not set"
    if conditionID == None:
        return "conditionID not set"
    conditionName = request.form.get("conditionName")
    description = request.form.get("description")
    maxPerGame = request.form.get("max_per_game")
    maxPerPlayer = request.form.get("max_per_player")
    scoringType = request.form.get("scoring_type")
    inputType = request.form.get("input_type")
    pointMultiplier = request.form.get("point_multiplier")
    cursor = mydb.cursor(prepared=True)
    statement = """
    UPDATE ScoringCondition SET conditionName = %s description = %s, maxPerGame = %s, maxPerPlayer = %s, scoringType = %s, inputType = %s, pointMultiplier = %s
    WHERE templateID = %s AND conditionID = %s
    """
    cursor.execute(statement, (conditionName, description, maxPerGame, maxPerPlayer, scoringType, inputType, pointMultiplier, templateID, conditionID))
    
    cursor.close()
    mydb.close()
    #return redirect(url_for("editConditionGET"))
    return "ok"

@app.route("/newTemplate/", methods=["POST"])
def createNewTemplate():
    mydb = mysql.connector.connect(pool_name = "mypool")
    gameID = request.form.get("game")
    templateName = request.form.get("template_name")
    userID = session.get("userID", None)
    if userID == None:
        return "userID not set"
    cursor = mydb.cursor(prepared=True)
    statement = """
    INSERT INTO Template (gameID, numRatings, templateName, userID)
    VALUES (%s, 0, %s, %s)
    """
    cursor.execute(statement, (gameID, templateName, userID))
    lastRowID = cursor.lastrowid
    response = {"id": lastRowID}
    
    cursor.close()
    mydb.close()
    # Need a way to get the new template ID and store it in the session
    #return redirect(url_for("editTemplateGET"))
    return jsonify(response)
    
@app.route("/edit/upload")
def uploadTemplate():
    # Do something, Taipu
    # I'm not sure how one uploads a template.  Do we commit to the DB, do we set the template as public, do we do something else?
    pass
    
# My Templates page
@app.route("/api/myTemplates")
def myTemplates():
    # Do something, Taipu
    mydb = mysql.connector.connect(pool_name = "mypool")
    userID = session.get("userID", None)
    if userID == None:
        return "userID not set"
        
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT (templateID, templateName, averageRating, numRatings) FROM Template WHERE userID = %s"
    cursor.execute(statement, (userID, ))
    response = {}
    results = cursor.fetchall()
    for t in results:
        dictionary = {
        "templateName": t[1],
        "averageRating": t[2],
        "numRatings": t[3]
        }
        response.update({t[0]: dictionary})
    
    cursor.close()
    mydb.close()
    
    return jsonify(response)

#Template Creation Screen
@app.route("/edit/templateGameList")
def templateGameList():
    mydb = mysql.connector.connect(pool_name = "mypool")
    cursor = mydb.cursor(prepared=True)
    statement = "SELECT (gameID, gameName) FROM Game"
    cursor.execute(statement)
    response = {}
    results = cursor.fetchall()
    for t in results:
        dictionary = {
            "gameID": t[0],
            "gameName": t[1]
        }
        response.update({t[0]:dictionary})

    cursor.close()
    mydb.close()

    return jsonify(response)

##################################### React Training ########################################
@app.route("/api/postReactTesting", methods=["POST"])
def apiPostReactTesting():
    content = request.json
    name = content['username']
    password = content['password']
    age = content['age']
    email = content['email']
    favoriteCharacter = content['favoriteCharacter']

    result = {"username":"{}".format(name)
            ,"password":"{}".format(password)
            ,"age":"{}".format(age)
            ,"email":"{}".format(email)
            ,"favoriteCharacter":"{}".format(favoriteCharacter)}
    response = jsonify(result)
    return response;

    
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
