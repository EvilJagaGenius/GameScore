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
    return render_template("home.html")

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
