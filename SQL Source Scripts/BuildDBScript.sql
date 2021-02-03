DROP TABLE IF EXISTS ActiveMatchPlayerConditionScore;
DROP TABLE IF EXISTS AppUserHistoryGame;
DROP TABLE IF EXISTS AppUserInteractTemplate;
DROP TABLE IF EXISTS AppUserPlayedGame;
DROP TABLE IF EXISTS AppUserRecommendedGame;
DROP TABLE IF EXISTS Player;
DROP TABLE IF EXISTS ActiveMatch;
DROP TABLE IF EXISTS Report;
DROP TABLE IF EXISTS ValueRow;
DROP TABLE IF EXISTS ScoringCondition;
DROP TABLE IF EXISTS Template;
DROP TABLE IF EXISTS AppUser;
DROP TABLE IF EXISTS Game;



CREATE TABLE Game (
gameID INT NOT NULL AUTO_INCREMENT,
gameName VARCHAR(100),
pictureURL VARCHAR(100) DEFAULT 'https://img-authors.flaticon.com/google.jpg',
PRIMARY KEY (gameID));

CREATE TABLE AppUser(
userID INT NOT NULL AUTO_INCREMENT,
username VARCHAR(30),
userPassword BLOB (1000),
winRate FLOAT DEFAULT 0.0,
avatarID INT DEFAULT 0,
hiddenProfile BOOLEAN DEFAULT false,
email VARCHAR(100),
PRIMARY KEY(userID));

CREATE TABLE Template (
templateID INT NOT NULL AUTO_INCREMENT,
gameID INT NOT NULL,
numRatings INT DEFAULT 0,
averageRating FLOAT default 0,
templateName VARCHAR(100),
userID int,
PRIMARY KEY (templateID,gameID),
FOREIGN KEY (gameID) REFERENCES Game(gameID),
FOREIGN KEY (userID) REFERENCES AppUser(userID));

CREATE TABLE ScoringCondition (
conditionID INT NOT NULL AUTO_INCREMENT,
gameID INT NOT NULL,
templateID INT NOT NULL,
conditionName VARCHAR (50),
description VARCHAR(200) DEFAULT '',
maxPerGame INT DEFAULT 0,
maxPerPlayer INT DEFAULT 0,
scoringType ENUM ('Linear','Tabular') DEFAULT 'Linear',
inputType ENUM ('Increment','Textbox') DEFAULT 'Increment',
pointMultiplier FLOAT DEFAULT 1,
PRIMARY KEY(conditionID,gameID,templateID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE ValueRow (
rowID INT NOT NULL AUTO_INCREMENT,
conditionID INT NOT NULL,
templateID INT NOT NULL,
gameID INT NOT NULL,
inputMax FLOAT DEFAULT 10,
inputMin FLOAT DEFAULT 0,
outputValue FLOAT DEFAULT 1,
PRIMARY KEY(rowID,gameID,conditionID,templateID),
FOREIGN KEY(conditionID) REFERENCES ScoringCondition(conditionID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE Report (
reportID INT NOT NULL AUTO_INCREMENT,
description VARCHAR(200) DEFAULT '',
reason ENUM('Template','Username') DEFAULT 'Template',
templateID INT,
gameID INT,
PRIMARY KEY(reportID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE ActiveMatch (
matchID INT NOT NULL AUTO_INCREMENT,
templateID INT,	
gameID INT,
PRIMARY KEY(matchID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID));

CREATE TABLE Player (
playerID INT NOT NULL AUTO_INCREMENT,
userID INT,
color ENUM('RED','BLUE') DEFAULT 'Red',
PRIMARY KEY(playerID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserRecommendedGame (
gameID INT,
userID INT,
PRIMARY KEY(gameID,userID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserPlayedGame (
userID INT,
gameID INT,
gamesWon INT DEFAULT 1,
gamesPlayed INT DEFAULT 2,
aggregateScore INT DEFAULT 50,
winrate FLOAT DEFAULT 0.5,
averageScore FLOAT DEFAUlT 25,
PRIMARY KEY(userID,gameID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserInteractTemplate (
userID INT,
gameID INT,
templateID INT,
rating FLOAT,
favorited BOOLEAN DEFAULT true,
PRIMARY KEY(userID,gameID,templateID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE AppUserHistoryGame (
userID INT,
gameID INT,
gameHistoryString VARCHAR(10000),
PRIMARY KEY(userID,gameID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(userID) REFERENCES AppUser(userID));

CREATE TABLE ActiveMatchPlayerConditionScore (
matchID INT,
playerID INT,
conditionID INT,
gameID INT,
templateID INT,
score FLOAT,
PRIMARY KEY(matchID,playerID,conditionID,gameID,templateID),
FOREIGN KEY(gameID) REFERENCES Game(gameID),
FOREIGN KEY(templateID) REFERENCES Template(templateID),
FOREIGN KEY(matchID) REFERENCES ActiveMatch(matchID),
FOREIGN KEY(conditionID) REFERENCES ScoringCondition(conditionID),
FOREIGN KEY(playerID) REFERENCES Player(playerID));


